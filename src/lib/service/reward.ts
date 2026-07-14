import { NextResponse } from "next/server";
import { db } from "../db";

export const claimDepositTickets = async (
  userId: string,
  ticketCost: number,
) => {
  const tickets = await db.depositTicket.findMany({
    where: {
      userId: userId,
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

  // let totalNeed = ticketCost;
  // const claimAbleTicket = [];
  // for (const ticket of tickets) {
  //   totalNeed -= +ticket.price;
  //   claimAbleTicket.push(ticket);
  //   if (totalNeed <= 0) {
  //     break;
  //   } else {
  //   }
  // }
  // const claimAbleTicketIds = claimAbleTicket.map((ticket) => ticket.id);
  // if (totalNeed < 0) {
  //   const lastTicket = claimAbleTicketIds.pop();
  //   console.log({ lastTicket });
  //   await db.depositTicket.update({
  //     where: {
  //       id: lastTicket,
  //     },
  //     data: {
  //       price: Math.abs(totalNeed),
  //     },
  //   });
  // }

  await db.depositTicket.deleteMany({
    where: {
      userId: userId,
    },
  });

  return totalTicketPrice;
};
