"use client";
import React, { useEffect, useRef, useState } from "react";
import rewardImg from "@/../public/reward.png";
import Image from "next/image";
import Leaderborad from "./leaderborad";
import { AiOutlineCloseCircle } from "react-icons/ai";
import useCurrentUser from "@/hook/useCurrentUser";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import RewardsTicketModal from "../reward-ticket";
import RewardEventCountdown from "@/components/event-timecound-down";
import {
  useClaimRewardEventMutation,
  useFetchRewardEvetsQuery,
} from "@/lib/features/rewardApiSlice";
import { RewardEventTicketType, RewardName } from "@prisma/client";
import { ColorRing } from "react-loader-spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import liveTicket from "@/../public/wheel/live-ticket.png";
import signinTicket from "@/../public/wheel/signin-ticket.png";
import RewardModal from "../reward-modal";
import { getRewardMeta } from "../red-envelop";

const generatePrizeArray = (include?: number) => {
  if (!include) {
    return [1, 0, 5, 8, 25, 100, 200, 500];
  }

  const NICE_VALUES = [1, 5, 10, 25, 50, 75, 100, 150, 200, 250, 500, 750, 900];

  const shuffle = (arr: number[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const pool = NICE_VALUES.filter((v) => v !== include && v !== 0);

  const less = pool.filter((v) => v < include);
  const greater = pool.filter((v) => v > include);

  const result = new Set<number>();

  // must include these
  result.add(include);
  result.add(0);

  // ensure at least one smaller & one greater
  if (less.length) {
    result.add(less[Math.floor(Math.random() * less.length)]);
  }

  if (greater.length) {
    result.add(greater[Math.floor(Math.random() * greater.length)]);
  }

  // fill remaining
  while (result.size < 8) {
    const rand = pool[Math.floor(Math.random() * pool.length)];
    result.add(rand);
  }

  // 🔥 shuffle so include is NOT fixed position
  return shuffle(Array.from(result));
};

const Wheel = ({
  onClose,
  selectedEventId,
}: {
  onClose?: () => void;
  selectedEventId?: string;
}) => {
  const user = useCurrentUser();
  const [prizes, setPrizes] = useState(generatePrizeArray());
  const [calculatedPrize, setCalculatedPrize] = useState(0);

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [claimError, setClaimError] = useState(false);
  const [claimSuccessModal, setClaimSuccessModal] = useState(false);
  const [ticketModalShow, setTicketModalShow] = useState(false);
  const [spinFinished, setSpinFinished] = useState(false);
  const [apiFinished, setApiFinished] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);

  const { data, isLoading, isFetching } = useFetchRewardEvetsQuery({
    name: RewardName.SPIN,
  });
  const [events, setEvents] = useState(null);
  console.log({ events });
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedReward, setSelectedReward] = useState(null);
  const swiperRef = useRef(null);
  const [extraRotation, setExtraRotation] = useState(0);
  const [waitingModal, setWaitingModal] = useState(false);
  const [spinDisplayMessage, setSpinDisplayMessage] = useState(null);
  const spinTimeoutRef = useRef<any>(null);
  const spinIntervalRef = useRef<any>(null);

  const [claimApi, { isLoading: claiming }] = useClaimRewardEventMutation();
  const claimSpin = () => {
    claimApi({
      prize: selectedReward.prize,
      prizeHash: selectedReward.prizeHash,
      rewardId: selectedReward.id,
      rewardType: selectedReward.rewardType,
    })
      .unwrap()
      .then(() => {
        setApiSuccess(true);
        setApiFinished(true);
      })
      .catch((error) => {
        console.log({ wheelError: error });
        setApiSuccess(false);
        setApiFinished(true);
        setClaimError(true);
        stopAllSpinning();
        toast.error("Reward Not Claimed!");
      });
  };
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

  const removeEventById = (id: string) => {
    const updatedEvents = events?.filter((event) => event.id != id);
    if (updatedEvents) {
      setEvents(updatedEvents);
    }
  };
  const stopAllSpinning = () => {
    // stop states
    setSpinning(false);
    setSpinFinished(true);

    // reset rotation
    setRotation(0);
    setExtraRotation(0);

    // clear timers
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
    }
  };
  const handleSpin = () => {
    if (!user) return redirect("/login");

    const requirementsFullFill = checkRequirementsFullfilled();
    if (!requirementsFullFill) {
      setTicketModalShow(true);
      return;
    }

    if (spinning || isLoading || isFetching) {
      setSpinDisplayMessage("Please wait!");
      setTimeout(() => setSpinDisplayMessage(null), 3000);
      return;
    }

    // reset states
    setSpinFinished(false);
    setApiFinished(false);
    setApiSuccess(false);

    if (prize) setPrize(null);
    if (claimError) setClaimError(false);
    if (claimSuccessModal) setClaimSuccessModal(false);

    const segments = prizes.length;
    const anglePerSegment = 360 / segments;
    const winIndex = prizes.indexOf(calculatedPrize);

    if (winIndex === -1) return;

    claimSpin(); // API call

    const segmentCenter = winIndex * anglePerSegment + anglePerSegment / 2;
    const desired = ((-segmentCenter % 360) + 360) % 360;

    setSpinning(true);

    setRotation((prev) => {
      const extraSpins = 5 * 360;
      const current = ((prev % 360) + 360) % 360;
      const deltaWithinCircle = (desired - current + 360) % 360;
      return prev + extraSpins + deltaWithinCircle;
    });

    // minimum spin duration
    spinTimeoutRef.current = setTimeout(() => {
      setSpinFinished(true);
    }, 4000);
  };

  // set events when it's come from api
  useEffect(() => {
    console.log({ events: data?.payload?.events });
    if (data?.payload?.events) {
      setEvents(data?.payload?.events);
    }
  }, [data]);

  // update the win when it's come from db
  useEffect(() => {
    if (selectedReward?.prize) {
      setCalculatedPrize(selectedReward?.prize);
      const fullfillRequirements = checkRequirementsFullfilled();
      if (fullfillRequirements) {
        setPrizes(generatePrizeArray(selectedReward?.prize));
      } else {
        setPrizes(generatePrizeArray());
      }
    }
  }, [selectedReward]);

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
      setSelectedReward(selectedReward);
    }
  }, [activeIndex, events]);

  useEffect(() => {
    if (!apiSuccess) return;
    if (spinFinished && apiFinished) {
      setSpinning(false);
      setExtraRotation(0); // reset

      if (apiSuccess) {
        setPrize(calculatedPrize);
        setWaitingModal(true);
        setTimeout(() => {
          setClaimSuccessModal(true);
          setWaitingModal(false);
          setTimeout(() => {
            setClaimSuccessModal(false);
            setPrize(null);
            setClaimError(false);
            stopAllSpinning();
            removeEventById(selectedReward.id);
          }, 3000);
        }, 1000);
      } else {
        setPrize(0);
      }
    }
  }, [spinFinished, apiFinished]);

  useEffect(() => {
    if (spinning && !spinFinished) {
      spinIntervalRef.current = setInterval(() => {
        setExtraRotation((prev) => prev + 360);
      }, 1000);
    }

    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
    };
  }, [spinning, spinFinished]);

  const {
    requireFig,
    progressFig,
    requirementTitle,
    requirementButtonLabel,
    redirectAfterRequirement,
  } = getRewardMeta(selectedReward);

  console.log({ prize });

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

          <div className=" overflow-y-auto overflow-x-hidden h-screen flex flex-col items-center  ">
            {!isLoading && data && selectedReward && (
              <>
                <div className="selectedReward-event-sliders relative ">
                  <div className="max-w-full  overflow-x-hidden  ">
                    <Swiper
                      initialSlide={activeIndex}
                      onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                      }}
                      slidesPerView={"auto"}
                      centeredSlides={true}
                      onSlideChange={(swiper) => {
                        setActiveIndex(swiper.realIndex);
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
                  <RewardEventCountdown expiryDate={selectedReward.expiry} />
                </div>
              </>
            )}

            {(!user || (!isLoading && events)) && (
              <>
                <div className="w-[400px] mt-12 relative flex justify-center items-center ">
                  {/* static border + glow */}

                  <div className="wheel-border"></div>
                  <div className="wheel-grow"></div>

                  {/* ONLY THIS SPINS */}
                  <div
                    className="wheel-plate aspect-square"
                    style={{
                      transform: `rotate(${rotation + extraRotation}deg)`,
                      transition: spinning ? "transform 1s linear" : "none",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {prizes?.map((prize, i) => (
                        <div
                          key={i}
                          className="absolute w-32 h-[60%] "
                          style={{
                            transform: `rotate(${i * 45}deg)`,
                          }}
                        >
                          <div
                            style={{
                              transform: `rotate(105deg)`,
                            }}
                            className="selectedReward-icon ml-[70px]  h-[30px] flex items-center"
                          >
                            <span className="text-xl">💰 </span>
                            <span className="text-xs  font-medium select-none">
                              ৳ {prize}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {spinDisplayMessage && (
                      <span className="top-[35%] absolute  left-1/2 font-medium bg-[#000000bc] text-white text-sm px-2 py-0.5 rounded-sm">
                        {spinDisplayMessage}
                      </span>
                    )}
                  </div>

                  {prize && <div className="slice-highlight"></div>}
                  {prize && <div className="slices-blue"></div>}

                  <button
                    className="spin-button"
                    onClick={handleSpin}
                    disabled={
                      isLoading ||
                      spinning ||
                      isFetching ||
                      claiming ||
                      waitingModal
                    }
                    title={`${isLoading ? "Wait.." : "Spin"}`}
                  ></button>
                </div>
                <div className="mt-16">
                  <button
                    onClick={handleSpin}
                    disabled={
                      isLoading ||
                      spinning ||
                      isFetching ||
                      claiming ||
                      waitingModal
                    }
                    title={`${isLoading ? "Wait.." : "Spin"}`}
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

            <div className="top-5 right-5 absolute">
              <button
                onClick={() => onClose()}
                className="cursor-pointer text-3xl text-white"
              >
                <AiOutlineCloseCircle />
              </button>
            </div>
          </div>

          {prize && (
            <RewardModal
              show={claimSuccessModal}
              onClose={() => {
                setClaimSuccessModal(false);
                setWaitingModal(false);
              }}
              reward={prize}
            />
          )}

          {data && (
            <RewardsTicketModal
              show={ticketModalShow}
              onClose={() => setTicketModalShow(false)}
              requireMents={requireFig}
              progress={progressFig}
              requirementTitle={requirementTitle}
              buttonLevel={requirementButtonLabel}
              redirect={redirectAfterRequirement}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Wheel;
