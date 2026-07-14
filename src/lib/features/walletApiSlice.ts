import { apiSlice } from "./apiSlice";
import { Prisma } from "@prisma/client";

const walletApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchWallet: builder.query<
      { payload: Prisma.WalletGetPayload<object> },
      void
    >({
      query: () => ({
        url: "/api/wallet",
        method: "GET",
      }),
      providesTags: ["wallet"],
    }),
  }),
});

export const { useFetchWalletQuery } = walletApiSlice;
