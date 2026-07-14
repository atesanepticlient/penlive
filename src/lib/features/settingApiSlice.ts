import { apiSlice } from "./apiSlice";
const historyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeadline: builder.query<any, void>({
      query: () => {
        return `/api/site/setting/headline`;
      },
    }),
  }),
});

export const { useGetHeadlineQuery } = historyApiSlice;
