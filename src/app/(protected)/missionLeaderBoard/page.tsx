"use client";
import React from "react";
import Image from "next/image";
import {  FaTrophy,  } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useGetLeaderboardQuery } from "@/lib/features/missionsApiSlice";
import { formatNumber } from "@/lib/utils";

import top1Badge from "@/../public/mission/leaderboard/winnum-1.png";
import top2Badge from "@/../public/mission/leaderboard/winnum-2.png";
import top3Badge from "@/../public/mission/leaderboard/winnum-3.png";

import top1Gift from "@/../public/mission/leaderboard/top-1-gift-icon.png";
import top2Gift from "@/../public/mission/leaderboard/top-2-gift-icon.png";
import top3Gift from "@/../public/mission/leaderboard/top-3-gift-icon.png";
import profileShadow from "@/../public/mission/leaderboard/top1-shadow-bg.png";

import BonusTootip from "./bonus-tooltip";
import LeaderCard from "./leader-card";
import { MdOutlineArrowBackIos } from "react-icons/md";

const LeaderboardPage = () => {
  const router = useRouter();
  const { data, isLoading } = useGetLeaderboardQuery();
  const leaderboard = data?.leaderboard;

  const rank1 = leaderboard?.find((lb) => lb.rank == 1);
  const rank2 = leaderboard?.find((lb) => lb.rank == 2);
  const rank3 = leaderboard?.find((lb) => lb.rank == 3);

  const othersLeaderBoard = leaderboard?.filter((lb) => lb.rank > 3);

  return (
    <div className="h-screen bg-teal-50 relative">
      {/* Header */}
      {leaderboard && (
        <div className="relative px-4 leadeboard-header-bg h-[450px] flex justify-center items-center">
          <div className="flex items-end gap-3">
            <NormalRank
              rank={2}
              bonus={rank2?.bonus}
              validBet={rank2?.validBet}
              userName={rank2.name}
            />
            <Top1Rank
              bonus={rank1?.bonus}
              validBet={rank1?.validBet}
              userName={rank1?.name}
            />
            <NormalRank
              rank={3}
              bonus={rank3?.bonus}
              validBet={rank3?.validBet}
              userName={rank3?.name}
            />
          </div>

          <BonusTootip bonus={rank1?.bonus}>
            <div className="left-1/2 -translate-x-1/2 absolute w-max top-[380px] cursor-pointer">
              <Image src={top1Gift} alt="Top1" className="w-16 " />
            </div>
          </BonusTootip>

          <BonusTootip bonus={rank2?.bonus}>
            <div className="left-[10%] absolute w-max top-[350px] cursor-pointer">
              <Image src={top2Gift} alt="Top2" className="w-[55px] " />
            </div>
          </BonusTootip>

          <BonusTootip bonus={rank3?.bonus}>
            <div className="right-[10%] absolute w-max top-[350px] cursor-pointer">
              <Image src={top3Gift} alt="Top3" className="w-[55px] " />
            </div>
          </BonusTootip>
        </div>
      )}

      <header className="top-0 left-0 fixed py-4 px-6   z-[1000000] flex items-center gap-36">
        <button onClick={() => router.back()}>
          <MdOutlineArrowBackIos className="text-[#D4AF37]" />
        </button>

        <h3 className="text-lg text-[#f3d53d] font-semibold">Leaderboard</h3>
      </header>

      {/* Leaderboard list */}
      <div className="relative  px-4 space-y-3 ">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#D4AF37] border-t-transparent" />
          </div>
        ) : !data?.isMissionActive ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <FaTrophy className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60 text-sm">No active mission today</p>
          </div>
        ) : (
          othersLeaderBoard.map((entry) => (
            <div
              key={entry.rank}
              // className={`bg-gradient-to-r ${getRankBg(entry.rank)} border rounded-2xl p-4 flex items-center gap-4`}
            >
              <LeaderCard
                bonus={entry.bonus}
                validBet={entry.validBet}
                name={entry.name}
                rank={entry.rank}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;

const Top1Rank = ({
  userName,
  validBet,
}: {
  userName: string;
  validBet: number;
  bonus: number;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="w-[180px] relative ">
        <Image
          src={profileShadow}
          alt="User"
          className="w-[180px] select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />

        <Image
          src={top1Badge}
          alt="User"
          className="w-[130px] z-10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />

        <img
          src={
            "https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
          }
          className="w-[90px] border-[3px] border-white aspect-square rounded-full select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] "
        />
      </div>
      <div className="flex flex-col justify-center mt-12">
        <h4 className="text-white text-lg text-center font-semibold">
          {userName.slice(3)}****
        </h4>
        <div className="text-center">
          <p className="text-sm text-white">Valid bet</p>
          <p className="text-base font-semibold text-white">
            {" "}
            {formatNumber(validBet)}
          </p>
        </div>
      </div>
    </div>
  );
};

const NormalRank = ({
  userName,
  validBet,
  rank,
}: {
  userName: string;
  validBet: number;
  bonus: number;
  rank: number;
}) => {
  if (![2, 3].includes(rank)) {
    return null;
  }

  return (
    <div className="flex flex-col ">
      <div className="relative w-[80px] ">
        <img
          src={
            "https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
          }
          className="w-[80px] border-[3px] border-white aspect-square rounded-full select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] "
        />
        <Image
          src={rank == 2 ? top2Badge : top3Badge}
          alt="User"
          className={`w-[52px] select-none absolute -bottom-8 ${rank == 2 ? "-right-5" : "-left-5"}`}
        />
      </div>
      <div className="flex flex-col justify-center mt-8">
        <h4 className="text-white text-lg text-center font-semibold">
          {userName.slice(3)}****
        </h4>
        <div className="text-center">
          <p className="text-sm text-white">Valid bet</p>
          <p className="text-base font-semibold text-white">
            {formatNumber(validBet)}
          </p>
        </div>
      </div>
    </div>
  );
};
