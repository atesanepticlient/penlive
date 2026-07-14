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
import { useState,  useEffect } from "react";
import toast from "react-hot-toast";
const data = [
  {
    title: "Airdrop",
    desc: "Claim 555tk free bet",
    type: "claim",
    icon: "🎁",
    redirect: "/airdrop/k9x2a8bz",
  },
  {
    title: "Invite Friend",
    desc: "Earn 100tk for every friend",
    type: "invite",
    icon: "🤝",
    redirect: "/invite-friends",
  },
  { title: "Registration Bonus", desc: "Claimed", type: "claimed", icon: "🎉" },
  {
    title: "Sign In Bonus",
    desc: "Claim 50tk free bet",
    type: "claim",
    icon: "🪙",
    redirect: "/activity/signin",
  },
  {
    title: "Free Bet",
    desc: "Receive 100tk free bet",
    type: "bet",
    icon: "⚽",
    redirect: "/",
  },
];

export default function PromoGolden() {
  const user = useCurrentUser();

  const {
    data: promotionsData,
    isLoading,
  } = useFetchprotionsDataQuery();

  const dailyChecking = promotionsData?.dailyCheck;

  return (
    <>
      <SideNavLayout>
        <TabLayout>
          <Header />

          {(!user || !isLoading) && (
            <div className="h-[94vh] platform-bg  px-4 py-6 text-white">
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
                <DailyCheckCard dailyChecking={dailyChecking} />
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
        background: "linear-gradient(180deg, #1A1A1A 0%, #0E0E0E 100%)",
        border: "1px solid rgba(255, 170, 50, 0.25)",
        boxShadow: `
          0 0 10px rgba(255,140,0,0.2),
          inset 0 1px 2px rgba(255,255,255,0.05)
        `,
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "#121212",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
            fontSize: 22,
          }}
        >
          {item.icon}
        </div>

        <div>
          <p className="text-[16px] font-semibold text-white">{item.title}</p>
          <p className="text-[13px] text-gray-400">{item.desc}</p>
        </div>
      </div>

      <Link href={item?.redirect || "/"}>
        <Button type={item.type} />
      </Link>
    </div>
  );
};

const Button = ({ type }: { type: string }) => {
  if (type === "claim") {
    return (
      <button
        style={{
          height: 34,
          padding: "0 18px",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 700,
          color: "#2B1A00",

          background:
            "linear-gradient(180deg, #FFF3B0 0%, #FACC15 45%, #D97706 100%)",

          border: "1px solid #FACC15",

          boxShadow: `
            inset 0 2px 3px rgba(255,255,255,0.6),
            inset 0 -2px 3px rgba(0,0,0,0.2),
            0 4px 12px rgba(255,180,0,0.5)
          `,
        }}
      >
        Claim
      </button>
    );
  }

  if (type === "invite") {
    return (
      <button
        style={{
          height: 34,
          padding: "0 18px",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          color: "#FACC15",

          background: "linear-gradient(180deg, #2B2B2B 0%, #121212 100%)",

          border: "1px solid #444",

          boxShadow: `
            inset 0 1px 2px rgba(255,255,255,0.1),
            0 4px 10px rgba(0,0,0,0.6)
          `,
        }}
      >
        Invite
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

  if (type === "bet") {
    return (
      <button
        style={{
          height: 34,
          padding: "0 18px",
          borderRadius: 10,
          fontSize: 14,
          color: "#fff",

          background: "linear-gradient(180deg, #3B82F6 0%, #1E3A8A 100%)",

          boxShadow: "0 4px 12px rgba(59,130,246,0.6)",
        }}
      >
        Bet
      </button>
    );
  }

  return null;
};

function DailyCheckCard({ dailyChecking }: any) {
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
        background: "linear-gradient(180deg, #1A1A1A 0%, #0E0E0E 100%)",
        border: "1px solid rgba(255, 170, 50, 0.25)",
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="w-[42px] h-[42px] rounded-xl bg-[#121212] flex items-center justify-center text-xl">
          📅
        </div>

        <div>
          <p className="text-white font-semibold">Daily Check-in</p>

          {/* ⏳ Dynamic text */}
          {claimed ? (
            <p className="text-gray-400 text-sm">
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
          className="h-[34px] px-4 rounded-[10px] text-sm font-bold transition-all"
          style={{
            color: isLoading ? "#777" : claimed ? "#999" : "#2B1A00",

            background: isLoading
              ? "linear-gradient(180deg, #2C2C2C, #121212)"
              : claimed
                ? "linear-gradient(180deg, #3A3A3A, #1F1F1F)"
                : "linear-gradient(180deg, #FFF3B0 0%, #FACC15 45%, #D97706 100%)",

            border: isLoading
              ? "1px solid #444"
              : claimed
                ? "1px solid #555"
                : "1px solid #FACC15",

            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Claiming" : claimed ? "Claimed" : "Claim"}
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
