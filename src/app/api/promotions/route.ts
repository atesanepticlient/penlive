import { findCurrentUser } from "@/data/user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { message: "Authentication Failed!" },
        { status: 401 },
      );

    let dailyCheck: any = await db.dailyCheck.findUnique({
      where: {
        userId: user.id,
      },
    });

    const userTotalDepositAmount = (
      await db.deposit.aggregate({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
          status: "APPROVED",
        },
        _sum: {
          amount: true,
        },
      })
    )._sum.amount;

    dailyCheck = { ...dailyCheck, noDeposit: +userTotalDepositAmount == 0 };

    console.log("Daily Check in : ", dailyCheck)

    return NextResponse.json({ dailyCheck }, { status: 200 });
  } catch  {
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
};
