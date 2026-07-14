"use client";
import Image from "next/image";
import React, {  useEffect, useRef, useState } from "react";
import rewardImg from "@/../public/reward.png";
import RewardEventCountdown from "../event-timecound-down";
import { ColorRing } from "react-loader-spinner";
import Leaderborad from "../wheel/leaderborad";
import { AiOutlineCloseCircle } from "react-icons/ai";
import EggHuntGame from "./game";
import { useFetchRewardEvetsQuery } from "@/lib/features/rewardApiSlice";
import { RewardName } from "@prisma/client";
import navigatorIcon from "@/../public/egg-hunt/navigator.png";
import liveTicket from "@/../public/egg-hunt/live-ticket.png";
import signinTicket from "@/../public/egg-hunt/signin-ticket.png";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import useCurrentUser from "@/hook/useCurrentUser";
import { redirect } from "next/navigation";

const EggHunt = ({
  onClose,
  selectedEventId,
}: {
  onClose: () => void;
  selectedEventId?: string;
}) => {
  const [events, setEvents] = useState(null);
  const { data, isLoading, isFetching } = useFetchRewardEvetsQuery({
    name: RewardName.EGGHUNT,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);

  console.log({ events });

  useEffect(() => {
    if (selectedEventId) {
      if (events) {
        let index = events.findIndex((event) => event.id == selectedEventId);
        index = index === -1 ? 0 : index;

        setActiveIndex(index);
        swiperRef?.current?.slideTo(index);
      }
    }
  }, [selectedEventId, events, swiperRef]);

  useEffect(() => {
    if (Array.isArray(events)) {
      const selectedReward = events[activeIndex];
      console.log([activeIndex]);
      setSelectedReward(selectedReward);
    }
  }, [activeIndex, events]);

  useEffect(() => {
    if (data?.payload?.events) {
      setEvents(data?.payload?.events);
    }
  }, [data]);

  const user = useCurrentUser();

  const handleClaim = () => {
    if (!user) {
      redirect("/login");
    }
  };

  const handleRemoveEventById = (id: string) => {
    const updatedEvents = events?.filter((event) => event.id != id);
    console.log("updatedEvents[activeIndex]", updatedEvents[activeIndex]);
    if (!updatedEvents[activeIndex]) {
      setActiveIndex(activeIndex + 1);
    }
    if (updatedEvents) {
      console.log({ updatedEvents });
      setEvents(updatedEvents);
    }
  };

  useEffect(() => {
    console.log({ events: selectedReward });
  }, [selectedReward]);

  return (
    <>
      {(!user || events?.length !== 0) && (
        <div className="w-full min-h-screen h-full flex-col fixed top-0 left-0 flex justify-center items-center bg-[#000000e7] backdrop-blur-md z-[20000]">
          <div className="mt-2 ">
            <div className="relative flex justify-center">
              <Image alt="Reward" src={rewardImg} className="w-[280px]" />
              <span className="text-xl font-semibold text-white absolute bottom-[18px] shadow left-1/2 -translate-x-1/2">
                Rewards
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center w-full h-screen overflow-y-auto pt-[30px]">
            {!isLoading && data && selectedReward && (
              <>
                <div className="reward-event-sliders relative ">
                  <div className="max-w-full  overflow-x-hidden ">
                    <Swiper
                      initialSlide={activeIndex}
                      onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                      }}
                      slidesPerView={"auto"}
                      centeredSlides={true}
                      onSlideChange={(swiper) => {
                        setActiveIndex(swiper.realIndex);
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                      }}
                      className="!w-[250px]"
                    >
                      {events.map((event, index) => (
                        <SwiperSlide key={index} className="!w-[110px] !pt-8">
                          <Image
                            src={
                              event.rewardType == "Live"
                                ? liveTicket
                                : signinTicket
                            }
                            alt="Ticket"
                            className={`w-[100px] mx-auto origin-center ${activeIndex == index ? "scale-100" : "scale-[0.92] opacity-70"} transition-all rounded-lg select-none`}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  {/* NEXT BUTTON */}
                  {!isEnd && (
                    <button
                      onClick={() => swiperRef.current.slideNext()}
                      className="top-[50px] -right-8 absolute"
                    >
                      <Image
                        src={navigatorIcon}
                        alt="Navigator icon"
                        className="w-[25px]"
                      />
                    </button>
                  )}

                  {/* PREV BUTTON */}
                  {!isBeginning && (
                    <button
                      onClick={() => swiperRef.current.slidePrev()}
                      className="top-[50px]  -left-8 absolute"
                    >
                      <Image
                        src={navigatorIcon}
                        alt="Navigator icon"
                        className="w-[25px] rotate-180"
                      />
                    </button>
                  )}

                  {selectedReward?.title && (
                    <span className="text-center block pt-3 pb-8 relative text-lg">
                      <span className="text-yellow-500 font-extrabold absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-max">
                        {selectedReward.title}
                      </span>
                      <span className="text-[#ffffffbe] font-bold absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-max">
                        {selectedReward.title}
                      </span>
                    </span>
                  )}
                </div>
                <div className="mb-12">
                  <RewardEventCountdown expiryDate={selectedReward.expiry} />
                </div>
              </>
            )}

            {(!user || (!isLoading && data && selectedReward)) && (
              <EggHuntGame
                onEventDelete={handleRemoveEventById}
                reward={selectedReward}
                isFetching={isFetching}
              />
            )}

            {isLoading && !data && (
              <div className="top-60 left-1/2 absolute -translate-x-1/2 ">
                <ColorRing
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={handleClaim}
                className="px-20 rounded-3xl cursor-pointer py-1 text-lg text-[#cf271b] font-bold bg-gradient-to-t from-[#feb414] to-[#fef9ee]"
              >
                Claim
              </button>
            </div>

            <div className="py-4 ">
              <Leaderborad />
            </div>

            <div className="top-5 right-5 absolute">
              <button
                onClick={() => onClose()}
                className="cursor-pointer text-3xl text-white"
              >
                <AiOutlineCloseCircle />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EggHunt;
