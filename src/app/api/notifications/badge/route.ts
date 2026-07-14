import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { RewardName } from "@prisma/client";
import { NextResponse } from "next/server";

/* -------------------- HELPERS -------------------- */

const getBonusReceivingCount = async (userId: string) => {
  const now = new Date();

  const fixedPrize = await db.fixedAmountReward.count({
    where: { userId, expiry: { gt: now } },
  });

  const customReward = await db.customRewardEvent.count({
    where: { userId, expiry: { gt: now } },
  });

  const eventsExpiry = await db.rewardEventExpiry.findFirst();
  const activeLiveNames: RewardName[] = [];

  if (eventsExpiry?.eggHunt > now) activeLiveNames.push("EGGHUNT");
  if (eventsExpiry?.spin > now) activeLiveNames.push("SPIN");
  if (eventsExpiry?.envelop > now) activeLiveNames.push("ENVELOP");

  let liveEventsCount = 0;

  if (activeLiveNames.length > 0) {
    const events = await db.rewardEvent.findMany({
      where: { name: { in: activeLiveNames } },
    });

    liveEventsCount = events.filter((event: any) =>
      event.usersData?.some((d) => d.userId === userId),
    ).length;
  }

  return fixedPrize + customReward + liveEventsCount;
};

const getAchievementCount = async (userId: string) => {
  const rewards = await db.invitationRewareds.findMany();

  const userBonus = await db.invitationBonus.findUnique({
    where: { userId },
    include: { claimedRewards: true },
  });

  if (!userBonus) return 0;

  const hasUnclaimed = rewards.some((reward) => {
    const isClaimed = userBonus.claimedRewards.some(
      (c) => c.rewardId === reward.id,
    );

    return !isClaimed && reward.targetReferral <= userBonus.totalValidreferral;
  });

  return hasUnclaimed ? 1 : 0;
};

const getSigninBonusCount = async (userId: string) => {
  const claimed = await db.claimedSigninReward.findMany({
    where: { userId },
    include: { reward: true },
    orderBy: { createdAt: "desc" },
  });

  const rewards = await db.signinBonusRewards.findMany();

  const nextReward = rewards.find((reward) => {
    if (claimed.length === 0) return true;
    return claimed.some((c) => c.reward.id !== reward.id);
  });

  if (!nextReward) return 0;

  const firstClaimedSiginReward = claimed[claimed.length - 1];

  if (firstClaimedSiginReward) {
    const isExpired =
      new Date() >
      new Date(
        firstClaimedSiginReward.createdAt.setDate(
          firstClaimedSiginReward.createdAt.getDate() + 30,
        ),
      );

    if (isExpired) {
      await db.claimedSigninReward.deleteMany({
        where: {
          userId: userId,
        },
      });
    }
  }

  const lastSignin = claimed.find((c) => c.isClamed);
  const totalDeposit =
    (
      await db.deposit.aggregate({
        where: {
          userId,
          status: "APPROVED",
          ...(lastSignin && {
            statusUpdateAt: { gt: lastSignin.createdAt },
          }),
        },
        _sum: { amount: true },
      })
    )._sum.amount || 0;
  const totalBettingData = (
    await db.bettingRecord.aggregate({
      where: {
        userId,
        status: "SETTLED",
        ...(lastSignin && {
          createdAt: { gt: lastSignin.createdAt },
        }),
      },
      _sum: { profit: true, loss: true },
    })
  )._sum;

  const totalBetting =
    +(totalBettingData.profit || 0) + +(totalBettingData.loss || 0);

  console.log("Total Deposit : ", totalDeposit);
  console.log("Total Betting : ", totalBetting);

  return nextReward.deposit <= totalDeposit &&
    +nextReward.betting <= totalBetting
    ? 1
    : 0;
};

const getDailyCheckinCount = async (userId: string) => {
  const now = new Date();

  const daily = await db.dailyCheck.findUnique({
    where: { userId },
  });

  if (!daily) return 0;

  return daily.lastChecked < now ? 1 : 0;
};

const getAirdropCount = async (userId: string) => {
  const now = new Date();

  const events = await db.airDropEvent.findMany({
    where: { expiry: { gt: now } },
  });

  const claimed = await db.airDrop.count({
    where: {
      userId,
      status: "CLAIMED",
      airDropId: { in: events.map((e) => e.id) },
    },
  });

  return events.length - claimed;
};

const getUnseenMessage = async (userId: string) => {
  const messageCount = await db.notification.count({
    where: { userId: userId, isRead: false },
  });

  return messageCount;
};

/* -------------------- ROUTE -------------------- */

export const GET = async () => {
  try {
    const user = await findCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication failed!" },
        { status: 401 },
      );
    }

    const [
      bonusReceivingRewardCount,
      achivementRewardsCount,
      siginBonueCount,
      dailyCheckinCount,
      airDropCount,
      unSeenMessagesCount,
    ] = await Promise.all([
      getBonusReceivingCount(user.id),
      getAchievementCount(user.id),
      getSigninBonusCount(user.id),
      getDailyCheckinCount(user.id),
      getAirdropCount(user.id),
      getUnseenMessage(user.id),
    ]);

    console.log({
      bonusReceivingRewardCount,
      achivementRewardsCount,
      siginBonueCount,
      dailyCheckinCount,
      airDropCount,
    });

    return NextResponse.json({
      badge: {
        bonusReceivingRewardCount,
        achivementRewardsCount,
        siginBonueCount,
        dailyCheckinCount,
        airDropCount,
        unSeenMessagesCount,
      },
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
