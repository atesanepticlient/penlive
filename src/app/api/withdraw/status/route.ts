import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { findCurrentUser } from "@/data/user";

export async function GET() {
  try {
    const currentUser = await findCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [, wallet, todayWithdraws] = await Promise.all([
      db.user.findUnique({
        where: { id: currentUser.id },
        select: {
          vipLevel: {
            select: {
              level: true,
            },
          },
        },
      }),
      db.wallet.findUnique({
        where: { userId: currentUser.id },
        select: { balance: true, turnOver: true },
      }),
      db.withdraw.count({
        where: {
          userId: currentUser.id,
          createdAt: { gte: today },
        },
      }),
    ]);
    console.log({ todayWithdraws });
    // Fetch turnover from betting records — sum of remaining turnover requirement
    // Adjust this query based on your actual schema
    const turnover = wallet?.turnOver || 0;

    const DAILY_WITHDRAW_LIMIT = 10;
    const remainingWithdraws = Math.max(
      0,
      DAILY_WITHDRAW_LIMIT - todayWithdraws,
    );
    const balance = wallet?.balance ?? 0;
    const remainingTurnover = turnover ?? 0;

    return NextResponse.json({
      balance,
      dailyWithdrawLimit: DAILY_WITHDRAW_LIMIT,
      todayWithdrawCount: todayWithdraws,
      remainingWithdraws,
      remainingTurnover,
      // turnover breakdown by game type
      turnoverRows:
        +remainingTurnover > 0
          ? [{ gameType: "General", remaining: remainingTurnover }]
          : [],
    });
  } catch (error) {
    console.error("[WITHDRAW_STATUS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
