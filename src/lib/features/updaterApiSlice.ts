/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "./apiSlice";

const updaterApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateDeposit: builder.mutation<any, void>({
      query: () => ({
        url: "api/updater",
        method: "PUT",
      }),
      //   invalidatesTags: [""],
    }),
  }),
});

export const { useUpdateDepositMutation } = updaterApiSlice;
