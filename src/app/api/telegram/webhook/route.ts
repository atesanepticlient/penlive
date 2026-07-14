import { askAI } from "@/lib/groq";
import { sendToUser } from "@/lib/sendToUser";

export async function POST(req) {
  const body = await req.json();

  const text = body.message?.text;

  // extract userId from message
  const userId = extractUserId(text);

  const reply = await askAI([
    {
      content: `Support replied: "${text}"Reply nicely to user. `,
      role: "assistant",
    },
  ]);

  // 🔴 send to user (realtime or notification)
  sendToUser(userId, reply);

  return Response.json({ ok: true });
}

function extractUserId(text: any) {
  throw new Error("Function not implemented.");
}
