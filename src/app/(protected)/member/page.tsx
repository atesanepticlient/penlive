/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { PiCubeThin, PiHandDepositFill } from "react-icons/pi";
import { FiRefreshCw } from "react-icons/fi";
import { FaCopy } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { FaCreditCard } from "react-icons/fa6";
import { PiHandWithdrawFill } from "react-icons/pi";
import { FaGift } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { LuNotebookText } from "react-icons/lu";
import { FaCircleUser } from "react-icons/fa6";
import { MdSecurity } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";
import { FiDownload } from "react-icons/fi";
import { MdOutlineSupportAgent } from "react-icons/md";
import Link from "next/link";
import { useFetchWalletQuery } from "@/lib/features/walletApiSlice";
import { getCurrencySymbol } from "@/lib/utils";
import useCurrentUser from "@/hook/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import LogOutModal from "@/components/logout-modal";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RiCalendarCheckFill, RiLogoutCircleRLine } from "react-icons/ri";

const App: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  const router = useRouter();
  const user: any = useCurrentUser();
  const {
    data,
    isLoading: walletLoading,
    refetch,
    isFetching: walletRetching,
  } = useFetchWalletQuery();

  const balance = Number(data?.payload!.balance);

  const handleCopyPlayerId = () => {
    navigator.clipboard.writeText(user.playerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshBalance = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    refetch();
    setLastUpdateTime(new Date());
    setShowToast(true);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="bg-white w-full min-h-screen pb-16 md:pb-4 md:flex md:flex-col md:items-center relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-800 to-transparent opacity-10 pointer-events-none" />
      <div className="md:w-full relative z-10">
        <div className="profile-inner relative">
          <div className="flex items-center gap-2 ml-5">
            <button onClick={handleBack}>
              <IoIosArrowBack className="w-5 h-5 text-white" />
            </button>
            <h3 className="text-xl font-bold text-white py-4">My Account</h3>
          </div>

          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-black border border-[#D4AF37]/50 text-white px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-opacity duration-300 z-50 flex items-center gap-3 ${
              showToast ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
              <FiRefreshCw className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-sm font-medium tracking-wide">
                Balance updated
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                {lastUpdateTime.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* ── PROFILE SECTION: UNTOUCHED ── */}
          <div className="px-5 py-6 absolute top-16 right-0 rounded-3xl member-profile md:mt-4 overflow-hidden">
            <Link
              href="/activity/signin"
              className="top-0 right-0 absolute px-8 py-1.5 text-white rounded-bl-[40px] flex items-center gap-2"
              style={{
                background:
                  "linear-gradient(to bottom, #d63d3d 0%, #b31d1d 100%)",
              }}
            >
              <RiCalendarCheckFill /> Sign In
            </Link>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center pt-1 pb-4">
                  <div className="relative">
                    <img
                      src="https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
                      className="w-[90px] border-[5px] border-white aspect-square rounded-full"
                    />
                  </div>
                  <div className="ml-4">
                    <VipButton level={0} />
                    <div className="flex items-center mt-1 text-neutral-400">
                      <span className="text-lg font-extrabold text-black tracking-wide">
                        {user?.phone || "0123..."}
                      </span>
                      <button
                        onClick={handleCopyPlayerId}
                        className="ml-2.5 p-1.5 rounded-lg transition-colors"
                      >
                        <FaCopy className="w-3.5 h-3.5 text-black" />
                      </button>
                    </div>
                    <div className="mt-2">
                      <h2 className="text-sm text-[#2c2c2c9c] tracking-wide font-bold">
                        Nickname:{" "}
                        {user?.name || (
                          <Skeleton className="w-[100px] h-[20px] bg-neutral-800" />
                        )}
                      </h2>
                      <h2 className="text-sm text-[#2c2c2c9c] tracking-wide font-bold mt-2">
                        Joined: {new Date(user.createdAt).getFullYear()}-
                        {new Date(user.createdAt).getMonth()}-
                        {new Date(user.createdAt).getDate()}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <span
                  className="text-3xl font-medium text-[#222222c6] tracking-tight transform md:text-4xl"
                  style={{
                    animation: isRefreshing
                      ? "none"
                      : "balancePulse 0.5s ease-out",
                  }}
                >
                  {(walletLoading || walletRetching) && 0.0}
                  {!walletLoading && !walletRetching && data && (
                    <span className="text-2xl font-medium">
                      {getCurrencySymbol("BDT")}
                      {balance.toFixed(2)}
                    </span>
                  )}
                </span>
                <button
                  onClick={handleRefreshBalance}
                  disabled={isRefreshing}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:border-[#D4AF37]/50 disabled:opacity-50 transition-all"
                >
                  <FiRefreshCw
                    className={`w-5 h-5 text-neutral-500 hover:text-neutral-600 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-2 scroll-auto overflow-x-scroll scrollbar-none pb-2">
              <Link href="/deposit">
                <button className="h-[40px] px-6 rounded-full bg-gradient-to-b from-[#F9F9F9] to-[#E3E3E3] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] font-bold text-[14px] text-[#555555] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:from-[#ffffff] active:scale-[0.98] active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.1)]">
                  Deposit
                </button>
              </Link>
              <Link href="/withdraw">
                <button className="h-[40px] px-6 rounded-full bg-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] font-bold text-[14px] text-[#555555] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:from-[#ffffff] active:scale-[0.98] active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.1)]">
                  Withdrawal
                </button>
              </Link>
              <Link href="/my-cards">
                <button className="h-[40px] px-6 rounded-full bg-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] font-bold text-[14px] text-[#555555] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:from-[#ffffff] active:scale-[0.98] active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.1)]">
                  My Cards
                </button>
              </Link>
            </div>
          </div>
        </div>

        <MemberMenu />
      </div>

      <style>{`
        @keyframes balancePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default App;

import badgeIcon from "@/../public/profile/badge.png";
import { useFetchVipLevelQuery } from "@/lib/features/vipApiSlice";
import { HiOutlineDocumentCurrencyPound } from "react-icons/hi2";
import { TbMessage2Filled } from "react-icons/tb";
import { useNotificationBadge } from "@/lib/store.zustond";
import { logout } from "@/action/logout";

const VipButton = ({ level = 0 }) => {
  const { data } = useFetchVipLevelQuery();
  const viPlevel = data?.payload?.level?.level || 0;
  const vipLabel = `VIP ${viPlevel}`;
  return (
    <Link href="/benefits">
      <button className="relative overflow-hidden rounded-full flex items-center gap-1.5 bg-gradient-to-b from-[#6D7278] to-[#4A4E54] border-[1.5px] border-t-[#8B9198] border-b-[#33373B] border-x-[#5B6066] px-4 py-1">
        <span className="absolute inset-0 shine"></span>
        <Image
          src={badgeIcon}
          alt="Badge"
          className="w-[16px] aspect-square relative z-10"
        />
        <span
          className="text-sxs font-extrabold text-white relative z-10"
          style={{ textShadow: "3px 3px 3px #00000040" }}
        >
          {vipLabel}
        </span>
      </button>
    </Link>
  );
};

/* ══════════════════════════════════════════
   SVG ICONS — exact match to reference image
   Circle bg: #fdeece  Icon stroke: #c8973a
══════════════════════════════════════════ */

const IC = "#c8973a"; // icon stroke/fill color
const BG = "#fdeece"; // circle background

/* 1. Reward Center — trophy with star */
const SvgReward = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <path
      d="M8 6h14v9a7 7 0 01-14 0V6z"
      stroke={IC}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M8 9H4v3a4 4 0 004 4M22 9h4v3a4 4 0 01-4 4"
      stroke={IC}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <line
      x1="15"
      y1="22"
      x2="15"
      y2="26"
      stroke={IC}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <line
      x1="11"
      y1="26"
      x2="19"
      y2="26"
      stroke={IC}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path d="M15 10l1 2h2l-1.5 1.2.6 2L15 14l-2.1 1.2.6-2L12 12h2z" fill={IC} />
  </svg>
);

/* 2. Betting Record — asterisk/spark lines */
const SvgBetting = () => (
  <svg width="34" height="35" viewBox="0 0 30 30" fill="none">
    <line
      x1="15"
      y1="5"
      x2="15"
      y2="25"
      stroke={IC}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="5"
      y1="15"
      x2="25"
      y2="15"
      stroke={IC}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="8"
      x2="22"
      y2="22"
      stroke={IC}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="22"
      y1="8"
      x2="8"
      y2="22"
      stroke={IC}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* 3. Profit & Loss — document with $ and arrow */
const SvgProfitLoss = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <rect
      x="6"
      y="3"
      width="18"
      height="24"
      rx="2"
      stroke={IC}
      strokeWidth="1.6"
    />
    <line
      x1="10"
      y1="10"
      x2="20"
      y2="10"
      stroke={IC}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="10"
      y1="14"
      x2="20"
      y2="14"
      stroke={IC}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 18h2.5a1.5 1.5 0 010 3H14v1.5"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path d="M14 17v6" stroke={IC} strokeWidth="1.4" strokeLinecap="round" />
    <path
      d="M21 5l2-2 2 2M23 3v5"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* 4. Deposit Record — clipboard with arrow up */
const SvgDepositRecord = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <rect
      x="6"
      y="5"
      width="18"
      height="22"
      rx="2"
      stroke={IC}
      strokeWidth="1.6"
    />
    <path
      d="M11 5v-1a1 1 0 011-1h6a1 1 0 011 1v1"
      stroke={IC}
      strokeWidth="1.4"
    />
    <line
      x1="10"
      y1="14"
      x2="20"
      y2="14"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <line
      x1="10"
      y1="18"
      x2="16"
      y2="18"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M20 21l-3-3 3-3M17 18h5"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* 5. Withdrawal Record — clipboard with arrow down */
const SvgWithdrawRecord = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <rect
      x="6"
      y="5"
      width="18"
      height="22"
      rx="2"
      stroke={IC}
      strokeWidth="1.6"
    />
    <path
      d="M11 5v-1a1 1 0 011-1h6a1 1 0 011 1v1"
      stroke={IC}
      strokeWidth="1.4"
    />
    <line
      x1="10"
      y1="14"
      x2="20"
      y2="14"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <line
      x1="10"
      y1="18"
      x2="16"
      y2="18"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M17 18l3 3-3 3M17 21h5"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* 6. Account Record — clipboard with clock */
const SvgAccountRecord = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <path
      d="M16 4H9a2 2 0 00-2 2v20a2 2 0 002 2h12a2 2 0 002-2V12"
      stroke={IC}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M16 4v6h7" stroke={IC} strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="19" cy="21" r="5" stroke={IC} strokeWidth="1.5" />
    <path
      d="M19 18.5v3l2 1"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* 7. My Account — person in circle */
const SvgMyAccount = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <circle cx="15" cy="15" r="11" stroke={IC} strokeWidth="1.6" />
    <circle cx="15" cy="12" r="4" stroke={IC} strokeWidth="1.5" />
    <path
      d="M7 25c0-4 3.6-7 8-7s8 3 8 7"
      stroke={IC}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/* 8. Security Center — shield with person */
const SvgSecurity = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <path
      d="M15 3L5 7v8c0 7 5 11 10 13 5-2 10-6 10-13V7z"
      stroke={IC}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="15" cy="13" r="3" stroke={IC} strokeWidth="1.4" />
    <path
      d="M9 22c0-3 2.7-5 6-5s6 2 6 5"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/* 9. Invite Friends — person with plus */
const SvgInvite = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <circle cx="12" cy="11" r="5" stroke={IC} strokeWidth="1.6" />
    <path
      d="M4 26c0-5 3.6-8 8-8s8 3 8 8"
      stroke={IC}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <line
      x1="23"
      y1="11"
      x2="23"
      y2="19"
      stroke={IC}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="19"
      y1="15"
      x2="27"
      y2="15"
      stroke={IC}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* 10. Mission — gift box */
const SvgMission = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <rect
      x="5"
      y="13"
      width="20"
      height="14"
      rx="1.5"
      stroke={IC}
      strokeWidth="1.6"
    />
    <rect
      x="3"
      y="8"
      width="24"
      height="5"
      rx="1.5"
      stroke={IC}
      strokeWidth="1.6"
    />
    <line x1="15" y1="8" x2="15" y2="27" stroke={IC} strokeWidth="1.5" />
    <path
      d="M15 8c0 0-3-5 0-5s0 5 0 5"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M15 8c0 0 3-5 0-5"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/* 11. Rebate — coins with circular arrows */
const SvgRebate = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <circle cx="15" cy="15" r="10" stroke={IC} strokeWidth="1.6" />
    <circle cx="15" cy="15" r="6" stroke={IC} strokeWidth="1.3" />
    <path
      d="M12 12h4a1.5 1.5 0 010 3h-2a1.5 1.5 0 000 3h4"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <line
      x1="15"
      y1="10.5"
      x2="15"
      y2="12"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <line
      x1="15"
      y1="18"
      x2="15"
      y2="19.5"
      stroke={IC}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/* 12. Suggestion — star + speech bubble */
const SvgSuggestion = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <path
      d="M5 5h20v16H16l-4 4v-4H5z"
      stroke={IC}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M15 9l1.2 2.5 2.8.4-2 2 .5 2.7L15 15.4l-2.5 1.2.5-2.7-2-2 2.8-.4z"
      stroke={IC}
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

/* 13. Download App — phone with download arrow */
const SvgDownload = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <rect
      x="8"
      y="3"
      width="14"
      height="24"
      rx="3"
      stroke={IC}
      strokeWidth="1.6"
    />
    <line
      x1="11"
      y1="6"
      x2="19"
      y2="6"
      stroke={IC}
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <circle cx="15" cy="23" r="1.2" fill={IC} />
    <path
      d="M12 14l3 3 3-3M15 10v7"
      stroke={IC}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* 14. Customer Service — 24/7 circle */
const SvgCustomer = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <circle cx="15" cy="15" r="11" stroke={IC} strokeWidth="1.6" />
    <text
      x="15"
      y="19"
      textAnchor="middle"
      fontSize="7.5"
      fontWeight="700"
      fill={IC}
      fontFamily="sans-serif"
    >
      24/7
    </text>
  </svg>
);

/* 15. Logout — arrow in circle */
const SvgLogout = () => (
  <svg width="35" height="35" viewBox="0 0 30 30" fill="none">
    <circle cx="15" cy="15" r="11" stroke={IC} strokeWidth="1.6" />
    <path
      d="M12 10l5 5-5 5"
      stroke={IC}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="9"
      y1="15"
      x2="17"
      y2="15"
      stroke={IC}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/* ── Single item ── */
const MenuItem = ({
  href,
  Svg,
  label,
  notification,
  onClick,
}: {
  href?: string;
  Svg: React.FC;
  label: string;
  notification?: number;
  onClick?: any;
}) => {
  const itemBody = (
    <div className="flex flex-col items-center gap-2 cursor-pointer active:opacity-70 relative">
      <div
        className="w-[60px] h-[60px] bg-[#fdeeceaa] rounded-full flex items-center justify-center"
        style={{}}
      >
        <Svg />
      </div>
      <span className="text-[13px] text-center leading-tight font-medium text-[#333] max-w-[68px]">
        {label}
      </span>

      {notification > 0 && (
        <span className="notification-badge !shadow-none top-2 right-4 absolute">
          {notification}
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{itemBody}</Link>;
  }
  if (onClick) {
    return <button onClick={async () => await onClick()}>{itemBody}</button>;
  }
  return null;
};
/* ── Member Menu section ── */
function MemberMenu() {
  const badge = useNotificationBadge((state) => state.badge);

  const rewardBadge =
    (badge?.bonusReceivingRewardCount || 0) +
    (badge?.siginBonueCount || 0) +
    (badge?.achivementRewardsCount || 0);
  const inviteCount = badge?.achivementRewardsCount || 0;
  const menuItemsConfig = useMemo(
    () => [
      {
        href: "/rewardCenter",
        Svg: SvgReward,
        label: "পুরস্কার কেন্দ্র",
        notification: rewardBadge,
      },
      { href: "/betting-record", Svg: SvgBetting, label: "বেটিং রেকর্ড" },
      { href: "/profitandloss", Svg: SvgProfitLoss, label: "লাভ ও ক্ষতি" },
      {
        href: "/history?type=deposit",
        Svg: SvgDepositRecord,
        label: "জমার রেকর্ড",
      },
      {
        href: "/history?type=withdraw",
        Svg: SvgWithdrawRecord,
        label: "উত্তোলন রেকর্ড",
      },
      {
        href: "/my-account",
        Svg: SvgAccountRecord,
        label: "অ্যাকাউন্ট রেকর্ড",
      },
      { href: "/my-account", Svg: SvgMyAccount, label: "আমার অ্যাকাউন্ট" },
      { href: "/security", Svg: SvgSecurity, label: "নিরাপত্তা কেন্দ্র" },
      {
        href: "/invite-friends",
        Svg: SvgInvite,
        label: "বন্ধু আমন্ত্রণ",
        notification: inviteCount,
      },
      { href: "/mission", Svg: SvgMission, label: "মিশন", notification: 1 },
      { href: "/rebate", Svg: SvgRebate, label: "রিবেট" },
      { href: "/suggestion", Svg: SvgSuggestion, label: "পরামর্শ" },
      { href: "#", Svg: SvgDownload, label: "অ্যাপ ডাউনলোড", notification: 1 },
      { href: "/chat", Svg: SvgCustomer, label: "গ্রাহক সেবা" },
      {
        onClick: async () => {
          await logout();
          location.reload();
        },
        Svg: SvgLogout,
        label: "লগআউট",
      },
    ],
    [rewardBadge],
  );

  return (
    <section className="w-full px-4 pt-4 mt-20">
      {/* "Member Center" pill — matches image exactly */}
      <div className="mb-6 flex items-center ">
        <span
          className="inline-block text-[13px] bg-[#00000014] font-medium text-[#444] px-4 py-1.5 rounded-full w-[140px] mx-auto text-center"
          style={{ border: "1px solid #e0e0e0" }}
        >
          সদস্য কেন্দ্র
        </span>
        <div className="w-full h-[1px] bg-[#ddd]"></div>
      </div>

      {/* Grid — no card wrapper, items float on white bg like the image */}
      <div className="grid grid-cols-4 gap-y-7 gap-x-1">
        {menuItemsConfig.map((item, index) => (
          <MenuItem
            key={index}
            href={item.href}
            Svg={item.Svg}
            label={item.label}
            notification={item.notification}
            onClick={item.onClick}
          />
        ))}
      </div>
    </section>
  );
}
