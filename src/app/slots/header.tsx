"use client";
import { useRouter } from "next/navigation";
import React from "react";

const GameHeader = ({ title = "Slots" }: { title?: string }) => {
  const router = useRouter();
  return (
    <div className="games-header-bg relative h-[80px] ">
      <button
        onClick={() => router.back()}
        className="w-10 h-10 rounded-2xl  flex items-center justify-center
bg-gradient-to-b from-[#8B36DF] via-purple-700 to-purple-900
shadow cursor-pointer
border 
before:absolute before:inset-0 before:rounded-2xl

overflow-hidden absolute top-1/2 -translate-y-1/2 left-5"
      >
        {/* glossy highlight */}
        <div className="absolute top-1 left-1 right-1 h-1/2 rounded-xl bg-white/10 blur-md" />

        {/* filter icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 drop-shadow-[0_2px_4px_rgba(255,255,255,0.35)]"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="bottom-6 left-1/2 -translate-x-1/2  absolute">
        <h3 className="text-purple-900 font-extrabold text-2xl">{title}</h3>
      </div>
    </div>
  );
};

export default GameHeader;
