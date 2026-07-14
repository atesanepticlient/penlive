"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import notice from "@/../public/icons/notice.png";
import { useGetHeadlineQuery } from "@/lib/features/settingApiSlice";

type Props = {
  variant?: "PLATFORM" | "NORMAL";
};

const AppNotice: React.FC<Props> = ({ variant = "PLATFORM" }) => {
  const { data, isLoading, error } = useGetHeadlineQuery();

  if (isLoading || !data || error) {
    return null;
  }

  return (
    <div className={`${variant == "NORMAL" && "px-2"}`}>
      <div
        className={`
          inline-flex items-center gap-2
          w-full h-[30px]
         
          overflow-hidden
          ${
            variant === "PLATFORM"
              ? "bg-[linear-gradient(90deg,#1a0d2e,#0d0b1a,#1a0d2e)] border-b border-[rgba(255,215,0,0.12)]"
              : "bg-[linear-gradient(180deg,#111111,#1A1A1A)] rounded-[52px] border border-[rgba(212,175,55,0.3)]  mt-3 "
          }
        `}
      >
        {/* LEFT LABEL / ICON */}
        {variant === "PLATFORM" ? (
          <div
            className="
              text-[8.5px]
              font-bold
              text-white
              px-[7px] h-[90%] flex items-center
              flex-shrink-0
              tracking-[1px]
              whitespace-nowrap
              font-['Orbitron']
              bg-[linear-gradient(90deg,#ff003c,#ff6b00)]
              shadow-[4px_0_10px_rgba(255,0,60,0.4)]
            "
          >
            🔥 LIVE
          </div>
        ) : (
          <div className="w-[18px] h-[18px] flex-shrink-0">
            <Image src={notice} alt="notice" className="w-full h-full" />
          </div>
        )}

        {/* MARQUEE */}
        <div className="flex-1 overflow-hidden">
          {variant === "PLATFORM" ? (
            <Marquee gradient={false} speed={40}>
              <div className="flex anim-ticker ">
                <span className="text-[12px] font-normal text-[#ffd900] font-sans">
                  <div dangerouslySetInnerHTML={{ __html: data.html }} />
                </span>
              </div>
            </Marquee>
          ) : (
            <Marquee gradient={false} speed={40}>
              <p className="text-[#D4AF37] text-[13px] font-medium font-['Segoe_UI'] whitespace-nowrap">
                <div dangerouslySetInnerHTML={{ __html: data.html }} />
              </p>
            </Marquee>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppNotice;
