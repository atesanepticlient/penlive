/* eslint-disable @typescript-eslint/no-explicit-any */
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const { userId } = await req.json();
    if (!userId) return Response.json({ error: "userId required" }, { status: 400 });

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    // Get user VIP level
    const userVip = await db.userVIPLevel.findUnique({ where: { userId } });
    const vipLevel = userVip?.level ?? 0;

    // Find today's mission for this vip level
    const todayMission = await db.missionTemplate.findFirst({
      where: {
        vipLevel,
        status: "TODAY",
        startDate: { gte: startOfDay },
      },
      include: { milestones: { orderBy: { order: "asc" } } },
    });

    if (!todayMission) return Response.json({ processed: false });

    const settledBets = await db.bettingRecord.findMany({
      where: {
        userId,
        status: "SETTLED",
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    });

    const settledBet = settledBets.reduce((acc, r) => acc + Number(r.betAmount), 0);
    const currentValidBet = settledBet;

    // Update or create user progress
    let progress = await db.userMissionProgress.findUnique({
      where: { userId_missionTemplateId: { userId, missionTemplateId: todayMission.id } },
    });

    if (!progress) {
      progress = await db.userMissionProgress.create({
        data: {
          user: { connect: { id: userId } },
          missionTemplate: { connect: { id: todayMission.id } },
          currentValidBet,
          completedMilestones: 0,
        },
      });
    } else {
      progress = await db.userMissionProgress.update({
        where: { userId_missionTemplateId: { userId, missionTemplateId: todayMission.id } },
        data: { currentValidBet, lastUpdated: new Date() },
      });
    }

    return Response.json({
      processed: true,
      currentValidBet,
      completedMilestones: progress.completedMilestones,
    });
  } catch (error) {
    console.error("Betting listener error:", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
