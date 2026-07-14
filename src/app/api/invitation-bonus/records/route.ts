import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import pMap from "p-map";

export const GET = async () => {
  try {
    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const referRecords = await db.inviataionRewardRecord.findMany({
      where: {
        userId: user.id,
      },
      select: {
        friendId: true,
        bonus: true,
        createdAt: true,
      },
    });

    const referRecoredsExtended = await pMap(referRecords, async (reward) => {
      const user = await db.user.findUnique({
        where: { id: reward.friendId },
        select: { phone: true },
      });

      return { user, ...reward };
    });

    const achivementRecords = await db.achivementRecords.findMany({
      where: { userId: user.id },
      select: {
        createdAt: true,
        reward: {
          select: {
            prize: true,
          },
        },
      },
    });

    const rebatehistory = await db.rebateDispatchItem.findMany({
      where: {
        refererId: user.id, // or params.userId for admin
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        dispatch: {
          select: {
            periodStart: true,
            periodEnd: true,
            percent: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        payload: {
          referRecords: referRecoredsExtended,
          achivementRecords: achivementRecords,
          rebate: rebatehistory,
        },
      },
      { status: 200 },
    );
  } catch  {
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
