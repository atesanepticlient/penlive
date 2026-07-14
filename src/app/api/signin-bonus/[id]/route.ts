/* eslint-disable @typescript-eslint/no-explicit-any */
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const user: any = await findCurrentUser();

    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed" },
        { status: 401 },
      );

    const reward = await db.signinBonusRewards.findUnique({
      where: { id },
    });

    if (!reward)
      return Response.json({ error: "Reward not found" }, { status: 404 });

    const lastSignin = await db.claimedSigninReward.findFirst({
      where: {
        userId: user!.id,
        isClamed: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        reward: true,
      },
    });

    const totalDeposit = (
      await db.deposit.aggregate({
        where: {
          userId: user.id,
          status: "APPROVED",
          ...(lastSignin?.createdAt && {
            statusUpdateAt: {
              gt: lastSignin.createdAt,
            },
          }),
        },
        _sum: {
          amount: true,
        },
      })
    )._sum.amount;

    const totalBetting = (
      await db.bettingRecord.aggregate({
        where: {
          status: "SETTLED",
          userId: user.id,
          ...(lastSignin?.createdAt && {
            statusUpdateAt: {
              gt: lastSignin.createdAt,
            },
          }),
          OR: [{ profit: { not: null } }, { loss: { not: null } }],
        },
        _sum: {
          profit: true,
          loss: true,
        },
      })
    )._sum;

    const totalValidBetting = +totalBetting.profit + +totalBetting.loss;

    //it demo
    const requirementsProgress = {
      deposit: totalDeposit || 0,
      betting: totalValidBetting || 0,
    };

    if (+reward.deposit > 0) {
      if (+requirementsProgress.deposit < +reward.deposit) {
        return NextResponse.json(
          { error: "Please Complete The deposit Requirements" },
          { status: 400 },
        );
      }
    }
    if (+reward.betting > 0) {
      if (requirementsProgress.betting < +reward.betting) {
        return NextResponse.json(
          { error: "Please Complete The betting Requirements" },
          { status: 400 },
        );
      }
    }

    const alreadyClaimed = await db.claimedSigninReward.findMany({
      where: {
        rewardId: reward.id,
        userId: user.id,
      },
    });

    if (alreadyClaimed.length > 0 && alreadyClaimed[0]) {
      return NextResponse.json(
        { error: "You already claimed This" },
        { status: 400 },
      );
    }

    // implement the logic for status claim
    const createdAt = lastSignin?.createdAt;
    const now = new Date();

    const isSameDay =
      createdAt &&
      createdAt.getFullYear() === now.getFullYear() &&
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getDate() === now.getDate();

    const canClaimInTheDay = !isSameDay;

    if (!canClaimInTheDay) {
      return NextResponse.json({ error: "Try tomorrow" }, { status: 400 });
    }

    // handle the other gif like egg hunt, beg late

    await db.$transaction(async (tx) => {
      await tx.wallet.update({
        where: {
          userId: user.id,
        },
        data: {
          balance: {
            increment: reward.cash,
          },
        },
      });
      await tx.claimedSigninReward.create({
        data: {
          reward: {
            connect: { id: reward.id },
          },
          user: {
            connect: { id: user.id },
          },
          isClamed: true,
        },
      });
      if (reward.beg || reward.wheel || reward.eggHunt) {
        db.customRewardEvent.create({
          data: {
            user: {
              connect: {
                id: user.id,
              },
            },
            name: reward.beg ? "ENVELOP" : reward.eggHunt ? "EGGHUNT" : "SPIN",
            rewardFor: "Signin",
            title: `Day ${reward.day} Signin Bonus`,
            expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            size: calculateBonusGameSize(
              {
                deposit: +reward.deposit,
                betting: +reward.betting,
              },
              {
                deposit: +requirementsProgress.deposit,
                betting: +requirementsProgress.betting,
              },
              Number(reward.day),
            ),
          },
        });
      }
    });

    // await createNotification({
    //   title: `Bonus Added`,
    //   description: `${reward.cash} BDT added to your account`,
    //   userId: user!.id!,
    //   icon: "MONEY",
    // });
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("signin error ", error.message);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};

const calculateBonusGameSize = (
  require: { betting: number; deposit: number },
  progress: { betting: number; deposit: number },
  level: number = 1,
) => {
  let bettingPoint = 0;
  let depositPoint = 0;
  if (require.deposit) {
    depositPoint = progress.deposit / require.deposit;
  }
  if (require.betting) {
    bettingPoint = progress.betting / require.betting;
  }

  return (bettingPoint + depositPoint) * level;
};
