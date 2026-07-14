import { apiSlice } from "./apiSlice";
import { MissionStatus, RewardName } from "@prisma/client";

export interface Milestone {
  id: string;
  order: number;
  targetValidBet: number;
  rewardCash: number;
  rewardTitle?: string;
  rewardType: RewardName;
  isClaimed: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  status: MissionStatus;
  milestones: Milestone[];
  userProgress: {
    currentValidBet: number;
    completedMilestones: number;
  } | null;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  bonus: number;
  validBet: number;
}

const missionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMissions: builder.query<
      {
        mission: Mission;
        currentValidBet: number;
        finishedMissions: Mission[];
        comingMissions: Mission[];
      },
      void
    >({
      query: () => "api/missions",
    }),
    claimMilestone: builder.mutation<{ success: boolean }, string>({
      query: (milestoneId) => ({
        url: "api/missions/claim",
        method: "POST",
        body: { milestoneId },
      }),
    }),
    getLeaderboard: builder.query<
      { leaderboard: LeaderboardEntry[]; isMissionActive: boolean },
      void
    >({
      query: () => "api/missions/leaderboard",
    }),
  }),
});

export const {
  useGetMissionsQuery,
  useClaimMilestoneMutation,
  useGetLeaderboardQuery,
} = missionsApiSlice;
