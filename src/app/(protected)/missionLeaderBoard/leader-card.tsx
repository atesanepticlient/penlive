import React from "react";
import { IoGiftSharp } from "react-icons/io5";
import BonusTootip from "./bonus-tooltip";
import { formatNumber } from "@/lib/utils";

const LeaderCard = ({
  name,
  validBet,
  bonus,
  rank,
}: {
  name: string;
  validBet: number;
  bonus: number;
  rank;
}) => {
  return (
    <div className="flex items-center gap-7 border-b w-full px-3 py-2">
      <div className="flex items-center gap-5">
        <h3 className="text-2xl text-gray-600 font-bold tracking-tight">
          {rank}
        </h3>
        <img
          src="https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
          className="w-10 aspect-square rounded-full object-cover"
          alt="user"
        />
      </div>

      <div className="flex items-center justify-between w-full">
        <div>
          <h4 className="text-base font-bold text-gray-600">
            {name.slice(4)}****
          </h4>
          <p className="text-gray-500 text-xs font-normal">
            Valid bet :{" "}
            <span className="text-sm font-bold text-gray-500">
              {" "}
              {formatNumber(validBet)}
            </span>
          </p>
        </div>

        <BonusTootip bonus={bonus}>
          <div
            className="w-7 aspect-square rounded-full flex justify-center items-center"
            style={{
              background: "linear-gradient(180deg, #f7db4f 0%, #f7b347 100%)",
              boxShadow:
                "0 10px 15px rgba(247, 179, 71, 0.35), 0 0 20px rgba(255, 215, 80,0.25)",
            }}
          >
            <IoGiftSharp className="text-white" />
          </div>
        </BonusTootip>
      </div>
    </div>
  );
};

export default LeaderCard;
