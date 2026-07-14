/* eslint-disable @typescript-eslint/no-explicit-any */
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";

// Fake leaderboard profiles
const FAKE_PROFILES = [
  {
    name: "Rocky",
    validBet: 120000,
    rank: 1,
    bonus: 1500,
  },
  {
    name: "Jamshed",
    validBet: 100000,
    rank: 2,
    bonus: 1200,
  },
  {
    name: "Raja Ahmed",
    validBet: 90000,
    rank: 3,
    bonus: 1100,
  },
  {
    name: "Nadim",
    validBet: 80000,
    rank: 4,
    bonus: 1050,
  },
  {
    name: "Nirob",
    validBet: 75000,
    rank: 5,
    bonus: 1000,
  },
  {
    name: "Salman",
    validBet: 72000,
    rank: 6,
    bonus: 970,
  },
  {
    name: "Kobir",
    validBet: 70000,
    rank: 7,
    bonus: 950,
  },
  {
    name: "Minhaz",
    validBet: 68700,
    rank: 8,
    bonus: 900,
  },
  {
    name: "Rahim",
    validBet: 68000,
    rank: 9,
    bonus: 890,
  },
  {
    name: "Nannur",
    validBet: 58700,
    rank: 10,
    bonus: 600,
  },
];

export const GET = async () => {
  try {
    const user = await findCurrentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    // const startOfDay = new Date(
    //   today.getFullYear(),
    //   today.getMonth(),
    //   today.getDate(),
    // );
    // const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    // (
    //   await db.userVIPLevel.findUnique({
    //     where: {
    //       userId: user.id,
    //     },
    //   })
    // ).level || 0;

    return Response.json({ leaderboard: FAKE_PROFILES, isMissionActive: true });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
