"use client";
import {
  useCliamAirdropMutation,
  useCreateAirDropMutation,
  useFetchAirdDroStatusQuery,
} from "@/lib/features/promotionsSlice";
import React, { useEffect, useState } from "react";

import progress1 from "@/../public/airdrop/registration/prograss-1.png";
import progress2 from "@/../public/airdrop/registration/prograss-2.png";
import progress3 from "@/../public/airdrop/registration/prograss-3.png";
import progress4 from "@/../public/airdrop/registration/prograss-4.png";
import progress5 from "@/../public/airdrop/registration/prograss-5.png";

import ImageMap from "../image-map";
import Image from "next/image";
import { AirDropStatus } from "@prisma/client";
import toast from "react-hot-toast";
import Link from "next/link";
import BackButton from "../back-button";
import RewardsTicketModal from "@/components/reward-ticket";

const Claim = () => {
  const { data, isLoading } = useFetchAirdDroStatusQuery({
    airdrop: "FIRST_JOIN",
  });
  const airDropStatus = data?.payload?.airdropUserStatus;

  const status =
    airDropStatus?.airDrop.prize - airDropStatus?.prizeCliamed == 1
      ? "CLAIME1"
      : airDropStatus?.airDrop.prize - airDropStatus?.prizeCliamed == 0.5
        ? "CLAIME2"
        : airDropStatus &&
            airDropStatus?.airDrop.prize == airDropStatus?.prizeCliamed &&
            airDropStatus?.status !== AirDropStatus.CLAIMED
          ? "READY"
          : airDropStatus?.status == AirDropStatus.CLAIMED
            ? "CLAIMED"
            : "CLAIMRREQ";

  const image =
    status == "CLAIME1"
      ? progress2
      : status == "CLAIME2"
        ? progress3
        : status == "READY"
          ? progress4
          : status == "CLAIMED"
            ? progress5
            : progress1;

  const [airDropCreateApi, { isLoading: creating }] =
    useCreateAirDropMutation();
  const [airDropClaimAPi, { isLoading: claiming }] = useCliamAirdropMutation();
  const [claimApiState, setClaimApiState] = useState("UNCALLED");
  const [rewardTicketModalShow, setRewardTicketModalShow] = useState(false);
  const handleClick = async () => {
    if (claiming || creating) return;

    if (status == "CLAIMRREQ" && !airDropStatus) {
      airDropCreateApi({ airdrop: "FIRST_JOIN" })
        .unwrap()
        .then(() => {})
        .catch((error) => {
          toast.error(error?.data.error || "Try Again!");
        });

      return;
    } else if (status == "READY") {
      setClaimApiState("CALLED");
      airDropClaimAPi({ airdrop: airDropStatus.id })
        .unwrap()
        .then(() => {
          setClaimApiState("SUCCESS");
        })
        .catch(() => {
          setClaimApiState("FAILED");
        });
      return;
    }
    setRewardTicketModalShow(true);
  };

  return (
    <div className="h-screen flex justify-center">
      {!isLoading && (
        <>
          <ImageMap
            x="24%"
            y="87.50%"
            width="52%"
            height="8%"
            onClick={handleClick}
            buttonHide={status == "CLAIMED"}
          >
            <Image
              src={image}
              alt="New User Bonus"
              className="w-full h-full md:w-[60%] lg:w-[50%]"
            />
          </ImageMap>
          {}
          {claimApiState !== "UNCALLED" && (
            <ClaimingLoading status={claimApiState} />
          )}

          <div className=" top-6 left-6 absolute">
            <BackButton />
          </div>
          {airDropStatus && (
            <RewardsTicketModal
              onClose={() => setRewardTicketModalShow(false)}
              show={rewardTicketModalShow}
              progress={airDropStatus.dpFullFill}
              requireMents={airDropStatus.airDrop.dpRequirement}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Claim;

const ClaimingLoading = ({ status }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-transparent backdrop-blur-sm flex items-center justify-center">
      <div className="w-[250px] h-[170px]  rounded-sm flex flex-col items-center justify-center py-4">
        <CircleProgress status={status} size={50} strokeWidth={4} />

        {status == "CALLED" && (
          <span className="text-base mt-2 block">পুরুষ্কার লোড হচ্ছে...</span>
        )}
        {status == "SUCCESS" && (
          <div>
            <span className="text-base mt-2 block">
              পুরুষ্কার একাউন্টে যুক্ত হয়েছে
            </span>
            <Link href="/member">
              <button className="text-sm block mx-auto w-auto rounded-sm  border mt-3 px-4 py-1.5">
                দেখুন
              </button>
            </Link>
          </div>
        )}
        {status == "FAILED" && (
          <div>
            <span className="text-base mt-2 block">কিছু সমস্যা হয়েছে!</span>
            <button
              onClick={() => location.reload()}
              className="text-sm block mx-auto w-auto rounded-sm border mt-3 px-4 py-1.5"
            >
              পুনরায় চেষ্টা
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface CircleProgressProps {
  status?: "CALLED" | "SUCCESS" | "FAILED";
  size?: number;
  strokeWidth?: number;
}

function CircleProgress({
  status = "CALLED",
  size = 64,
  strokeWidth = 4,
}: CircleProgressProps) {
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    if (status === "SUCCESS" || status === "FAILED") {
      // Small delay for smooth transition
      const timer = setTimeout(() => setShowIcon(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowIcon(false);
    }
  }, [status]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const isSuccess = status === "SUCCESS";
  const isFailed = status === "FAILED";

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Spinning Progress Circle */}
      <svg
        width={size}
        height={size}
        className={`transition-all duration-500 ${
          showIcon ? "opacity-0 scale-0" : "opacity-100 scale-100"
        }`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-green-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          className="text-green-500 animate-spin origin-center"
          style={{ animationDuration: "1s" }}
        />
      </svg>

      {/* Success Checkmark Icon */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          showIcon && isSuccess ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <div className="bg-green-500 rounded-full p-2 shadow-lg">
          <svg
            width={size * 0.6}
            height={size * 0.6}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      {/* Failed Cross Icon */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          showIcon && isFailed ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <div className="bg-red-500 rounded-full p-2 shadow-lg">
          <svg
            width={size * 0.6}
            height={size * 0.6}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </div>
    </div>
  );
}
