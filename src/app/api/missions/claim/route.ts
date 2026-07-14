/* eslint-disable @typescript-eslint/no-explicit-any */
import { createNotification } from "@/action/notifications";
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { milestoneId } = await req.json();
    const user: any = await findCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const milestone = await db.missionMilestone.findUnique({
      where: { id: milestoneId },
      include: { missionTemplate: true },
    });
    if (!milestone) return NextResponse.json({ error: "Milestone not found" }, { status: 404 });

    // Get user progress
    const progress = await db.userMissionProgress.findUnique({
      where: { userId_missionTemplateId: { userId: user.id, missionTemplateId: milestone.missionTemplateId } },
    });

    if (!progress) return NextResponse.json({ error: "Mission not started" }, { status: 400 });

    if (milestone.order > progress.completedMilestones) {
      return NextResponse.json({ error: "Complete previous milestones first" }, { status: 400 });
    }

    if (milestone.isClaimed) {
      return NextResponse.json({ error: "Already claimed" }, { status: 400 });
    }

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    if (milestone.missionTemplate.startDate > endOfDay || milestone.missionTemplate.status !== "TODAY") {
      return NextResponse.json({ error: "Mission not active" }, { status: 400 });
    }

    // Check if target is met
    if (Number(progress.currentValidBet) < Number(milestone.targetValidBet)) {
      return NextResponse.json({ error: "Target not reached" }, { status: 400 });
    }

    await db.$transaction([
      db.missionMilestone.update({
        where: { id: milestoneId },
        data: { isClaimed: true, claimedAt: new Date() },
      }),
      db.userMissionProgress.update({
        where: { userId_missionTemplateId: { userId: user.id, missionTemplateId: milestone.missionTemplateId } },
        data: { completedMilestones: { increment: 1 } },
      }),
      ...(+milestone.rewardCash > 0 ? [
        db.wallet.update({
          where: { userId: user.id },
          data: { balance: { increment: milestone.rewardCash } },
        }),
        db.fixedAmountReward.create({
          data: {
            user: { connect: { id: user.id } },
            prize: milestone.rewardCash,
            rewardFor: "MISSION",
            title: `${milestone.missionTemplate.title} - Milestone ${milestone.order}`,
            expiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        }),
      ] : []),
    ]);

    await createNotification({
      title: "Mission Reward",
      description: `${milestone.rewardCash} BDT earned from ${milestone.missionTemplate.title}`,
      userId: user.id,
      icon: "BELL",
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Claim milestone error:", error);
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};