/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiSlice } from "./apiSlice";
import { WithdrawPageData } from "@/types/api/withdraw";
export interface WithdrawStatus {
  balance: number;
  dailyWithdrawLimit: number;
  todayWithdrawCount: number;
  remainingWithdraws: number;
  remainingTurnover: number;
  turnoverRows: { gameType: string; remaining: number }[];
}

const depositApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    makeWithdraw: builder.mutation<any, any>({
      query: (body) => ({
        url: "api/withdraw",
        method: "POST",
        body,
      }),
      invalidatesTags: ["withdraw"],
    }),
    fetchWithdrawPageData: builder.query<WithdrawPageData, void>({
      query: () => ({
        url: "api/withdraw/page",
        method: "GET",
      }),
      providesTags: ["withdraw"],
    }),
    fetchWithdrawWallet: builder.query<any, void>({
      query: () => ({
        url: "api/withdraw/wallet",
        method: "GET",
      }),
    }),
    getWithdrawStatus: builder.query<WithdrawStatus, void>({
      query: () => "api/withdraw/status",
      providesTags: ["WithdrawStatus"],
    }),
  }),
});

export const {
  useMakeWithdrawMutation,
  useFetchWithdrawPageDataQuery,
  useFetchWithdrawWalletQuery,
  useGetWithdrawStatusQuery
} = depositApiSlice;
