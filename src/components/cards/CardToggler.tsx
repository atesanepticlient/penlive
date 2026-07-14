"use client";

import Image from "next/image";
import bkashLogo from "@/../public/wallet/bkash-seeklogo.png";
import nagadLogo from "@/../public/wallet/nagad-seeklogo.png";

type CardName = "BKASH" | "NAGAD";

interface CardTogglerProps {
  selected: CardName;
  onChange: (cardName: CardName) => void;
  bkashCount?: number;
  nagadCount?: number;
}

const CARD_OPTIONS: {
  name: CardName;
  label: string;
  logo: any;
  color: string;
  bg: string;
  border: string;
}[] = [
  {
    name: "BKASH",
    label: "bKash",
    logo: bkashLogo,
    color: "#E2136E",
    bg: "bg-pink-50",
    border: "border-pink-400",
  },
  {
    name: "NAGAD",
    label: "Nagad",
    logo: nagadLogo,
    color: "#F6821F",
    bg: "bg-orange-50",
    border: "border-orange-400",
  },
];

export default function CardToggler({
  selected,
  onChange,
  bkashCount = 0,
  nagadCount = 0,
}: CardTogglerProps) {
  const counts: Record<CardName, number> = {
    BKASH: bkashCount,
    NAGAD: nagadCount,
  };

  return (
    <div className="w-full">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        Select Wallet Type
      </p>
      <div className="grid grid-cols-2 gap-3">
        {CARD_OPTIONS.map((option) => {
          const isSelected = selected === option.name;
          const count = counts[option.name];
          const atLimit = count >= 5;

          return (
            <button
              key={option.name}
              type="button"
              onClick={() => !atLimit && onChange(option.name)}
              disabled={atLimit}
              className={`
                relative flex flex-col items-center justify-center  p-1 rounded-2xl border-2
                transition-all duration-200 cursor-pointer select-none
                ${
                  isSelected
                    ? `${option.bg} ${option.border} shadow-md scale-[1.02]`
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }
                ${atLimit ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {/* Selected ring pulse */}
              {isSelected && (
                <span
                  className="absolute inset-0 rounded-2xl animate-pulse opacity-20"
                  style={{ background: option.color }}
                />
              )}

              {/* Logo */}
              <div className="relative w-14 h-14">
                <Image
                  src={option.logo}
                  alt={option.label}
                  fill
                  className="object-contain drop-shadow-sm"
                />
              </div>

              {/* Label */}
              {/* <span
                className={`text-sm font-bold tracking-wide ${
                  isSelected ? "text-slate-800" : "text-slate-500"
                }`}
              >
                {option.label}
              </span> */}

              {/* Card count badge */}
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full -translate-y-2 ${
                  isSelected ? "text-white" : "bg-slate-100 text-slate-400"
                }`}
                style={isSelected ? { background: option.color } : {}}
              >
                {count}/5 {atLimit ? "· Full" : "cards"}
              </span>

              {/* Checkmark */}
              {isSelected && (
                <span
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow"
                  style={{ background: option.color }}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
