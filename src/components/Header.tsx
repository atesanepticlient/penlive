"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

import HeaderBalance from "./HeaderBalance";
import AppSideCanva from "./AppSideCanva";
import PrimaryButton from "./buttons/PrimaryButton";
import SecondaryButton from "./buttons/SecondaryButton";
import { useFetchWalletQuery } from "@/lib/features/walletApiSlice";
import { useText } from "@/hook/useText";
import AuthModal from "./auth/auth-modal";

const styles = {
  header: {
    platform:
      "sticky top-0 z-[100] px-[14px] py-[10px] flex items-center justify-between gap-2 border-b border-[rgba(255,215,0,0.28)] backdrop-blur-[14px] bg-[rgba(7,5,16,0.96)] shadow-[0_2px_24px_rgba(255,215,0,0.07)]",
  },
};

const Header = () => {
  const { data: wallet } = useFetchWalletQuery();
  const t = useText("/");

  const [openAuthModal, setOpenAuthModal] = useState<"login" | "register">(
    null,
  );

  return (
    <>
      <header
        className={`${styles.header.platform}`}
        // style={{
        //   width: "100%",
        //   height: 70,
        //   zIndex: 1000,
        //   position: "sticky",
        //   top: 0,

        //   // 🔥 BLACK BACKGROUND
        //   background: "#111111",
        //   boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        // }}
      >
        <div className="flex items-center flex-shrink-0 gap-2 b">
          <div>
            <AppSideCanva trigger={<PlatFormSidebarTrigger />} />
          </div>

          {/* LOGO */}
          <PlatFormLogo />
        </div>

        {wallet && (
          <HeaderBalance
            balance={+wallet.payload.balance}
            currency={wallet.payload.currency}
          />
        )}

        {!wallet && (
          <div className="flex items-center gap-3">
            {/* LOGIN BUTTON */}

            <SecondaryButton onClick={() => setOpenAuthModal("login")}>
              {(t.auth as { login?: string })?.login || "Login"}
            </SecondaryButton>

            {/* REGISTER BUTTON */}

            <PrimaryButton onClick={() => setOpenAuthModal("register")}>
              {(t.auth as { register?: string })?.register || "Register"}
            </PrimaryButton>
          </div>
        )}
      </header>

      <AuthModal
        show={!!openAuthModal}
        selectModal={openAuthModal}
        onClose={() => setOpenAuthModal(null)}
      />
    </>
  );
};

export default Header;

const PlatFormLogo = () => {
  return (
    <div>
      <div
        className="text-[16px] mt-1 leading-none font-extralight font-cinzel bg-[linear-gradient(135deg,#ffd700,#ffe97a,#b8860b,#ffd700)] bg-clip-text
  text-transparent
  drop-shadow-[0_0_7px_rgba(255,215,0,0.45)]"
      >
        Penlive
      </div>
      <div
        className="text-[7px] mt-0.5 text-[#ff003c] tracking-[2.5px] font-['Orbitron']
  drop-shadow-[0_0_7px_#ff003c]"
      >
        CASINO BD
      </div>
    </div>
  );
};

const PlatFormSidebarTrigger = () => {
  return (
    <div className="w-[36px] bg-red-700! h-[36px] rounded-[10px] flex flex-col justify-center items-center gap-1 cursor-pointer border border-[rgba(255,215,0,0.28)] bg-[linear-gradient(145deg,#1e1535,#0e0b1c)] shadow-[0_0_10px_rgba(255,215,0,0.08)]">
      <span className="block w-4 h-[2px] rounded-sm bg-[linear-gradient(90deg,#ffd700,#ffe97a)] shadow-[0_0_5px_rgba(255,215,0,0.55)]"></span>

      <span className="block w-[11px] h-[2px] rounded-sm bg-[linear-gradient(90deg,#ffd700,#ffe97a)] shadow-[0_0_5px_rgba(255,215,0,0.55)]"></span>

      <span className="block w-4 h-[2px] rounded-sm bg-[linear-gradient(90deg,#ffd700,#ffe97a)] shadow-[0_0_5px_rgba(255,215,0,0.55)]"></span>
    </div>
  );
};
