"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import rewardImg from "@/../public/reward.png";
import Image from "next/image";
import Link from "next/link";

const RewardsTicketModal = ({
  show = false,
  onClose,
  // progress: current deposited amount
  progress = 0,
  requireMents = 100,
  requirementTitle = "Amount to deposit - After claiming the ticket ",
  buttonLevel = "Go",
  redirect = "/",
}) => {
  // local animated values
  const [ticketWidth, setTicketWidth] = useState(0);
  const [depositWidth, setDepositWidth] = useState(0);

  const progressOfTicket = (progress / requireMents) * 100;

  // clamp and compute percentages
  const ticketPercent = Math.min(Math.max(progressOfTicket, 0), 100);
  const depositPercent = Math.min(
    Math.max((progress / requireMents) * 100, 0),
    100,
  );

  // animate width when props change
  useEffect(() => {
    setTicketWidth(ticketPercent);
  }, [ticketPercent]);

  useEffect(() => {
    setDepositWidth(depositPercent);
  }, [depositPercent]);

  if (!show) return null;

  return (
    <div className="top-0 left-0 absolute w-full z-[3000]">
      <div className="flex  justify-center w-full min-h-screen bg-[#000000cb] p-4">
        <div className="relative w-full max-w-md bg-transparent rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Section with Crown and Trumpets */}
          <div className="relative pt-12 pb-6 bg-transparent">
            <button
              onClick={() => onClose(true)}
              className="absolute top-4 right-4 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition"
            >
              <X size={24} />
            </button>

            <div className="flex justify-center mb-[-20px] relative z-10">
              <div className="text-5xl">👑</div>
            </div>

            <div className="relative flex justify-center">
              <Image alt="Reward" src={rewardImg} className="w-[60%]" />
              <span className="text-xl font-semibold text-white absolute bottom-3.5 shadow left-1/2 -translate-x-1/2">
                Rewards
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-6 pb-8 text-center">
            <p className="text-white text-lg font-medium mb-4">
              Complete the task to claim your ticket
            </p>

            {/* Top Progress Bar – Ticket */}
            <div className="relative w-full h-6 bg-black/70 rounded-full border border-gray-600 mb-6 overflow-hidden">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-sm font-bold">
                {ticketPercent.toFixed(2)}%
              </div>
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${ticketWidth}%` }}
              />
            </div>

            {/* Deposit Task Card */}
            <div className="bg-[#424547] rounded-2xl p-6 shadow-inner">
              <div className="flex justify-between items-start mb-6">
                <div className="text-left">
                  <p className="text-gray-200 text-sm md:text-base">
                    {requirementTitle}
                    <span className="text-yellow-500 font-bold">
                      ≥ ৳ {requireMents}
                    </span>
                  </p>
                </div>
                <Link href={redirect}>
                  <button className="bg-gradient-to-b from-orange-300 to-orange-500 hover:from-orange-400 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform active:scale-95 text-base">
                    {buttonLevel}
                  </button>
                </Link>
              </div>

              {/* Bottom Progress Bar – Deposit */}
              <div className="relative w-full h-3 bg-black/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-700 ease-out"
                  style={{ width: `${depositWidth}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400 font-bold">
                <span>0</span>
                <span>{requireMents}</span>
              </div>
              <div className="mt-1 text-right text-[10px] text-gray-300">
                {progress} / {requireMents} ({depositPercent.toFixed(2)}
                %)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsTicketModal;
