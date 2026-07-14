/* eslint-disable @typescript-eslint/no-explicit-any */
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import pMap from "p-map";

type Direction = "prev" | "next";

interface DayRange {
  startDate: Date;
  endDate: Date;
}

function getDayRanges(
  direction: Direction = "prev",
  days: number = 7,
): DayRange[] {
  const result: DayRange[] = [];
  const today = new Date();

  for (let i = 1; i <= days; i++) {
    const date = new Date(today);

    if (direction === "prev") {
      // yesterday, day before yesterday...
      date.setDate(today.getDate() - i);
    } else {
      // tomorrow, next day...
      date.setDate(today.getDate() + i);
    }

    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0,
    );

    const endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
      999,
    );

    result.push({
      startDate,
      endDate,
    });
  }

  return result;
}
const fetchUsersProgress = async (startDateOfDay: Date, userId: string) => {
  const progress = await db.userMissionProgress.findFirst({
    where: {
      userId,
      startDateOfDay,
    },
  });

  return progress;
};

export const GET = async () => {
  try {
    const user: any = await findCurrentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const vipLevel =
      (
        await db.userVIPLevel.findUnique({
          where: {
            userId: user.id,
          },
        })
      ).level || 0;

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    // Get upcoming 7 days for COMING_SOON
    const comingSoonDates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date(startOfDay);
      date.setDate(date.getDate() + i);
      comingSoonDates.push(date);
    }

    // Get finished dates (last 7 days)
    const finishedDates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date(startOfDay);
      date.setDate(date.getDate() - i);
      finishedDates.push(date);
    }

    // Fetch all relevant mission templates
    const mission = await db.missionTemplate.findFirst({
      where: {
        vipLevel,
      },
      include: {
        milestones: { orderBy: { order: "asc" } },
      },
    });

    // Get user progress for today's missions
    const missionId = mission.id;
   await db.userMissionProgress.findFirst({
      where: { userId: user.id, missionTemplateId: missionId },
    });

    // Calculate valid bet for today
    const validBet = await db.bettingRecord.aggregate({
      where: {
        userId: user.id,
        status: "SETTLED",
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      _sum: { profit: true, loss: true },
    });

    const currentValidBet =
      Number(validBet._sum.profit || 0) + Number(validBet._sum.loss || 0);

    const progressForToday = await fetchUsersProgress(startOfDay, user.id);

    const formattedMission = {
      id: mission.id,
      title: mission.title,
      description: mission.description,
      startDate: startOfDay,
      endDate: endOfDay,
      milestones: mission.milestones.map((ms) => ({
        id: ms.id,
        order: ms.order,
        targetValidBet: Number(ms.targetValidBet),
        rewardCash: Number(ms.rewardCash),
        rewardType: ms.rewardType,
        rewardTitle: ms.rewardTypeTitle,
        isClaimed: progressForToday
          ? ms.order <= progressForToday.completedMilestones
          : false,
      })),
      userProgress: progressForToday
        ? {
            currentValidBet: currentValidBet,
            completedMilestones: progressForToday.completedMilestones,
          }
        : null,
    };

    const finishedMissions = await pMap(
      getDayRanges(),

      async ({ startDate, endDate }) => {
        const progressForToday = await fetchUsersProgress(startDate, user.id);
        return {
          id: mission.id,
          title: mission.title,
          description: mission.description,
          startDate: startDate,
          endDate: endDate,
          milestones: mission.milestones.map((ms) => ({
            id: ms.id,
            order: ms.order,
            targetValidBet: Number(ms.targetValidBet),
            rewardCash: Number(ms.rewardCash),
            rewardType: ms.rewardType,
            rewardTitle: ms.rewardTypeTitle,
            isClaimed: progressForToday
              ? ms.order <= progressForToday.completedMilestones
              : false,
          })),
          userProgress: progressForToday
            ? {
                currentValidBet: currentValidBet,
                completedMilestones: progressForToday.completedMilestones,
              }
            : null,
        };
      },
    );

    const comingMissions = await pMap(
      getDayRanges("next", 7),

      async ({ endDate, startDate }) => {
        return {
          id: mission.id,
          title: mission.title,
          description: mission.description,
          startDate: startDate,
          endDate: endDate,
          milestones: mission.milestones.map((ms) => ({
            id: ms.id,
            order: ms.order,
            targetValidBet: Number(ms.targetValidBet),
            rewardCash: Number(ms.rewardCash),
            rewardType: ms.rewardType,
            rewardTitle: ms.rewardTypeTitle,
            isClaimed: false,
          })),
          userProgress: null,
        };
      },
    );

    return Response.json(
      {
        mission: formattedMission,
        currentValidBet,
        finishedMissions,
        comingMissions,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get missions error:", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
