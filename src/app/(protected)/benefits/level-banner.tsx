"use client";
import { vipLevelBadgeFinder } from "@/lib/image";
import Image from "next/image";
import React, { useState } from "react";
import { IoArrowRedoSharp } from "react-icons/io5";
import LevelProgressModal from "./level-progress-modal";
import { useFetchVipLevelQuery } from "@/lib/features/vipApiSlice";
const LevelBanner = () => {
  const [progressModal, setProgressModal] = useState(false);
  const vipLevel = 0;
  const { image: vipBadge } = vipLevelBadgeFinder(vipLevel);

  const { data, isLoading } = useFetchVipLevelQuery();
  console.log({ data });
  const currentLevel = data?.payload?.level;
  const levelProgress = data?.payload?.progress;
  return (
    <div className="w-full h-[100px] vip-level-banner rounded-[30px] ">
      {data && !isLoading && (
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3 pl-6">
            <Image
              src={vipBadge}
              alt="VIP Level"
              className="w-[80px] -translate-y-2"
            />
            <span className="text-[#333] text-3xl font-extrabold">
              VIP {currentLevel.level}
            </span>
          </div>

          <button
            onClick={() => setProgressModal(true)}
            className=" flex items-center gap-2
        /* Shape & Sizing */
        min-w-[120px] 
        h-[40px] 
        px-6 
        rounded-s-full 
        /* Gradient Background - Exact Match */
        bg-white
        
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)]
        
        /* Typography */
        font-bold 
        text-[14px] 
        text-[#555555] 
        
        /* Smooth Interaction */
        transition-all 
        duration-200 
        ease-in-out
        hover:from-[#ffffff]
      
      "
          >
            Upgrade <IoArrowRedoSharp />
          </button>

          <LevelProgressModal
            show={progressModal}
            onClose={() => setProgressModal(false)}
            data={{
              level: currentLevel.level,
              progress: {
                totalDeposit: levelProgress.totalDeposit,
                totalBet: levelProgress.totalBet,
              },
              nextLevelReq: {
                totalDeposit: currentLevel.nextLevelRequirements.totalDeposit,
                totalBet: currentLevel.nextLevelRequirements.totalBet,
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default LevelBanner;
