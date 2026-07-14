import { apiSlice } from "./apiSlice";

const promotionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchprotionsData: builder.query<any, void>({
      query: () => ({
        url: "/api/promotions",
        method: "GET",
      }),
      providesTags: ["promotions"],
    }),
    cliamDailyCheck: builder.mutation<any, void>({
      query: () => ({
        url: "api/promotions/daily-checkin",
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["promotions", "wallet"],
    }),
    fetchAirdDroStatus: builder.query<any, { airdrop: string }>({
      query: ({ airdrop }) => ({
        url: `/api/promotions/airdrop?airdrop=${airdrop}`,
        method: "GET",
      }),
      providesTags: ["airdrop"],
    }),
    cliamAirdrop: builder.mutation<any, { airdrop: string }>({
      query: ({ airdrop }) => ({
        url: `api/promotions/airdrop/?airdrop=${airdrop}`,
        method: "PUT",
        body: {},
      }),
      invalidatesTags: ["airdrop"],
    }),
    createAirDrop: builder.mutation<any, { airdrop: string }>({
      query: ({ airdrop }) => ({
        url: `api/promotions/airdrop/?airdrop=${airdrop}`,
        method: "POST",
        body: {},
      }),
    }),
    fetchSpinData: builder.query<any, void>({
      query: () => ({
        url: `/api/promotions/spin`,
        method: "GET",
      }),
      providesTags: ["spinClaim"],
    }),
    fetchDepositTicket: builder.query<any, void>({
      query: () => ({
        url: `api/promotions/deposit-tickets`,
        method: "GET",
      }),
      providesTags: ["depositTicket"],
    }),
    claimDepositTicket: builder.mutation<any, { cost: number }>({
      query: ({ cost }) => ({
        url: `api/promotions/deposit-tickets?cost=${cost}`,
        method: "PUT",
        body: {},
      }),
      invalidatesTags: ["depositTicket"],
    }),
    claimSpin: builder.mutation<any, void>({
      query: () => ({
        url: `/api/promotions/spin`,
        method: "PUT",
        body: {},
      }),
      invalidatesTags: ["spinClaim"],
    }),
    rewardShortSenter: builder.query<any, void>({
      query: () => ({
        url: "/api/promotions/reward-senter-short",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useFetchprotionsDataQuery,
  useCliamDailyCheckMutation,
  useFetchAirdDroStatusQuery,
  useCliamAirdropMutation,
  useCreateAirDropMutation,
  useFetchDepositTicketQuery,
  useClaimDepositTicketMutation,
  useFetchSpinDataQuery,
  useClaimSpinMutation,
  useRewardShortSenterQuery,
} = promotionsApiSlice;
