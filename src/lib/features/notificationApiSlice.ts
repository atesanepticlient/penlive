import { apiSlice } from "./apiSlice";
const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchNotificationBadge: builder.query<any, void>({
      query: () => ({
        url: "/api/notifications/badge",
        method: "GET",
      }),
    }),
    fetchNotification: builder.query<any, void>({
      query: () => ({
        url: "/api/notifications/random",
        method: "GET",
      }),
    }),
  }),
});

export const { useFetchNotificationBadgeQuery, useFetchNotificationQuery } =
  notificationApiSlice;
