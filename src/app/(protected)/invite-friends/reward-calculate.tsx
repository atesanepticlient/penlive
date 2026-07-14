"use client";
import { useState } from "react";
import moneyCard from "@/../public/mony-card.png";
import Image from "next/image";
const points = [
  { users: 1, income: 1000 },
  { users: 10, income: 15000 },
  { users: 100, income: 200000 },
  { users: 1000, income: 999999 },
];

function interpolate(users) {
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    if (users >= p1.users && users <= p2.users) {
      const ratio = (users - p1.users) / (p2.users - p1.users);
      return Math.round(p1.income + ratio * (p2.income - p1.income));
    }
  }

  return points[points.length - 1].income;
}
const steps = [1, 3, 10, 30, 100, 300, 1000];
export default function RewardCalculator() {
  const [users, setUsers] = useState(10);
  const max = steps.length - 1;
  const progress = ((users - 1) / (max - 1)) * 100;
  const income = interpolate(users);

  return (
    <div className=" flex items-center justify-center bg-gray-100 px-2">
      <div
        className="w-[700px] rounded-lg p-10 text-center text-white
        bg-gradient-to-r from-pink-500 to-blue-700 shadow-xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={moneyCard}
            alt="Income"
            className="w-[70px] text-[#00000031]"
          />
          <h1
            className="text-2xl font-bold text-start "
            style={{ textShadow: "3px 3px 5px #00000050" }}
          >
            Income <br /> calculator
          </h1>
        </div>

        <div className="text-2xl font-bold text-yellow-300 mb-3">
          ৳ {income.toLocaleString()}
        </div>

        <p className="text-base mb-3">
          Invite <span className="text-yellow-300 font-bold">{users}</span>{" "}
          active users, expected revenue
        </p>

        <input
          type="range"
          min="1"
          max={max}
          value={users}
          onChange={(e) => setUsers(Number(e.target.value))}
          className="w-full h-[6px] rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(
      to right,
      #0396ff 0%,
      #0396ff calc(${progress}% + 9px),
      #0000004d calc(${progress}% + 9px),
      #0000004d 100%
    )`,
          }}
        />
      </div>
    </div>
  );
}
