import { apiSlice } from "./apiSlice";

const vipApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchVipLevel: builder.query<any, void>({
      query: () => ({
        url: "api/vip",
        method: "GET",
      }),
    }),

    fetchVipRequirements: builder.query<any, void>({
      query: () => ({
        url: "api/vip/requirements",
        method: "GET",
      }),
    }),

    fetchVipRewards: builder.query<any, void>({
      query: () => ({
        url: "api/vip/reward",
        method: "GET",
      }),
      providesTags: ["vipreward"],
    }),

    cliamVipRewards: builder.mutation<any, { rewardId: string }>({
      query: ({ rewardId }) => ({
        url: `api/vip/reward?reward-id=${rewardId}`,
        method: "PUT",
      }),
      invalidatesTags: ["vipreward"],
    }),
  }),
});

export const {
  useFetchVipLevelQuery,
  useFetchVipRequirementsQuery,
  useFetchVipRewardsQuery,
  useCliamVipRewardsMutation,
} = vipApiSlice;
