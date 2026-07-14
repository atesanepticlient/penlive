"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useEffect } from "react";

interface AddCardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CARD_OPTIONS = [
  {
    name: "BKASH" as const,
    label: "E Wallet",
    description: "bKash Mobile Banking",
    bg: "bg-gradient-to-br from-[#E2136E] to-[#8A0040]",
    logo: (
      <svg
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        className="w-11 h-11"
      >
        <circle cx="22" cy="22" r="22" fill="#E2136E" />
        <text
          x="22"
          y="28"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="800"
          fontFamily="sans-serif"
        >
          bK
        </text>
      </svg>
    ),
  },
  {
    name: "NAGAD" as const,
    label: "E Wallet",
    description: "Nagad Digital Financial Service",
    bg: "bg-gradient-to-br from-[#F7941D] to-[#8B4500]",
    logo: (
      <svg
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        className="w-11 h-11"
      >
        <circle cx="22" cy="22" r="22" fill="#F7941D" />
        <text
          x="22"
          y="28"
          textAnchor="middle"
          fill="white"
          fontSize="16"
          fontWeight="800"
          fontFamily="sans-serif"
        >
          N
        </text>
      </svg>
    ),
  },
];

export default function AddCardDrawer({ isOpen, onClose }: AddCardDrawerProps) {
  const router = useRouter();

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSelect = (cardName: "BKASH" | "NAGAD") => {
    onClose();
    router.push(`/dashboard/cards/add?card=${cardName}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl transition-transform duration-500 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
            Add New
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Options */}
        <div className="px-6 py-6 flex flex-col gap-3 pb-10">
          {CARD_OPTIONS.map((opt) => (
            <button
              key={opt.name}
              onClick={() => handleSelect(opt.name)}
              className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-all duration-200 active:scale-[0.98] group"
            >
              {/* Logo */}
              <div className="shrink-0">{opt.logo}</div>

              {/* Text */}
              <div className="text-left">
                <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                  {opt.name === "BKASH" ? "bKash" : "Nagad"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {opt.label}
                </p>
              </div>

              {/* Arrow */}
              <div className="ml-auto text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400 transition-colors">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
