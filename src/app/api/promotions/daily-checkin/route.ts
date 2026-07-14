import { findCurrentUser } from "@/data/user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed" },
        { status: 401 },
      );

    const dailyCheckin = await db.dailyCheck.findUnique({
      where: { userId: user.id },
    });

    let price = +dailyCheckin.firstPrice || 2.5;

    if (dailyCheckin.lastChecked) {
      const now = Date.now();
      const last = dailyCheckin.lastChecked.getTime();
      if (!(now - last >= 24 * 60 * 60 * 1000)) {
        return NextResponse.json({ error: "Try it later!" }, { status: 403 });
      }

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

      if (+userTotalDepositAmount == 0) {
        return NextResponse.json(
          { error: "Complete Daily Task to Claim" },
          { status: 1406 },
        );
      }

      price = +userTotalDepositAmount * 0.02;
    }

    price = Number(price.toFixed(2));

    const [dailyCheck] = await db.$transaction([
      db.dailyCheck.update({
        where: { userId: user.id },
        data: {
          lastChecked: new Date(),
        },
      }),
      db.wallet.update({
        where: { userId: user.id },
        data: {
          balance: {
            increment: price,
          },
        },
      }),
    ]);

    return NextResponse.json(
      { payload: { price, lastChecked: dailyCheck.lastChecked } },
      { status: 201 },
    );
  } catch  {
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
};
