import React, { ReactNode } from "react";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import bonusIcon from "@/../public/mission/main/bonus-icon.png";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BonusTootip({
  bonus,
  children,
}: {
  bonus: number;
  children: ReactNode;
}) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="!bg-white !text-[#333] !py-2">
        <div className="flex items-center gap-2">
          <div className="w-5 bg-blue-500 aspect-square rounded-full flex justify-center items-center">
            <Image src={bonusIcon} alt="Bonus" className="w-4" />
          </div>
          <span className="text-xs ">
            Bonus :{" "}
            <span className=" font-semibold text-blue-500">
              {formatNumber(bonus?.toFixed(2))}
            </span>
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

