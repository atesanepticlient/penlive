import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const user = await findCurrentUser();

    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const tickets = await db.depositTicket.findMany({
      where: {
        userId: user.id,
        expire: {
          gt: new Date(), // greater than now → not expired
        },
      },
    });

    const totalTicketPrice = tickets.reduce(
      (prev, ticket) => prev + +ticket.price,
      0,
    );

    return NextResponse.json(
      { payload: { tickets, totalTicketPrice } },
      { status: 200 },
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const ticketCost = Number(req.nextUrl.searchParams.get("cost")) || 0;

    if (!ticketCost)
      return NextResponse.json({ error: "Data missing!" }, { status: 403 });

    if (ticketCost > 100) {
      return NextResponse.json(
        { error: "Minimum Ticket Claim 100BDT" },
        { status: 403 },
      );
    }

    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

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

    if (totalTicketPrice < ticketCost)
      return NextResponse.json(
        { error: "Please Deposit to claim reward" },
        { status: 403 },
      );

    let totalNeed = ticketCost;
    const claimAbleTicket = [];
    for (const ticket of tickets) {
      totalNeed -= +ticket.price;
      claimAbleTicket.push(ticket);
      if (totalNeed <= 0) {
        break;
      } else {
      }
    }
    const claimAbleTicketIds = claimAbleTicket.map((ticket) => ticket.id);
    if (totalNeed < 0) {
      const lastTicket = claimAbleTicketIds.pop();
      console.log({ lastTicket });
      await db.depositTicket.update({
        where: {
          id: lastTicket,
        },
        data: {
          price: Math.abs(totalNeed),
        },
      });
    }

    await db.depositTicket.deleteMany({
      where: {
        userId: user.id,
        id: { in: claimAbleTicketIds },
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch  {
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
