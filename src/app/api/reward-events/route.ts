import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { RewardName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import pMap from "p-map";
import { encryptText } from "@/lib/helpers";

export const GET = async (req: NextRequest) => {
  try {
    const user = await findCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication Failed" },
        { status: 401 },
      );
    }

    // ✅ Parse query params
    // Example: ?name=EGGHUNT or ?name=EGGHUNT,SPIN
    const { searchParams } = new URL(req.url);
    const namesParam = searchParams.get("name");

    let selectedNames: RewardName[] | null = null;

    if (namesParam) {
      selectedNames = namesParam
        .split(",")
        .map((n) => n.trim().toUpperCase() as RewardName);
    }

    const eventsExpiry = await db.rewardEventExpiry.findFirst();
    const now = new Date();

    // ✅ Build allowed live event names based on expiry
    const activeLiveNames: RewardName[] = [];

    if (eventsExpiry?.eggHunt > now) activeLiveNames.push("EGGHUNT");
    if (eventsExpiry?.spin > now) activeLiveNames.push("SPIN");
    if (eventsExpiry?.envelop > now) activeLiveNames.push("ENVELOP");

    // ✅ Apply query filter (if provided)
    const finalLiveNames = selectedNames
      ? activeLiveNames.filter((name) => selectedNames!.includes(name))
      : activeLiveNames;

    let liveEvents: any[] = [];

    if (finalLiveNames.length > 0) {
      liveEvents = await db.rewardEvent.findMany({
        where: {
          name: { in: finalLiveNames },
        },
      });

      // for (let i = 0; liveEvents.length; i++) {
      //   const isUserDataAvail = liveEvents[0]?.usersData?.find(
      //     (d) => d.userId === user.id,
      //   );

      //   if (!isUserDataAvail) {
      //     const updatedEvent = await db.rewardEvent.update({
      //       where: {
      //         id: liveEvents[i]?.id,
      //       },
      //       data: {
      //         usersData: {
      //           push: {
      //             claimable: true,
      //             userId: user.id,
      //             createdAt: new Date(),
      //           },
      //         },
      //       },
      //     });

      //     liveEvents[i] = updatedEvent;
      //   }
      // }

      console.log({ liveEvents });

      // filter user-specific
      liveEvents = liveEvents.filter((event) =>
        event.usersData?.some((d) => d.userId === user.id),
      );
      console.log({ liveEvents });
      liveEvents = await pMap(liveEvents, async (event) => {
        const userRecord = event.usersData.find((d) => d.userId === user.id);

        const progress = await findRequireMentsProgress(
          userRecord.createdAt,
          event.ticketType,
          user.id,
          {},
        );

        const prize = Math.floor(
          getPrizeForLiveEvent({
            ticketType: event.ticketType,
            account:
              (event.ticketType == "DEPOSIT" && progress.deposit) ||
              (event.ticketType == "BET" && progress.bet) ||
              (event.ticketType == "INVITE" && progress.invite),
          }),
        );

        const prizeHash = encryptText(String(prize));
        const expiryMap = {
          EGGHUNT: eventsExpiry?.eggHunt,
          SPIN: eventsExpiry?.spin,
          ENVELOP: eventsExpiry?.envelop,
        };

        return {
          id: event.id,
          ticketType: event.ticketType,
          rewardType: "Live",
          name: event.name,
          createdAt: userRecord.createdAt,
          title: event.title,
          expiry: expiryMap[event.name],
          prize,
          prizeHash,
          requirementsProgress: [
            {
              progress,
              account: event.account,
            },
          ],
        };
      });
    }

    // ✅ Custom events
    let customEvents: any = await db.customRewardEvent.findMany({
      where: {
        userId: user.id,
        ...(selectedNames && {
          name: { in: selectedNames },
        }),
        expiry: {
          gt: new Date(),
        },
      },
    });

    customEvents = customEvents.map((event) => {
      const prize = Math.floor(getPrizeForCustomEvent(event.size));
      const prizeHash = encryptText(String(prize));
      return {
        id: event.id,
        rewardFor: event.rewardFor,
        ticketType: null,
        prize,
        prizeHash,
        rewardType: "Custom",
        name: event.name,
        createdAt: event.createdAt,
        expiry: event.expiry,
        title: event.title,
        requirementsProgress: null,
      };
    });
    let fixedRewards = [];

    if (!namesParam) {
      fixedRewards = await db.fixedAmountReward.findMany({
        where: {
          userId: user.id,
          expiry: { gt: new Date() },
        },
      });

      fixedRewards = fixedRewards.map((reward) => {
        return { ...reward, rewardType: "Fixed" };
      });
    }

    const events = [...liveEvents, ...customEvents, ...fixedRewards].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    );

    return NextResponse.json({ payload: { events } }, { status: 200 });
  } catch (error) {
    console.error("GET /events error:", error);
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};

export const findRequireMentsProgress = async (
  createdAt: Date,
  fetch: "DEPOSIT" | "BET" | "INVITE" | "BOTH",
  userId: string,
  { removeDeposits }: { removeDeposits?: boolean },
) => {
  let deposit: number | null = 0;
  let bet: number | null = 0;
  let invite: number | null = 0;

  if (fetch === "DEPOSIT" || fetch === "BOTH") {
    const deposits = await db.depositTicket.findMany({
      where: {
        userId,
        createdAt: { gt: createdAt },
        price: { not: 0 },
        expire: { gt: new Date() },
      },
      select: {
        id: true,
        price: true,
      },
    });
    deposit = deposits.reduce((e, dp) => {
      return e + +dp.price;
    }, 0);

    if (removeDeposits && deposits.length !== 0) {
      await db.depositTicket.deleteMany({
        where: {
          id: {
            in: [...deposits.map((deposit) => deposit.id)],
          },
        },
      });
    }

    if (fetch === "DEPOSIT") return { deposit };
  }

  if (fetch === "BET" || fetch === "BOTH") {
    const result = (
      await db.bettingRecord.aggregate({
        where: {
          userId,
          createdAt: { gt: createdAt },
          status: "SETTLED",
        },
        _sum: {
          loss: true,
          profit: true,
        },
      })
    )._sum;

    bet = (+result.loss || 0) + (+result.profit || 0);

    if (fetch === "BET") return { bet };
  }

  if (fetch == "INVITE" || fetch == "BOTH") {
    const validRefers = await db.invitation.findUnique({
      where: {
        userId: userId,
      },
      select: {
        validRerredUsers: true,
      },
    });
    if (validRefers && validRefers?.validRerredUsers?.length != 0) {
      const quniqeValidRefers = validRefers.validRerredUsers.filter(
        (refer: any) => {
          return refer.createdAt > createdAt;
        },
      );
      invite = quniqeValidRefers.length;
    }
    if (fetch == "INVITE") {
      return { invite };
    }
  }
  return { deposit, bet, invite };
};

const getPrizeForCustomEvent = (point: number) => {
  if (point < 1) return 0;

  const baseRandom = Math.floor(Math.random() * 5) + 1;
  return baseRandom * point;
};

export const getPrizeForLiveEvent = ({
  account,
  ticketType,
}: {
  ticketType: "BET" | "INVITE" | "DEPOSIT";
  account: number;
}) => {
  const getRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  let prize = 0;
  if (ticketType == "DEPOSIT") {
    if (account >= 10000) {
      prize = 500;
    }
    if (account >= 8000) {
      prize = 200;
    }
    if (account >= 5000) {
      prize = 100;
    }
    if (account >= 1000) {
      prize = 25;
    }
    if (account >= 500) {
      prize = 8;
    }

    // lower than 500 → random from small prizes
    const smallPrizes = [1, 3, 5];
    prize = smallPrizes[Math.floor(Math.random() * smallPrizes.length)];
  } else if (ticketType == "BET") {
    if (account >= 100000) {
      prize = getRandom(501, 1500);
    }
    if (account >= 50000) {
      prize = getRandom(150, 500);
    }
    if (account >= 20000) {
      prize = getRandom(61, 150);
    }
    if (account >= 10000) {
      prize = getRandom(41, 60);
    }
    if (account >= 5000) {
      prize = getRandom(21, 40);
    }
    if (account >= 2000) {
      prize = getRandom(9, 20);
    }
    if (account >= 500) {
      prize = getRandom(6, 8);
    }

    // lower than 500 → random from small prizes
    const smallPrizes = [1, 3, 5];
    prize = smallPrizes[Math.floor(Math.random() * smallPrizes.length)];
  } else if (ticketType == "INVITE") {
    if (account > 10) {
      prize = getRandom(1000, 3000);
    }
    if (account >= 5 && account <= 10) {
      prize = getRandom(600, 2000);
    }
    if (account >= 5) {
      prize = getRandom(400, 600);
    }
    if (account >= 4) {
      prize = getRandom(200, 400);
    }
    if (account >= 3) {
      prize = getRandom(101, 200);
    }
    if (account >= 2) {
      prize = getRandom(50, 100);
    }
    if (account >= 1) {
      prize = getRandom(5, 50);
    }
  }
  return prize;
};
