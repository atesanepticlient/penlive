"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { vipLevelBadgeFinder } from "@/lib/image";
import Image from "next/image";
import Link from "next/link";

interface DataPros {
  level: number;
  progress: {
    totalDeposit: number;
    totalBet: number;
  };
  nextLevelReq: {
    totalDeposit: number;
    totalBet: number;
  };
}
const LevelProgressModal = ({
  show,
  onClose,
  data,
}: {
  show: boolean;
  onClose: () => void;
  data: DataPros;
}) => {
  const [closed, setClosed] = useState(false);
  const handleClose = () => {
    setClosed(true);
    setTimeout(() => {
      onClose();
    }, 100);
  };

  useEffect(() => {
    {
      if (show) {
        setClosed(false);
      }
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="flex z-[100] top-0 left-0 right-0 w-full h-screen overflow-y-hidden bg-[#00000040] fixed">
      <div
        className={`left-1/2 -translate-x-1/2 bottom-10  absolute bottom-to-top-push  ${closed && "bottom-to-top-pull"}`}
      >
        <div className="relative ">
          <UpgradeComponent data={data} />

          <div className="absuolute -bottom-8 !left-1/2  flex justify-center">
            <button
              onClick={() => handleClose()}
              className="  -translate-x-1/2 p-1.5 bg-white text-[#333] rounded-full cursor-pointer text-sm"
            >
              <AiOutlineClose />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelProgressModal;
const UpgradeComponent = ({ data }: { data: DataPros }) => {
  const [totalBet] = useState(data.progress.totalBet);
  const maxBet = data.nextLevelReq.totalBet;
  const progressPercent = (totalBet / maxBet) * 100;

  const [totalDeposit] = useState(data.progress.totalDeposit);
  const maxDeposit = data.nextLevelReq.totalDeposit;
  const depositPercent = (totalDeposit / maxDeposit) * 100;

  // Function to simulate dynamic updating for bet progress

  // Function to simulate dynamic updating

  const { image: badge } = vipLevelBadgeFinder(data.level);
  return (
    <div className=" flex items-center justify-center p-4 antialiased">
      <div className="relative bg-white  rounded-3xl shadow-xl  w-[370px] overflow-hidden">
        {/* Medal Icon - Matching positions from the original image */}
        <div className="absolute top-[-10px] right-[-10px] scale-90 origin-top-right">
          <Image src={badge} alt="VIP Level" className="w-[90px]" />
        </div>

        {/* Text Header */}
        <div
          className="mb-2 vip-level-banner p-3 !bg-cover h-[100px] "
          style={{ backgroundPosition: "center" }}
        >
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Upgrade
          </h1>
          <p className="text-base text-neutral-600 font-medium leading-relaxed mt-1">
            To level up, all conditions must be <br /> fulfilled
          </p>
        </div>

        <div className="bg-white p-2">
          {/* Content Box (Total bet and GO button) */}
          {maxBet > 0 && (
            <div className="relative bg-white/50  p-3 rounded-2xl shadow-inner-sm overflow-hidden shadow-md">
              <p className="text-base font-medium text-neutral-400 mb-1.5">
                Total bet
              </p>

              <div className="flex items-end gap-1 text-base font-semibold text-neutral-900 ">
                <span className="text-sm">&#x09F3; {totalBet.toFixed(0)}</span>
                <span className="text-base font-normal text-neutral-400">
                  /{maxBet.toFixed(0)}
                </span>
              </div>

              <div className="relative flex items-center justify-between gap-2 ">
                <div className="w-full bg-neutral-100 rounded-full h-1.5 relative overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-1.5 bg-neutral-900 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <p className="text-sm font-medium text-neutral-400">
                  {Math.round(progressPercent)}%
                </p>
                <Link href="/">
                  <button className="flex items-center gap-1 bg-neutral-900 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg transition duration-200 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2">
                    GO <span className="text-neutral-400">→</span>
                  </button>
                </Link>
              </div>
            </div>
          )}

          {maxDeposit > 0 && (
            <div className="relative bg-white/50  p-3 rounded-2xl shadow-inner-sm overflow-hidden shadow-md mt-1.5">
              <p className="text-base font-medium text-neutral-400 mb-1.5">
                Total Deposit
              </p>

              <div className="flex items-end gap-1 text-base font-semibold text-neutral-900 ">
                <span className="text-sm">
                  &#x09F3; {totalDeposit.toFixed(0)}
                </span>
                <span className="text-base font-normal text-neutral-400">
                  /{maxDeposit.toFixed(0)}
                </span>
              </div>

              <div className="relative  flex items-center justify-between gap-2">
                <div className="w-full bg-neutral-100 rounded-full h-1.5 relative overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-1.5 bg-neutral-900 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${depositPercent}%` }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </div>
                <span className="text-sm font-medium text-neutral-400">
                  {Math.round(depositPercent)}%
                </span>
                <Link href="/deposit">
                  <button className="flex items-center gap-1 bg-neutral-900 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg transition duration-200 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2">
                    Go<span className="text-neutral-400">→</span>
                  </button>
                </Link>
              </div>
            </div>
          )}
          {/* --- NEW SECTION: Total Deposit Progress --- */}
        </div>
      </div>
    </div>
  );
};
