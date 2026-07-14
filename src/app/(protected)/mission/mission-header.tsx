"use client";
import React from "react";
import badge from "@/../public/mission/main/badge.png";
import Image from "next/image";
import useTimeCountDown from "@/hook/useTimeCountDown";
import Link from "next/link";
interface HeaderProps {
  title: string;
  startDate: string;
  endDate: string;
  totalMilestones: number;
  completedMilestones: number;
  type?: "ACTIVE" | "COMING" | "FINISHED";
  onClick?: () => void;
}

const MissionHeader = ({
  title,
  startDate,
  endDate,
  totalMilestones = 0,
  completedMilestones = 0,
  type = "ACTIVE",
  onClick,
}: HeaderProps) => {
  const { concrete, isInvalidDate } = useTimeCountDown({
    formte: "h-m-s",
    date: endDate,
  });
  const progress = Math.round((completedMilestones / totalMilestones) * 100);
  return (
    <div
      onClick={() => onClick?.()}
      className={`px-4 py-5 flex  gap-3 justify-between rounded-2xl ${type !== "ACTIVE" ? "mission-progress-disabled-header-bg" : "mission-progress-header-bg"}  h-36`}
    >
      <div className="flex flex-col items-center gap-2">
        <Image
          src={badge}
          alt="VIP"
          className={`w-[50px] select-none ${type == "FINISHED" && "grayscale"}`}
        />

        <span className="text-[#5f5f5f] font-bold text-2xl inline-block text-center">
          {progress}%
        </span>
      </div>
      <div className="flex-1 gap-1 ">
        <div className="flex justify-between gap-1.5">
          <div className="flex flex-col gap-0.5 flex-1">
            <h2 className="text-xl font-bold text-[#3c3c3c] line-clamp-1">
              {title}
            </h2>
            <span className="text-[14px] text-gray-600">
              Date :{" "}
              <span className="font-bold text-gray-600 text-[13px]">
                {new Date(startDate).toLocaleDateString("en-GB")}
              </span>
              ~
              <span className="font-bold text-gray-600 text-[13px]">
                {new Date(endDate).toLocaleDateString("en-GB")}
              </span>
            </span>
            <span className="text-[14px] text-gray-600">
              Remaining :{" "}
              <span className="font-bold text-gray-600 text-[13px]">
                {!isInvalidDate && type == "ACTIVE" && (
                  <>
                    {concrete.hours}: {concrete.min}:{concrete.sec}
                  </>
                )}
                {isInvalidDate || (type != "ACTIVE" && "---")}
              </span>
            </span>
            <span className="text-[14px] text-gray-600">
              Milestones :{" "}
              <span className="font-bold text-gray-600 text-[13px]">
                {completedMilestones || 0}/{totalMilestones}
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-2 w-[70px]">
            <Link
              href="/missionLeaderBoard"
              className="text-xs inline-block text-center text-gray-500 bg-transparent border border-gray-500 rounded-3xl px-2 py-1"
            >
              Leaderbo..
            </Link>
            <Link
              href="#"
              className="text-xs inline-block text-center text-gray-500 bg-transparent border border-gray-500 rounded-3xl px-2 py-1"
            >
              Rules
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg w-full h-2 mt-2 relative">
          <div
            className="top-0 left-0 right-0 h-full"
            style={{ width: "0" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MissionHeader;
