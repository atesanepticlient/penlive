import { findCurrentUser } from "@/data/user";
import Link from "next/link";
import React from "react";
import { PiHandDepositFill, PiHandWithdrawFill } from "react-icons/pi";
import DepositWithdrawButtons from "./buttons/ButtonsOutLine";

const WithdrawDepositButton = async () => {
  const user = await findCurrentUser();
  if (!user) return null;
  const variant = "PLATFORM";
  return (
    <div className="relative w-full py-6 px-2">
      {/* Outer Glow Container */}
      {variant != "PLATFORM" && (
        <div className="flex w-full   p-[1px] ">
          <div className="flex w-full h-full  overflow-hidden items-stretch gap-2">
            {/* DEPOSIT: The "Illuminated" Side */}/
            {/* WITHDRAW: The "Stealth" Side */}
            {/* <Link
            href="/withdraw"
            className="relative flex-1 group flex items-center justify-center gap-3 transition-all duration-500 hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-2 group-hover:scale-105 transition-transform opacity-60 group-hover:opacity-100">
              <PiHandWithdrawFill className="w-5 h-5 text-neutral-400 group-hover:text-white" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 group-hover:text-white">
                Withdraw
              </span>
            </div>
          </Link> */}
            <Link href="/deposit" className="block w-full">
              {/* <PrimaryButton className="w-full !py-5">
              <div >
                
                Deposit
              </div>
            </PrimaryButton> */}
              <button
                className="flex items-center gap-1 w-full justify-center "
                style={{
                  height: 44,
                  padding: "0 18px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#2B1A00",

                  background:
                    "linear-gradient(180deg, #FFF3B0 0%, #FACC15 45%, #D97706 100%)",

                  border: "1px solid #FACC15",

                  boxShadow: `
            inset 0 2px 3px rgba(255,255,255,0.6),
            inset 0 -2px 3px rgba(0,0,0,0.2),
            0 4px 12px rgba(255,180,0,0.5)
          `,
                }}
              >
                <PiHandDepositFill className="w-5 h-5 " />
                Deposit
              </button>
            </Link>
            <Link href="/withdraw" className="block w-full">
              {/* <PrimaryButton className="w-full !py-5">
              <div className="flex items-center gap-1 ">
                <PiHandWithdrawFill className="w-5 h-5 " />
                Withdraw
              </div>
            </PrimaryButton> */}
              <button
                className="flex items-center gap-1 w-full justify-center "
                style={{
                  height: 44,
                  padding: "0 18px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#2B1A00",

                  background:
                    "linear-gradient(180deg, #FFF3B0 0%, #FACC15 45%, #D97706 100%)",

                  border: "1px solid #FACC15",

                  boxShadow: `
            inset 0 2px 3px rgba(255,255,255,0.6),
            inset 0 -2px 3px rgba(0,0,0,0.2),
            0 4px 12px rgba(255,180,0,0.5)
          `,
                }}
              >
                <PiHandWithdrawFill className="w-5 h-5 " />
                Withdraw
              </button>
            </Link>
          </div>
        </div>
      )}

      {variant == "PLATFORM" && <DepositWithdrawButtons />}

      {/* Bottom Accent Line */}
      {/* <div className="w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent mx-auto mt-4 blur-[1px]" /> */}
    </div>
  );
};

export default WithdrawDepositButton;
