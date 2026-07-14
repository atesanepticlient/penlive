import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const eventExpiry = await db.rewardEventExpiry.findFirst({ where: {} });

    const spinWheelExpiry =
      !eventExpiry || eventExpiry.spin < new Date() ? false : true;

    const user = await findCurrentUser();

    let notification = false;
    if (!user) {
      notification = false;
    } else {
      const ticketPrice =
        (
          await db.depositTicket.aggregate({
            where: { userId: user.id },
            _sum: {
              price: true,
            },
          })
        )._sum.price || 0;
      notification = +ticketPrice > 100;
    }
    return NextResponse.json(
      {
        payload: { spinWheel: { expiry: spinWheelExpiry, notification } },
      },
      { status: 200 },
    );
  } catch  {
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
