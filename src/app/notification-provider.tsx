"use client";
import { useFetchNotificationBadgeQuery } from "@/lib/features/notificationApiSlice";
import { useNotificationBadge } from "@/lib/store.zustond";
import  { useEffect } from "react";

const NotificationProvider = () => {
  const { data, error } = useFetchNotificationBadgeQuery();
  const setBadge = useNotificationBadge((state) => state.setBadge);
  useEffect(() => {
    if (data && !error) {
      setBadge(data.badge);
    }
  }, [data]);

  return null;
};

export default NotificationProvider;
