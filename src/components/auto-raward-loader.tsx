"use client";

import { useFetchRewardHubQuery } from "@/lib/features/rewardApiSlice";
import React, { useEffect, useState } from "react";
import EggHunt from "./egg-hunt";
import Envelop from "./red-envelop";
import Wheel from "./wheel/wheel";
function getRandomInt(start, end, avoid = []) {
  // Create valid numbers list
  const validNumbers = [];

  for (let i = start; i <= end; i++) {
    if (!avoid.includes(i)) {
      validNumbers.push(i);
    }
  }

  // Edge case: nothing left
  if (validNumbers.length === 0) {
    throw new Error("No valid numbers available");
  }

  // Pick random index
  const randomIndex = Math.floor(Math.random() * validNumbers.length);

  return validNumbers[randomIndex];
}
const AutoRawardLoader = () => {
  const [rewardShowDone, setRewardShowDone] = useState([]);
  const [autoShowRewards, setAutoShowRewards] = useState([]);
  const [rewardData, setRewardData] = useState({
    rewardName: "",
    id: "",
  });
  const { data: rewardHub, isLoading } = useFetchRewardHubQuery();

  const rewardsEventData = rewardHub?.payload?.eventsData;

  useEffect(() => {
    if (rewardsEventData) {
      const newAutoShowRewards = [];
      if (rewardsEventData?.egg?.length > 0) {
        newAutoShowRewards.push({
          rewardName: "EGG",
          id: rewardsEventData.egg[0].id,
        });
      }
      if (rewardsEventData?.spin.length > 0) {
        newAutoShowRewards.push({
          rewardName: "SPIN",
          id: rewardsEventData?.spin[0].id,
        });
      }
      if (rewardsEventData?.envelop?.length > 0) {
        newAutoShowRewards.push({
          rewardName: "ENVELOP",
          id: rewardsEventData?.envelop[0].id,
        });
      }

      if (newAutoShowRewards.length > 0) {
        setAutoShowRewards(newAutoShowRewards);
        setTimeout(() => {
          const randomIndex = getRandomInt(
            0,
            newAutoShowRewards.length - 1,
            rewardShowDone,
          );
          console.log("Random from effect", randomIndex);
          setRewardData(newAutoShowRewards[randomIndex]);
          setRewardShowDone((state) => [...state, randomIndex]);
        }, 1000);
      }
    }
  }, [rewardsEventData]);

  // 0,
  const handleCloseReward = () => {
    setRewardData({ rewardName: "", id: "" });
    if (autoShowRewards.length != rewardShowDone.length) {
      setTimeout(() => {
        const randomIndex = getRandomInt(
          0,
          autoShowRewards.length - 1,
          rewardShowDone,
        );

        setRewardData(autoShowRewards[randomIndex]);
        setRewardShowDone((state) => [...state, randomIndex]);
      }, 1000);
    }
  };

  if (!isLoading && rewardsEventData) {
    return (
      <>
        {rewardData.rewardName == "SPIN" && (
          <Wheel
            selectedEventId={rewardData.id}
            onClose={() => handleCloseReward()}
          />
        )}
        {rewardData.rewardName == "EGG" && (
          <EggHunt
            selectedEventId={rewardData.id}
            onClose={() => handleCloseReward()}
          />
        )}
        {rewardData.rewardName == "ENVELOP" && (
          <Envelop
            selectedEventId={rewardData.id}
            onClose={() => handleCloseReward()}
          />
        )}
      </>
    );
  } else {
    return null;
  }
};

export default AutoRawardLoader;
