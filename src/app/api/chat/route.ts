import { NextRequest, NextResponse } from "next/server";
import { sessions } from "@/lib/sessionStore";
import { detectIntent, askAI } from "@/lib/groq";
import { sendToTelegram } from "@/lib/telegram";
import { getFAQ } from "@/lib/sheets";
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";

// ─────────────────────────────────────────────
// ORDER ID validator: no spaces, min 4 chars,
// alphanumeric + dashes/underscores only
// ─────────────────────────────────────────────
function isValidOrderId(str: string): boolean {
  return /^[a-zA-Z0-9_\-]{4,}$/.test(str.trim());
}

// ─────────────────────────────────────────────
// Amount validator: numeric, optional decimals
// ─────────────────────────────────────────────
function isValidAmount(str: string): boolean {
  return /^\d+(\.\d{1,2})?$/.test(str.trim()) && parseFloat(str) > 0;
}

// ─────────────────────────────────────────────
// Check if user is trying to escape the flow
// ─────────────────────────────────────────────
async function isExitIntent(message: string): Promise<boolean> {
  const lower = message.toLowerCase().trim();
  const exitKeywords = [
    "cancel",
    "exit",
    "stop",
    "back",
    "quit",
    "বাতিল",
    "ফিরে",
    "বন্ধ",
    "hi",
    "hello",
    "help",
    "হ্যালো",
    "হেল্প",
  ];
  return exitKeywords.some((kw) => lower.includes(kw));
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();
    // history: Array<{ role: "user"|"assistant", content: string }>

    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const userId = user.id;
    const session = sessions.get(userId);

    // ── Active deposit/withdraw flow ──────────────────────────────
    if (session) {
      // Check for abuse even mid-flow — takes priority
      const midFlowIntent = await detectIntent(message, history);
      if (midFlowIntent === "negative") {
        sessions.delete(userId);
        return NextResponse.json({
          reply:
            "⚠️ আপনার বার্তায় অনুপযুক্ত ভাষা বা বিষয়বস্তু রয়েছে। অনুগ্রহ করে ভদ্র ভাষায় কথা বলুন।\n\n" +
            "⚠️ Your message contains inappropriate or abusive content. " +
            "Please communicate respectfully — we are here to help, but cannot respond to offensive or 18+ messages.",
        });
      }

      // Let user cancel the flow at any time
      if (await isExitIntent(message)) {
        sessions.delete(userId);
        return NextResponse.json({
          reply:
            "আপনার অনুরোধ বাতিল করা হয়েছে। / Your request has been cancelled. How can I help you?",
        });
      }

      if (session.type === "deposit") {
        return handleDepositFlow(userId, message, session);
      }
      if (session.type === "withdraw") {
        return handleWithdrawFlow(userId, message, session);
      }
    }

    // ── Detect intent (with history for context) ──────────────────
    const intent = await detectIntent(message, history);
    console.log("[INTENT]", intent);

    // ── NORMAL / FAQ ──────────────────────────────────────────────
    if (intent === "normal" || intent === "unknown") {
      const faq = await getFAQ();

      const reply = await askAI([
        ...history,
        {
          role: "user" as const,
          content: `
You are "Nova", a helpful support agent for a financial platform.
You speak both Bangla and English. Reply in the same language the user used.

FAQ data:
${faq}

User: ${message}
            `.trim(),
        },
      ]);

      return NextResponse.json({ reply });
    }

    // ── DEPOSIT FLOW ──────────────────────────────────────────────
    if (intent === "deposit_issue") {
      sessions.set(userId, {
        step: "ask_order_id",
        type: "deposit",
        data: {},
      });

      return NextResponse.json({
        reply:
          "আপনার ডিপোজিট অর্ডার আইডি দিন। / Please provide your Deposit Order ID.\n\n👉 Deposit Record page → Find transaction → Copy Order ID",
      });
    }

    // ── WITHDRAW FLOW ─────────────────────────────────────────────
    if (intent === "withdraw_issue") {
      sessions.set(userId, {
        step: "ask_withdraw_id",
        type: "withdraw",
        data: {},
      });

      return NextResponse.json({
        reply:
          "আপনার উইথড্র রিকোয়েস্ট আইডি দিন। / Please provide your Withdraw Request ID.\n\n👉 Withdraw History → Find request → Copy ID",
      });
    }

    // ── INFO intents → answer from FAQ ───────────────────────────
    if (intent === "deposit_info" || intent === "withdraw_info") {
      const faq = await getFAQ();
      const reply = await askAI([
        {
          role: "user" as const,
          content: `
You are "Nova". Reply in the same language the user used (Bangla or English).
Answer this question using the FAQ below.

FAQ:
${faq}

User question: ${message}
          `.trim(),
        },
      ]);
      return NextResponse.json({ reply });
    }

    // ── NEGATIVE / ABUSIVE / 18+ ──────────────────────────────────
    if (intent === "negative") {
      // Clear any active flow so it doesn't continue after abuse
      sessions.delete(userId);

      return NextResponse.json({
        reply:
          "⚠️ আপনার বার্তায় অনুপযুক্ত ভাষা বা বিষয়বস্তু রয়েছে। অনুগ্রহ করে ভদ্র ভাষায় কথা বলুন।\n\n" +
          "⚠️ Your message contains inappropriate or abusive content. " +
          "Please communicate respectfully — we are here to help, but cannot respond to offensive or 18+ messages.",
      });
    }

    return NextResponse.json({
      reply: "আমি বুঝতে পারিনি। / I didn't understand. Please try again.",
    });
  } catch (error) {
    console.error("CHAT[ERROR]", error);
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────
// DEPOSIT FLOW
// ─────────────────────────────────────────────────────────────────
async function handleDepositFlow(
  userId: string,
  message: string,
  session: any,
) {
  const { step, data, type } = session;

  if (step === "ask_order_id") {
    if (!isValidOrderId(message)) {
      return Response.json({
        reply: `❌ এটি একটি বৈধ Order ID নয়। / This doesn't look like a valid Order ID.

Order ID must be:
• At least 4 characters
• No spaces
• Letters, numbers, dashes only (e.g. ORD-2024-XYZ)

👉 Deposit Record page → Find transaction → Copy Order ID`,
      });
    }

    data.orderId = message.trim();
    session.step = "ask_amount";
    sessions.set(userId, session);

    return Response.json({
      reply:
        "✅ Order ID পেয়েছি। এখন ডিপোজিটের পরিমাণ লিখুন। / Got it! Now enter the deposit amount (numbers only, e.g. 500):",
    });
  }

  if (step === "ask_amount") {
    if (!isValidAmount(message)) {
      return Response.json({
        reply:
          "❌ সঠিক পরিমাণ লিখুন। / Please enter a valid amount (numbers only, e.g. 500 or 1500.50):",
      });
    }

    data.amount = message.trim();
    sessions.delete(userId);

    await sendToTelegram({
      userId,
      orderId: data.orderId,
      amount: data.amount,
      type,
    });

    return Response.json({
      reply:
        "✅ আপনার সমস্যা সাপোর্ট টিমে পাঠানো হয়েছে। অনুগ্রহ করে অপেক্ষা করুন।",
    });
  }
}

// ─────────────────────────────────────────────────────────────────
// WITHDRAW FLOW
// ─────────────────────────────────────────────────────────────────
async function handleWithdrawFlow(
  userId: string,
  message: string,
  session: any,
) {
  const { step, data } = session;

  if (step === "ask_withdraw_id") {
    if (!isValidOrderId(message)) {
      return Response.json({
        reply: `❌ এটি একটি বৈধ Withdraw ID নয়। / This doesn't look like a valid Withdraw ID.

👉 Withdraw History → Find request → Copy ID`,
      });
    }

    data.withdrawId = message.trim();
    session.step = "ask_amount";
    sessions.set(userId, session);

    return Response.json({
      reply:
        "✅ Withdraw ID পেয়েছি। এখন পরিমাণ লিখুন। / Got it! Now enter the withdraw amount (numbers only):",
    });
  }

  if (step === "ask_amount") {
    if (!isValidAmount(message)) {
      return Response.json({
        reply:
          "❌ সঠিক পরিমাণ লিখুন। / Please enter a valid amount (numbers only):",
      });
    }

    data.amount = message.trim();
    sessions.delete(userId);

    await sendToTelegram({
      userId,
      withdrawId: data.withdrawId,
      amount: data.amount,
      type: "withdraw_issue",
    });

    return Response.json({
      reply:
        "✅ আপনার উইথড্র সমস্যা সাপোর্ট টিমে পাঠানো হয়েছে। / Your withdraw issue has been sent to support.",
    });
  }
}
