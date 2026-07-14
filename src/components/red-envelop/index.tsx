"use client";
import React, { useEffect, useRef, useState } from "react";
import Leaderborad from "../wheel/leaderborad";
import Image from "next/image";
import rewardImg from "@/../public/reward.png";
import { AiOutlineCloseCircle } from "react-icons/ai";
import RewardEventCountdown from "../event-timecound-down";
import { ColorRing } from "react-loader-spinner";
import RewardsTicketModal from "../reward-ticket";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import evnelopThum from "@/../public/red-envelope/raffle.gif";
import EnvelopGame from "./game";
import { RewardEventTicketType, RewardName } from "@prisma/client";
import { useFetchRewardEvetsQuery } from "@/lib/features/rewardApiSlice";
import useCurrentUser from "@/hook/useCurrentUser";

import liveTicket from "@/../public/red-envelope/live-ticket.png";
import signinTicket from "@/../public/red-envelope/signin-ticket.png";
import { redirect } from "next/navigation";
const Envelop = ({
  onClose,
  selectedEventId,
}: {
  onClose: () => void;
  selectedEventId?: string;
}) => {
  const user = useCurrentUser();

  const swiperRef = useRef(null);
  const [gameStart, setGameStart] = useState(false);

  const { data, isLoading } = useFetchRewardEvetsQuery({
    name: RewardName.ENVELOP,
  });

  const [events, setEvents] = useState(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedReward, setSelectedReward] = useState(null);
  const [requirementsModal, setRequirementModal] = useState(false);

  // set events when it's come from api
  useEffect(() => {
    console.log({ events: data?.payload?.events });
    if (data?.payload?.events) {
      setEvents(data?.payload?.events);
    }
  }, [data]);

  useEffect(() => {
    if (selectedEventId) {
      if (Array.isArray(events)) {
        let index = events.findIndex((event) => event.id == selectedEventId);
        index = index === -1 ? 0 : index;

        setActiveIndex(index);
        swiperRef?.current?.slideTo(index);
      }
    }
  }, [selectedEventId, swiperRef]);

  useEffect(() => {
    if (Array.isArray(events)) {
      const selectedReward = events[activeIndex];
      setSelectedReward(selectedReward);
    }
  }, [activeIndex, events]);

  const checkRequirementsFullfilled = () => {
    // Handle case when selectedReward is null or undefined
    if (!selectedReward) return false;

    if (selectedReward.ticketType == RewardEventTicketType.DEPOSIT) {
      return (
        selectedReward.requirementsProgress?.[0]?.progress?.deposit >=
        +selectedReward.requirementsProgress?.[0]?.account
      );
    } else if (selectedReward.ticketType == RewardEventTicketType.BET) {
      return (
        selectedReward.requirementsProgress?.[0]?.progress?.bet >=
        +selectedReward.requirementsProgress?.[0]?.account
      );
    } else if (selectedReward.ticketType == RewardEventTicketType.INVITE) {
      return (
        selectedReward.requirementsProgress?.[0]?.progress?.invite >=
        +selectedReward.requirementsProgress?.[0]?.account
      );
    } else return true;
  };

  const handleStartGame = () => {
    if (!user) {
      return redirect("/login");
    }
    if (!selectedReward) {
      return;
    }
    const requirementsFullFill = checkRequirementsFullfilled();
    if (!requirementsFullFill) {
      setRequirementModal(true);
      return;
    }

    setGameStart(true);
  };

  const removeEventById = (id: string) => {
    const updatedEvents = events?.filter((event) => event.id != id);
    if (updatedEvents) {
      setEvents(updatedEvents);
    }
  };

  const {
    requireFig,
    progressFig,
    requirementTitle,
    requirementButtonLabel,
    redirectAfterRequirement,
  } = getRewardMeta(selectedReward);

  return (
    <>
      {(!user || events?.length != 0) && (
        <div className="w-full min-h-screen h-full flex-col fixed top-0 left-0 flex justify-center items-center bg-[#000000e7] backdrop-blur-md z-[20000]">
          <div className="my-2 ">
            <div className="relative flex justify-center">
              <Image alt="Reward" src={rewardImg} className="w-[280px]" />
              <span className="text-xl font-semibold text-white absolute bottom-[18px] shadow left-1/2 -translate-x-1/2">
                Rewards
              </span>
            </div>
          </div>

          <div className="overflow-y-auto overflow-x-hidden h-screen flex flex-col items-center">
            {!isLoading && data && selectedReward && (
              <>
                <div className="selectedReward-event-sliders relative ">
                  <div className="max-w-full  overflow-x-hidden  ">
                    <Swiper
                      initialSlide={activeIndex}
                      onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        // setIsBeginning(swiper.isBeginning);
                        // setIsEnd(swiper.isEnd);
                      }}
                      slidesPerView={"auto"}
                      centeredSlides={true}
                      onSlideChange={(swiper) => {
                        setActiveIndex(swiper.realIndex);
                        // setIsBeginning(swiper.isBeginning);
                        // setIsEnd(swiper.isEnd);
                      }}
                      className="!w-[250px]"
                    >
                      {events.map((event, index) => (
                        <SwiperSlide key={index} className="!w-[110px] ">
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
                  {/* {!isEnd && (
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
              )} */}

                  {/* PREV BUTTON */}
                  {/* {!isBeginning && (
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
              )} */}

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
                  <RewardEventCountdown expiryDate={new Date()} />
                </div>
              </>
            )}

            {(!user || (!isLoading && data && selectedReward)) && (
              <>
                <div>
                  <button onClick={() => handleStartGame()}>
                    <Image
                      src={evnelopThum}
                      alt="Red Envelop"
                      className="w-[250px]"
                    />
                  </button>
                </div>
                <div className="mt-16">
                  <button
                    // onClick={handleSpin}
                    // disabled={isLoading || spinning || isFetching || claiming}
                    // title={`${isLoading ? "Wait.." : "Spin"}`}
                    className="px-20 rounded-3xl cursor-pointer py-1 text-lg text-[#cf271b] font-bold bg-gradient-to-t from-[#feb414] to-[#fef9ee]"
                  >
                    Claim
                  </button>
                </div>

                <div className="py-10 ">
                  <Leaderborad />
                </div>
              </>
            )}

            {isLoading && !data && (
              <div className="h-[400px] w-full flex justify-center items-center">
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
              </div>
            )}

            {gameStart && selectedReward && (
              <EnvelopGame
                onDeleteEventById={removeEventById}
                reward={selectedReward}
                show={gameStart}
                prize={selectedReward.prize}
                onClose={() => setGameStart(false)}
              />
            )}
          </div>

          <div className="top-5 right-5 absolute">
            <button
              onClick={() => onClose()}
              className="cursor-pointer text-3xl text-white"
            >
              <AiOutlineCloseCircle />
            </button>
          </div>

          <RewardsTicketModal
            show={requirementsModal}
            onClose={() => setRequirementModal(false)}
            requireMents={requireFig}
            progress={progressFig}
            requirementTitle={requirementTitle}
            buttonLevel={requirementButtonLabel}
            redirect={redirectAfterRequirement}
          />
        </div>
      )}
    </>
  );
};

export default Envelop;

export const getRewardMeta = (selectedReward) => {
  if (!selectedReward) {
    return {
      requireFig: 0,
      progressFig: 0,
      requirementTitle: "",
      requirementButtonLabel: "Claim",
      redirectAfterRequirement: "/",
    };
  }

  const type = selectedReward.ticketType;
  const progressData = selectedReward?.requirementsProgress?.[0] || {};

  const requireFig = +progressData?.account || 0;

  let progressFig = 0;
  let requirementTitle = "";
  let requirementButtonLabel = "Invite";
  let redirectAfterRequirement = "/invite-friends";

  switch (type) {
    case RewardEventTicketType.DEPOSIT:
      progressFig = +progressData?.progress?.deposit || 0;
      requirementTitle = "Amount to valid deposit - Before claiming the ticket";
      requirementButtonLabel = "Deposit";
      redirectAfterRequirement = "/deposit";
      break;

    case RewardEventTicketType.BET:
      progressFig = +progressData?.progress?.bet || 0;
      requirementTitle = "Amount to bet - Before claiming the ticket";
      requirementButtonLabel = "Bet";
      redirectAfterRequirement = "/";
      break;
    case RewardEventTicketType.INVITE:
      progressFig = +progressData?.progress?.bet || 0;
      requirementTitle = "Amount to Invite - Before claiming the ticket";
      requirementButtonLabel = "Invite";
      redirectAfterRequirement = "/invite-friends";
      break;

    default:
      break;
  }

  return {
    requireFig,
    progressFig,
    requirementTitle,
    requirementButtonLabel,
    redirectAfterRequirement,
  };
};
