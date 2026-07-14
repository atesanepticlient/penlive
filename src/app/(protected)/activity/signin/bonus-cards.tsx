/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

import money from "@/../public/icons/rewards/money.png";
import beg from "@/../public/icons/rewards/bag.png";
import eggHunt from "@/../public/icons/rewards/egg-hunt.png";
import Image from "next/image";
import { useClaimSignRewardMutation } from "@/lib/features/rewardApiSlice";
import toast from "react-hot-toast";
import { INTERNAL_SERVER_ERROR } from "@/error";
import ActionModal from "@/components/action-modal";
import { redirect } from "next/navigation";
import { ClaimingLoading } from "../../invite-friends/rewards";

const BonusCards = ({
  rewards,
  progress,
  nextLevel,
}: {
  rewards: any[];
  progress: { deposit?: number; betting?: number };
  nextLevel: any;
}) => {
  const [requirementsModal, setRequirementsModal] = useState(false);

  const handleGo = () => {
    if (nextLevel.deposit > 0) {
      redirect("/deposit");
    } else if (nextLevel.betting > 0) {
      redirect("/");
    }
  };

  return (
    <div className="bg-white px-4  grid grid-cols-3 gap-3">
      {rewards.map((reward, i) => (
        <BonusCard
          reward={reward}
          key={i}
          setActionModalOpen={() => setRequirementsModal(true)}
        />
      ))}

      {requirementsModal && (
        <ActionModal
          header="Confirmation"
          onGo={() => handleGo()}
          onClose={() => setRequirementsModal(false)}
        >
          <p className="text-sm text-center">
            Plase Complete the{" "}
            <span className="font-medium">deposit/betting</span> requirements
            for todays sign-in bonus.
          </p>
          <div>
            {nextLevel.deposit > 0 && (
              <p className="text-center text-sm ">
                Current Deposit amount : {progress.deposit}
              </p>
            )}
            {nextLevel.betting > 0 && (
              <p className="text-center text-sm ">
                Current Betting amount : {progress.betting}
              </p>
            )}

            {nextLevel.deposit > 0 && (
              <p className="text-center text-sm ">
                Required Deposit amount : {nextLevel.deposit}
              </p>
            )}

            {nextLevel.betting > 0 && (
              <p className="text-center text-sm ">
                Required Betting amount : {nextLevel.betting}
              </p>
            )}
          </div>
        </ActionModal>
      )}
    </div>
  );
};

export default BonusCards;

interface BonusCardProps {
  reward: any;
  setActionModalOpen?: () => void;
}
const BonusCard = ({ reward, setActionModalOpen }: BonusCardProps) => {
  const [claimApi, { isLoading }] = useClaimSignRewardMutation();
  const handleClaimReward = (id: string) => {
    if (!reward.isClaimable) {
      setActionModalOpen();
      return true;
    }
    claimApi({ id })
      .unwrap()
      .catch((error) => {
        if (error.data.error) {
          toast.error(error.data.error);
        } else {
          toast.error(INTERNAL_SERVER_ERROR);
        }
      });
  };

  return (
    <div className="rounded-lg border border-green-200 overflow-hidden ">
      <h4 className="text-sm py-1 text-white text-center font-semibold bg-blue-600">
        Day {reward.day}
      </h4>

      <div className="bg-[#FBF4ED] h-[170px] ">
        <div className="z-[2] relative h-full flex flex-col justify-between">
          <div className="absolute z-[-1] w-full h-[80px] signin-bonus-bg-effect"></div>
          <div className="flex items-center  gap-2 justify-between px-2 py-1.5">
            {reward.cash > 0 && (
              <Image
                src={money}
                alt="Money"
                className="w-[60px] h-auto select-none mx-auto"
              />
            )}

            {reward.beg && (
              <Image
                src={beg}
                alt="Beg"
                className="w-[60px] h-auto select-none"
              />
            )}
            {reward.eggHunt && (
              <Image
                src={eggHunt}
                alt="Egg Hunt"
                className="w-[60px] h-auto select-none"
              />
            )}
          </div>
          <div className="px-2 py-1 ">
            <div className="">
              <p className="text-xs font-bold text-gray-500">
                Bonus ৳ {reward.cash}
              </p>
              {reward.eggHunt && (
                <p className="text-xs font-bold text-gray-500">20 Golden Egg</p>
              )}
              {reward.beg && (
                <p className="text-xs font-bold text-gray-500">Red envelope</p>
              )}
            </div>

            <button
              onClick={() => handleClaimReward(reward.id)}
              disabled={
                reward.status == "AVAILABLE" ||
                reward.status == "CLAIMED" ||
                isLoading
              }
              className={` ${
                reward.status == "CLAIMED" || reward.status == "AVAILABLE"
                  ? "bg-gray-500"
                  : "bg-gradient-to-r from-[#f8493f] to-[#fd603f]"
              } w-full py-1 rounded-full text-sm text-white cursor-pointer mt-4 mb-2`}
            >
              {reward.status == "CLAIMED"
                ? "Claimed"
                : reward.status == "AVAILABLE"
                  ? "Signin"
                  : "Signin"}
            </button>
          </div>
        </div>
      </div>

      {isLoading && <ClaimingLoading />}
    </div>
  );
};
