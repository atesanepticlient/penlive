import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import pMap from "p-map";

const fetchDepositsAndBetting = async (
  fetchStartDate: Date,
  userId: string,
) => {
  const deposits =
    (
      await db.deposit.aggregate({
        where: {
          statusUpdateAt: {
            gt: fetchStartDate,
          },
          userId: userId,
        },
        _sum: {
          amount: true,
        },
      })
    )._sum.amount || 0;

  const totalBetting = (
    await db.bettingRecord.aggregate({
      where: {
        userId: userId,
        status: "SETTLED",
        createdAt: { gt: fetchStartDate },
        OR: [{ profit: { not: null } }, { loss: { not: null } }],
      },
      _sum: {
        profit: true,
        loss: true,
      },
    })
  )._sum;

  const totalValidBetting = +totalBetting.profit + +totalBetting.loss;

  return { deposits: deposits, betting: totalValidBetting };
};

export const GET = async () => {
  try {
    const user = await findCurrentUser();

    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    let rewards: any = await db.vIPRewardUserProgress.findMany({
      where: {
        userId: user.id,
        expiry : {gt : new Date()}
      },
      include: {
        requirements: true,
      },
    });

    rewards = await pMap(rewards, async (reward: any) => {
      const { deposits, betting } = await fetchDepositsAndBetting(
        reward.createdAt,
        user.id,
      );
      return {
        ...reward,
        progress: { totalDeposit: deposits, totalBet: betting },
      };
    });

    return NextResponse.json({ payload: { rewards } }, { status: 200 });
  } catch (error) {
    console.log("vip reward error ", error);
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const rewardId = req.nextUrl.searchParams.get("reward-id");

    const reward = await db.vIPRewardUserProgress.findUnique({
      where: {
        userId: user.id,
        id: rewardId,
      },
      include: { requirements: true },
    });

    if (!reward)
      return NextResponse.json(
        { error: "Reward is not available!" },
        { status: 404 },
      );

    if (reward.expiry < new Date()) {
      return NextResponse.json({ error: "Reward Expired!" }, { status: 404 });
    }

    const { deposits: totalDeposit, betting: totalBet } =
      await fetchDepositsAndBetting(reward.createdAt, user.id);

    if (
      +reward.requirements.totalDeposit > +totalDeposit ||
      +reward.requirements.totalBet > +totalBet
    ) {
      return NextResponse.json(
        { error: "Full Fill The Deposit requirements" },
        { status: 403 },
      );
    }

    await db.$transaction([
      db.wallet.update({
        where: { userId: user.id },
        data: {
          balance: { increment: reward.requirements.reward },
          turnOver: { increment: +reward.requirements.reward * 2 },
        },
      }),
      db.vIPRewardUserProgress.delete({
        where: { id: rewardId },
      }),
    ]);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch  {
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 200 });
  }
};
