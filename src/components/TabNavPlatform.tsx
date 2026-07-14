"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotificationBadge } from "@/lib/store.zustond";

// ─── SVG Icons (from HTML nav) ────────────────────────────────────────────

const HomeIcon = () => (
  <svg
    className="tab-svg"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
  >
    <path
      d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
      fill="url(#homeGrad)"
      stroke="rgba(255,215,0,0.4)"
      strokeWidth="0.5"
    />
    <defs>
      <linearGradient id="homeGrad" x1="3" y1="3" x2="21" y2="21">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
    </defs>
  </svg>
);

const PromoIcon = () => (
  <svg
    className="tab-svg"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
  >
    <rect
      x="3"
      y="6"
      width="18"
      height="13"
      rx="2"
      fill="url(#promoGrad)"
      opacity="0.9"
    />
    <path d="M3 10H21" stroke="rgba(255,215,0,0.5)" strokeWidth="1" />
    <circle cx="8" cy="14" r="2" fill="white" opacity="0.8" />
    <path
      d="M14 13H18M14 15.5H17"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.8"
    />
    <path
      d="M7 6V4M12 6V3M17 6V4"
      stroke="rgba(255,100,0,0.8)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="promoGrad" x1="3" y1="6" x2="21" y2="19">
        <stop offset="0%" stopColor="#FF003C" />
        <stop offset="100%" stopColor="#FF6B00" />
      </linearGradient>
    </defs>
  </svg>
);

const InviteIcon = () => (
  <svg
    className="tab-svg"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
  >
    <circle cx="9" cy="7" r="3" fill="white" opacity="0.9" />
    <path
      d="M3 19C3 16.24 5.69 14 9 14"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.9"
    />
    <circle cx="17" cy="12" r="2" fill="white" opacity="0.7" />
    <path
      d="M14 19C14 17.34 15.34 16 17 16C18.66 16 20 17.34 20 19"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.7"
    />
    <path
      d="M15 7L21 7M18 4L21 7L18 10"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.85"
    />
  </svg>
);

const RewardIcon = () => (
  <svg
    className="tab-svg"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
  >
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill="url(#rewardGrad)"
      stroke="rgba(255,215,0,0.3)"
      strokeWidth="0.5"
    />
    <defs>
      <linearGradient id="rewardGrad" x1="2" y1="2" x2="22" y2="22">
        <stop offset="0%" stopColor="#FFE97A" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
  </svg>
);

const MemberIcon = () => (
  <svg
    className="tab-svg"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
  >
    <circle cx="12" cy="8" r="4" fill="url(#memberGrad)" opacity="0.9" />
    <path
      d="M5 20C5 16.69 8.13 14 12 14C15.87 14 19 16.69 19 20"
      stroke="url(#memberGrad2)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 5.5L9.5 3L12 5L14.5 3L16 5.5"
      stroke="#FFD700"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.7"
    />
    <defs>
      <linearGradient id="memberGrad" x1="8" y1="4" x2="16" y2="12">
        <stop offset="0%" stopColor="#C0A0FF" />
        <stop offset="100%" stopColor="#8040FF" />
      </linearGradient>
      <linearGradient id="memberGrad2" x1="5" y1="14" x2="19" y2="20">
        <stop offset="0%" stopColor="#C0A0FF" />
        <stop offset="100%" stopColor="#8040FF" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── Component ─────────────────────────────────────────────────────────────

const TabNav = () => {
  const path = usePathname();

  const badge = useNotificationBadge((state) => state.badge);

  // 🎯 Calculate badge counts
  const rewardBadge =
    (badge?.bonusReceivingRewardCount || 0) +
    (badge?.siginBonueCount || 0) +
    (badge?.achivementRewardsCount || 0);

  const promoBadge =
    (badge?.dailyCheckinCount || 0) + (badge?.airDropCount || 0);

  // 🎯 Tabs config
  const tabs = useMemo(
    () => [
      {
        name: "হোম",
        href: "/",
        icon: HomeIcon,
        badge: 0,
      },
      {
        name: "প্রমোশন",
        href: "/promotions",
        icon: PromoIcon,
        badge: promoBadge,
      },
      {
        name: "আমন্ত্রণ",
        href: "/invite-friends",
        icon: InviteIcon,
        isCenter: true,
      },
      {
        name: "পুরস্কার",
        href: "/rewardCenter",
        icon: RewardIcon,
        badge: rewardBadge,
      },
      {
        name: "সদস্য",
        href: "/member",
        icon: MemberIcon,
        badge: 0,
      },
    ],
    [promoBadge, rewardBadge],
  );

  return (
    <>
      <style>{`
        .tab-bar-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
   
       
          background: linear-gradient(180deg, rgba(10,8,20,0.97), rgba(7,5,16,0.99));
          border-top: 1px solid rgba(255,215,0,0.25);
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 8px 0 10px;
          z-index: 200;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 -4px 30px rgba(0,0,0,0.6), 0 -1px 0 rgba(255,215,0,0.1);
        }

        .tab-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          flex: 1;
          transition: all 0.2s;
          position: relative;
          padding: 4px 0;
          text-decoration: none;
        }
        .tab-nav-item:active { transform: scale(0.9); }

        /* Active top-line indicator */
        .tab-nav-item.is-active::before {
          content: '';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 3px;
          border-radius: 0 0 3px 3px;
          background: linear-gradient(90deg, #FFD700, #FF8C00);
          box-shadow: 0 0 10px rgba(255,215,0,0.6);
        }

        .tab-nav-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s;
        }
        .tab-nav-item.is-active .tab-nav-icon-wrap {
          background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.1));
          box-shadow: 0 0 20px rgba(255,215,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .tab-nav-label {
          font-family: 'Noto Sans Bengali', sans-serif;
          font-size: 9.5px;
          font-weight: 600;
          color: rgba(180,160,220,0.6);
          transition: all 0.2s;
          line-height: 1;
        }
        .tab-nav-item.is-active .tab-nav-label {
          color: #FFD700;
          text-shadow: 0 0 8px rgba(255,215,0,0.6);
        }

        /* Center tab */
        .tab-nav-item.is-center::before { display: none; }
        .tab-nav-item.is-center .tab-nav-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFD700, #FF8C00, #FF4500);
          box-shadow: 0 0 25px rgba(255,150,0,0.7), 0 0 50px rgba(255,100,0,0.3), inset 0 2px 0 rgba(255,255,255,0.3);
          margin-top: -14px;
          border: 2px solid rgba(255,215,0,0.4);
        }
        .tab-nav-item.is-center:active .tab-nav-icon-wrap { transform: scale(0.9); }
        .tab-nav-item.is-center .tab-nav-label {
          color: #FFD700;
          text-shadow: 0 0 8px rgba(255,215,0,0.6);
        }

        /* Badge */
        .tab-nav-badge {
          position: absolute;
          top: 0;
          right: -6px;
          background: #FF003C;
          color: white;
          font-size: 9px;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          box-shadow: 0 0 8px rgba(255,0,60,0.7);
          line-height: 1;
        }
      `}</style>

      <nav
        className="tab-bar-nav w-full md:w-[480px] mx-auto
      "
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = path === tab.href;

          // ⭐ Center tab (Invite)
          if (tab.isCenter) {
            return (
              <Link
                key={index}
                href={tab.href}
                className="tab-nav-item is-center"
              >
                <div className="tab-nav-icon-wrap">
                  <Icon />
                </div>
                <span className="tab-nav-label">{tab.name}</span>
              </Link>
            );
          }

          // ⭐ Normal tabs
          return (
            <Link
              key={index}
              href={tab.href}
              className={`tab-nav-item${isActive ? " is-active" : ""}`}
            >
              <div className="tab-nav-icon-wrap">
                <div style={{ position: "relative" }}>
                  <Icon />
                  {/* 🔔 Badge */}
                  {tab.badge > 0 && (
                    <span className="tab-nav-badge">{tab.badge}</span>
                  )}
                </div>
              </div>
              <span className="tab-nav-label">{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default TabNav;
