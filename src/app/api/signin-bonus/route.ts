/* eslint-disable @typescript-eslint/no-explicit-any */
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    const user: any = await findCurrentUser();

    if (!user)
      return Response.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const claimedSigninRewards = await db.claimedSigninReward.findMany({
      where: { userId: user!.id },
      include: {
        reward: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const firstClaimedSiginReward =
      claimedSigninRewards[claimedSigninRewards.length - 1];

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
            userId: user.id,
          },
        });
      }
    }

    const totalSigninIncome = claimedSigninRewards.reduce(
      (acc, claimedSigninReward) => {
        if (claimedSigninReward.isClamed) {
          return acc + claimedSigninReward.reward.cash;
        }
        return acc;
      },
      0,
    );

    const lastSignin = claimedSigninRewards.find(
      (claimedSigninReward) => claimedSigninReward.isClamed,
    );

    let rewards: any = await db.signinBonusRewards.findMany({ where: {} });

    const totalDeposit =
      (
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
      )._sum.amount || 0;
    const totalBetting = (
      await db.bettingRecord.aggregate({
        where: {
          status: "SETTLED",
          userId: user.id,
          ...(lastSignin?.createdAt && {
            createdAt: {
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

    rewards = rewards.map((reward: any) => {
      const id = reward.id;

      const alreadyClaimed = claimedSigninRewards.find(
        (claimedSigninReward) =>
          claimedSigninReward.reward.id == id && claimedSigninReward.isClamed,
      );

      if (alreadyClaimed) {
        reward.status = "CLAIMED";
        return reward;
      }

      reward.status = "AVAILABLE";
      return reward;
    });

    const nextClaimAvailable = rewards.find((reward: any) => {
      if (claimedSigninRewards.length == 0) {
        return true;
      } else {
        const unclaimed = claimedSigninRewards.find(
          (claimedSigninReward) => claimedSigninReward.reward.id !== reward.id,
        );
        return !!unclaimed;
      }
    });

    rewards = rewards.map((reward: any) => {
      if (reward.id == nextClaimAvailable.id) {
        reward.status = "CLAIM";
        // implement the logic for status claim
        const createdAt = lastSignin?.createdAt;
        const now = new Date();

        const isSameDay =
          createdAt &&
          createdAt.getFullYear() === now.getFullYear() &&
          createdAt.getMonth() === now.getMonth() &&
          createdAt.getDate() === now.getDate();

        const canClaimInTheDay = !isSameDay;

        const requirementsFullfill =
          reward.deposit <= requirementsProgress.deposit &&
          reward.betting <= requirementsProgress.betting;

        // const prevWasClaimed = rewards[i].;

        if (canClaimInTheDay && requirementsFullfill) {
          reward.isClaimable = true;
          return reward;
        }
        return reward;
      }
      return reward;
    });

    return Response.json({
      statictic: {
        totalSigninIncome,
        lastSigninIncome: lastSignin?.reward.cash || 0,
      },
      lastClaimed: lastSignin,
      nextClaimAvailable,
      rewards: rewards,
      progress: requirementsProgress,
    });
  } catch (error) {
    console.log("signin error ", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
