// /lib/sendToUser.js

import { connections } from "./connectionStore";

export function sendToUser(userId, message) {
  const controller = connections.get(userId);

  if (!controller) {
    console.log("User not connected → fallback to notification");
    return;
  }

  controller.enqueue(`data: ${JSON.stringify({ message })}\n\n`);
}
