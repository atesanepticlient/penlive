import { db } from "./src/lib/db.js";

// ============================================
// SEED FUNCTIONS
// ============================================

const seedRewards = async () => {
  await db.invitationRewareds.createMany({
    data: [
      {
        prize: 30,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607129/mbuzz88/kdi4ajsyggxdjl8xvyy5.png",
        targetReferral: 3,
      },
      {
        prize: 40,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607134/mbuzz88/ittgozvoezof3cqbprik.png",
        targetReferral: 7,
      },
      {
        prize: 50,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607130/mbuzz88/dx7stvyko3gvwvrwgxwx.png",
        targetReferral: 12,
      },
      {
        prize: 100,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607131/mbuzz88/mqo9muoc3pevb6kff8jb.png",
        targetReferral: 20,
      },
      {
        prize: 300,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607130/mbuzz88/xrqqj8zdn7dtdwcsn4wd.png",
        targetReferral: 50,
      },
      {
        prize: 500,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607130/mbuzz88/tf8sa8jbruzzckjljcjg.png",
        targetReferral: 100,
      },
      {
        prize: 1000,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607129/mbuzz88/t8asb1uve3yfhqbuozqt.png",
        targetReferral: 200,
      },
      {
        prize: 3000,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1750249497/level-08.a59c1688_vvzuhh.png",
        targetReferral: 500,
      },
    ],
  });
  console.log("✅ Invitation rewards seeded");
};

const seedSigninReward = async () => {
  await db.signinBonusRewards.createMany({
    data: [
      { day: "1", deposit: 100, cash: 5 },
      { day: "2", betting: 1000, cash: 10 },
      { day: "3", deposit: 200, cash: 15 },
      { day: "4", betting: 1500, cash: 20 },
      { day: "5", deposit: 300, cash: 25 },
      { day: "6", betting: 2000, cash: 30 },
      { day: "7", deposit: 500, cash: 40 },
      { day: "8", betting: 3000, cash: 45 },
      { day: "9", deposit: 1000, cash: 80 },
      { day: "10", betting: 5000, cash: 120 },
      { day: "11", deposit: 1500, cash: 150 },
      { day: "12", betting: 7000, cash: 200 },
      { day: "13", deposit: 2000, cash: 2020 },
      { day: "14", deposit: 1000, betting: 8000, cash: 220, beg: true },
      { day: "15", deposit: 3000, betting: 8000, cash: 300, eggHunt: true },
    ],
  });
  console.log("✅ Sign-in bonus rewards seeded");
};

const seedAidropEvent = async () => {
  await db.airDropEvent.create({
    data: {
      prize: 555,
      name: "FIRST_JOIN",
    },
  });
  console.log("✅ Airdrop event seeded");
};

// COMMENTED - Uses static userId
// const seedDepositTickets = async () => {
//   await db.depositTicket.createMany({
//     data: [
//       {
//         price: 10000,
//         expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
//         userId: "cmn62gox50000mp5hm04le0e9",
//       },
//       {
//         price: 100,
//         expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
//         userId: "cmn62gox50000mp5hm04le0e9",
//       },
//       {
//         price: 100,
//         expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
//         userId: "cmn62gox50000mp5hm04le0e9",
//       },
//       {
//         price: 100,
//         expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
//         userId: "cmn62gox50000mp5hm04le0e9",
//       },
//       {
//         price: 250,
//         expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
//         userId: "cmn62gox50000mp5hm04le0e9",
//       },
//     ],
//   });
//   console.log("✅ Deposit tickets seeded");
// };

// COMMENTED - Uses static id for update
// const seedRewardEventExpiry = async () => {
//   await db.rewardEventExpiry.update({
//     where: {
//       id: "cmnyh2zna0000mpmdykgwozxw",
//     },
//     data: {
//       eggHunt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
//       envelop: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
//     },
//   });
//   console.log("✅ Reward event expiry seeded");
// };

const seedRewardEvent = async () => {
  await db.rewardEvent.createMany({
    data: [
      { account: 100, ticketType: "DEPOSIT", name: "EGGHUNT", usersData: [] },
      { account: 500, ticketType: "BET", name: "EGGHUNT", usersData: [] },
      { account: 1000, ticketType: "BET", name: "EGGHUNT", usersData: [] },
      { account: 1500, ticketType: "BET", name: "EGGHUNT", usersData: [] },
      { account: 2000, ticketType: "BET", name: "EGGHUNT", usersData: [] },
      { account: 3000, ticketType: "BET", name: "EGGHUNT", usersData: [] },
      { account: 5000, ticketType: "BET", name: "EGGHUNT", usersData: [] },
      { account: 7000, ticketType: "BET", name: "EGGHUNT", usersData: [] },
      { account: 10000, ticketType: "BET", name: "EGGHUNT", usersData: [] },
      { account: 15000, ticketType: "BET", name: "EGGHUNT", usersData: [] },
      { account: 25000, ticketType: "BET", name: "EGGHUNT", usersData: [] },
      { account: 1, ticketType: "INVITE", name: "EGGHUNT", usersData: [] },
    ],
  });
  console.log("✅ Reward events seeded");
};

const seedVipRequirements = async () => {
  await db.vIPLevelRequirements.create({
    data: {
      levels: [
        { level: 1, totalDeposit: 0, totalDepositCount: 0, totalBet: 2000 },
        { level: 2, totalDeposit: 0, totalDepositCount: 0, totalBet: 10000 },
        { level: 3, totalDeposit: 0, totalDepositCount: 0, totalBet: 30000 },
        { level: 4, totalDeposit: 4000, totalDepositCount: 0, totalBet: 60000 },
        { level: 5, totalDeposit: 4500, totalDepositCount: 0, totalBet: 70000 },
        { level: 6, totalDeposit: 5000, totalDepositCount: 0, totalBet: 80000 },
        { level: 7, totalDeposit: 5500, totalDepositCount: 0, totalBet: 90000 },
        {
          level: 8,
          totalDeposit: 6000,
          totalDepositCount: 0,
          totalBet: 100000,
        },
        {
          level: 9,
          totalDeposit: 6500,
          totalDepositCount: 0,
          totalBet: 110000,
        },
        {
          level: 10,
          totalDeposit: 7000,
          totalDepositCount: 0,
          totalBet: 120000,
        },
        {
          level: 11,
          totalDeposit: 8000,
          totalDepositCount: 0,
          totalBet: 140000,
        },
      ],
    },
  });
  console.log("✅ VIP requirements seeded");
};

const seedVipRewardRequirements = async () => {
  await db.vIPRewardRequirements.createMany({
    data: [
      {
        levelRequire: 1,
        validForDay: 7,
        totalDeposit: 200,
        totalBet: 400,
        reward: 10,
      },
      {
        levelRequire: 2,
        validForDay: 30,
        totalDeposit: 300,
        totalBet: 500,
        reward: 15,
      },
      {
        levelRequire: 3,
        validForDay: 30,
        totalDeposit: 310,
        totalBet: 550,
        reward: 20,
      },
      {
        levelRequire: 4,
        validForDay: 30,
        totalDeposit: 330,
        totalBet: 600,
        reward: 25,
      },
      {
        levelRequire: 5,
        validForDay: 30,
        totalDeposit: 330,
        totalBet: 650,
        reward: 30,
      },
      {
        levelRequire: 6,
        validForDay: 30,
        totalDeposit: 350,
        totalBet: 700,
        reward: 35,
      },
      {
        levelRequire: 7,
        validForDay: 30,
        totalDeposit: 400,
        totalBet: 800,
        reward: 40,
      },
      {
        levelRequire: 8,
        validForDay: 30,
        totalDeposit: 500,
        totalBet: 1000,
        reward: 40,
      },
      {
        levelRequire: 9,
        validForDay: 30,
        totalDeposit: 700,
        totalBet: 1500,
        reward: 50,
      },
      {
        levelRequire: 10,
        validForDay: 30,
        totalDeposit: 1000,
        totalBet: 2000,
        reward: 100,
      },
    ],
  });
  console.log("✅ VIP reward requirements seeded");
};

// COMMENTED - Uses static userId and requirementId
// const seedVipReward = async () => {
//   await db.vIPRewardUserProgress.create({
//     data: {
//       user: { connect: { id: "cmnyenn0b0004mpk9ujht06de" } },
//       requirements: { connect: { id: "cmnzvdnqp0000mpmiuz5oxrmh" } },
//       expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     },
//   });

//   await db.vIPRewardUserProgress.create({
//     data: {
//       user: { connect: { id: "cmnitbo0500008otvj6eww80y" } },
//       requirements: { connect: { id: "cmnretzbq0001mpiq8qpi56l3" } },
//       expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//     },
//   });
//   console.log("✅ VIP rewards seeded");
// };

const seedInviationBonusRequirements = async () => {
  await db.inviataionRewardRequirements.create({
    data: {
      requirements: [
        {
          vipLevels: [0],
          reward: { money: 100, goldenEgg: false },
          requirements: { bet: 2000, deposit: 100 },
        },
        {
          vipLevels: [1, 2],
          reward: { money: 200, goldenEgg: false },
          requirements: { bet: 2000, deposit: 100 },
        },
        {
          vipLevels: [3, 4],
          reward: { money: 300, goldenEgg: false },
          requirements: { bet: 2000, deposit: 100 },
        },
        {
          vipLevels: [5, 6],
          reward: { money: 500, goldenEgg: false },
          requirements: { bet: 4000, deposit: 200 },
        },
        {
          vipLevels: [7, 8],
          reward: { money: 700, goldenEgg: true },
          requirements: { bet: 6000, deposit: 400 },
        },
        {
          vipLevels: [9, 10],
          reward: { money: 1000, goldenEgg: true },
          requirements: { bet: 10000, deposit: 500 },
        },
      ],
    },
  });
  console.log("✅ Invitation bonus requirements seeded");
};

// COMMENTED - Uses static userId
// const depositsSeed = async () => {
//   await db.deposit.create({
//     data: {
//       user: { connect: { id: "cmq68hjqh0001mpwr0nd3dagr" } },
//       amount: 500,
//       senderNumber: "",
//       status: "APPROVED",
//       createdAt: new Date(),
//       statusUpdateAt: new Date(),
//       wallet: "BKASH",
//     },
//   });
//   await db.deposit.create({
//     data: {
//       user: { connect: { id: "cmq68hjqh0001mpwr0nd3dagr" } },
//       amount: 500,
//       senderNumber: "",
//       status: "APPROVED",
//       createdAt: new Date(),
//       statusUpdateAt: new Date(),
//       wallet: "BKASH",
//     },
//   });
//   console.log("✅ Deposits seeded");
// };

const seedAutoUpdatesInterval = async () => {
  await db.autoUpdatesInterval.create({
    data: {
      deposit: 1000 * 60 * 60,
      betting: 1000 * 60 * 60,
    },
  });
  console.log("✅ Auto updates interval seeded");
};

// COMMENTED - Uses static userId
// const seedRewardsTouser = async () => {
//   await db.customRewardEvent.create({
//     data: {
//       user: { connect: { id: "cmnyenn0b0004mpk9ujht06de" } },
//       size: 1,
//       name: "SPIN",
//       title: "Weekly rewards",
//       rewardFor: "WEEKLY",
//       expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//     },
//   });
//   console.log("✅ Rewards to user seeded");
// };

// COMMENTED - Uses static userId
// const seedBets = async () => {
//   await db.bettingRecord.createMany({
//     data: [
//       {
//         betAmount: 400,
//         loss: 400,
//         status: "SETTLED",
//         category: "SLOT",
//         userId: "cmq68hjqh0001mpwr0nd3dagr",
//         name: "Aviator",
//         orderNo: "32981934576",
//       },
//       {
//         betAmount: 100,
//         loss: 10000,
//         status: "SETTLED",
//         category: "FISH",
//         userId: "cmq68hjqh0001mpwr0nd3dagr",
//         name: "Super Ace",
//         orderNo: "32981934536",
//       },
//     ],
//   });
//   console.log("✅ Bets seeded");
// };

// COMMENTED - Uses static id for update
// const updateInvitationReq = async () => {
//   await db.inviataionRewardRequirements.update({
//     where: {
//       id: "cmnyh3whp0000mpr4ocn936q9",
//     },
//     data: {
//       requirements: [
//         {
//           reward: { money: 100, goldenEgg: false, envelop: false, spinWheel: false },
//           vipLevels: [0],
//           requirements: { bet: 2000, deposit: 100 },
//         },
//         {
//           reward: { money: 200, goldenEgg: false, envelop: false, spinWheel: false },
//           vipLevels: [1, 2],
//           requirements: { bet: 2000, deposit: 100 },
//         },
//         {
//           reward: { money: 300, goldenEgg: false, envelop: false, spinWheel: false },
//           vipLevels: [3, 4],
//           requirements: { bet: 2000, deposit: 100 },
//         },
//         {
//           reward: { money: 500, goldenEgg: false, envelop: false, spinWheel: false },
//           vipLevels: [5, 6],
//           requirements: { bet: 4000, deposit: 200 },
//         },
//         {
//           reward: { money: 700, goldenEgg: true, envelop: false, spinWheel: false },
//           vipLevels: [7, 8],
//           requirements: { bet: 6000, deposit: 400 },
//         },
//         {
//           reward: { money: 1000, goldenEgg: true, envelop: true, spinWheel: true },
//           vipLevels: [9, 10],
//           requirements: { bet: 10000, deposit: 500 },
//         },
//       ],
//     },
//   });
//   console.log("✅ Invitation requirements updated");
// };

// ============================================
// MASTER SEED FUNCTION - CALLS ALL ABOVE
// ============================================

const seedAll = async () => {
  console.log("🌱 ========================================");
  console.log("🌱 Starting database seeding...");
  console.log("🌱 ========================================\n");

  try {
    // 1. Seed Invitation Rewards
    // await seedRewards();

    // 2. Seed Sign-in Bonus Rewards
    // await seedSigninReward();

    // 3. Seed Airdrop Event
    // await seedAidropEvent();

    // 4. Seed Deposit Tickets - COMMENTED (uses static userId)
    // await seedDepositTickets();

    // 5. Seed Reward Event Expiry - COMMENTED (uses static id)
    // await seedRewardEventExpiry();

    // 6. Seed Reward Events (EGGHUNT)
    await seedRewardEvent();

    // 7. Seed VIP Requirements
    await seedVipRequirements();

    // 8. Seed VIP Reward Requirements
    await seedVipRewardRequirements();

    // 9. Seed VIP Rewards for Users - COMMENTED (uses static userId)
    // await seedVipReward();

    // 10. Seed Invitation Bonus Requirements
    await seedInviationBonusRequirements();

    // 11. Seed Deposits - COMMENTED (uses static userId)
    // await depositsSeed();

    // 12. Seed Auto Updates Interval
    await seedAutoUpdatesInterval();

    // 13. Seed Rewards to User - COMMENTED (uses static userId)
    // await seedRewardsTouser();

    // 14. Seed Bets - COMMENTED (uses static userId)
    // await seedBets();

    // 15. Update Invitation Requirements - COMMENTED (uses static id)
    // await updateInvitationReq();

    console.log("\n✅ ========================================");
    console.log("✅ All seeds completed successfully!");
    console.log("✅ ========================================");
  } catch (error) {
    console.error("\n❌ ========================================");
    console.error("❌ Error during seeding:", error);
    console.error("❌ ========================================");
    throw error;
  }
};

// ============================================
// RUN THE SEED - UNCOMMENT TO EXECUTE
// ============================================
seedAll();
