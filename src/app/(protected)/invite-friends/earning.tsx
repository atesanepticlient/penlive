"use client";

import React from "react";
import { useFetchInviatationBonusEarningQuery } from "@/lib/features/rewardApiSlice";
const Earning = () => {
  const { data } = useFetchInviatationBonusEarningQuery();

  const totalEarning = data?.payload?.total;
  const last24hoursEarning = data?.payload?.last24Hours;

  const totalEarningData = {
    currency: "৳",
    todayIncome:
      Number(totalEarning?.invitationReward ?? 0) +
      Number(totalEarning?.achievementReward ?? 0) +
      Number(totalEarning?.rebate ?? 0),

    metrics: [
      {
        id: 1,
        label: "Invitation Rewards",
        value: Number(totalEarning?.invitationReward),
        isCurrency: true,
      },
      {
        id: 2,
        label: "Achievement Rewards",
        value: Number(totalEarning?.achievementReward),
        isCurrency: true,
      },
      {
        id: 3,
        label: "Deposit Rebate",
        value: Number(totalEarning?.rebate),
        isCurrency: true,
      },
      {
        id: 5,
        label: "Registers",
        value: Number(totalEarning?.registers),
        isCurrency: false,
      },
      {
        id: 6,
        label: "Valid Referral",
        value: Number(totalEarning?.validReferral),
        isCurrency: false,
      },
    ],
  };
  const last24hoursData = {
    currency: "৳",
    todayIncome:
      Number(last24hoursEarning?.invitationReward ?? 0) +
      Number(last24hoursEarning?.achievementReward ?? 0) +
      Number(last24hoursEarning?.rebate ?? 0),

    metrics: [
      {
        id: 1,
        label: "Invitation Rewards",
        value: Number(last24hoursEarning?.invitationReward),
        isCurrency: true,
      },
      {
        id: 2,
        label: "Achievement Rewards",
        value: Number(last24hoursEarning?.achievementReward),
        isCurrency: true,
      },
      {
        id: 3,
        label: "Deposit Rebate",
        value: Number(last24hoursEarning?.rebate),
        isCurrency: true,
      },
      {
        id: 5,
        label: "Registers",
        value: Number(last24hoursEarning?.registers),
        isCurrency: false,
      },
      {
        id: 6,
        label: "Valid Referral",
        value: Number(last24hoursEarning?.validReferral),
        isCurrency: false,
      },
    ],
  };

  if (!data) return null;

  return (
    <div className="flex flex-col gap-10">
      <IncomeDashboard data={last24hoursData} />
      <IncomeDashboard data={totalEarningData} />
    </div>
  );
};

export default Earning;

function IncomeDashboard({ data }) {
  const { currency, todayIncome, metrics } = data;

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100/80 font-sans">
      {/* Top Header Section */}
      <div className="bg-white pt-7 pb-6 text-center border-b border-gray-100">
        <h2 className="text-[17px] font-bold text-[#4c566a]">
          Todays Income:{" "}
          <span className="text-[#3b3379] ml-1">
            {currency} {todayIncome.toFixed(2)}
          </span>
        </h2>
      </div>

      {/* Main Content Area with the Soft Soft Gradient */}
      <div className="px-7 py-6 space-y-4 bg-gradient-to-b from-white via-[#f4f7fc] to-[#e9f0f8]">
        {metrics.map((item) => (
          <div key={item.id} className="flex justify-between items-center ">
            {/* Soft, dark slate color for labels */}
            <span className="text-[#5a6578] font-semibold text-[15px]">
              {item.label}
            </span>

            {/* Deep purple/indigo color for values */}
            <span className="text-[#3b3379] font-bold text-[16px]">
              {item.isCurrency
                ? `${currency} ${item.value.toFixed(2)}`
                : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
