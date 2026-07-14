"use client";
import React, { useEffect, useMemo, useState } from "react";
import mistryBox from "@/../public/vip/box-img.a082f15a.png";
import Image from "next/image";
import { IoLockClosed, IoLockOpen } from "react-icons/io5";
import { GiReceiveMoney } from "react-icons/gi";
import { motion } from "framer-motion";
import {
  useCliamVipRewardsMutation,
  useFetchVipRewardsQuery,
} from "@/lib/features/vipApiSlice";
import useTimeCountDown from "@/hook/useTimeCountDown";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
const Rewards = () => {
  const [activeTab, setActiveTab] = useState<7 | 30>(7);

  const { data, isLoading } = useFetchVipRewardsQuery();
  const rewards = data?.payload?.rewards;

  const getFilteredRewards = () => {
    if (!rewards || rewards.length == 0) return null;
    return rewards.filter((reward) => {
      return reward.requirements.validForDay == activeTab;
    });
  };

  const filteredRewards = getFilteredRewards();

  const tabBars = useMemo<(7 | 30)[]>(() => {
    const days =
      rewards
        ?.map((r: any) => r.requirements.validForDay)
        ?.filter((v: unknown): v is 7 | 30 => v === 7 || v === 30) ?? [];

    return Array.from(new Set(days));
  }, [rewards]);

  useEffect(() => {
    setActiveTab(tabBars[0] ?? 7);
  }, [tabBars]);

  return (
    <div className="py-6">
      {data && !isLoading && (
        <>
          <div className="flex justify-start items-center gap-3">
            <div className="w-1.5 h-[20px] bg-red-600"></div>
            <h3 className="text-2xl font-bold text-[#303030da]">Salary</h3>
          </div>

          {(!rewards || rewards.length == 0) && (
            <span className="text-[#484747] text-sm block py-3 font-medium">
              No Salary Remaining
            </span>
          )}

          {(!rewards || rewards.length != 0) && (
            <>
              {/* Tab bars */}
              <div>
                <div
                  className="flex flex-nowrap w-max overflow-x-auto scrollbar-none items-center gap-1.5 rounded-md  p-1.5 mt-2 "
                  style={{
                    boxShadow:
                      "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px",
                  }}
                >
                  {tabBars.map((tabBar, key) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(tabBar)}
                      className={` ${activeTab == tabBar ? "bg-gradient-to-br from-[#95a3b9]  to-slate-50  text-white" : "bg-transparent text-[#333]"}  text-xs font-semibold  px-4 py-1.5 rounded-md`}
                    >
                      {tabBar} Days
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="grid grid-cols-1">
                  {filteredRewards && (
                    <>
                      {filteredRewards.map((reward, i) => (
                        <div key={i}>
                          <RemainingTime date={reward.expiry} />
                          <RewardCard
                            id={reward.id}
                            key={reward.id}
                            reward={reward.requirements.reward}
                            requirements={{
                              totalBet: reward.requirements.totalBet,
                              totalDeposit: reward.requirements.totalDeposit,
                            }}
                            progress={{
                              totalBet: reward.progress.totalBet,
                              totalDeposit: reward.progress.totalDeposit,
                            }}
                          />
                        </div>
                      ))}

                      {filteredRewards.length == 0 && (
                        <span className="text-[#484747] text-xs block py-3 font-medium">
                          No Rewards
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Rewards;

const RewardCard = ({
  id,
  reward,
  requirements,
  progress,
}: {
  id: string;
  reward: number;
  requirements: {
    totalDeposit: number;
    totalBet: number;
  };
  progress: {
    totalDeposit: number;
    totalBet: number;
  };
}) => {
  const blur = !(
    requirements.totalDeposit <= progress.totalDeposit &&
    requirements.totalBet <= progress.totalBet
  );
  const prize = reward;
  const deposit = {
    need: requirements.totalDeposit,
    progress: progress.totalDeposit,
  };
  const bet = {
    need: requirements.totalBet,
    progress: progress.totalBet,
  };
  const progressPercent = (bet.progress / bet.need) * 100;
  const depositPercent = (deposit.progress / deposit.need) * 100;

  const [claimApi, { isLoading }] = useCliamVipRewardsMutation();

  const handleClick = () => {
    claimApi({ rewardId: id })
      .unwrap()
      .then(() => {
        toast.success("Reward Claimed");
      })
      .catch((error) => {
        if (error?.data?.error) {
          toast.error(error?.data?.error);
        } else {
          toast.error("Something went wrong!");
        }
      });
  };

  return (
    <div className="relative">
      <button
        disabled={blur}
        onClick={handleClick}
        className={`w-full bg-white p-1 flex shadow ${isLoading && "opacity-15"} `}
      >
        <div>
          <div
            className={`relative border-s border-e border-dashed border-s-white border-e-white w-[90px] h-[100px]  flex items-center justify-center ${blur ? "bg-[#d2d2d2b0]" : "bg-[#1a44ff15]"} `}
          >
            <Image
              src={mistryBox}
              style={{
                WebkitFilter: `${blur ? "grayscale(100%)" : "grayscale(0%)"}`,
              }}
              alt="Salary"
              className={`w-[65px] ${blur ? "filter-[grayscale(100%)]" : "filter-[grayscale(0%)]"} `}
            />
            {!blur && (
              <div className="top-0 left-0 right-0 bg-[#00000061] absolute z-[10] w-full h-full"></div>
            )}
            <div className=" left-1/2 top-1/2 -translate-1/2 -translate-x-1/2 absolute">
              {blur ? (
                <IoLockClosed className="text-xs bg-[#333333e4] text-white rounded-full p-1 w-7 h-7" />
              ) : (
                <IoLockOpen className="text-[#333333e4] text-xs bg-white rounded-full p-1 w-7 h-7" />
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 px-1.5 py-1 bg-[#f5f5f5e2]">
          <div className="flex items-center gap-2 border-b">
            <GiReceiveMoney className="text-[#414141]" />
            <span
              className={`${blur ? "text-[#414141]" : "text-[#414141]"} text-sm font-semibold`}
            >
              ৳ {prize}
            </span>
            {/* {!blur && (
            <button className="px-2 py-1 -translate-y-1 rounded-full bg-gradient-to-br from-gray-300 via-gray-100 to-slate-50  border border-white/50 text-xs  ">
              Claim
            </button>
          )} */}
          </div>

          <div className="pt-0.5">
            <p
              className={`text-xs text-start ${blur ? "text-[#4b4b4b]" : "text-[#4b4b4b]"}`}
            >
              Deposit ৳{deposit.need}, Betting ৳ {bet.need} to unlock
            </p>
            <div className=" pt-1">
              <div className="">
                <div className="flex justify-between items-center py-0.5">
                  <span
                    className={`text-xs ${blur ? "text-[#4b4b4b]" : "text-[#4b4b4b]"}`}
                  >
                    Deposit Amount
                  </span>
                  <span
                    className={`text-xs ${blur ? "text-[#4b4b4b]" : "text-[#4b4b4b]"}`}
                  >
                    {deposit.progress}/{deposit.need}
                  </span>
                </div>
                <div className="h-1 relative w-full overflow-hidden bg-[#c9c8c86f]">
                  <motion.div
                    className={`absolute top-0 left-0 h-1 ${blur ? "bg-[#747474]" : "bg-[#747474]"}  rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${depositPercent}%` }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
              <div className="">
                <div className="flex justify-between items-center py-0.5">
                  <span
                    className={`text-xs ${blur ? "text-[#4b4b4b]" : "text-[#4b4b4b]"}`}
                  >
                    Bet Amount
                  </span>
                  <span
                    className={`text-xs ${blur ? "text-[#4b4b4b]" : "text-[#4b4b4b]"}`}
                  >
                    {bet.progress}/{bet.need}
                  </span>
                </div>
                <div className="h-1 relative w-full overflow-hidden bg-[#c9c8c86f]">
                  <motion.div
                    className={`absolute top-0 left-0 h-1 ${blur ? "bg-[#747474]" : "bg-[#747474]"}  rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
      {isLoading && (
        <div className="top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2 ">
          <ClipLoader color="lightblue" />
        </div>
      )}
    </div>
  );
};

const RemainingTime = ({ date }: { date: Date }) => {
  const { concrete } = useTimeCountDown({ date: date });

  return (
    <div className="py-3">
      <span className="text-[#484747] text-base font-medium">
        Remaining unlock time :{" "}
        <span className="font-bold">
          {concrete.day}Day : {concrete.hours} : {concrete.min} : {concrete.sec}
        </span>
      </span>
    </div>
  );
};
