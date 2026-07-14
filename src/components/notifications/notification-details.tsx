"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  description?: string;
  icon: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
};

interface NotificationDetailProps {
  notification: Notification | null;
  onClose: () => void;
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  } catch {
    return iso;
  }
}

export function NotificationDetail({
  notification,
  onClose,
}: NotificationDetailProps) {
  const [visible, setVisible] = useState(false);

  // Animate in when notification is set
  useEffect(() => {
    if (notification) {
      // Small delay so the initial transform is painted first
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [notification]);

  function handleClose() {
    setVisible(false);
    // Wait for slide-down animation before unmounting
    setTimeout(onClose, 350);
  }

  if (!notification) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-black/30 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl overflow-hidden shadow-2xl transition-transform duration-350 ease-out"
        style={{
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
          maxHeight: "92dvh",
          overflowY: "auto",
        }}
      >
        {/* Header — dark teal with yellow title */}
        <div
          className="relative flex items-center justify-center px-10 py-5 min-h-[72px]"
          style={{ backgroundColor: "#1a5f5a" }}
        >
          <button
            onClick={handleClose}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-1"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <h1
            className="text-center text-base font-extrabold leading-snug"
            style={{ color: "#f5a623" }}
          >
            {notification.title}
          </h1>
        </div>

        {/* Meta rows */}
        <div className="divide-y divide-gray-200 border-b border-gray-200">
          <MetaRow label="Title:" value={notification.title} />
          <MetaRow label="Sender:" value="Platform" />
          <MetaRow label="Time:" value={formatDate(notification.createdAt)} />
        </div>

        {/* Body */}
        {notification.description && (
          <div className="px-5 py-6">
            <p
              className="text-sm leading-7 text-gray-500"
              dangerouslySetInnerHTML={{ __html: notification.description }}
            />
          </div>
        )}

        {/* Safe area spacer for mobile */}
        <div className="h-6" />
      </div>
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-4">
      <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-500 text-right">{value}</span>
    </div>
  );
}
