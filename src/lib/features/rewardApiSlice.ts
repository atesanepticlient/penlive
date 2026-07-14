/* eslint-disable @typescript-eslint/no-explicit-any */
import { InviationRewardGetOutput } from "@/types/api/reward";
import { apiSlice } from "./apiSlice";

const rewardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    findInvitationRewardData: builder.query<InviationRewardGetOutput, void>({
      query: () => ({
        url: "api/invitation-bonus",
        method: "GET",
      }),
      providesTags: ["invitationReward"],
    }),

    clamInvitationReward: builder.mutation<
      { success: boolean },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `api/invitation-bonus/${id}`,
        body: {},
        method: "PUT",
      }),
      invalidatesTags: ["invitationReward"],
    }),
    fetchInviatationBonusRecord: builder.query<any, void>({
      query: () => ({
        url: "/api/invitation-bonus/records",
        method: "GET",
      }),
    }),
    fetchInviatationBonusEarning: builder.query<any, void>({
      query: () => ({
        url: "/api/invitation-bonus/earning",
        method: "GET",
      }),
    }),
    findSigninBonusRewardsData: builder.query<any, void>({
      query: () => ({
        url: "api/signin-bonus",
        method: "GET",
      }),
      providesTags: ["signinReward"],
    }),

    claimSignReward: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `api/signin-bonus/${id}`,
        body: {},
        method: "PUT",
      }),
      invalidatesTags: ["signinReward"],
    }),

    fetchRewardEvets: builder.query<any, { name?: string }>({
      query: ({ name }) => ({
        url: `api/reward-events?name=${name}`,
        method: "GET",
      }),
      providesTags: ["rewaredEvent"],
    }),

    claimRewardEvent: builder.mutation<
      any,
      { rewardId: string; rewardType: string; prizeHash: string; prize: number }
    >({
      query: (body) => ({
        url: `api/reward-events/reward-claim`,
        method: "PUT",
        body: body,
      }),
    }),
    claimFixedPrizeRewardEvent: builder.mutation<any, { rewardId: string }>({
      query: ({ rewardId }) => ({
        url: `api/reward-events/reward-claim/fixed?rewardId=${rewardId}`,
        method: "PUT",
        body: {},
      }),
      invalidatesTags: ["rewaredEvent"],
    }),

    fetchInviatationReuiremnts: builder.query<any, void>({
      query: () => ({
        url: "api/invitation-bonus/requirements",
        method: "GET",
      }),
    }),
    fetchRewardHub: builder.query<any, void>({
      query: () => ({
        url: "api/reward-hub",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useFindInvitationRewardDataQuery,
  useClamInvitationRewardMutation,
  useFindSigninBonusRewardsDataQuery,
  useClaimSignRewardMutation,
  useFetchRewardEvetsQuery,
  useFetchInviatationReuiremntsQuery,
  useFetchInviatationBonusRecordQuery,
  useClaimRewardEventMutation,
  useClaimFixedPrizeRewardEventMutation,
  useFetchRewardHubQuery,
  useFetchInviatationBonusEarningQuery,
} = rewardApiSlice;
