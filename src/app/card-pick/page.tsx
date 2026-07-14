"use client";

import dynamic from "next/dynamic";

const Wheel = dynamic(
  () =>
    import("react-custom-roulette").then((mod) => ({
      default: mod.Wheel,
    })),
  {
    ssr: false,
  },
);

const data = [
  { option: "0", style: { backgroundColor: "green", textColor: "black" } },
  { option: "1", style: { backgroundColor: "white" } },
  { option: "2" },
];

export default function CardPickPage() {
  return (
    <Wheel
      mustStartSpinning
      prizeNumber={2}
      data={data}
      backgroundColors={["#3e3e3e", "#df3428"]}
      textColors={["#ffffff"]}
    />
  );
}
