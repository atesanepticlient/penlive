/* eslint-disable @typescript-eslint/no-explicit-any */
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { cardNumberGenerate } from "@/lib/helpers";
import { CreateNewCardInput } from "@/types/api/card";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const user = await findCurrentUser();
    if (!user)
      return Response.json({ error: "Refresh the page" }, { status: 401 });

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true, withdrawPassword: true },
    });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { paymentWalletId, password, walletNumber, ownerName } =
      (await req.json()) as CreateNewCardInput;

    if (!paymentWalletId || !password || !walletNumber || !ownerName)
      return Response.json(
        {
          error: "Invalid Input",
        },
        { status: 400 },
      );

    const existingCardWithNumber = await db.card.findFirst({
      where: { walletNumber },
    });

    if (existingCardWithNumber)
      return Response.json(
        {
          error: "Card is avialiable! Try with another Number",
        },
        { status: 400 },
      );

    const paymentWallet = await db.paymentWallet.findUnique({
      where: { id: paymentWalletId },
    });

    if (!paymentWallet) {
      return Response.json(
        { error: "Invalid payment wallet" },
        { status: 400 },
      );
    }

    const walletName = paymentWallet.walletName.toLowerCase();
    const cardName = walletName.includes("bkash")
      ? "BKASH"
      : walletName.includes("nagad")
        ? "NAGAD"
        : null;

    if (!cardName) {
      return Response.json({ error: "Invalid card type" }, { status: 400 });
    }

    if (!dbUser.withdrawPassword) {
      const hashed = await bcrypt.hash(password, 10);
      await db.user.update({
        where: { id: user.id },
        data: { withdrawPassword: hashed },
      });
    } else {
      const isMatch = await bcrypt.compare(password, dbUser.withdrawPassword);
      if (!isMatch) {
        return Response.json({ error: "Invalid Password" }, { status: 400 });
      }
    }

    const cardNumber = await cardNumberGenerate();
    const card = await db.card.create({
      data: {
        cardNumber,
        walletNumber,
        payerName: ownerName,
        cardName,
        userId: user.id,
        containerId: user.id,
      },
    });

    return Response.json(
      { message: "New card created", card: { ...card, paymentWallet } },
      { status: 201 },
    );
  } catch (error) {
    console.log("careate new card error ", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
