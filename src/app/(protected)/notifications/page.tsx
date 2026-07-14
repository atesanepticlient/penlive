/* eslint-disable @typescript-eslint/no-explicit-any */
// app/notifications/page.tsx
import { NotificationList } from "@/components/notifications/notification-list";
import { getUserNotifications } from "@/action/notifications";
import SiteHeader from "@/components/SiteHeader";
import { findCurrentUser } from "@/data/user";

type NotificationsSearchParams = {
  id?: string | string[];
};

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<NotificationsSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const highlightId =
    typeof resolvedSearchParams.id === "string"
      ? resolvedSearchParams.id
      : undefined;

  const user: any = await findCurrentUser();
  if (!user) return <div>Please sign in</div>;

  const limit = 20;

  const response = await getUserNotifications(user.id, 1, limit);

  return (
    <div className="container">
      <SiteHeader title="Notifications" />
      <main className="py-6 px-2 md:px-50 lg:px-[200px]">
        <NotificationList
          userId={user.id}
          initialNotifications={response?.notifications || []}
          totalCount={response?.totalCount || 0}
          highlightId={highlightId}
        />
      </main>
    </div>
  );
}
