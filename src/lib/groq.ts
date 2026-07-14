import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type Message = { role: "user" | "assistant"; content: string };

// ─────────────────────────────────────────────────────────────────
// detectIntent — uses conversation history for better accuracy
// Returns one of:
//   deposit_issue | withdraw_issue | deposit_info | withdraw_info
//   | normal | unknown
// ─────────────────────────────────────────────────────────────────
export async function detectIntent(
  message: string,
  history: Message[] = [],
): Promise<string> {
  // Build a short context summary from last 4 exchanges
  const recentHistory = history
    .slice(-4)
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const contextBlock = recentHistory
    ? `\nRecent conversation:\n${recentHistory}\n`
    : "";

  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.2, // deterministic output
    max_tokens: 20, // we only need one word
    messages: [
      {
        role: "system",
        content: `
You are an intelligent intent classifier for a customer support chatbot (Bangla + English).

Your job:
Understand the MEANING of the message, not just keywords.

Return ONLY one label:
deposit_issue | withdraw_issue | deposit_info | withdraw_info | normal | negative | unknown

Guidelines:
- deposit_issue → user has a problem with deposit (failed, not received, stuck, delay, error)
- withdraw_issue → user has a problem with withdraw (pending, not received, rejected, delay)
- deposit_info → user wants to know how to deposit (methods, steps, limits)
- withdraw_info → user wants to know how to withdraw
- normal → greetings, casual talk, general help
- negative → ANY abusive, sexual, or threatening content (highest priority)
- unknown → spam, nonsense, irrelevant

Important:
- Use context if helpful, but focus on the latest message
- Do NOT rely only on keywords — understand intent
- If unsure, choose the closest logical intent (prefer "normal" over "unknown")

Output ONLY the label. No explanation.
`.trim(),
      },
      {
        role: "user",
        content: `${contextBlock}\nLatest message: "${message}"\n\nClassify:`,
      },
    ],
  });

  const raw = res.choices[0].message.content?.trim().toLowerCase() ?? "unknown";

  // Sanitize — only accept known values
  const valid = [
    "deposit_issue",
    "withdraw_issue",
    "deposit_info",
    "withdraw_info",
    "normal",
    "negative",
    "unknown",
  ];

  const intent = valid.includes(raw) ? raw : "normal";
  console.log("[GROQ INTENT RAW]", raw, "→", intent);
  return intent;
}

// ─────────────────────────────────────────────────────────────────
// askAI — accepts full message array for multi-turn context
// ─────────────────────────────────────────────────────────────────
export async function askAI(messages: Message[]): Promise<string> {
  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.5,
    max_tokens: 512,
    messages,
  });

  return res.choices[0].message.content ?? "Something went wrong.";
}
