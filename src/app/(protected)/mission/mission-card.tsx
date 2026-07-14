"use client";
import React, { useState } from "react";

import { Mission } from "@/lib/features/missionsApiSlice";

import MissionHeader from "./mission-header";
import MilestoneCard from "./milestone-card";
import { Tab } from "./page";
import Image from "next/image";
import fireIcon from "@/../public/mission/main/fire.png";
// const ClaimingLoader = () => (
//   <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
//     <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#D4AF37] border-t-transparent" />
//   </div>
// );

const MissionCard = ({
  mission,
  tab,
}: {
  mission: Mission;
  onClaimed: () => void;
  tab: Tab;
}) => {
  // const [claimMilestone] = useClaimMilestoneMutation();

  const currentValidBet = mission.userProgress?.currentValidBet ?? 0;

  // const handleClaim = async (milestoneId: string) => {
  //   setClaimingId(milestoneId);
  //   try {
  //     await claimMilestone(milestoneId).unwrap();
  //     toast.success("Reward claimed!");
  //     onClaimed();
  //   } catch (err: any) {
  //     toast.error(err?.data?.error || INTERNAL_SERVER_ERROR);
  //   } finally {
  //     setClaimingId(null);
  //   }
  // };

  // const getMilestoneState = (ms: Mission["milestones"][0]) => {
  //   if (ms.isClaimed) return "claimed";
  //   if (currentValidBet >= ms.targetValidBet) return "claimable";
  //   return "locked";
  // };

  // const getDateLabel = () => {
  //   const date = new Date(mission.startDate);
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(tomorrow.getDate() + 1);

  //   if (date.toDateString() === today.toDateString()) return "Today";
  //   if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  //   return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  // };

  const [milestonesShow, setMilestonesShow] = useState(true);
  return (
    <div className="   overflow-hidden">
      {/* Card Header */}
      <MissionHeader
        onClick={() => setMilestonesShow(!milestonesShow)}
       
        title={mission.title}
        startDate={mission.startDate}
        endDate={mission.endDate}
        totalMilestones={mission.milestones.length}
        completedMilestones={mission?.userProgress?.completedMilestones}
        type={
          tab == "TODAY"
            ? "ACTIVE"
            : tab == "COMING_SOON"
              ? "COMING"
              : "FINISHED"
        }
      />
      {/* Milestones */}
      <div
        style={{
          display: `${milestonesShow ? "block" : "none"}`,
        }}
      >
        <div className="flex items-center py-3 gap-2">
          <Image
            src={fireIcon}
            alt="Milestones"
            className={`w-4 ${tab == "FINISHED" && "grayscale"}`}
          />
          <h2 className="text-xl font-bold text-[#666] ">
            All Milestones ({mission.milestones.length})
          </h2>
        </div>
        <div className="p-3 space-y-5">
          {mission.milestones.map((ms) => {
            const progress = Math.min(
              (currentValidBet / ms.targetValidBet) * 100,
              100,
            );
            const running =
              (mission.userProgress?.completedMilestones || 0) >= ms.order - 1;
            return (
              <MilestoneCard
              key={ms.id}
                requireBet={ms.targetValidBet}
                completedBet={progress}
                bonus={ms.rewardCash}
                banusTitle={"Ramadan Wishing Wheel"}
                rewardName={ms.rewardType}
                completed={ms.isClaimed}
                running={running}
                disabled={tab != "TODAY"}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
