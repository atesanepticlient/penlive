"use client";

import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { ChevronRight, Loader2, Mail, Trash2, Frown } from "lucide-react";
import { deleteNotification } from "@/action/notifications";
import { NotificationDetail } from "./notification-details";

type Notification = {
  id: string;
  title: string;
  description?: string;
  icon: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
};

const ITEMS_PER_PAGE = 10;
type Tab = "inbox" | "outbox";

export function NotificationList({
  userId,
  initialNotifications = [],
  totalCount = 0,
  highlightId,
}: {
  userId: string;
  initialNotifications?: any[];
  totalCount?: number;
  highlightId?: string;
}) {
  const highlightRef = useRef<HTMLLIElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>("inbox");
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeNotification, setActiveNotification] =
    useState<Notification | null>(null);

  const [isHighlighted, setIsHighlighted] = useState(!!highlightId);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusher.subscribe(`user-${userId}`);
    channel.bind("new-notification", (n: Notification) => {
      setNotifications((prev) => [n, ...prev.slice(0, ITEMS_PER_PAGE - 1)]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightId]);

  useEffect(() => {
    if (!highlightId) return;

    // scroll into view
    highlightRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // fade out highlight after 2s
    const timer = setTimeout(() => setIsHighlighted(false), 2000);
    return () => clearTimeout(timer);
  }, [highlightId]);

  // ── Selection ──────────────────────────────────────────────────────────────

  const allSelected =
    notifications.length > 0 && selected.size === notifications.length;

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(notifications.map((n) => n.id)));
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // ── Delete selected ────────────────────────────────────────────────────────

  async function handleDeleteSelected() {
    if (selected.size === 0) return;
    setIsDeleting(true);
    try {
      await Promise.all([...selected].map((id) => deleteNotification(id)));
      setNotifications((prev) => prev.filter((n) => !selected.has(n.id)));
      setSelected(new Set());
    } finally {
      setIsDeleting(false);
    }
  }

  // ── Pagination ─────────────────────────────────────────────────────────────

  async function fetchPage(page: number) {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/notifications?userId=${userId}&page=${page}&limit=${ITEMS_PER_PAGE}`,
      );
      const data = await res.json();
      setNotifications(data.notifications || []);
      setCurrentPage(page);
      setSelected(new Set());
    } catch (e) {
      console.error(e);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }

  // ── Row click ─────────────────────────────────────────────────────────────

  function handleRowClick(n: Notification) {
    // In selection mode, clicking a row toggles selection instead
    if (selected.size > 0) {
      toggleSelect(n.id);
      return;
    }
    setActiveNotification(n);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="w-full max-w-lg mx-auto bg-white min-h-screen">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {(["inbox", "outbox"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelected(new Set());
              }}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors
                ${
                  activeTab === tab
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-800 border-b-2 border-transparent"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "inbox" && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={toggleSelectAll}
              >
                <span
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                    ${allSelected ? "bg-blue-500 border-blue-500" : "border-gray-400 bg-white"}`}
                >
                  {allSelected && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      viewBox="0 0 12 10"
                      fill="none"
                    >
                      <path
                        d="M1 5l3.5 3.5L11 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  Select all
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  className={`w-5 h-5 ${selected.size > 0 ? "text-gray-600" : "text-gray-300"}`}
                />
                <button
                  onClick={handleDeleteSelected}
                  disabled={selected.size === 0 || isDeleting}
                  className="disabled:opacity-30 transition-opacity"
                >
                  {isDeleting ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                  ) : (
                    <Trash2
                      className={`w-5 h-5 ${selected.size > 0 ? "text-gray-600" : "text-gray-300"}`}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* List */}
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
              </div>
            ) : notifications.length === 0 ? (
              <EmptyState />
            ) : (
              <ul>
                {notifications.map((n) => {
                  const isSelected = selected.has(n.id);
                  return (
                    <li
                      key={n.id}
                      ref={n.id === highlightId ? highlightRef : null}
                      onClick={() => handleRowClick(n)}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 transition-colors duration-700
    ${isSelected ? "bg-gray-100" : ""}
    ${
      n.id === highlightId && isHighlighted
        ? "bg-yellow-50 border-l-4 border-l-yellow-400"
        : "bg-white active:bg-gray-50"
    }"}`}
                    >
                      {/* Checkbox */}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(n.id);
                        }}
                        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                          ${isSelected ? "bg-blue-500 border-blue-500" : "border-gray-400 bg-white"}`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            viewBox="0 0 12 10"
                            fill="none"
                          >
                            <path
                              d="M1 5l3.5 3.5L11 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>

                      {/* Unread dot */}
                      <span
                        className={`mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full ${!n.isRead ? "bg-green-500" : "bg-transparent"}`}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-gray-700 truncate">
                            Sender:<span className="font-medium">Platform</span>
                          </span>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {formatDate(n.createdAt)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5 truncate">
                          Title:{n.title}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-4 py-4">
                <button
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => fetchPage(currentPage - 1)}
                  className="text-sm text-blue-500 disabled:text-gray-300"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages || isLoading}
                  onClick={() => fetchPage(currentPage + 1)}
                  className="text-sm text-blue-500 disabled:text-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "outbox" && <EmptyState />}
      </div>

      {/* Detail bottom sheet */}
      <NotificationDetail
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
      />
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Frown className="w-16 h-16 text-gray-300" strokeWidth={1.2} />
      <p className="text-sm text-gray-400">No messages</p>
    </div>
  );
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
