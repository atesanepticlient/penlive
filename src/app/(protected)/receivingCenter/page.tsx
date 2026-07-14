import React from "react";
import SiteHeader from "@/components/SiteHeader";
import { findCurrentUser } from "@/data/user";
import BonusList from "./bonus-list";

const RecivingCenterPage = async () => {
  const user: any = await findCurrentUser();
  return (
    <div className="bg-[#ddd] h-screen">
      <SiteHeader title="Bonus" />{" "}
      <div>
        <div className="reward-recive w-full h-[220px] py-8 px-12">
          <div className="flex gap-4 items-center">
            <img
              src={
                "https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
              }
              alt="User Avatar"
              className="w-[90px] aspect-square rounded-full border-[7px] border-[#7ecaf9e4]"
            />

            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#ffffffcd]">
                {user.phone}
              </span>
              <span className="text-lg font-bold text-white">
                ৳{user.wallet.balance}
              </span>
            </div>
          </div>
        </div>

        <div>
          <BonusList />
        </div>
      </div>
    </div>
  );
};

export default RecivingCenterPage;
