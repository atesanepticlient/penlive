/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { UserAvatar } from "@/components/HeaderBalance";
import React, { useEffect, useState } from "react";
import { FaCopy, FaCrown } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { IoArrowForwardCircle, IoLogOut } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/hook/useCurrentUser";
import { useFetchWalletQuery } from "@/lib/features/walletApiSlice";
import { getCurrencySymbol } from "@/lib/utils";
import Link from "next/link";
import { RiCalendarCheckFill } from "react-icons/ri";
import { useFetchVipLevelQuery } from "@/lib/features/vipApiSlice";

const RewardHeader = () => {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  const { data, refetch, error } = useFetchWalletQuery();

  const user: any = useCurrentUser();

  const balance = Number(data?.payload?.balance) || 0;

  const handleCopyPlayerId = () => {
    navigator.clipboard.writeText(user?.phone || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { data: vipLevelData, isLoading } = useFetchVipLevelQuery();
  const require = vipLevelData?.payload?.level?.nextLevelRequirements;
  const progress = vipLevelData?.payload?.level?.progress;
  const vipTargetedMission =
    Number(!!require?.totalBet) + Number(!!require?.totalDeposit);

  const vipTargetedMisstionCompleted =
    Number(!!(require?.totalBet > 0 && progress?.totalBet >= require?.totalBet)) +
    Number(
      !!(
        require?.totalDeposit > 0 &&
        progress?.totalDeposit >= require?.totalDeposit
      ),
    );

  console.log({ vipTargetedMisstionCompleted });

  const handleRefreshBalance = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    refetch();

    setLastUpdateTime(new Date());
    setShowToast(true);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative reward-header-bg rounded-b-[70%]  p-2 h-[240px] flex items-center">
      {/* Toast Notification */}

      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 z-50 ${
          showToast ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="text-sm font-medium">Balance updated successfully</div>
        <div className="text-xs mt-1">
          {lastUpdateTime.toLocaleTimeString()}
        </div>
      </div>

      <h2 className="text-[60px]   font-bold absolute left-1/2 -translate-x-1/2 top-5  text-transparent bg-[linear-gradient(#fff,#0000)] bg-clip-text">
        Reward
      </h2>

      <button
        className="cursor-pointer absolute top-4 left-5"
        onClick={handleBack}
      >
        <FaArrowLeftLong className="w-5 h-5 text-white" />
      </button>

      <div className=" flex items-center  mb-4 mt-52 mx-auto ">
        <div className="   pt-9 w-[370px] h-[200px] mx-auto reward-profile p-3 rounded-3xl relative overflow-hidden">
          <div className="w-full items-center flex justify-start pl-6 ">
            <div className=" ">
              <div
                className={`overflow-x-hidden overflow-y-hidden p-0.5 mr-2 border border-t border-r border-b border-l border-solid bg-[linear-gradient(rgb(255,230,0),rgb(255,184,0))] border-orange-200 border-opacity-50   shadow-[hsl(51.23595505617977, 100%, 82.54901960784314%)_0px_1.9584px_0px_1.7px_inset,rgb(182,65,0)_0px_1.9584px_0px_0px]  w-[60px] h-[60px] md:w-[150px] md:h-[150px] rounded-full `}
              >
                <div className="flex overflow-x-hidden overflow-y-hidden relative justify-center items-center rounded-full size-full">
                  <div className="overflow-x-hidden overflow-y-hidden rounded-full size-full">
                    <img
                      alt="User avatar"
                      src={
                        "https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
                      }
                      className="overflow-x-clip overflow-y-clip size-full  object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-3 ">
              <div className="flex items-center">
                <h2 className="font-semibold border-b border-b-black text-lg ">
                  {user?.phone}
                </h2>
                <button
                  onClick={handleCopyPlayerId}
                  className="ml-2 text-xs bg-gray-200 hover:bg-gray-400 p-1 rounded cursor-pointer"
                >
                  <FaCopy className="" />
                </button>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-sm font-semibold text-[#00000086]">
                  NickName: {user?.name}
                </span>
              </div>

              <div className="flex items-center justify-between  ">
                <div>
                  <div className="flex items-center">
                    <span
                      className="text-xl font-semibold tracking-tighter text-[#00000086]  transition-all duration-300 transform"
                      style={{
                        animation: isRefreshing
                          ? "none"
                          : "balancePulse 0.5s ease-out",
                      }}
                    >
                      {getCurrencySymbol(data?.payload.currency || "BDT")}
                      {balance.toFixed(2)}
                    </span>
                    <style>
                      {`
                @keyframes balancePulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                  100% { transform: scale(1); }
                }
              `}
                    </style>
                    <button
                      onClick={handleRefreshBalance}
                      className="ml-2 text-xs bg-gray-200 hover:bg-gray-400 p-1.5 rounded cursor-pointer relative"
                      disabled={isRefreshing}
                    >
                      <FiRefreshCw className="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full px-3 mt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 font-semibold">
                <FaCrown />
                VIP<span>{vipLevelData?.payload?.level?.level}</span>
              </div>

              <Link
                href={"/benefits"}
                className="text-sm text-gray-600 flex items-center gap-1"
              >
                Benefits <IoArrowForwardCircle />
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <div className="relative w-full h-1 bg-gray-400 rounded-md mt-1.5 flex-1">
                <div
                  className="top-0 left-0 right-0 h-full"
                  style={{
                    height: `${(vipTargetedMisstionCompleted / vipTargetedMission) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                {vipTargetedMisstionCompleted}/{vipTargetedMission}
              </p>
            </div>
          </div>

          <Link
            href="/activity/signin"
            className="top-0 right-0 absolute px-8 py-1.5 text-white  rounded-bl-[40px] flex items-center gap-2"
            style={{
              background:
                "linear-gradient(to bottom, #f26d6d 0%, #b31d1d 100%)",
            }}
          >
            <RiCalendarCheckFill /> Sigain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RewardHeader;
