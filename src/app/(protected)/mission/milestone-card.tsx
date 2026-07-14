import Image from "next/image";
import React from "react";

import menIcon from "@/../public/mission/main/men-icon.png";
import noteIcon from "@/../public/mission/main/note-icon.png";
import bonusIcon from "@/../public/mission/main/bonus-icon.png";

import { RewardName } from "@prisma/client";
import { FaCheck } from "react-icons/fa";

interface MilestoneCardProps {
  requireBet: number;
  completedBet: number;
  bonus: number;
  completed?: boolean;
  running?: boolean;
  disabled?: boolean;
  banusTitle?: string;
  rewardName?: RewardName;
}

const MilestoneCard = ({
  requireBet = 0,
  completedBet = 0,
  bonus = 0,
  completed = false,
  running = false,
  disabled = false,
  banusTitle,
  rewardName,
}: MilestoneCardProps) => {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center gap-3">
        {!completed && (
          <div
            className={`w-8 flex items-center justify-center rounded-full aspect-square ${!disabled && running ? "bg-[#FFBF59]" : "bg-[#D5D5D5]"}`}
          >
            <Image src={menIcon} alt="Progress" className="w-4" />
          </div>
        )}
        {completed && (
          <div
            className={` ${disabled ? "bg-[#D5D5D5]" : "bg-emerald-500"}  w-8 aspect-square rounded-full flex justify-center items-center`}
          >
            <FaCheck className="text-white" />
          </div>
        )}
        <div
          className={`h-[90px] w-[3px] ${completed && !disabled ? "bg-emerald-500" : "bg-[#D5D5D5]"} `}
        ></div>
      </div>

      <div className="bg-white flex-1 rounded-lg shadow-sm px-2 py-3">
        <div className="pb-3 border-b border-b-[#E0E0E0] flex px-2 relative">
          <h3 className="flex-1 text-base font-semibold text-[#666666]">
            Valid Bet
          </h3>
          <h3 className="flex-1 font-semibold text-sm text-[#666666]">
            ৳ {completedBet} / {requireBet}
          </h3>

          {completed && (
            <span
              className={`top-0.5 right-2 absolute ${disabled ? "text-[#D5D5D5]" : "text-emerald-500"} text-xs font-semibold`}
            >
              Completed
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col gap-3">
          {(rewardName || banusTitle) && (
            <div
              className={`flex items-center gap-1  w-max pr-5 rounded-full ${disabled ? "bg-[#dddddd57]" : "bg-[#FFE7FD]"}`}
            >
              <div
                className={`w-5 aspect-square rounded-full flex justify-center items-center ${disabled ? "bg-[#dddddde3]" : "bg-[#FE95FC]"} `}
              >
                <Image src={noteIcon} alt="Bonus" className="w-3 select-none" />
              </div>
              <span className="text-xs text-[#666666]">
                {banusTitle || rewardName.toLocaleLowerCase()} :
              </span>{" "}
              <span
                className={` font-semibold text-xs ${disabled ? "text-[#666]" : "text-[#F75EF6]"}`}
              >
                1
              </span>
            </div>
          )}

          <div
            className={`flex items-center gap-1  w-max pr-5 rounded-full ${disabled ? "bg-[#dddddd57]" : "bg-[#DAEFFF]"} `}
          >
            <div
              className={`w-5 aspect-square rounded-full flex justify-center items-center  ${disabled ? "bg-[#dddddde3]" : "bg-[#40ADFF]"}`}
            >
              <Image src={bonusIcon} alt="Bonus" className="w- select-none" />
            </div>
            <span className="text-xs text-[#666666]">Bonus :</span>{" "}
            <span
              className={` font-semibold text-xs ${disabled ? "text-[#666]" : "text-[#40ADFF]"}`}
            >
              ৳ {bonus.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;
