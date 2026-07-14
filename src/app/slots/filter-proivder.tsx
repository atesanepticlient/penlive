"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { GAME_TYPE, providers } from "../../../data/api-providers";
import Image from "next/image";
import { GameProvider } from "@/types/game";

const FilterProivder = ({
  onSelect,
}: {
  onSelect: (provider: GameProvider) => void;
}) => {
  const [selectedProvider, setProvider] = useState<any>("");

  useEffect(() => {
    onSelect(selectedProvider);
  }, [selectedProvider]);

  const slotsProviders = providers.filter((provider) => {
    if (!provider.gameType) return true;
    else {
      if (
        provider.gameType.includes(GAME_TYPE.SLOT) ||
        provider.gameType.includes(GAME_TYPE.OTHERS)
      )
        return true;
      else return false;
    }
  });

  return (
    <div className="relative w-full rounded-[12px] -translate-y-1 bg-violet-50 backdrop-blur-lg shadow-md    ">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/25 to-transparent" />
      {/* inner glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,184,0,0.06),transparent_50%)]" />

      <Swiper
        slidesPerView={"auto"}
        // spaceBetween={10}
        className="relative z-10 !px-2 "
      >
        {/* All */}
        <SwiperSlide className="!w-auto">
          <button
            onClick={() => setProvider("")}
            className={`
              relative h-[45px] min-w-[110px]  rounded-[14px] px-7
              text-sm font-black uppercase tracking-[0.1em]
              transition-all duration-300 translate-y-2 shadow
              ${
                selectedProvider === ""
                  ? "border border-yellow-400/60 bg-gradient-to-b from-[#ffe44a] to-[#edb11b]  text-[#1a0800] shadow-[0_0_20px_rgba(255,184,0,0.5),0_4px_12px_rgba(180,100,0,0.4),inset_0_1px_0_rgba(255,255,255,0.35)]"
                  : "bg-violet-50 !text-violet-950"
              }
            `}
          >
            {selectedProvider === "" && (
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent " />
            )}
            All
          </button>
        </SwiperSlide>

        {/* Providers */}
        {slotsProviders.map((provider, i) => (
          <SwiperSlide key={i} className="!w-auto !py-2">
            <button
              onClick={() => setProvider(provider.product_code)}
              className={`
                relative flex h-[45px] min-w-[110px] items-center justify-center
                rounded-[14px] shadow px-5 
                transition-all duration-300 ml-2
                ${
                  provider.product_code === selectedProvider
                    ? "border-yellow-400/60 bg-gradient-to-b from-[#ffe44a] to-[#edb11b] shadow-[0_0_20px_rgba(255,184,0,0.5),0_4px_12px_rgba(180,100,0,0.4),inset_0_1px_0_rgba(255,255,255,0.35)]"
                    : "bg-violet-50"
                }
              `}
            >
              {provider.product_code === selectedProvider && (
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              )}
              <Image
                src={provider.image}
                alt={provider.name}
                width={70}
                height={30}
                className="h-auto  w-[70px] max-h-[28px] object-contain transition-all duration-300"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

   
    </div>
  );
};

export default FilterProivder;
