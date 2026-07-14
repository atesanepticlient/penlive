import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { findCurrentUser } from "@/data/user";

export async function GET() {
  const user = await findCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const agg = await db.bettingRecord.aggregate({
      where: { userId: user.id, status: "SETTLED" },
      _sum: { betAmount: true, profit: true },
    });

    const totalBet = agg._sum.betAmount ? +agg._sum.betAmount : 0;
    const totalWin = agg._sum.profit ? +agg._sum.profit : 0;
    const winningRate = totalBet > 0 ? (totalWin / totalBet) * 100 : 0;

    return NextResponse.json({
      totalBet,
      totalWin,
      winningRate,
    });
  } catch (error) {
    console.error("Error fetching betting record:", error);
    return NextResponse.json(
      { error: "Failed to fetch betting record" },
      { status: 500 }
    );
  }
}
