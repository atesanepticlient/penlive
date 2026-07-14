import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    const user = await findCurrentUser();

    if (!user)
      return Response.json({ error: "Refresh the page" }, { status: 401 });

    const userInvitationBonus = await db.invitationBonus.findUnique({
      where: { userId: user.id },
      include: { claimedRewards: true },
    });

    const rewards = await db.invitationRewareds.findMany({ where: {} });

    const userRewards = rewards.map((reward) => {
      const newReward = {
        ...reward,
        completedReferral: userInvitationBonus.totalValidreferral,
        isClamed: false,
      };

      // newReward.completedReferral =
      //   userInvitationBonus!.totalValidreferral >= reward.targetReferral
      //     ? reward.targetReferral
      //     : userInvitationBonus!.totalValidreferral;

      newReward.isClamed = !!userInvitationBonus!.claimedRewards.find(
        (clamedReward) => reward.id === clamedReward.rewardId,
      );

      return newReward;
    });

   await db.invitationBonus.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        claimedRewards: {
          include: {
            reward: true,
          },
        },
      },
    });

    const [invitationRewards, achievementRewards, rebateHistory] =
      await Promise.all([
        db.inviataionRewardRecord.findMany({
          where: {
            userId: user.id,
          },
          select: {
            bonus: true,
            createdAt: true,
          },
        }),

        db.achivementRecords.findMany({
          where: {
            userId: user.id,
          },
          include: {
            reward: {
              select: {
                prize: true,
              },
            },
          },
        }),

        db.rebateDispatchItem.findMany({
          where: {
            refererId: user.id,
          },
          select: {
            rebateAmount: true,
            createdAt: true,
          },
        }),

        db.invitation.findUnique({
          where: {
            userId: user.id,
          },
          include: {
            referredUsers: {
              select: {
                id: true,
                createdAt: true,
              },
            },
          },
        }),
      ]);

    // ---------------- Invitation Reward ----------------

    const totalInvitationReward = invitationRewards.reduce(
      (sum, item) => sum + Number(item.bonus),
      0,
    );

    const totalAchievementReward = achievementRewards.reduce(
      (sum, item) => sum + Number(item.reward.prize),
      0,
    );

    const totalRebate = rebateHistory.reduce(
      (sum, item) => sum + Number(item.rebateAmount),
      0,
    );

    const totalIncome =
      totalInvitationReward + totalAchievementReward + totalRebate;

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const invitationReward24h = invitationRewards
      .filter((item) => item.createdAt >= last24Hours)
      .reduce((sum, item) => sum + Number(item.bonus), 0);

    const achievementReward24h = achievementRewards
      .filter((item) => item.createdAt >= last24Hours)
      .reduce((sum, item) => sum + Number(item.reward.prize), 0);

    const rebate24h = rebateHistory
      .filter((item) => item.createdAt >= last24Hours)
      .reduce((sum, item) => sum + Number(item.rebateAmount), 0);

    const todayIncome = invitationReward24h + achievementReward24h + rebate24h;

    const statictic = {
      registersCount: userInvitationBonus!.totalRegisters,
      todayIncome: todayIncome,
      validReferral: userInvitationBonus!.totalValidreferral,
      totalIncome,
    };

    return Response.json({ rewards: userRewards, statictic }, { status: 200 });
  } catch (error) {
    console.log("Invitation Bonus = ", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
