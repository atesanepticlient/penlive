import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { RewardName } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const user = await findCurrentUser();

    const liveEventExpiry = await db.rewardEventExpiry.findFirst({ where: {} });
   
    const now = new Date();

    const activeLiveNames: RewardName[] = [];

    if (liveEventExpiry?.eggHunt > now) activeLiveNames.push("EGGHUNT");
    if (liveEventExpiry?.spin > now) activeLiveNames.push("SPIN");
    if (liveEventExpiry?.envelop > now) activeLiveNames.push("ENVELOP");

    let liveEvents = await await db.rewardEvent.findMany({
      where: { name: { in: activeLiveNames } },
      select: {
        usersData: true,
        id: true,
        name: true,
      },
    });

    const eventsData = {
      spin: [],
      egg: [],
      envelop: [],
    };

    eventsData.spin = [
      ...eventsData.spin,
      ...liveEvents.filter((event) => event.name == "SPIN"),
    ];
    eventsData.egg = [
      ...eventsData.egg,
      ...liveEvents.filter((event) => event.name == "EGGHUNT"),
    ];
    eventsData.envelop = [
      ...eventsData.envelop,
      ...liveEvents.filter((event) => event.name == "ENVELOP"),
    ];

    if (!user) {
      return NextResponse.json({ payload: { eventsData } }, { status: 200 });
    }

    liveEvents = liveEvents.filter((event) =>
      event.usersData?.some((d: any) => d.userId === user.id),
    );

    eventsData.spin = [...liveEvents.filter((event) => event.name == "SPIN")];
    eventsData.egg = [...liveEvents.filter((event) => event.name == "EGGHUNT")];
    eventsData.envelop = [
      ...liveEvents.filter((event) => event.name == "ENVELOP"),
    ];

    const customeEvents = await db.customRewardEvent.findMany({
      where: {
        userId: user.id,
        expiry: { gt: now },
      },
      select: {
        name: true,
        id: true,
      },
    });

    eventsData.spin = [
      ...customeEvents.filter((event) => event.name == "SPIN"),
      ...eventsData.spin,
    ];
    eventsData.egg = [
      ...customeEvents.filter((event) => event.name == "EGGHUNT"),
      ...eventsData.egg,
    ];
    eventsData.envelop = [
      ...customeEvents.filter((event) => event.name == "ENVELOP"),
      ...eventsData.envelop,
    ];

    return NextResponse.json({ payload: { eventsData } }, { status: 200 });
  } catch (error) {
    console.log("ERROR[api/reward-hub]", error.message);
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR });
  }
};
