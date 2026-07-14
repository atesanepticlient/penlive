import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const user = await findCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication Error!" },
        { status: 401 },
      );
    }

    const userId = user.id;
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [invitationRewards, achievementRewards, rebateHistory, invitation] =
      await Promise.all([
        db.inviataionRewardRecord.findMany({
          where: {
            userId,
          },
          select: {
            bonus: true,
            createdAt: true,
          },
        }),

        db.achivementRecords.findMany({
          where: {
            userId,
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
            refererId: userId,
          },
          select: {
            rebateAmount: true,
            createdAt: true,
          },
        }),

        db.invitation.findUnique({
          where: {
            userId,
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

    const invitationReward24h = invitationRewards
      .filter((item) => item.createdAt >= last24Hours)
      .reduce((sum, item) => sum + Number(item.bonus), 0);

    // ---------------- Achievement Reward ----------------

    const totalAchievementReward = achievementRewards.reduce(
      (sum, item) => sum + Number(item.reward.prize),
      0,
    );

    const achievementReward24h = achievementRewards
      .filter((item) => item.createdAt >= last24Hours)
      .reduce((sum, item) => sum + Number(item.reward.prize), 0);

    // ---------------- Rebate ----------------

    const totalRebate = rebateHistory.reduce(
      (sum, item) => sum + Number(item.rebateAmount),
      0,
    );

    const rebate24h = rebateHistory
      .filter((item) => item.createdAt >= last24Hours)
      .reduce((sum, item) => sum + Number(item.rebateAmount), 0);

    // ---------------- Referral ----------------

    const totalRegisters = invitation?.referredUsers.length ?? 0;

    const registers24h =
      invitation?.referredUsers.filter((user) => user.createdAt >= last24Hours)
        .length ?? 0;

    const totalValidReferral = invitation?.validRerredUsers.length ?? 0;

    const validReferral24h =
      invitation?.validRerredUsers.filter(
        (user: any) => new Date(user.createdAt) >= last24Hours,
      ).length ?? 0;

    return NextResponse.json(
      {
        payload: {
          total: {
            invitationReward: totalInvitationReward,
            achievementReward: totalAchievementReward,
            rebate: totalRebate,
            registers: totalRegisters,
            validReferral: totalValidReferral,
          },

          last24Hours: {
            invitationReward: invitationReward24h,
            achievementReward: achievementReward24h,
            rebate: rebate24h,
            registers: registers24h,
            validReferral: validReferral24h,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
