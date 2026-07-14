"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

import hotGame from "@/../public/icons/nav-hotgames.svg";
import slot from "@/../public/icons/nav-slot.svg";
import sport from "@/../public/icons/nav-sport.svg";
import live from "@/../public/icons/nav-live.svg";
import lottery from "@/../public/icons/nav-lottery.svg";
import fav from "@/../public/icons/nav-fav.svg";
import pvp from "@/../public/icons/nav-pvp.svg";
import gift from "@/../public/icons/nav-gift.svg";
import reward from "@/../public/icons/nav-reward.svg";
import fish from "@/../public/icons/nav-fish.svg";
import SecondaryButton from "./buttons/SecondaryButton";
import PrimaryButton from "./buttons/PrimaryButton";

const menuData = [
  { title: "Hot Games", icon: hotGame, redirect: "#" },
  { title: "Slots", icon: slot, redirect: "/slots" },
  { title: "Sports", icon: sport, redirect: "/sports" },
  { title: "Live", icon: live, redirect: "/live-casino" },
  { title: "Favorites", icon: fav, redirect: "/favorites" },
  { title: "Lottery", icon: lottery, redirect: "/lottery" },
  { title: "PVP", icon: pvp, redirect: "/pocker" },
  { title: "Promotion", icon: gift, redirect: "/promotion" },
  { title: "Reward", icon: reward, redirect: "/rewardCenter" },
  { title: "Fish", icon: fish, redirect: "/fish" },
];

export const SideNav = () => {
  return (
    <div className="h-screen bg-[#111111] p-5">
      <div className="grid grid-cols-2 gap-4">
        {menuData.map((menu, i) => (
          <Link
            key={i}
            href={menu.redirect}
            className="flex flex-col justify-center items-center px-3 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#2A2A2A] shadow-lg transition-colors duration-200"
            aria-label={menu.title}
          >
            <figure className="w-10 h-10 mb-2">
              <Image
                src={menu.icon}
                alt={menu.title}
                className="w-full h-full  !text-red-600"
                style={{
                  filter:
                    "invert(79%) sepia(71%) saturate(749%) hue-rotate(1deg) brightness(96%) contrast(101%)",
                }}
              />
            </figure>
            <span className="text-sm font-bold text-[#D4AF37]">
              {menu.title}
            </span>
          </Link>
        ))}
      </div>

      {/* Example Login/Register Buttons */}
      <div className="mt-6 flex flex-col gap-3">
        <Link href="/login">
          <SecondaryButton className="!w-full !h-[40px]">Login</SecondaryButton>
        </Link>
        <Link href="/register">
          <PrimaryButton className="!w-full !h-[40px]">Register</PrimaryButton>
        </Link>
      </div>
    </div>
  );
};
import { useState, useEffect } from "react";
import useCurrentUser from "@/hook/useCurrentUser";
import { useFetchVipLevelQuery } from "@/lib/features/vipApiSlice";
import AuthModal from "./auth/auth-modal";
import { useNotificationBadge } from "@/lib/store.zustond";
import { logout } from "@/action/logout";

/* ─── Inline SVG Icons ─── */
const Ic = ({ d, size = 20, fill = "none", sw = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Array.isArray(d) ? (
      d.map((p, i) => <path key={i} d={p} />)
    ) : (
      <path d={d} />
    )}
  </svg>
);

const Icons = {
  home: <Ic d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />,
  profile: (
    <Ic
      d={[
        "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
        "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
      ]}
    />
  ),
  deposit: <Ic d={["M12 5v14", "M5 12l7 7 7-7"]} />,
  withdraw: <Ic d={["M12 19V5", "M5 12l7-7 7 7"]} />,
  bell: (
    <Ic
      d={[
        "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9",
        "M13.73 21a2 2 0 0 1-3.46 0",
      ]}
    />
  ),
  gift: (
    <Ic
      d={[
        "M20 12v10H4V12",
        "M2 7h20v5H2z",
        "M12 22V7",
        "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z",
        "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
      ]}
    />
  ),
  refer: (
    <Ic
      d={[
        "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
        "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
        "M23 21v-2a4 4 0 0 0-3-3.87",
        "M16 3.13a4 4 0 0 1 0 7.75",
      ]}
    />
  ),
  history: (
    <Ic
      d={[
        "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
        "M3 3v5h5",
        "M12 7v5l4 2",
      ]}
    />
  ),
  settings: (
    <Ic
      d={[
        "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
        "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
      ]}
    />
  ),
  support: (
    <Ic
      d={[
        "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.9 19.8 19.8 0 0 1 1.61 3.27 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
      ]}
    />
  ),
  logout: (
    <Ic
      d={[
        "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
        "M16 17l5-5-5-5",
        "M21 12H9",
      ]}
    />
  ),
  crown: (
    <Ic
      d="M2 19l2.5-9L9 14l3-9 3 9 4.5-4L22 19H2z"
      size={14}
      fill="currentColor"
      sw={0}
    />
  ),
  menu: <Ic d={["M3 6h18", "M3 12h18", "M3 18h18"]} />,
  close: <Ic d={["M18 6 6 18", "M6 6l12 12"]} />,
  chevron: <Ic d="M9 18l6-6-6-6" size={14} />,
  coin: (
    <Ic
      d={[
        "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z",
        "M12 6v2",
        "M12 16v2",
        "M8 12h8",
      ]}
      size={14}
    />
  ),
  flame: (
    <Ic
      d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      size={14}
    />
  ),
  vip: <Ic d="M3 6l3 13h12l3-13-6 4-3-7-3 7-6-4z" size={14} />,
  live: (
    <Ic
      d={["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z", "M12 8v4l3 3"]}
      size={12}
    />
  ),
};

const TICKER_ITEMS = [
  "🏆 রাহেল জিতেছেন ৳১,২০,০০০ পোকারে",
  "🎰 সুমন জিতেছেন ৳৫০,০০০ স্লটে",
  "🎣 তামিম জিতেছেন ৳৭৫,০০০ ফিশ গেমে",
  "🃏 রিফাত জিতেছেন ৳২,৫০,০০০ বাকারায়",
  "🎲 নাবিলা জিতেছেন ৳৩০,০০০ ডাইসে",
];

/* ─── Tiny helpers ─── */
const GoldText = ({ children, style = {} }) => (
  <span
    style={{
      background: "linear-gradient(90deg,#fbbf24,#f59e0b,#fcd34d)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      ...style,
    }}
  >
    {children}
  </span>
);

const Badge = ({ value }) => {
  const isNum = typeof value === "number";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: isNum ? 18 : 30,
        height: 18,
        borderRadius: 99,
        padding: "0 5px",
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: 0.5,
        background: isNum
          ? "linear-gradient(135deg,#ef4444,#dc2626)"
          : value === "HOT"
            ? "linear-gradient(135deg,#f97316,#ef4444)"
            : "linear-gradient(135deg,#7c3aed,#4f46e5)",
        color: "#fff",
        textTransform: "uppercase",
        boxShadow: isNum ? "0 0 8px rgba(239,68,68,0.6)" : "none",
      }}
    >
      {value}
    </span>
  );
};

/* ─── Main Component ─── */
export function PlatformSidebar() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("home");
  const [hovered, setHovered] = useState(null);
  const [, setTickerIdx] = useState(0);
  const [, setVipAnim] = useState(false);

  /* ticker auto-advance */
  useEffect(() => {
    const t = setInterval(
      () => setTickerIdx((i) => (i + 1) % TICKER_ITEMS.length),
      3200,
    );
    return () => clearInterval(t);
  }, []);

  /* VIP bar pulse on mount */
  useEffect(() => {
    setTimeout(() => setVipAnim(true), 600);
  }, []);

  const sidebarW = 300;

  const user: any = useCurrentUser();
  const { data } = useFetchVipLevelQuery();
  const level = data?.payload?.level?.level || 0;
  const [openAuthModal, setOpenAuthModal] = useState<"login" | "register">(
    null,
  );
  const badge = useNotificationBadge((state) => state.badge);

  const profileNotificationCount =
    badge.achivementRewardsCount + badge.bonusReceivingRewardCount + 2;

  const MENU = useMemo(
    () => [
      {
        id: "home",
        label: "হোম",
        icon: Icons.home,

        accent: "#c084fc",
        badge: null,
        isExit: false,
        redirect: "/",
      },
      {
        id: "profile",
        label: "প্রোফাইল",
        icon: Icons.profile,
        accent: "#fbbf24",
        badge: profileNotificationCount,
        isExit: false,
        redirect: "/member",
      },
      {
        id: "deposit",
        label: "ডিপোজিট",
        icon: Icons.deposit,
        accent: "#34d399",
        badge: "HOT",
        isExit: false,
        redirect: "/deposit",
      },
      {
        id: "withdraw",
        label: "উইথড্র",
        icon: Icons.withdraw,
        accent: "#60a5fa",
        badge: null,
        isExit: false,
        redirect: "/withdraw",
      },
      {
        id: "notif",
        label: "নোটিফিকেশন",
        icon: Icons.bell,
        accent: "#f472b6",
        badge: badge.unSeenMessagesCount,
        isExit: false,
        redirect: "/notification",
      },
      {
        id: "bonus",
        label: "বোনাস ও অফার",
        icon: Icons.gift,
        accent: "#fbbf24",
        badge: "NEW",
        isExit: false,
        redirect: "/rewardCenter",
      },
      {
        id: "refer",
        label: "রেফার করুন",
        icon: Icons.refer,
        accent: "#38bdf8",
        badge: badge.achivementRewardsCount,
        isExit: false,
        redirect: "invite-friends",
      },
      {
        id: "history",
        label: "লেনদেনের ইতিহাস",
        icon: Icons.history,
        accent: "#a78bfa",
        badge: null,
        isExit: false,
        redirect: "/",
      },
      {
        id: "settings",
        label: "সেটিংস",
        icon: Icons.settings,
        accent: "#94a3b8",
        badge: null,
        isExit: false,
        redirect: "/my-account",
      },
      {
        id: "support",
        label: "সাপোর্ট",
        icon: Icons.support,
        accent: "#4ade80",
        badge: null,
        isExit: false,
        redirect: "/chat",
      },
      {
        id: "logout",
        label: "লগআউট",
        icon: Icons.logout,
        accent: "#f87171",
        badge: null,
        isExit: true,
        onClick: async () => {
          await logout();
          location.reload();
        },
      },
    ],
    [],
  );

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: "#07060f",
          display: "flex",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
        className="w-full"
      >
        <style>{`
        @keyframes tickerSlide {
          0%   { opacity:0; transform:translateY(10px); }
          15%  { opacity:1; transform:translateY(0); }
          85%  { opacity:1; transform:translateY(0); }
          100% { opacity:0; transform:translateY(-10px); }
        }
        @keyframes vipFill {
          from { width:0; }
          to   { width:68%; }
        }
        @keyframes goldPulse {
          0%,100% { box-shadow:0 0 0 0 rgba(251,191,36,.5); }
          50%      { box-shadow:0 0 0 8px rgba(251,191,36,0); }
        }
        @keyframes slideIn {
          from { transform:translateX(-${sidebarW}px); opacity:.4; }
          to   { transform:translateX(0); opacity:1; }
        }
        @keyframes fadeIn {
          from { opacity:0; transform:translateX(-6px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes shimmerLine {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes liveBlip {
          0%,100% { opacity:1; } 50% { opacity:.3; }
        }
        .sidebar-item { transition: background .18s, border-color .18s, transform .12s; }
        .sidebar-item:active { transform: scale(.97); }
      `}</style>

        {/* ── SIDEBAR ── */}
        <aside
          style={{
            width: sidebarW,
            minHeight: "100vh",
            background:
              "linear-gradient(175deg,#0f0d1e 0%,#0c0a1a 50%,#090715 100%)",
            borderRight: "1px solid rgba(251,191,36,.18)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            flexShrink: 0,
            zIndex: 10,
            animation: open ? "slideIn .35s cubic-bezier(.22,1,.36,1)" : "none",
            boxShadow: "4px 0 40px rgba(0,0,0,.7), 1px 0 0 rgba(139,92,246,.1)",
          }}
        >
          {/* Top gold edge */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "5%",
              right: "5%",
              height: 1,
              background:
                "linear-gradient(90deg,transparent,rgba(251,191,36,.8),rgba(251,191,36,1),rgba(251,191,36,.8),transparent)",
            }}
          />

          {/* ── USER CARD ── */}
          {user && (
            <div
              style={{
                margin: "12px 12px 0",
                background:
                  "linear-gradient(135deg,rgba(124,58,237,.15),rgba(79,70,229,.08))",
                border: "1px solid rgba(251,191,36,.18)",
                borderRadius: 14,
                padding: "12px 14px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Shimmer line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  right: "-100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg,transparent 30%,rgba(251,191,36,.04) 50%,transparent 70%)",
                  backgroundSize: "300% 100%",
                  animation: "shimmerLine 4s linear infinite",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  position: "relative",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    border: "2px solid rgba(251,191,36,.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#fff",
                    flexShrink: 0,
                    animation: "goldPulse 4s ease-in-out infinite",
                  }}
                >
                  <img
                    src={
                      user.profileImage ||
                      "https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
                    }
                    className="w-10 rounded-full"
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: 4,
                    }}
                  >
                    {user?.name}
                  </div>
                  {/* VIP Badge */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      background:
                        "linear-gradient(90deg,rgba(251,191,36,.2),rgba(251,191,36,.08))",
                      border: "1px solid rgba(251,191,36,.35)",
                      borderRadius: 6,
                      padding: "2px 8px",
                    }}
                  >
                    <span style={{ color: "#fbbf24", display: "flex" }}>
                      {Icons.crown}
                    </span>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 800,
                        color: "#fbbf24",
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                      }}
                    >
                      VIP
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        background: "#fbbf24",
                        color: "#000",
                        borderRadius: 4,
                        padding: "0 4px",
                      }}
                    >
                      LV.{level}
                    </span>
                  </div>
                </div>

                {/* Online dot */}
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "#4ade80",
                    boxShadow:
                      "0 0 0 2px rgba(74,222,128,.3), 0 0 8px rgba(74,222,128,.6)",
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* Balance row */}
              <div
                style={{
                  marginTop: 10,
                  padding: "7px 10px",
                  background: "rgba(0,0,0,.3)",
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 9.5,
                      color: "rgba(255,255,255,.4)",
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      marginBottom: 1,
                    }}
                  >
                    ব্যালেন্স
                  </div>
                  <GoldText style={{ fontSize: 17, fontWeight: 800 }}>
                    ৳{user?.wallet?.balance || 0}
                  </GoldText>
                </div>
              </div>

              {/* VIP progress */}
              {/* <div style={{ marginTop: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  fontSize: 9.5,
                  color: "rgba(255,255,255,.4)",
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                আরও ৳৩,৫৫০ → LV.5
              </span>
              <span
                style={{ fontSize: 9.5, fontWeight: 700, color: "#fbbf24" }}
              >
                68%
              </span>
            </div>
            <div
              style={{
                height: 5,
                background: "rgba(255,255,255,.08)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 99,
                  background: "linear-gradient(90deg,#f59e0b,#fbbf24,#fcd34d)",
                  width: vipAnim ? "68%" : "0%",
                  transition: "width 1.2s cubic-bezier(.22,1,.36,1)",
                  boxShadow: "0 0 8px rgba(251,191,36,.5)",
                }}
              />
            </div>
          </div> */}
            </div>
          )}

          {/* ── QUICK ACTIONS ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              padding: "10px 12px 4px",
            }}
          >
            {user && (
              <>
                {[
                  {
                    label: "ডিপোজিট",
                    icon: "↓",
                    bg: "linear-gradient(135deg,#065f46,#047857)",
                    border: "rgba(52,211,153,.3)",
                    glow: "rgba(52,211,153,.4)",
                    link: "/deposit",
                  },
                  {
                    label: "উইথড্র",
                    icon: "↑",
                    bg: "linear-gradient(135deg,#1e3a8a,#1d4ed8)",
                    border: "rgba(96,165,250,.3)",
                    glow: "rgba(96,165,250,.4)",
                    link: "/withdraw",
                  },
                ].map((b,i) => (
                  <Link href={b.link} key={i}>
                    <button
                      key={b.label}
                      style={{
                        padding: "9px 8px",
                        borderRadius: 10,
                        background: b.bg,
                        border: `1px solid ${b.border}`,
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        boxShadow: `0 4px 15px ${b.glow}`,
                        transition: "transform .15s, box-shadow .15s",
                      }}
                      className="w-full"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <span style={{ fontSize: 16, lineHeight: 1 }}>
                        {b.icon}
                      </span>{" "}
                      {b.label}
                    </button>
                  </Link>
                ))}
              </>
            )}

            {!user && (
              <>
                <SecondaryButton
                  onClick={() => {
                    setOpenAuthModal("login");
                  }}
                  className="mt-3 !py-2"
                >
                  Login
                </SecondaryButton>
                <PrimaryButton
                  onClick={() => {
                    setOpenAuthModal("register");
                  }}
                  className="mt-3 !py-2"
                >
                  Register
                </PrimaryButton>
              </>
            )}
          </div>

          {/* ── SECTION LABEL ── */}
          <div
            style={{
              padding: "10px 18px 6px",
              fontSize: 9.5,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "rgba(255,255,255,.25)",
              fontWeight: 600,
            }}
          >
            মেনু
          </div>

          {/* ── NAV ITEMS ── */}
          <nav style={{ flex: 1, overflowY: "auto", padding: "0 8px 8px" }}>
            {MENU.map((item, i) => {
              const isActive = active === item.id;
              const isHov = hovered === item.id;
              const highlight = isActive || isHov;
              const isLast = item.isExit;

              return (
                <div key={item.id}>
                  {/* Separator before logout */}
                  {isLast && (
                    <div
                      style={{
                        height: 1,
                        margin: "8px 6px",
                        background:
                          "linear-gradient(90deg,transparent,rgba(248,113,113,.15),transparent)",
                      }}
                    />
                  )}
                  <button
                    className="sidebar-item"
                    onClick={async () => {
                      if (!isLast) {
                        setActive(item.id);
                      }
                      await item?.onClick?.();
                    }}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: highlight
                        ? `1px solid ${isLast ? "rgba(248,113,113,.25)" : item.accent + "30"}`
                        : "1px solid transparent",
                      background:
                        isActive && !isLast
                          ? `linear-gradient(90deg,${item.accent}18,${item.accent}08)`
                          : isHov
                            ? isLast
                              ? "rgba(248,113,113,.07)"
                              : `${item.accent}0d`
                            : "transparent",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      animation: `fadeIn .25s ease ${i * 0.04}s both`,
                      marginBottom: 2,
                    }}
                  >
                    {/* Active left bar */}
                    {isActive && !isLast && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "20%",
                          bottom: "20%",
                          width: 3,
                          borderRadius: "0 3px 3px 0",
                          background: `linear-gradient(180deg,transparent,${item.accent},transparent)`,
                          boxShadow: `0 0 10px ${item.accent}`,
                        }}
                      />
                    )}

                    {/* Icon box */}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: highlight
                          ? `linear-gradient(135deg,${item.accent}25,${item.accent}10)`
                          : "rgba(255,255,255,.04)",
                        border: `1px solid ${highlight ? item.accent + "40" : "rgba(255,255,255,.06)"}`,
                        color: highlight ? item.accent : "rgba(255,255,255,.4)",
                        transition: "all .2s",
                        boxShadow: isActive
                          ? `0 0 12px ${item.accent}50`
                          : "none",
                        transform: isHov ? "scale(1.08)" : "scale(1)",
                      }}
                    >
                      {item.icon}
                    </div>

                    {/* Label */}
                    <span
                      style={{
                        flex: 1,
                        textAlign: "left",
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 400,
                        color:
                          isActive && !isLast
                            ? "#fff"
                            : isLast
                              ? isHov
                                ? "#f87171"
                                : "rgba(248,113,113,.75)"
                              : isHov
                                ? "#fff"
                                : "rgba(255,255,255,.6)",
                        letterSpacing: 0.2,
                        transition: "color .18s",
                      }}
                    >
                      {item.label}
                    </span>

                    {/* Badge */}
                    {item.badge != null && typeof item.badge == "number"
                      ? item.badge > 0 && <Badge value={item.badge} />
                      : item.badge && <Badge value={item.badge} />}

                    {/* Active chevron */}
                    {isActive && !isLast && (
                      <span
                        style={{
                          color: item.accent,
                          opacity: 0.7,
                          display: "flex",
                        }}
                      >
                        {Icons.chevron}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* ── PROMO BANNER ── */}
          <Link href={"/invite-friends"}>
            {" "}
            <div
              style={{
                margin: "0 12px 12px",
                padding: "11px 14px",
                background:
                  "linear-gradient(135deg,rgba(124,58,237,.25),rgba(79,70,229,.15))",
                border: "1px solid rgba(139,92,246,.3)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  right: "-100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg,transparent 30%,rgba(255,255,255,.04) 50%,transparent 70%)",
                  backgroundSize: "300% 100%",
                  animation: "shimmerLine 3.5s linear infinite",
                }}
              />
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: "rgba(251,191,36,.15)",
                  border: "1px solid rgba(251,191,36,.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                🎁
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 2,
                  }}
                >
                  রেফার করুন, টাকা জিতুন!
                </div>
                <div style={{ fontSize: 10, color: "rgba(251,191,36,.8)" }}>
                  প্রতি রেফারে পান ৳৫০০ বোনাস
                </div>
              </div>
              <span style={{ color: "#fbbf24", fontSize: 16, flexShrink: 0 }}>
                →
              </span>
            </div>
          </Link>

          {/* Bottom purple glow edge */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "20%",
              right: "20%",
              height: 1,
              background:
                "linear-gradient(90deg,transparent,rgba(139,92,246,.5),transparent)",
            }}
          />
        </aside>

        {/* ── MAIN CONTENT (demo only) ── */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              height: 56,
              padding: "0 20px",
              borderBottom: "1px solid rgba(255,255,255,.06)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255,255,255,.02)",
            }}
          >
            {!open && (
              <button
                onClick={() => setOpen(true)}
                style={{
                  background: "rgba(251,191,36,.1)",
                  border: "1px solid rgba(251,191,36,.25)",
                  borderRadius: 8,
                  color: "#fbbf24",
                  cursor: "pointer",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Icons.menu}
              </button>
            )}
            <span
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,.35)",
                fontWeight: 500,
              }}
            >
              {MENU.find((m) => m.id === active)?.label ?? "হোম"}
            </span>
          </div>

          {/* Page body placeholder */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 40, opacity: 0.15 }}>♛</div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,.15)",
                textAlign: "center",
                lineHeight: 2,
              }}
            >
              মেনু আইটেম ক্লিক করুন
              <br />
              সাইডবার ট্রাই করতে
            </div>
          </div>
        </main>
      </div>
      <AuthModal
        show={!!openAuthModal}
        selectModal={openAuthModal}
        onClose={() => setOpenAuthModal(null)}
      />
    </>
  );
}
