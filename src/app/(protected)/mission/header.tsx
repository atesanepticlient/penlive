"use client";
import React from "react";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/hook/useCurrentUser";
import { IoIosArrowBack } from "react-icons/io";

const MissionPageHeader = ({
}: {
  onRefresh: () => void;
  currentValidBet: number;
}) => {
  const router = useRouter();
  const user: any = useCurrentUser();

  // const handleRefresh = async () => {
  //   if (isRefreshing) return;
  //   setIsRefreshing(true);
  //   await new Promise((r) => setTimeout(r, 500));
  //   onRefresh();
  //   setIsRefreshing(false);
  // };

  return (
    <div className="top-0 left-0 sticky z-10 overflow-hidden px-12 h-36 mission-header-bg flex items-center gap-4 -translate-y-4">
      <button onClick={() => router.back()}>
        <IoIosArrowBack size={25} color="#fff" />
      </button>

      <div>
        <img
          src="https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
          className=" object-cover w-[65px] border-[3px] border-white aspect-square rounded-full"
          alt="user"
        />
      </div>
      <div>
        <h3 className="text-white/90 text-lg font-bold">{user.phone}</h3>
        <h2 className="text-xl text-white font-bold">
          ৳ {user?.wallet?.balance}
        </h2>
      </div>
    </div>
  );
};

export default MissionPageHeader;
