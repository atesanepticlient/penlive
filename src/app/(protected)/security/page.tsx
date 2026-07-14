"use client";

import React, { useTransition, useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/action/logout";
import toast from "react-hot-toast";
import SpinLoader from "@/components/loader/SpinLoader";
import { IoArrowBackSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

// ─── Custom SVG Icons ────────────────────────────────────────────────────────

const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="8"
      r="4"
      fill="#92620A"
      fillOpacity="0.15"
      stroke="#92620A"
      strokeWidth="1.5"
    />
    <path
      d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6"
      stroke="#92620A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <rect
      x="15"
      y="14"
      width="8"
      height="5.5"
      rx="1.5"
      fill="#C9A84C"
      fillOpacity="0.9"
    />
    <path
      d="M16.2 16.5h5.6M16.2 17.8h3.5"
      stroke="white"
      strokeWidth="0.9"
      strokeLinecap="round"
    />
  </svg>
);

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="5"
      y="11"
      width="14"
      height="10"
      rx="2.5"
      fill="#0F6E56"
      fillOpacity="0.12"
      stroke="#0F6E56"
      strokeWidth="1.5"
    />
    <path
      d="M8 11V8.5a4 4 0 018 0V11"
      stroke="#0F6E56"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1.8" fill="#0F6E56" />
    <rect x="11.2" y="16" width="1.6" height="2.5" rx="0.6" fill="#0F6E56" />
    <circle cx="3" cy="5" r="0.8" fill="#0F6E56" fillOpacity="0.4" />
    <circle cx="21" cy="8" r="0.8" fill="#0F6E56" fillOpacity="0.4" />
    <path
      d="M3 5l0.8-0.8M21 8l-0.8-0.8"
      stroke="#0F6E56"
      strokeWidth="0.6"
      strokeLinecap="round"
      strokeOpacity="0.4"
    />
  </svg>
);

const PaymentLockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="6"
      width="14"
      height="10"
      rx="2"
      fill="#185FA5"
      fillOpacity="0.12"
      stroke="#185FA5"
      strokeWidth="1.4"
    />
    <path d="M3 9.5h14" stroke="#185FA5" strokeWidth="1.4" />
    <path
      d="M6 13h4"
      stroke="#185FA5"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M17 13.5l4 -2v4.5C21 18.5 19.5 20 17 21c-2.5-1-4-2.5-4-4V11.5l4 2Z"
      fill="#185FA5"
      fillOpacity="0.85"
    />
    <path
      d="M15.5 15.5l1.2 1.3L18.5 14"
      stroke="white"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PowerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M8.5 5.5A8 8 0 1 0 15.5 5.5"
      stroke="#C0392B"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M12 3v8"
      stroke="#C0392B"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M7 19H5a2 2 0 0 1-2-2V7l2.5 2M17 19h2a2 2 0 0 0 2-2V7l-2.5 2"
      stroke="#C0392B"
      strokeWidth="1"
      strokeLinecap="round"
      strokeOpacity="0.3"
    />
  </svg>
);

const ChevronRight = ({ color = "#C9A84C" }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M5 10.5L9 7L5 3.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1.5L9.8 5.3L14 5.9L11 8.8L11.7 13L8 11L4.3 13L5 8.8L2 5.9L6.2 5.3L8 1.5Z"
      fill={filled ? "#C9A84C" : "#E8D9A0"}
      stroke={filled ? "#C9A84C" : "#E8D9A0"}
      strokeWidth="0.5"
    />
  </svg>
);

// ─── Circle Progress ──────────────────────────────────────────────────────────

const SafetyRing = ({ percent = 85 }: { percent?: number }) => {
  const [progress, setProgress] = useState(0);
  const r = 30;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percent), 100);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#F0E8CC"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="url(#goldRing)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        <defs>
          <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0D080" />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-base font-bold text-yellow-700 leading-none"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {percent}%
        </span>
        <span className="text-[9px] text-yellow-600 uppercase tracking-wide">
          safe
        </span>
      </div>
    </div>
  );
};

// ─── Menu Item ────────────────────────────────────────────────────────────────

interface MenuItemProps {
  href?: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
  danger?: boolean;
  delay?: string;
}

const MenuItem = ({
  href,
  icon,
  iconBg,
  title,
  subtitle,
  onClick,
  danger,
  delay = "0ms",
}: MenuItemProps) => {
  const base =
    "flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer group " +
    (danger
      ? "bg-red-50 border-red-100 hover:border-red-300 hover:shadow-md hover:shadow-red-100 active:scale-[0.98]"
      : "bg-white border-amber-100 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100 active:scale-[0.98]");

  const inner = (
    <>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold ${danger ? "text-red-600" : "text-stone-800"}`}
        >
          {title}
        </p>
        <p
          className={`text-xs mt-0.5 ${danger ? "text-red-300" : "text-stone-400"}`}
        >
          {subtitle}
        </p>
      </div>
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
          danger ? "bg-red-100" : "bg-amber-50"
        }`}
      >
        <ChevronRight color={danger ? "#C0392B" : "#C9A84C"} />
      </div>
    </>
  );

  const style = { animationDelay: delay };

  if (href) {
    return (
      <Link href={href} className={base} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`w-full text-left ${base}`}
      style={style}
    >
      {inner}
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Security = () => {
  const [pending, startTr] = useTransition();

  const handleLogout = () => {
    logout().then((res) => {
      startTr(() => {
        if (res.success) {
          location.reload();
        } else if (res.error) {
          toast.error(res.error);
        }
      });
    });
  };
  const router = useRouter();
  return (
    <div className="min-h-screen bg-amber-50/60">
      {/* ── Header ── */}
      {/* <SiteHeader title="Security Center" des={` Protected &amp; Verified`} /> */}

      <div className="px-4 mt-4 space-y-4 pb-10">
        {/* ── Safety Score Card ── */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-lg shadow-amber-100/60 p-4 relative overflow-hidden">
          {/* glow blob */}

          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-100/50 blur-2xl" />

          <div className="flex items-center gap-4 relative">
            <button onClick={() => router.back()}>
              <IoArrowBackSharp className="text-amber-900 text-2xl" />
            </button>
            <SafetyRing percent={100} />

            <div className="flex-1">
              {/* badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-amber-900 mb-2"
                style={{
                  background: "linear-gradient(135deg, #F0D080, #C9A84C)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M5 1L6.2 3.5L9 3.9L7 5.8L7.5 8.5L5 7.2L2.5 8.5L3 5.8L1 3.9L3.8 3.5L5 1Z"
                    fill="#3D2800"
                  />
                </svg>
                HIGH PROTECTION
              </div>

              <p
                className="text-sm font-semibold text-stone-800 mb-1.5"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Account Safety Score
              </p>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} filled={i <= 5} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Section: Account ── */}
        <div>
          <p
            className="text-[10px] tracking-[2.5px] text-amber-700/70 uppercase mb-2.5 pl-1"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Account Settings
          </p>
          <div className="space-y-2.5">
            <MenuItem
              href="/my-account"
              icon={<ProfileIcon />}
              iconBg="bg-gradient-to-br from-amber-50 to-amber-100"
              title="Personal Information"
              subtitle="Complete your profile details"
              delay="0ms"
            />
            <MenuItem
              href="/security/password"
              icon={<LockIcon />}
              iconBg="bg-gradient-to-br from-emerald-50 to-emerald-100"
              title="Login Password"
              subtitle="Letter & number combination"
              delay="60ms"
            />
            <MenuItem
              href="/security/withdraw-password"
              icon={<PaymentLockIcon />}
              iconBg="bg-gradient-to-br from-blue-50 to-blue-100"
              title="Withdraw Password"
              subtitle="Secure your transactions"
              delay="120ms"
            />
          </div>
        </div>

        {/* ── Section: Session ── */}
        <div>
          <p
            className="text-[10px] tracking-[2.5px] text-amber-700/70 uppercase mb-2.5 pl-1"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Session
          </p>
          <MenuItem
            icon={<PowerIcon />}
            iconBg="bg-gradient-to-br from-red-50 to-red-100"
            title="Logout"
            subtitle="Exit your session safely"
            onClick={handleLogout}
            danger
            delay="180ms"
          />
        </div>
      </div>

      {pending && <SpinLoader />}
    </div>
  );
};

export default Security;
