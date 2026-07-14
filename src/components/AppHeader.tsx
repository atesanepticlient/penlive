"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";

const AppHeader = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-[100] w-full px-6 py-4 bg-[#111111] backdrop-blur-md border-b border-[#D4AF37]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Back Button with subtle gold glow hover */}
        <button
          onClick={() => router.back()}
          className="group flex items-center justify-center w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900/50 hover:border-[#D4AF37]/50 transition-all duration-300"
        >
          <IoIosArrowBack className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
        </button>

        {/* Title: High-end Typography */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <h3 className="text-white text-sm font-light uppercase tracking-[0.3em] sm:text-base whitespace-nowrap">
            {title}
          </h3>
          {/* Elegant accent line below title */}
          <div className="h-[1px] w-6 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-1 opacity-60" />
        </div>

        {/* Empty spacer for flex alignment (or room for a Right Action icon) */}
        <div className="w-10" />
      </div>
    </div>
  );
};

export default AppHeader;
