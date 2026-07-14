// import { findCurrentUser } from "@/data/user";
// import { INTERNAL_SERVER_ERROR } from "@/error";
// import { db } from "@/lib/db";

// export const GET = async () => {
//   try {
//     const user = await findCurrentUser();
//     if (!user)
//       return Response.json({ error: "Refresh the page" }, { status: 401 });

//     const hasCardContainer = !!(await db.cardContainer.findFirst({
//       where: { userId: user.id },
//     }));

//     return Response.json({ hasCardContainer }, { status: 200 });
//   } catch (error) {
//     console.log("CARD FETCH ERROR : ", error);
//     return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
//   }
// };

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { findCurrentUser } from "@/data/user";

export async function GET() {
  try {
    const currentUser = await findCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication Error!" },
        { status: 401 },
      );
    }

    const user = await db.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        withdrawPassword: true,
        cards: {
          select: {
            id: true,
            cardName: true,
            walletNumber: true,
            payerName: true,
            cardNumber: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      hasWithdrawPassword: !!user.withdrawPassword,
      cards: user.cards,
    });
  } catch (error) {
    console.error("[USER_STATUS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
