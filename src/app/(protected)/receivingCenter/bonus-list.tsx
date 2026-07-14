"use client";
import EggHunt from "@/components/egg-hunt";
import Envelop from "@/components/red-envelop";
import Wheel from "@/components/wheel/wheel";
import useTimeCountDown from "@/hook/useTimeCountDown";
import {
  useClaimFixedPrizeRewardEventMutation,
  useFetchRewardEvetsQuery,
} from "@/lib/features/rewardApiSlice";
import { RewardName } from "@prisma/client";
import moment from "moment";
import React, { useState } from "react";
import bonusModal from "@/../public/bonus/reward-modal.png";
import Image from "next/image";
import toast from "react-hot-toast";
const BonusList = () => {
  const { data, isLoading } = useFetchRewardEvetsQuery({ name: "" });

  const events = data?.payload?.events;
  const [gameData, setGameData] = useState(null);
  const [fixedRewardPrizeModalShow, setFixedRewardPrizeModalShow] =
    useState(false);
  const [fixedRewardPrize, setFixedRewardPrize] = useState(0);
  return (
    <div>
      {/* <span className="block text-center text-lg font-bold text-[#33333384] py-10">
        No Bonus Availble
      </span> */}

      {data && !isLoading && (
        <div className="grid grid-cols-1 ">
          {events.map((event, i) => (
            <BonusCard
              rewardType={event?.rewardType}
              key={i}
              id={event.id}
              rewardName={event?.name}
              rewardFor={event?.rewardFor}
              expiry={event?.expiry}
              createdAt={event?.createdAt}
              title={event?.title}
              prize={event?.prize}
              onSetData={(game, id) => setGameData({ name: game, id })}
              onShowFixedRewardModal={() => setFixedRewardPrizeModalShow(true)}
              onSetFixedRewardPrize={(prize) => setFixedRewardPrize(prize)}
            />
          ))}
        </div>
      )}

      <ShowGame
        gameName={gameData?.name}
        onClose={() => setGameData(null)}
        selectedId={gameData?.id}
      />
      <FixedRewardBonusModal
        prize={fixedRewardPrize}
        onClose={() => {
          setFixedRewardPrizeModalShow(false);
          setFixedRewardPrize(0);
        }}
        show={fixedRewardPrizeModalShow}
      />
    </div>
  );
};

export default BonusList;

const BonusCard = ({
  id,
  rewardName,
  title,
  rewardFor,
  createdAt,
  expiry,
  rewardType,
  onSetData,
  prize,
  onShowFixedRewardModal,
  onSetFixedRewardPrize,
}: {
  id: string;
  rewardType: string;
  rewardName: RewardName;
  title: string;
  rewardFor?: string;
  createdAt: Date;
  expiry: Date;
  onSetData: (game: RewardName, id?: string) => void;
  onShowFixedRewardModal: () => void;
  onSetFixedRewardPrize?: (prize: number) => void;
  prize: number;
}) => {
  const rewardCommonName =
    rewardName == "EGGHUNT"
      ? "Golden Egg"
      : rewardName == "ENVELOP"
        ? "Red Envelope"
        : "Routtle wheel";

  const rewardLabelClass =
    rewardType == "Live"
      ? rewardName == "EGGHUNT"
        ? "reward-lebel-orang"
        : rewardName == "SPIN"
          ? "reward-lebel-red"
          : "reward-lebel-pink"
      : "reward-lebel-blue";

  const rewardListItemBgClass =
    rewardType == "Live"
      ? "spin-bonus-recive-list-card-red"
      : "spin-bonus-recive-list-card-blue";

  const getRewardMiddleTextContent = () => {
    if (rewardType == "Fixed") {
      return (
        <div>
          <span className="text-base font-bold text-border text-slate-600">
            {title}
          </span>
          <br />
          <span className="text-sm lg:text-base font-medium text-[#333333b2]">
            Reward : ৳{prize}
          </span>
        </div>
      );
    } else {
      return (
        <div>
          <span className="text-sm lg:text-base font-medium text-[#333333b2]">
            Reward
          </span>
          <br />
          <span className="text-sm lg:text-base font-medium text-[#333333b2]">
            {title}
          </span>
        </div>
      );
    }
  };

  const [claimFixedRewardApi] = useClaimFixedPrizeRewardEventMutation();

  const handleClaimFixedReward = async () => {
    if (rewardType != "Fixed") return;

    onShowFixedRewardModal();
    onSetFixedRewardPrize?.(prize);

    try {
      await claimFixedRewardApi({ rewardId: id }).unwrap();
      // if (res) {
      //   toast.success("Reward claimed");
      // }
    } catch (error) {
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Reward was not claimed!");
      }
    }
  };

  return (
    <div className="flex py-1.5 ">
      <div
        className={`flex-1  h-[160px] py-6 px-4 md:px-10 flex gap-1.5 items-center ${rewardListItemBgClass}`}
      >
        <div
          className={`p-4 w-[130px] min-h-[90px] text-center md:p-5 rounded-2xl bg-gradient-to-br ${rewardLabelClass} flex flex-col items-center justify-center text-white font-sans `}
        >
          <h2 className="text-sm md:text-lg   tracking-tight uppercase ">
            {rewardType == "Live" ? "Reward Voucher" : "Bonus"}
          </h2>
          {(rewardFor || rewardName) && (
            <h3 className="text-sm font-medium">
              {rewardFor || rewardCommonName}
            </h3>
          )}
          <span className="text-sm font-medium">
            {moment(createdAt).format("MMM Do YY")}
          </span>
        </div>
        {getRewardMiddleTextContent()}
      </div>
      <div className="h-[160px] bg-white flex justify-center items-center">
        <BonusAction
          onClaimFixedReward={handleClaimFixedReward}
          rewardType={rewardType}
          expiry={expiry}
          onClaimClick={() => {
            onSetData(rewardName, id);
          }}
        />
      </div>
    </div>
  );
};

const BonusAction = ({
  expiry,
  onClaimClick,
  onClaimFixedReward,
  rewardType,
}) => {
  const handleClaim = () => {
    if (rewardType == "Fixed") {
      onClaimFixedReward();
    } else {
      onClaimClick();
    }
  };
  return (
    <div className="w-[120px] flex flex-col items-center">
      <span className="block text-center text-sm text-gray-400 font-medium ">
        Due Date
      </span>

      <div className="py-2 ">
        <ExpiryTimer expiry={expiry} />
      </div>

      <button
        onClick={() => handleClaim()}
        style={{
          boxShadow: "2px 2px 5px #3ec440",
        }}
        className="bg-gradient-to-r from-[#3ec440] to-[#50dd1c] brightness-105
mx-auto px-1.5 py-2 rounded-full text-white block w-[80%] text-sm"
      >
        Claim
      </button>
    </div>
  );
};

interface CountdownProps {
  expiry: Date;
}

const ExpiryTimer = ({ expiry }: CountdownProps) => {
  const { concrete } = useTimeCountDown({ date: expiry });
  return (
    <div className="flex gap-2 font-mono text-white">
      <div className="flex flex-col items-center">
        <span className="font-sans">
          <span className="text-4xl text-[#373636a4] font-bold leading-1 ">
            {concrete.day}
          </span>
          <sub className="text-[#373636a4] text-lg font-semibold">day</sub>
        </span>
        <p className="text-center font-sans">
          {" "}
          <span className="text-lg font-semibold text-[#373636a4]">
            {concrete.hours}:
          </span>
          <span className="text-lg font-semibold text-[#373636a4] ">
            {concrete.min}:
          </span>
          <span className="text-lg font-semibold text-[#373636a4] ">
            {concrete.sec}
          </span>
        </p>
      </div>
    </div>
  );
};

const ShowGame = ({
  gameName,
  onClose,
  selectedId,
}: {
  gameName?: RewardName;
  onClose: () => void;
  selectedId?: string;
}) => {
  console.log({ selectedId });
  if (gameName == "EGGHUNT") {
    return <EggHunt onClose={() => onClose()} selectedEventId={selectedId} />;
  } else if (gameName == "SPIN") {
    return <Wheel onClose={() => onClose()} selectedEventId={selectedId} />;
  } else if (gameName == "ENVELOP") {
    return <Envelop onClose={() => onClose()} selectedEventId={selectedId} />;
  }
};

const FixedRewardBonusModal = ({
  prize,
  onClose,
  show,
}: {
  prize: number;
  onClose: () => void;
  show: boolean;
}) => {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 w-full h-screen  flex justify-center items-center z-10">
      <div
        onClick={() => onClose()}
        className="top-0 left-0 right-0 absolute w-full h-full bg-[#0000004b]"
      ></div>
      <div className="w-[300px] relative">
        <Image src={bonusModal} alt="Reward" className="w-full select-none" />
        <div className="bottom-12 left-1/2 -translate-x-1/2 absolute w-full">
          <p className="text-sm text-center font-bold uppercase tracking-widest text-amber-900/80 ">
            Congratulations
          </p>
          <p className="text-2xl text-center font-extrabold text-[#3D2511] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] tracking-tight">
            ৳{prize}
          </p>
        </div>
      </div>
    </div>
  );
};
