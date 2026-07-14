"use client";
import Image from "next/image";
import React from "react";

type Entry = {
  user: string;
  prize: number;
};

const data: Entry[] = [
  { user: "U_***xc", prize: 100 },
  { user: "U_ab12c", prize: 200 },
  { user: "U_z9x8c", prize: 50 },
  { user: "U_lm34n", prize: 500 },
  { user: "U_qw87e", prize: 75 },
];

import leaderBoardIcon from "@/../public/wheel/xyzp_list_bg11-BknjhYpj.png";

const Leaderborad = () => {
  const loopData = [...data, ...data];
  return (
    <div>
      <div className="leader-board-bg w-[350px] h-[130px] relative">
        <div className="top-0 left-0 absolute z-50">
          <Image src={leaderBoardIcon} alt="Leader Board" />
        </div>

        <div className="h-[80px] w-[80%] mx-auto overflow-hidden  top-7 left-6 absolute">
          {/* animated container */}
          <div className="leaderboard-marquee ">
            {loopData.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between  px-2 py-1 text-sm border-b border-b-[#f6ba2e3a]"
              >
                <span className="font-mono text-xs font-medium text-slate-300">
                  {item.user}
                </span>
                <span className="font-semibold text-yellow-300">
                  ৳ {item.prize}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderborad;
