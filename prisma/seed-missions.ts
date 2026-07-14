/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, MissionStatus, RewardName } from "@prisma/client";

const prisma = new PrismaClient();

const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

const missions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap((vipLevel) => [
  // Today
  {
    vipLevel,
    title: `VIP ${vipLevel} Daily Mission`,
    description: `Complete valid betting to earn rewards`,
    startDate: today,
    endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
    status: MissionStatus.TODAY,
    milestones: [
      { order: 1, targetValidBet: 100, rewardCash: 5 },
      { order: 2, targetValidBet: 1000, rewardCash: 15 },
      {
        order: 3,
        targetValidBet: 5000,
        rewardCash: 40,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x1",
      },
      {
        order: 4,
        targetValidBet: 10000,
        rewardCash: 100,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x2",
      },
      {
        order: 5,
        targetValidBet: 25000,
        rewardCash: 250,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x2",
      },
      {
        order: 6,
        targetValidBet: 50000,
        rewardCash: 500,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x3",
      },
      {
        order: 7,
        targetValidBet: 100000,
        rewardCash: 1000,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x5",
      },
    ],
  },
  // Coming Soon (tomorrow)
  {
    vipLevel,
    title: `VIP ${vipLevel} Daily Mission`,
    description: `Complete valid betting to earn rewards`,
    startDate: tomorrow,
    endDate: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000 - 1),
    status: MissionStatus.COMING_SOON,
    milestones: [
      { order: 1, targetValidBet: 100, rewardCash: 5 },
      { order: 2, targetValidBet: 1000, rewardCash: 15 },
      {
        order: 3,
        targetValidBet: 5000,
        rewardCash: 40,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x1",
      },
      {
        order: 4,
        targetValidBet: 10000,
        rewardCash: 100,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x2",
      },
      {
        order: 5,
        targetValidBet: 25000,
        rewardCash: 250,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x2",
      },
      {
        order: 6,
        targetValidBet: 50000,
        rewardCash: 500,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x3",
      },
      {
        order: 7,
        targetValidBet: 100000,
        rewardCash: 1000,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x5",
      },
    ],
  },
  // Yesterday (finished)
  {
    vipLevel,
    title: `VIP ${vipLevel} Daily Mission`,
    description: `Complete valid betting to earn rewards`,
    startDate: yesterday,
    endDate: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1),
    status: MissionStatus.FINISHED,
    milestones: [
      { order: 1, targetValidBet: 100, rewardCash: 5 },
      { order: 2, targetValidBet: 1000, rewardCash: 15 },
      {
        order: 3,
        targetValidBet: 5000,
        rewardCash: 40,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x1",
      },
      {
        order: 4,
        targetValidBet: 10000,
        rewardCash: 100,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x2",
      },
      {
        order: 5,
        targetValidBet: 25000,
        rewardCash: 250,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x2",
      },
      {
        order: 6,
        targetValidBet: 50000,
        rewardCash: 500,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x3",
      },
      {
        order: 7,
        targetValidBet: 100000,
        rewardCash: 1000,
        rewardType: RewardName.SPIN,
        rewardTypeTitle: "Wheel x5",
      },
    ],
  },
]);

async function main() {
  console.log("Seeding missions...");

  await prisma.missionMilestone.deleteMany();
  await prisma.missionTemplate.deleteMany();

  for (const mission of missions) {
    const { milestones, ...templateData } = mission;
    const template = await prisma.missionTemplate.create({
      data: templateData,
    });

    await prisma.missionMilestone.createMany({
      data: milestones.map((m) => ({
        ...m,
        missionTemplateId: template.id,
        targetValidBet: m.targetValidBet,
        rewardCash: m.rewardCash,
      })),
    });
  }

  console.log(`Seeded ${missions.length} missions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
