import React from "react";
import RewardHeader from "./header";
import RewardCards from "./reward-cards";

const RewardCenter = () => {
  return (
    <div className="bg-[#F5F5F9] md:px-50 ">
      <RewardHeader />
      <main className="pt-16 px-3 ">
        <RewardCards />
      </main>
    </div>
  );
};

export default RewardCenter;
