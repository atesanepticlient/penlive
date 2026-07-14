"use client";
import Link from "next/link";
import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import fireIcon from "@/../public/mission/main/fire.png";
import liveIcon from "@/../public/games-cat/platform/live.png";
import pockerIcon from "@/../public/games-cat/platform/pocker.png";
import fishIcon from "@/../public/games-cat/platform/fish.png";
import Image from "next/image";
interface GameSelectionHeaderProps {
  title: string;
  rightAction: () => void;
  leftAction: () => void;
  isMoreGames?: boolean;
  seeMoreLink?: string;
}

const GameSelectionHeader = ({
  title,
  rightAction,
  leftAction,
  isMoreGames = true,
  seeMoreLink = "#",
}: GameSelectionHeaderProps) => {
  // Luxury Palette
  const goldPrimary = "#D4AF37";
  const goldHighlight = "#F9E498";
  const blackPanel = "#121212";

  const variant = "PLATFORM";

  return (
    <div className="flex items-center justify-between mt-3  px-1">
      {/* Title with Metallic Shine Effect */}

      {variant == "PLATFORM" && (
        <div className="flex items-center justify-between pr-[5px] pl-[15px] pt-[14px] pb-[9px] w-full">
          <div className="flex items-center gap-[7px] text-[21px] font-bold text-[#ffd700] drop-shadow-[0_0_13px_rgba(255,215,0,0.55)]">
            {title.includes("Hot") && (
              <Image src={fireIcon} alt="Hot" className="w-4" />
            )}{" "}
            {title.includes("Live") && (
              <Image src={liveIcon} alt="Live Casino" className="w-4" />
            )}
            {title.includes("Pocker") && (
              <Image src={pockerIcon} alt="Pocker" className="w-4" />
            )}
            {title.includes("Fish") && (
              <Image src={fishIcon} alt="Fish" className="w-4" />
            )}
            {title}
          </div>

          <Link href={seeMoreLink}>
            <button
              className="
    cursor-pointer rounded-[11px]
    border border-[rgba(255,215,0,0.28)]
    bg-[linear-gradient(135deg,rgba(255,215,0,0.1),rgba(255,215,0,0.04))]
    px-[15px] py-2
   uppercase tracking-[1px]
    text-[#ffd700] font-orbitron text-[12px]
  "
            >
              সব দেখুন
            </button>
          </Link>
        </div>
      )}

      {variant != "PLATFORM" && (
        <>
          <div className="relative group">
            <span
              style={{
                color: goldHighlight,
                fontSize: "20px",
                fontFamily: "serif", // Serif provides the 'luxury' feel
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                textShadow:
                  "0px 2px 4px rgba(0,0,0,0.8), 0px 0px 10px rgba(212, 175, 55, 0.3)",
                display: "block",
              }}
            >
              {title}
            </span>
            {/* Underline flourish seen in premium UI */}
            <div className="h-[2px] mt-1 bg-gradient-to-r from-[#D4AF37] to-transparent w-12 group-hover:w-full transition-all duration-500" />
          </div>

          {isMoreGames && (
            <div className="flex gap-2 items-center">
              {/* "See All" Link Styled as a Polished Button */}
              <Link href={seeMoreLink}>
                <button
                  className="hover:brightness-125 transition-all duration-300 active:scale-95"
                  style={{
                    padding: "8px 16px",
                    background: `linear-gradient(180deg, #222 0%, ${blackPanel} 100%)`,
                    borderTop: `1px solid ${goldPrimary}66`,
                    borderLeft: `1px solid ${goldPrimary}33`,
                    borderRadius: "12px",
                    color: goldPrimary,
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    boxShadow:
                      "0px 4px 10px rgba(0,0,0,0.5), inset 0px 1px 1px rgba(255,255,255,0.05)",
                  }}
                >
                  See All
                </button>
              </Link>

              {/* Navigation Arrows with Inset Look */}
              <div className="flex bg-[#0A0A0A] p-1 rounded-xl shadow-inner border border-white/5">
                <button
                  onClick={rightAction}
                  className="p-2 hover:text-[#F9E498] transition-colors duration-200"
                  style={{ color: goldPrimary }}
                >
                  <IoIosArrowBack size={20} />
                </button>

                <div className="w-[1px] h-4 bg-white/10 self-center mx-1" />

                <button
                  onClick={leftAction}
                  className="p-2 hover:text-[#F9E498] transition-colors duration-200"
                  style={{ color: goldPrimary }}
                >
                  <IoIosArrowForward size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameSelectionHeader;
