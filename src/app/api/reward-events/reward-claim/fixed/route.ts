import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
  try {
    const rewardId = req.nextUrl.searchParams.get("rewardId");
    if (!rewardId) {
      return NextResponse.json(
        { error: "Required input is missing" },
        { status: 400 },
      );
    }

    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const reward = await db.fixedAmountReward.findUnique({
      where: {
        userId: user.id,
        id: rewardId,
      },
    });

    if (!reward) {
      return NextResponse.json(
        { error: "Reward was not found!" },
        { status: 404 },
      );
    }

    if (reward.expiry < new Date()) {
      return NextResponse.json(
        { error: "Reward was expired" },
        { status: 400 },
      );
    }

    await db.$transaction([
      db.wallet.update({
        where: {
          userId: user.id,
        },
        data: {
          balance: {
            increment: reward.prize,
          },
          turnOver: {
            increment: +reward.prize * 3,
          },
        },
      }),
      db.fixedAmountReward.delete({
        where: {
          id: rewardId,
          userId: user.id,
        },
      }),
    ]);

    return NextResponse.json({ success: "" }, { status: 200 });
  } catch (error) {
    console.log("FIXED REWARD CLAIM ERROR : ", error);
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
