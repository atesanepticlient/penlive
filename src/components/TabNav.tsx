"use client";

import React, { useMemo } from "react";
import { TfiHome } from "react-icons/tfi";
import { TbGiftCard } from "react-icons/tb";
import Link from "next/link";
import { BiAward } from "react-icons/bi";
import { GiCutDiamond } from "react-icons/gi";
import { usePathname } from "next/navigation";
import { HiGiftTop } from "react-icons/hi2";
import { useNotificationBadge } from "@/lib/store.zustond";

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
        name: "Home",
        href: "/",
        icon: TfiHome,
        badge: 0,
      },
      {
        name: "Promo",
        href: "/promotions",
        icon: HiGiftTop,
        badge: promoBadge,
      },
      {
        name: "Invite",
        href: "/invite-friends",
        icon: TbGiftCard,
        isCenter: true,
      },
      {
        name: "Reward",
        href: "/rewardCenter",
        icon: BiAward,
        badge: rewardBadge,
      },
      {
        name: "Member",
        href: "/member",
        icon: GiCutDiamond,
        badge: 0,
      },
    ],
    [promoBadge, rewardBadge],
  );

  // 🎨 Colors
  const GOLD_DULL = "#B8860B";
  const GOLD_BRIGHT = "#FFD700";
  const BLACK_GRADIENT = "linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%)";

  return (
    <div className="fixed bottom-[5px] left-0 w-full md:w-[500px] md:mx-auto md:left-1/2 md:-translate-x-1/2 z-[999] px-2">
      <div
        className="flex items-center justify-between py-1 px-2 border-t-[1px]"
        style={{
          height: 60,
          background: BLACK_GRADIENT,
          boxShadow:
            "0px 10px 30px rgba(0, 0, 0, 0.5), inset 0px 1px 1px rgba(212, 175, 55, 0.3)",
          borderRadius: 20,
          borderColor: "rgba(212, 175, 55, 0.4)",
        }}
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = path === tab.href;

          // ⭐ Center Button (Invite)
          if (tab.isCenter) {
            return (
              <div key={index} className="flex-1 -mt-8">
                <Link
                  href={tab.href}
                  className="flex flex-col items-center justify-center w-full"
                >
                  <div
                    className="flex items-center justify-center rounded-full shadow-lg border-2 border-[#D4AF37]"
                    style={{
                      width: 50,
                      height: 50,
                      background: "linear-gradient(145deg, #FFD700, #B8860B)",
                      boxShadow: "0px 4px 15px rgba(184, 134, 11, 0.4)",
                    }}
                  >
                    <Icon size={28} className="text-black" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-bold mt-1 text-[#FFD700]">
                    {tab.name}
                  </p>
                </Link>
              </div>
            );
          }

          // ⭐ Normal Tabs
          return (
            <div key={index} className="flex-1 relative">
              <Link
                href={tab.href}
                className={`flex flex-col items-center justify-center transition-all duration-300 w-full ${
                  isActive ? "scale-110" : "opacity-70"
                }`}
                style={{
                  color: isActive ? GOLD_BRIGHT : GOLD_DULL,
                }}
              >
                {/* Icon */}
                <div className="relative">
                  <Icon size={22} className="mx-auto" />

                  {/* 🔔 Badge */}
                  {tab.badge > 0 && (
                    <span className="notification-badge absolute top-0 -right-5">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <p className="text-[10px] uppercase tracking-widest font-semibold mt-1">
                  {tab.name}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TabNav;
