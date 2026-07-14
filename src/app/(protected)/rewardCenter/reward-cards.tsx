"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

import invitaionBg from "@/../public/bonus-cards/invitation-bonus-icon.png";
import signinBg from "@/../public/bonus-cards/signin-bonus-icon.png";
import recvingBg from "@/../public/bonus-cards/bonus-icon.png";
import promoBg from "@/../public/bonus-cards/promo-icon.png";

import { useNotificationBadge } from "@/lib/store.zustond";

const RewardCards = () => {
  const badge = useNotificationBadge((state) => state.badge);

  // 🎯 Prepare counts safely
  const bonusCount = badge?.bonusReceivingRewardCount || 0;
  const signinCount = badge?.siginBonueCount || 0;
  const inviteCount = badge?.achivementRewardsCount || 0;

  // 🎯 Cards config
  const cards = useMemo(
    () => [
      {
        name: "Bonus",
        href: "/receivingCenter",
        bgClass: "bonus-reciving-bg",
        image: recvingBg,
        count: bonusCount,
      },
      {
        name: "Signin",
        href: "/activity/signin",
        bgClass: "signin-bonus-bg",
        image: signinBg,
        count: signinCount,
      },
      {
        name: "Invite Friends",
        href: "/invite-friends",
        bgClass: "invitaion-bonus-bg",
        image: invitaionBg,
        count: inviteCount,
      },
      {
        name: "Promo Code",
        href: "/promoCode",
        bgClass: "promo-bg",
        image: promoBg,
        count: 0,
      },
    ],
    [bonusCount, signinCount, inviteCount],
  );

  return (
    <div className="grid grid-cols-2 gap-3 mt-10">
      {cards.map((card, index) => (
        <Link
          key={index}
          href={card.href}
          className={`${card.bgClass} flex justify-center items-center w-full h-[160px] rounded-xl relative`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center w-[60px] h-[60px] mx-auto rounded-full bg-white">
              <Image
                src={card.image}
                alt={card.name}
                className="w-[30px]"
                placeholder="blur"
              />
            </div>

            <span className="text-white text-sm font-medium block text-center">
              {card.name}
            </span>
          </div>

          {/* 🔔 Badge */}
          {card.count > 0 && (
            <span className="absolute top-[2.8rem] left-[7.5rem] notification-badge !shadow-none">
              {card.count}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
};

export default RewardCards;
