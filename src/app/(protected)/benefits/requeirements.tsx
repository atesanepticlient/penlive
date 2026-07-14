"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import { vipLevelBadgeFinder } from "@/lib/image";
import Image from "next/image";
import { useFetchVipRequirementsQuery } from "@/lib/features/vipApiSlice";
const Requeirements = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading } = useFetchVipRequirementsQuery();

  const requirements = data?.payload?.requiremnents;
  const progress = data?.payload?.progress;
  const currentLevel = data?.payload?.currentLevel;
  const initialSlide = currentLevel || 0;
  const getData = () => {
    if (!data) {
      return null;
    }

    const requirementsExtened = requirements?.levels?.map((level) => {
      return {
        level: level.level - 1,
        depositCount: level.totalDepositCount,
        deposit: level.totalDeposit,
        bet: level.totalBet,
        depositFullFill:
          currentLevel == level.level - 1 ? progress.totalDeposit : 0,
        betFullFill: currentLevel == level.level - 1 ? progress.totalBet : 0,
      };
    });
    return requirementsExtened;
  };

  const extenedData = getData();

  const { color } = vipLevelBadgeFinder(activeIndex);

  useEffect(() => {
    const bulletPoint: any = document.querySelector(
      "#vip_reqiremnets_slider .swiper-pagination-bullet-active",
    );

    if (bulletPoint) {
      bulletPoint.style.backgroundColor = color;
    }
  }, [activeIndex]);

  return (
    <div className="mt-6">
      <div className="flex justify-start items-center gap-3">
        <div className="w-1.5 h-[20px] bg-red-600"></div>
        <h3 className="text-2xl font-bold text-[#303030da]">
          Level Up Requirements
        </h3>
      </div>
      <div className=" ">
        <span className="text-sm text-[#484747] py-3">
          To level up, all conditions be fuilfilled
        </span>

        {extenedData && !isLoading && (
          <div className="bg-white rounded-3xl shadow-[0px_4px_12px_rgba(0,0,0,0.1)] overflow-hidden mt-4">
            <div className="w-full flex relative">
              <div className="w-[33.34%] absolute h-[350px] left-0 top-0 bg-[#f7f7f797] z-[20] flex flex-col">
                <div className="flex-1 flex items-center border-b border-b-[#efefefa0]">
                  <span className="pl-2 text-sm font-bold text-[#707070]">
                    Total Deposit
                  </span>
                </div>

                <div className="flex-1 flex items-center  border-b border-b-[#efefefa0]">
                  <span className="pl-2 text-sm font-bold text-[#707070]">
                    Deposit Count
                  </span>
                </div>

                <div className="flex-1 flex items-center  border-b border-b-[#efefefa0]">
                  <span className="pl-2 text-sm font-bold text-[#707070]">
                    Total Bet
                  </span>
                </div>
              </div>
              <div className="w-full" id={"vip_reqiremnets_slider"}>
                <Swiper
                  initialSlide={initialSlide}
                  onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                  slidesPerView={3}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true, // ⭐ enables dynamic bullets
                    dynamicMainBullets: 3,
                  }}
                  modules={[Pagination]}
                  className="mySwiper"
                >
                  <SwiperSlide>
                    <div className="!h-[350px]  "></div>
                  </SwiperSlide>
                  {extenedData.map((level, i) => {
                    const { image, color } = vipLevelBadgeFinder(level.level);
                    return (
                      <SwiperSlide key={i}>
                        <div
                          className="!h-[350px]  flex flex-col px-2 relative transition-all duration-300 "
                          style={{
                            background: `${
                              activeIndex == i
                                ? `linear-gradient(180deg,  #FFF 0%, ${color}70 100%)`
                                : ""
                            }`,
                          }}
                        >
                          <div className="top-0 w-full justify-center left-1/2 -translate-x-1/2 absolute flex items-center gap-2 ">
                            <Image
                              style={{
                                WebkitFilter: `${activeIndex != i ? "grayscale(150%)" : "grayscale(0%)"}`,
                              }}
                              src={image}
                              className="w-[35px]"
                              alt="Level"
                            />
                            <span className="text-[#222] text-xs font-bold">
                              VIP {level.level}
                            </span>
                          </div>

                          <div className="flex-1 flex flex-col justify-center  border-b border-b-[#efefefa0] pt-3">
                            {level.deposit > 0 && (
                              <span className="block pl-2 text-[13px] font-bold text-[#8b8b8b]">
                                {level.depositFullFill}
                              </span>
                            )}

                            <span className="block pl-2 text-end text-xs font-bold text-[#686868]">
                              /{level.deposit}
                            </span>
                          </div>

                          <div className="flex-1 flex items-center  border-b border-b-[#efefefa0]">
                            <span className="block pl-2 text-end text-xs font-bold text-[#686868]">
                              {level.depositCount}
                            </span>
                          </div>

                          <div className="flex-1 flex flex-col justify-center  border-b border-b-[#efefefa0]">
                            {level.bet > 0 && (
                              <span className="block pl-2 text-[13px] font-bold text-[#8b8b8b]">
                                {level.betFullFill}
                              </span>
                            )}

                            <span className="block pl-2 text-end text-xs font-bold text-[#686868]">
                              /{level.bet}
                            </span>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requeirements;
