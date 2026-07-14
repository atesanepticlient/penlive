"use client";
import { markAsRead, deleteNotification } from "@/action/notifications";
import { useFetchNotificationQuery } from "@/lib/features/notificationApiSlice";
import { toast } from "@/lib/toast";
import { redirect } from "next/navigation";
import  { useEffect } from "react";

const InitialNotificationLeader = () => {
  const { data, error } = useFetchNotificationQuery();
  console.log({ data }, { error });
  const notification = data?.payload;

  useEffect(() => {
    if (notification) {
      toast.success(notification.title, {
        onTrigger: () => markAsRead(notification.id),
        onManualClose: () => deleteNotification(notification.id),
        onClick: () => redirect(`/notifications?id=${notification.id}`),
      });
    }
  }, [notification]);

  return null;
};

export default InitialNotificationLeader;
