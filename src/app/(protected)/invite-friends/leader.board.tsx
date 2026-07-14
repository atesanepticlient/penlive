import React from "react";

import avatar1 from "@/../public/leader-board/leader1.png";
import avatar2 from "@/../public/leader-board/leader2.png";
import avatar3 from "@/../public/leader-board/leader3.png";
import Image from "next/image";

const topLeaders = [
  {
    rank: 2,
    avatar: avatar2, // Temporary placeholder
    phone: "01*****3",
    score: "19,169,302.93",
  },
  {
    rank: 1,
    avatar: avatar1, // Temporary placeholder
    phone: "01*****1",
    score: "16,096,185.47",
  },
  {
    rank: 3,
    avatar: avatar3, // Temporary placeholder
    phone: "01*****8",
    score: "10,605,695.75",
  },
];

// Content for the scrolling list. These 4 items will be repeated in a continuous loop.
const rewardList = [
  { phone: "01********6", reward: "৳ 120.00" },
  { phone: "01********6", reward: "Prize Wheel" },
  { phone: "01********9", reward: "৳ 240.00" },
  { phone: "01********9", reward: "Prize Wheel" },
];

export default function Leaderboard() {
  // Map the topLeaders array into a component structure
  const getTopThree = () => {
    return topLeaders.map((item) => (
      <div key={item.rank} className="text-center flex flex-col items-center ">
        {/* Leaderboard Image Container */}
        <div className="relative mb-3">
          <Image
            src={item.avatar}
            alt={`Leader ${item.rank}`}
            className={`${item.rank == 1 ? "w-[100px] h-[100px] -translate-y-6" : "w-[90px] h-[90px]"}  rounded-full object-cover`}
          />
          {/* Rank Badge */}
          <div className="absolute -top-3 -right-3 px-3 py-1 bg-[#FBBF24] text-[#1E1E2D] font-bold text-lg rounded-full shadow-md z-10">
            {item.rank}
            <sup className="text-xs">
              {item.rank === 1 ? "st" : item.rank === 2 ? "nd" : "rd"}
            </sup>
          </div>
        </div>
        {/* Phone and Score */}
        <div className={`${item.rank == 1 && "-translate-y-2"}`}>
          <p className=" font-semibold text-xs leading-tight mb-1 text-white">
            {item.phone}
          </p>
          <p className=" font-semibold text-sm leading-tight flex items-center text-white ">
            <span className="">৳</span>
            {item.score}
          </p>
        </div>
      </div>
    ));
  };

  // Build a single reward row component
  const getRewardRow = (item, index) => (
    // Fixed height h-[44px] + mb-3 (12px) = 56px total per row
    <div
      key={index}
      className="grid grid-cols-3 justify-between items-center bg-white/90 backdrop-blur-sm rounded-full w-full h-[44px] shadow-sm px-6 mb-3 flex-shrink-0"
    >
      <div className="text-left">
        <p className="text-gray-500 font-semibold text-xs whitespace-nowrap">
          {item.phone}
        </p>
      </div>
      <div className="text-center ">
        <p className="text-gray-400 font-medium text-xs">Received</p>
      </div>
      <div className="text-left ">
        <p
          className={`text-gray-800 text-left font-bold text-sm ${item.reward.includes("৳") ? "" : "italic"}`}
        >
          {item.reward}
        </p>
      </div>
    </div>
  );

  // Combine the content for a continuous vertical loop.
  // This duplicates the list and calculates the offset.
  const createScrollingRows = () => {
    // 1. Triple the list to ensure the container is always overflowing during the transition
    const tripleList = [...rewardList, ...rewardList, ...rewardList];

    // 2. Calculation: Each row is 44px (h-11) + 12px (mb-3) = 56px.
    // We want to scroll exactly the height of the original list (4 items * 56px = 224px)
    const rowHeight = 56;
    const totalOriginalHeight = rewardList.length * rowHeight;

    return (
      <div className="overflow-hidden w-full h-[200px] relative">
        <div
          className="animate-infinite-scroll flex flex-col w-full"
          style={{
            ["--scroll-offset" as any]: `-${totalOriginalHeight}px`,
          }}
        >
          {tripleList.map((item, idx) => getRewardRow(item, idx))}
        </div>
      </div>
    );
  };

  return (
    <div className=" bg-gray-50 flex flex-col items-center pt-6 font-sans">
      <h1 className="text-3xl font-bold text-[#1E293B] mb-6">Leaderboard</h1>

      {/* Main Leaderboard UI Card */}
      <div className="w-[97%]  bg-gradient-to-b from-[#3B82F6] via-[#A855F7] to-[#A855F7] rounded-xl py-10 px-4 flex flex-col items-center">
        {/* Top 3 Leaders Component */}
        <div className="grid grid-cols-[30%_40%_30%]  w-full items-start mb-16">
          {getTopThree()}
        </div>

        {/* Section Title */}
        <h2 className="text-2xl font-extrabold text-white mb-8 tracking-wide">
          Who received the rewards
        </h2>

        {/* Scrolling Rewards Component */}
        <div className="w-full relative flex-grow ">
          {createScrollingRows()}
          {/* Fading Gradients */}
          {/* <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#A855F7] to-transparent z-10 pointer-events-none rounded-t-xl" />
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#A855F7] to-transparent z-10 pointer-events-none rounded-b-xl" /> */}
        </div>
      </div>
    </div>
  );
}
