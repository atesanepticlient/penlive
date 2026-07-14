import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import {  NextResponse } from "next/server";
import { db } from "@/lib/db";

function getPrizeForDeposit(ticketPrize: number) {
  if (ticketPrize >= 10000) return 500;
  if (ticketPrize >= 8000) return 200;
  if (ticketPrize >= 5000) return 100;
  if (ticketPrize >= 1000) return 25;
  if (ticketPrize >= 500) return 8;

  // lower than 500 → random from small prizes
  const smallPrizes = [1, 3, 5];
  return smallPrizes[Math.floor(Math.random() * smallPrizes.length)];
}
export const GET = async () => {
  try {
    const user = await findCurrentUser();

    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const expiry = await db.rewardEventExpiry.findFirst({
      where: {},
      select: {
        spin: true,
      },
    });

    const totalTicket =
      (
        await db.depositTicket.aggregate({
          where: {
            userId: user.id,
            expire: {
              gt: new Date(),
            },
            price: { not: 0 },
          },
          _sum: {
            price: true,
          },
        })
      )._sum.price || 0;

    if (+totalTicket < 100)
      return NextResponse.json(
        { payload: { totalTicket, prize: 0, expiry } },
        { status: 200 },
      );

    const prize = getPrizeForDeposit(+totalTicket);

    return NextResponse.json(
      { payload: { totalTicket, prize, expiry } },
      { status: 200 },
    );
  } catch (error) {
    console.log({ error: error.message });
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};

export const PUT = async () => {
  try {
    const user = await findCurrentUser();

    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const spinExpriy = await db.rewardEventExpiry.findFirst({
      where: {},
      select: { spin: true },
    });

    if (!spinExpriy || spinExpriy.spin < new Date()) {
      return NextResponse.json({ error: "Event was Closed" }, { status: 403 });
    }
    const tickets = await db.depositTicket.findMany({
      where: {
        userId: user.id,
        expire: {
          gt: new Date(),
        },
        price: { not: 0 },
      },
      orderBy: {
        price: "desc",
      },
    });
    const totalTicketPrice = tickets.reduce(
      (prev, ticket) => prev + +ticket.price,
      0,
    );
    if (totalTicketPrice < 100)
      return NextResponse.json(
        { error: "Please Deposit to claim reward" },
        { status: 403 },
      );

    const prize = getPrizeForDeposit(totalTicketPrice);

    await db.$transaction([
      db.wallet.update({
        where: { userId: user.id },
        data: {
          balance: {
            increment: prize,
          },
          turnOver: {
            increment: prize * 2,
          },
        },
      }),
      db.depositTicket.deleteMany({
        where: {
          userId: user.id,
        },
      }),
    ]);

    return NextResponse.json({ payload: { prize } }, { status: 200 });
  } catch  {
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
