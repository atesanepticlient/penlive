import React from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import coin from "@/../public/coin.png";
import Image from "next/image";
import Link from "next/link";
import SliderNeumorphic from "./slider-neumoriphic";
import WheelSpinner, { Segment } from "@/components/wheel/WheelSpinner";

const LuckyWheel = ({ componentToggler }: { componentToggler: () => void }) => {
  const Coin = () => {
    return (
      <Image src={coin} alt="Coin" className="w-10  object-fill select-none" />
    );
  };

  const segments: Segment[] = [
    {
      label: "6৳",
      color: "#0e6a6e",
      chip: "#8e3cf7",
      icon: <Coin />,
    },
    {
      label: "12৳",
      color: "#1aa7a9",
      chip: "#ff9d4d",
      icon: <Coin />,
    },
    {
      label: "x",
      color: "#0e6a6e",
      chip: "#57d36a",
    },
    {
      label: "3৳",
      color: "#1aa7a9",
      chip: "#57e6d4",
    },
    {
      label: "5৳",
      color: "#0e6a6e",
      chip: "#8e3cf7",
    },
    {
      label: "30৳",
      color: "#1aa7a9",
      chip: "#ff9d4d",
    },
    {
      label: "x",
      color: "#0e6a6e",
      chip: "#57d36a",
    },
    {
      label: "15৳",
      color: "#1aa7a9",
      chip: "#57e6d4",
    },
  ];
  const chooseIndex = (): number | null => null;

  const onFinish = (i: number, seg: Segment) => {
    alert(`You landed on ${seg.label}`);
  };
  return (
    <div>
      <div
        style={{ minHeight: "100dvh" }}
        className="bg-transparent backdrop-blur-md flex items-center justify-center fixed top-0 left-0 w-full z-[99999]"
      >
        <div>
          <div className="py-12">
            <h2
              className="text-5xl font-extrabold text-center text-yellow-300"
              style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)" }}
            >
              Earn Free Tk
            </h2>
            <Link
              href={"/deposit"}
              className="flex gap-2 items-center justify-center text-lg font-medium text-white cursor-pointer"
            >
              in Every Deposit{" "}
              <MdKeyboardDoubleArrowRight className="w-4 h-4" />
            </Link>

            <SliderNeumorphic initialValue={2000} onChange={() => {}} />
          </div>
          <WheelSpinner
            segments={segments}
            getTargetIndex={chooseIndex}
            onFinish={onFinish}
          />
        </div>

        <button onClick={componentToggler} className="fixed top-10 right-5">
          <RiCloseCircleFill className="w-10 h-10 text-[#ffffffa3]" />
        </button>
      </div>
    </div>
  );
};

export default LuckyWheel;
