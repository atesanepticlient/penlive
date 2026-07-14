"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";

import egg_hunt from "@/../public/egg-hunt/GOLDEN_EGG_thumb.gif";
import spin_wheel from "@/../public/wheel/lucky-wheel.gif";
import red_envelop from "@/../public/red-envelope/raffle.gif";
import signin_grp from "@/../public/highlighted-events/LOGIN.webp";

import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";

import Wheel from "@/components/wheel/wheel";
import { useFetchRewardHubQuery } from "@/lib/features/rewardApiSlice";
import { redirect } from "next/navigation";
import EggHunt from "../egg-hunt";
import Envelop from "../red-envelop";

const STATIC_HIGHLIGHT_EVENTS = [
  {
    image: signin_grp,
    action: () => redirect("/activity/signin"),
  },
];

const Highlight = () => {
  const { data: rewardHub, isLoading } = useFetchRewardHubQuery();

  const rewardsEventData = rewardHub?.payload?.eventsData;

  const [sliderComponentVisiable, setSliderVisibility] = useState(true);
  const [sliderMode, setSliderMode] = useState<"horizontal" | "vertical">(
    "horizontal",
  );

  const [rewardData, setRewardData] = useState<{
    rewardName: string;
    id: string;
  }>({ rewardName: "", id: "" });

  const events = useMemo(() => {
    const newEvents = [];
    if (rewardsEventData) {
      if (rewardsEventData?.egg.length > 0) {
        newEvents.push({
          image: egg_hunt,
          action: () =>
            setRewardData({
              id: rewardsEventData.egg[0].id,
              rewardName: "EGG",
            }),
        });
      }
      if (rewardsEventData?.spin.length > 0) {
        newEvents.push({
          image: spin_wheel,
          action: () =>
            setRewardData({
              id: rewardsEventData.spin[0].id,
              rewardName: "SPIN",
            }),
        });
      }
      if (rewardsEventData?.envelop.length > 0) {
        newEvents.push({
          image: red_envelop,
          action: () =>
            setRewardData({
              id: rewardsEventData.envelop[0].id,
              rewardName: "ENVELOP",
            }),
        });
      }
    }

    return [...newEvents, ...STATIC_HIGHLIGHT_EVENTS];
  }, [rewardsEventData]);

  const handleCloseSliderComponent = () => setSliderVisibility(false);

  const handleToggleSliderMode = () => {
    setSliderMode((prev) =>
      prev === "horizontal" ? "vertical" : "horizontal",
    );
  };

  return (
    <>
      {!isLoading && rewardHub && sliderComponentVisiable && (
        <div>
          <div className="fixed bottom-16 right-2 z-[1991] flex flex-col items-center">
            {/* Controls Container */}
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleCloseSliderComponent}
                className="w-7 h-7 transition-transform hover:scale-110 active:scale-95"
              >
                <AiFillCloseCircle className="w-full h-full text-white/60 hover:text-white" />
              </button>
              <button
                onClick={handleToggleSliderMode}
                className="bg-gradient-to-b from-orange-500 to-orange-700 rounded-full w-7 h-7 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <MdKeyboardDoubleArrowUp
                  className={`w-5 h-5 text-white transition-transform duration-300 ${
                    sliderMode === "vertical" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </div>

            {/* Slider Container */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden shadow-2xl 
              ${
                sliderMode === "horizontal"
                  ? "w-[90px] h-[90px] rounded-3xl"
                  : "w-[75px] h-[220px] rounded-[40px] bg-[#000000c5]"
              }`}
            >
              <Swiper
                key={sliderMode} // Forces fresh initialization on mode change
                direction={sliderMode}
                slidesPerView={sliderMode === "horizontal" ? 1 : 3}
                spaceBetween={0} // Minimized space for tighter look
                centeredSlides={false}
                modules={[Autoplay]}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                loop={events.length > (sliderMode === "horizontal" ? 1 : 3)}
                className="h-full w-full"
              >
                {events.map((event, i) => {
                  return (
                    <SwiperSlide
                      key={i}
                      // Calculate height in vertical mode to prevent stretching/gaps
                      className={`flex items-center justify-center p-2 ${
                        sliderMode === "vertical" ? "!h-[73px]" : "h-full"
                      }`}
                    >
                      <button
                        onClick={event.action}
                        className="relative w-full aspect-square flex items-center justify-center"
                      >
                        <div className="w-full h-full rounded-full overflow-hidden ">
                          <Image
                            src={event.image}
                            alt="event"
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                        {event.notification && (
                          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-orange-400 bg-orange-500 z-10" />
                        )}
                      </button>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
          {/* Example placeholder for reward games*/}
          {rewardData.rewardName == "SPIN" && (
            <Wheel
              selectedEventId={rewardData.id}
              onClose={() => setRewardData({ rewardName: "", id: "" })}
            />
          )}
          {rewardData.rewardName == "EGG" && (
            <EggHunt
              selectedEventId={rewardData.id}
              onClose={() => setRewardData({ rewardName: "", id: "" })}
            />
          )}
          {rewardData.rewardName == "ENVELOP" && (
            <Envelop
              selectedEventId={rewardData.id}
              onClose={() => setRewardData({ rewardName: "", id: "" })}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Highlight;
