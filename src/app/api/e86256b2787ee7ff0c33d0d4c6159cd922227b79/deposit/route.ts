import { createNotification } from "@/action/notifications";
import { db } from "@/lib/db";
import { decryptPayload, verifySign } from "@/lib/payment";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Create a URL object from the request URL
    const { searchParams } = new URL(req.url);

    // Get individual params
    const userId = searchParams.get("user");

    const body = await req.json();
    const { payload, sign } = body;

    // 1️⃣ Verify signature
    if (!verifySign(payload, sign)) {
      return new Response("Invalid signature", { status: 400 });
    }

    // 2️⃣ Decrypt payload
    const decryptedData = decryptPayload(payload);

    const user = await db.user.findUnique({ where: { playerId: userId! } });

    // 3️⃣ Process based on transaction status
    if (decryptedData.status === "00") {
      await db.wallet.update({
        where: {
          userId: user!.id,
        },
        data: {
          balance: {
            increment: decryptedData.price,
          },
          turnOver: {
            increment: decryptedData.price,
          },
        },
      });
      await createNotification({
        title: `Deposit Successfull`,
        description: `Your ${decryptedData.price}BDT Deposit was Added`,
        userId: user!.id!,
        icon: "MONEY",
      });
      if (user.invitedById) {
        await db.wallet.update({
          where: {
            userId: user.invitedById,
          },
          data: {
            balance: {
              increment: decryptedData.price / 2,
            },
            turnOver: {
              increment: (decryptedData.price / 2) * 2,
            },
          },
        });
        await createNotification({
          title: `Bonus Added`,
          description: `You got ${
            decryptedData.price / 2
          }BDT Bonus from your invited player`,
          userId: user.invitedById,
          icon: "MONEY",
        });
      }
    } else {
      await createNotification({
        title: `Deposit Failed!`,
        description: `Your ${decryptedData.price}BDT Deposit was Failed due to wrong information`,
        userId: user!.id!,
        icon: "MONEY",
      });
    }

    // 4️⃣ Respond to platform
    return new Response("success", { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response("error", { status: 500 });
  }
}
