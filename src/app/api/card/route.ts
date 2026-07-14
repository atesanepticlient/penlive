// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { findCurrentUser } from "@/data/user";
// import { INTERNAL_SERVER_ERROR } from "@/error";
// import { db } from "@/lib/db";
// import { cardNumberGenerate } from "@/lib/helpers";
// import { CreateCardInput } from "@/types/api/card";
// import { Prisma } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import { NextRequest } from "next/server";

// export const POST = async (req: NextRequest) => {
//   try {
//     console.log("CARD CALLED");

//     const user = await findCurrentUser();
//     if (!user)
//       return Response.json({ error: "Refresh the page" }, { status: 401 });

//     const { walletNumber, paymentWalletId, password } =
//       (await req.json()) as CreateCardInput;

//     if (!walletNumber || !paymentWalletId || !password)
//       return Response.json(
//         {
//           error: "Invalid Input",
//         },
//         { status: 400 }
//       );
//     const cardContainer = await db.cardContainer.findFirst({
//       where: { userId: user.id },
//       include: { cards: true },
//     });

//     if (!cardContainer)
//       return Response.json(
//         {
//           error: "Please create a new Card with Payeer name",
//         },
//         { status: 400 }
//       );

//     const existingCardWithNumber = await db.card.findFirst({
//       where: { walletNumber },
//     });

//     if (existingCardWithNumber)
//       return Response.json(
//         {
//           error: "Card is avialiable! Try with another Number",
//         },
//         { status: 400 }
//       );

//     const isPasswordMatch = await bcrypt.compare(
//       password,
//       cardContainer.password
//     );

//     if (!isPasswordMatch)
//       return Response.json(
//         {
//           error: "Invalid Password",
//         },
//         { status: 400 }
//       );

//     const limit = cardContainer.cards.length;
//     if (limit > 4) {
//       return Response.json({ error: "Card limit reached " }, { status: 400 });
//     }

//     const cardNumber = await cardNumberGenerate();

//     const card: any = await db.card.create({
//       data: {
//         walletNumber,
//         paymentWalletid: paymentWalletId,
//         cardNumber,
//         container: {
//           connect: {
//             id: cardContainer.id,
//           },
//         },
//       },
//       include: { container: true },
//     });
//     console.log("card.paymentWalletId ", card.paymentWalletId);
//     const paymentWallet = await db.paymentWallet.findFirst({
//       where: { id: card.paymentWalletid },
//     });
//     card.paymentWallet = paymentWallet;

//     return Response.json(
//       { message: "New card created", card: card },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log("CREATE CARD ERROR ", error);
//     return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
//   }
// };

import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { createId } from "@paralleldrive/cuid2";
import { findCurrentUser } from "@/data/user";

export async function GET() {
  try {
    const currentUser = await findCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cards = await db.card.findMany({
      where: {
        userId: currentUser.id,
        isActive: true,
      },
      select: {
        id: true,
        cardName: true,
        cardNumber: true,
        walletNumber: true,
        payerName: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("[CARDS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

const CARD_LIMIT_PER_NAME = 5;

export async function POST(req: Request) {
  try {
    const currentUser = await findCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { payerName, walletNumber, cardName, password } = body;

    // Validate required fields
    if (!payerName || !walletNumber || !cardName || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate cardName enum
    if (!["BKASH", "NAGAD"].includes(cardName)) {
      return NextResponse.json({ error: "Invalid card type" }, { status: 400 });
    }

    // Fetch the user with cards and withdrawPassword
    const user = await db.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        withdrawPassword: true,
        cards: {
          where: { cardName },
          select: { id: true, walletNumber: true, cardName: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check card limit per card name
    if (user.cards.length >= CARD_LIMIT_PER_NAME) {
      return NextResponse.json(
        {
          error: `You can only add up to ${CARD_LIMIT_PER_NAME} ${cardName} cards`,
        },
        { status: 400 },
      );
    }

    // Check wallet number uniqueness for the same card name (globally)
    const existingWallet = await db.card.findFirst({
      where: {
        walletNumber,
        cardName,
      },
    });

    if (existingWallet) {
      return NextResponse.json(
        {
          error: `This wallet number is already registered as a ${cardName} card`,
        },
        { status: 400 },
      );
    }

    // Handle withdraw password logic
    if (!user.withdrawPassword) {
      // No withdraw password yet — set it now
      const hashed = await bcrypt.hash(password, 10);
      await db.user.update({
        where: { id: currentUser.id },
        data: { withdrawPassword: hashed },
      });
    } else {
      // Verify existing withdraw password
      const isMatch = await bcrypt.compare(password, user.withdrawPassword);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect card/withdraw password" },
          { status: 401 },
        );
      }
    }

    // Create the card with auto-generated card number
    const card = await db.card.create({
      data: {
        payerName,
        cardNumber: createId(),
        walletNumber,
        cardName,
        userId: currentUser.id,
        containerId: currentUser.id,
      },
    });

    return NextResponse.json({ success: true, card }, { status: 201 });
  } catch (error) {
    console.error("[CARD_CREATE_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
