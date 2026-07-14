import { apiSlice } from "./apiSlice";
const luckyWheelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLuckyWheelLog: builder.query({
      query: () => ({
        url: "api/lucky-wheel",
        method: "POST",
      }),
      providesTags: ["luckyWheel"],
    }),
    deleteLuckyWheelLog: builder.mutation({
      query: () => ({
        url: "api/lucky-wheel",
        method: "DELETE",
      }),
      invalidatesTags: ["luckyWheel"],
    }),
  }),
});

export const { useGetLuckyWheelLogQuery, useDeleteLuckyWheelLogMutation } =
  luckyWheelApiSlice;
