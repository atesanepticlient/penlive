"use client";

import Header from "@/components/Header";
import SideNavLayout from "@/components/SideNavLayout";
import TabLayout from "@/components/TabLayout";
import useCurrentUser from "@/hook/useCurrentUser";
import {
  useCliamDailyCheckMutation,
  useFetchprotionsDataQuery,
} from "@/lib/features/promotionsSlice";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { FaCalendarCheck } from "react-icons/fa";
import { SiWondersharefilmora } from "react-icons/si";
import { RiGiftFill, RiGift2Fill } from "react-icons/ri";
import { IoGameController } from "react-icons/io5";
import { GiMoneyStack } from "react-icons/gi";
import { useNotificationBadge } from "@/lib/store.zustond";

export default function PromoPlatform() {
  const user = useCurrentUser();

  const {
    data: promotionsData,

    isLoading,
  } = useFetchprotionsDataQuery();

  const dailyChecking = promotionsData?.dailyCheck;
  const badge = useNotificationBadge((state) => state.badge);

  const dailyCheckInNotification = badge.dailyCheckinCount || 0;

  const data = useMemo(
    () => [
      {
        title: "Airdrop",
        desc: "Claim 555tk free bet",
        type: "claim",
        icon: <GiMoneyStack />,
        redirect: "/airdrop/k9x2a8bz",
        accent: "#c084fc",
        notification: !!badge.airDropCount,
      },
      {
        title: "Invite Friend",
        desc: "Earn 100tk for every friend",
        type: "invite",
        icon: <SiWondersharefilmora />,
        redirect: "/invite-friends",
        accent: "#34d399",
        notification: !!badge.achivementRewardsCount,
      },
      {
        title: "Registration Bonus",
        desc: `${user ? "Claimed" : "Claim"}`,
        type: `${user ? "claimed" : "claim"}`,
        icon: <RiGiftFill />,
        accent: "#fbbf24",
      },
      {
        title: "Sign In Bonus",
        desc: "Claim 50tk free bet",
        type: "claim",
        icon: <RiGift2Fill />,
        redirect: "/activity/signin",
        accent: "#60a5fa",
        notification: !!badge.siginBonueCount,
      },
      {
        title: "Free Bet",
        desc: "Receive 100tk free bet",
        type: "bet",
        icon: <IoGameController />,
        redirect: "/",
        accent: "#f472b6",
      },
    ],
    [badge],
  );

  return (
    <>
      <SideNavLayout>
        <TabLayout>
          <Header />

          {(!user || !isLoading) && (
            <div className="h-[94vh] bg-[#07060f]  px-4 py-6 text-white">
              <h1
                className="text-center text-3xl font-semibold mb-6"
                style={{
                  background:
                    "linear-gradient(180deg, #FFF3B0 0%, #FACC15 50%, #B45309 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",

                  textShadow: `
      0 2px 6px rgba(255, 200, 0, 0.4),
      0 0 12px rgba(255, 180, 0, 0.25)
    `,
                }}
              >
                Bonuses & Promotions
              </h1>

              <div className="max-w-xl mx-auto space-y-3">
                <DailyCheckCard
                  dailyChecking={dailyChecking}
                  notification={!!dailyCheckInNotification}
                />
                {data.map((item, i) => (
                  <Card key={i} item={item} />
                ))}
              </div>
            </div>
          )}

          {user && isLoading && <PromotionsSkeleton />}
        </TabLayout>
      </SideNavLayout>
    </>
  );
}

const Card = ({ item }: any) => {
  console.log({ item });
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl relative"
      style={{
        background: `linear-gradient(90deg,${item.accent}18,${item.accent}08)`,
        border: `1px solid ${item.accent + "30"}`,
      }}
    >
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
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg,${item.accent}25,${item.accent}10)`,
            border: `1px solid ${item.accent + "40"}`,
            color: `${item.accent}`,
            transition: "all .2s",
            boxShadow: `0 0 12px ${item.accent}50`,
            // transform: isHov ? "scale(1.08)" : "scale(1)",
          }}
        >
          {item.icon}
        </div>

        <div>
          <p
            className="text-[14px] font-semibold text-white"
            style={{ letterSpacing: 0.2 }}
          >
            {item.title}
          </p>
          <p className="text-[12px] text-gray-400">{item.desc}</p>
        </div>
      </div>

      <Link href={item?.redirect || "/"}>
        <Button type={item.type} notification={item.notification} />
      </Link>
    </div>
  );
};

const Button = ({
  type,
  notification,
}: {
  type: string;
  notification?: boolean;
}) => {
  if (type === "claim") {
    return (
      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 30,
          height: 18,
          borderRadius: 99,
          padding: "16px 15px",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: 0.5,
          background: `linear-gradient(135deg,#7c3aed,#4f46e5)`,
          color: "#fff",
          textTransform: "uppercase",
          position: "relative",
          //   boxShadow: isNum ? "0 0 8px rgba(239,68,68,0.6)" : "none",
        }}
      >
        Claim
        {notification && (
          <span
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 0 2px #0d0d0d", // match your page background
              display: "block",
            }}
          />
        )}
      </button>
    );
  }

  if (type === "invite" || type == "bet") {
    return (
      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 30,
          height: 18,
          borderRadius: 99,
          padding: "16px 15px",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: 0.5,
          background: `linear-gradient(135deg,#f97316,#ef4444)`,
          color: "#fff",
          textTransform: "uppercase",
          position: "relative",
          //   boxShadow: isNum ? "0 0 8px rgba(239,68,68,0.6)" : "none",
        }}
      >
        {type}
        {notification && (
          <span
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 0 2px #0d0d0d", // match your page background
              display: "block",
            }}
          />
        )}
      </button>
    );
  }

  if (type === "claimed") {
    return (
      <button
        style={{
          height: 34,
          padding: "0 18px",
          borderRadius: 10,
          fontSize: 14,
          color: "#999",

          background: "linear-gradient(180deg, #3A3A3A, #1F1F1F)",
          border: "1px solid #555",
        }}
      >
        Claimed
      </button>
    );
  }

  return null;
};

function DailyCheckCard({ dailyChecking, notification }: any) {
  const user = useCurrentUser();
  const [lastChecked, setLastChecked] = useState(dailyChecking?.lastChecked);
  const [claimed, setClaimed] = useState(false);
  const [reward, setReward] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const [dailyCheckinApi, { isLoading }] = useCliamDailyCheckMutation();

  // ⏳ Calculate remaining time
  const calculateTimeLeft = () => {
    if (!lastChecked) return null;

    const last = new Date(lastChecked).getTime();
    const next = last + 24 * 60 * 60 * 1000;
    const now = Date.now();

    const diff = next - now;

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // ⏱ Timer update
  useEffect(() => {
    const update = () => {
      const remaining = calculateTimeLeft();

      if (remaining) {
        setClaimed(true);
        setTimeLeft(remaining);
      } else {
        setClaimed(false);
        setTimeLeft("");
      }
    };

    update();
    const interval = setInterval(update, 1000); // update every 1 min

    return () => clearInterval(interval);
  }, [lastChecked]);

  const handleClaim = async () => {
    if (!user || !dailyChecking) redirect("/login");

    if (claimed) return;

    if (lastChecked && dailyChecking.noDeposit) redirect("/deposit");

    try {
      const res = await dailyCheckinApi().unwrap();
      setClaimed(true);
      setReward(res.payload.price);
      setLastChecked(res.payload.lastChecked);

      const audio = new Audio("/sounds/reward.mp3");
      audio.volume = 0.6;
      audio.play();

      // 🔊 Sound
      setTimeout(() => setReward(null), 1500);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl relative"
      style={{
        background: `linear-gradient(90deg,#a78bfa18,#a78bfa08)`,
        border: `1px solid #a78bfa30`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          bottom: "20%",
          width: 3,
          borderRadius: "0 3px 3px 0",
          background: `linear-gradient(180deg,transparent,#a78bfa,transparent)`,
          boxShadow: `0 0 10px #a78bfa`,
        }}
      />

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg,#a78bfa25,#a78bfa10)",
            border: `1px solid #a78bfa40`,
            color: `#a78bfa`,
            transition: "all .2s",
            boxShadow: `0 0 12px #a78bfa50`,
            // transform: isHov ? "scale(1.08)" : "scale(1)",
          }}
        >
          <FaCalendarCheck />
        </div>

        <div>
          <p
            style={{ letterSpacing: 0.2 }}
            className="text-white font-semibold text-[14px]"
          >
            Daily Check-in
          </p>

          {/* ⏳ Dynamic text */}
          {claimed ? (
            <p className="text-gray-400 text-[12px]">
              Next reward in <strong>{timeLeft}</strong>
            </p>
          ) : (
            <p className="text-gray-400 text-sm">Claim your daily reward</p>
          )}
        </div>
      </div>

      {/* BUTTON */}
      <div className="relative">
        <button
          onClick={handleClaim}
          disabled={claimed || isLoading}
          className="h-[34px] px-4 rounded-[50px] text-sm font-bold transition-all uppercase relative"
          style={{
            color: isLoading ? "#777" : claimed ? "#999" : "#fff",

            background: isLoading
              ? "linear-gradient(180deg, #2C2C2C, #121212)"
              : claimed
                ? "linear-gradient(180deg, #3A3A3A, #1F1F1F)"
                : "linear-gradient(135deg,#7c3aed,#4f46e5)",

            border: isLoading
              ? "1px solid #444"
              : claimed
                ? "1px solid #555"
                : "none",

            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Claiming" : claimed ? "Claimed" : "Claim"}

          {notification && (
            <span
              style={{
                position: "absolute",
                top: -3,
                right: -3,
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 0 2px #0d0d0d", // match your page background
                display: "block",
              }}
            />
          )}
        </button>

        {/* 💰 Reward animation */}
        {reward && (
          <span className="absolute left-1/2 top-1/2 text-yellow-400 font-bold text-lg pointer-events-none animate-reward">
            ৳{reward}
          </span>
        )}
      </div>
    </div>
  );
}

function PromotionsSkeleton() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 mx-auto">
      {/* Header Title Placeholder */}
      <div className="flex justify-center mb-8">
        <div className="h-8 w-48 bg-zinc-800 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
      </div>

      {/* List of Bonus Items */}
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <BonusSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
const BonusSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-4 mb-3 border border-zinc-800 rounded-xl bg-zinc-900/50 animate-pulse">
      <div className="flex items-center gap-4">
        {/* Icon Placeholder */}
        <div className="w-10 h-10 rounded-lg bg-zinc-700" />

        {/* Text Placeholders */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-zinc-700 rounded" />
          <div className="h-3 w-24 bg-zinc-800 rounded" />
        </div>
      </div>

      {/* Button Placeholder */}
      <div className="h-9 w-20 bg-zinc-700 rounded-lg" />
    </div>
  );
};
