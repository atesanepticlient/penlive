/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useGetCurrentUser from "@/hook/useCurrentUser";
import {
  useGetDepositPaymentDataQuery,
  useMakeDepositeMutation,
} from "@/lib/features/depositApiSlice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdOutlineSupportAgent, MdHistory } from "react-icons/md";
import { CiGift } from "react-icons/ci";
import { formatBDT } from "@/lib/utils";
import { PulseLoader } from "react-spinners";
import PageLoader from "@/components/loader/PageLoader";
import toast from "react-hot-toast";
import { INTERNAL_SERVER_ERROR } from "@/error";
import SiteHeader from "@/components/SiteHeader";
import PaymentMethod from "@/components/PaymentMethod";

const quickAmounts = [100, 400, 500, 800, 1000, 1500, 2000, 5000, 10000];

const InfoIcon = () => (
  <svg
    className="w-4 h-4 flex-shrink-0 mt-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 10l7-7m0 0l7 7m-7-7v18"
    />
  </svg>
);

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={` rounded-3xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-3">
      {children}
    </p>
  );
}

const DepositPage: React.FC = () => {
  const { data, isLoading } = useGetDepositPaymentDataQuery();
  const wallets = data?.wallets;
  const bonus = data?.bonus;
  const user: any = useGetCurrentUser();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>();
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [walletNumber] = useState("");
  const [selectedAmountBtn, setSelectedAmountBtn] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState<{
    id: string;
    label: string;
    value: number;
    disable: boolean;
  }>({ id: "none", label: "No Bonus", value: 0, disable: false });

  const [bonusOptions, setBonusOptions] = useState([
    {
      id: "signinBonus",
      label: "First Deposit Bonus",
      value: 0,
      disable: true,
    },
    {
      id: "referralBonus",
      label: "Refer Bonus",
      value: 0,
      disable: true,
    },
    {
      id: "none",
      label: "No Bonus",
      value: 0,
      disable: false,
    },
  ]);

  const [makeDeposit] = useMakeDepositeMutation();

  const totalAmount = parseFloat(depositAmount) || 0;
  const bonusAmount =
    selectedBonus.value > 0
      ? Math.round((totalAmount * selectedBonus.value) / 100)
      : 0;
  const grandTotal = totalAmount + bonusAmount;
  const isValidAmount = totalAmount >= 100 && totalAmount <= 50000;

  const minDeposit = selectedPaymentMethod
    ? +selectedPaymentMethod.min_deposit
    : 100;
  const maxDeposit = selectedPaymentMethod
    ? +selectedPaymentMethod.max_deposit
    : 10000;

  const handleAmountBtn = (amount: number) => {
    setSelectedAmountBtn(amount);
    setDepositAmount(amount.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositAmount(e.target.value);
    setSelectedAmountBtn(null);
  };

  const handleSubmit = () => {
    setPending(true);
    if (!depositAmount || +depositAmount < 0) {
      setError("Please enter an amount");
      setPending(false);
      return;
    }
    if (+depositAmount < 100) {
      setError("Minimum deposit is ৳100");
      setPending(false);
      return;
    }
    if (+depositAmount > 10000) {
      setError("Maximum deposit is ৳10,000");
      setPending(false);
      return;
    }
    if (!walletNumber) {
      setError("Please enter wallet number");
      setPending(false);
      return;
    }

    makeDeposit({
      amount: +depositAmount + +bonusAmount,
      account_number: walletNumber,
      ps: selectedPaymentMethod!.name,
    })
      .unwrap()
      .then((res) => {
        if (res.success) {
          setPending(false);
          window.location.href = res.payload.payUrl;
        }
      })
      .catch((err: any) => {
        toast.error(err?.data?.error ?? INTERNAL_SERVER_ERROR);
        setPending(false);
      });
  };

  useEffect(() => {
    if (wallets) setSelectedPaymentMethod(wallets[0]);
  }, [wallets]);

  useEffect(() => {
    if (bonus && user) {
      const isSign = bonus.signinBonus > 0 && user.wallet?.signinBonus;
      const isRefer = bonus.referralBonus > 0 && user.wallet?.referralBonus;
      setBonusOptions((prev) =>
        prev.map((opt) => {
          if (opt.id === "signinBonus")
            return { ...opt, disable: !isSign, value: bonus.signinBonus };
          if (opt.id === "referralBonus")
            return { ...opt, disable: !isRefer, value: bonus.referralBonus };
          return opt;
        }),
      );
    }
  }, [user, bonus]);

  useEffect(() => {
    if (error) setError("");
  }, [depositAmount]);

  useEffect(() => {
    if (quickAmounts.includes(+depositAmount))
      setSelectedAmountBtn(+depositAmount);
  }, [depositAmount]);

  if (!data || isLoading || !user) return <PageLoader />;

  return (
    <div
      className="min-h-screen pb-32"
      style={{
        background:
          "linear-gradient(160deg,#fff8f8 0%,#fff1f2 50%,#fffbfb 100%)",
      }}
    >
      <SiteHeader title="Deposit">
        <Link
          href="/support"
          className="text-slate-600 hover:text-slate-900 transition-colors"
        >
          <MdOutlineSupportAgent className="text-xl" />
        </Link>
        <Link
          href="/history"
          className="text-slate-600 hover:text-slate-900 transition-colors"
        >
          <MdHistory className="text-xl" />
        </Link>
      </SiteHeader>

      <main className="px-4 space-y-2">
        <Card>
          <div className="px-4 pt-4 pb-1">
            <SectionTitle>Deposit Method</SectionTitle>
          </div>
          <div
            className="flex gap-1.5 px-4 pb-4 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {wallets?.map((pw: any, i: number) => (
              <PaymentMethod
                key={i}
                method={pw}
                selectedPaymentMethod={selectedPaymentMethod!}
                onClick={() => setSelectedPaymentMethod(pw)}
              />
            ))}
          </div>
        </Card>

        <div className="rounded-2xl px-2 flex items-start gap-3">
          <span className="text-red-600 mt-0.5">
            <InfoIcon />
          </span>
          <div>
            <p className="text-sm font-black text-red-600 mb-1 ">
              Note :{" "}
              <span className="space-y-0.5 text-red-600 font-semibold">
                To get the amount to your account quickly, Please provide you
                Trx-Id after making deposit.
              </span>
            </p>
          </div>
        </div>

        <Card className="p-4">
          <SectionTitle>Deposit Amount</SectionTitle>
          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
              ৳
            </span>
            <input
              disabled={pending}
              type="number"
              className="w-full pl-9 pr-4 py-3.5 rounded-2xl border text-sm font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:ring-2 transition-all"
              style={
                {
                  background: "linear-gradient(135deg,#fffafa,#fff5f5)",
                  borderColor: depositAmount ? "#e11d48" : "#e2e8f0",
                  "--tw-ring-color": "#e11d48",
                } as any
              }
              placeholder="Enter amount"
              value={depositAmount}
              onChange={handleAmountChange}
            />
            {totalAmount > 0 && (
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                style={{ background: "linear-gradient(90deg,#e11d48,#be123c)" }}
              >
                ৳{grandTotal.toLocaleString()}
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-500 mb-2 px-1">
              {error}
            </p>
          )}

          <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-4 px-1">
            <span>Min: {formatBDT(minDeposit)}</span>
            <span>Max: {formatBDT(maxDeposit)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((amt) => {
              const isActive = selectedAmountBtn === amt;
              const bonusVal =
                selectedBonus.value > 0
                  ? Math.round((amt * selectedBonus.value) / 100)
                  : 0;
              return (
                <button
                  key={amt}
                  disabled={pending}
                  onClick={() => handleAmountBtn(amt)}
                  className="relative py-2.5 px-2 rounded-2xl text-center transition-all duration-200 active:scale-95 overflow-hidden"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg,#e11d48,#be123c)"
                      : "linear-gradient(135deg,#fffafa,#fff5f5)",
                    border: isActive
                      ? "2px solid #e11d48"
                      : "2px solid #e2e8f0",
                    boxShadow: isActive ? "0 4px 16px #e11d4840" : "none",
                    transform: isActive ? "scale(1.03)" : "scale(1)",
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.25) 50%,transparent 60%)",
                        animation: "shimmer 1.6s infinite",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  )}
                  <p
                    className={`text-xs font-black relative z-10 ${isActive ? "text-white" : "text-slate-700"}`}
                  >
                    ৳{amt.toLocaleString()}
                  </p>
                  {bonusVal > 0 && (
                    <p
                      className={`text-[9px] font-bold relative z-10 mt-0.5 flex items-center justify-center gap-0.5 ${isActive ? "text-rose-100" : "text-rose-500"}`}
                    >
                      +{bonusVal} <CiGift className="text-xs" />
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-4">
          <SectionTitle>Select Bonus</SectionTitle>
          <div className="space-y-2.5">
            {bonusOptions.map((opt) => {
              const isSelected = selectedBonus.id === opt.id;
              const isDisabled = opt.disable;
              return (
                <div
                  key={opt.id}
                  onClick={() =>
                    !isDisabled && !pending && setSelectedBonus(opt)
                  }
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200 ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg,#fff1f2,#ffe4e6)"
                      : "linear-gradient(135deg,#fffafa,#f9fafb)",
                    borderColor: isSelected ? "#fda4af" : "#e2e8f0",
                    boxShadow: isSelected ? "0 2px 12px #e11d4820" : "none",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ borderColor: isSelected ? "#e11d48" : "#cbd5e1" }}
                  >
                    {isSelected && (
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: "linear-gradient(135deg,#e11d48,#be123c)",
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-black ${isSelected ? "text-rose-700" : "text-slate-700"}`}
                    >
                      {opt.label}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {opt.id === "signinBonus" &&
                        `${opt.value}% extra on your first deposit`}
                      {opt.id === "referralBonus" &&
                        `${opt.value}% bonus from referral`}
                      {opt.id === "none" && "Proceed without any bonus"}
                    </p>
                  </div>
                  {opt.value > 0 && (
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: isSelected
                          ? "linear-gradient(90deg,#e11d48,#be123c)"
                          : "linear-gradient(90deg,#ffe4e6,#ffd7db)",
                        color: isSelected ? "white" : "#e11d48",
                      }}
                    >
                      +{opt.value}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {totalAmount > 0 && (
          <div
            className="rounded-2xl px-4 py-3 flex items-center justify-between"
            style={{
              background: "linear-gradient(135deg,#fff1f2,#ffe4e6)",
              border: "1.5px solid #fda4af",
              animation: "fadeUp 0.2s ease-out both",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                Deposit
              </span>
              <span className="text-xs font-black text-slate-700">
                ৳{totalAmount.toLocaleString()}
              </span>
              {bonusAmount > 0 && (
                <>
                  <span className="text-slate-300 text-xs">+</span>
                  <span className="text-xs font-black text-green-600">
                    ৳{bonusAmount.toLocaleString()} bonus
                  </span>
                </>
              )}
            </div>
            <span
              className="text-sm font-black"
              style={{
                background: "linear-gradient(90deg,#e11d48,#9f1239)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ৳{grandTotal.toLocaleString()}
            </span>
          </div>
        )}
      </main>

      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-3"
        style={{
          background:
            "linear-gradient(to top,rgba(255,248,248,1) 70%,transparent)",
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={!isValidAmount || pending}
          className="w-full py-4 rounded-2xl text-white text-base font-black flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98]"
          style={{
            background:
              isValidAmount && !pending
                ? "linear-gradient(135deg, #e11d48 0%, #be123c 50%, #9f1239 100%)"
                : "linear-gradient(135deg,#94a3b8,#cbd5e1)",
            boxShadow:
              isValidAmount && !pending ? "0 8px 32px #e11d4855" : "none",
          }}
        >
          {pending ? (
            <PulseLoader size={10} color="#fff" />
          ) : (
            <>
              <ArrowIcon />
              Process Deposit
              {grandTotal > 0 && (
                <span className="ml-1 text-sm font-black text-white/70">
                  · ৳{grandTotal.toLocaleString()}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
      `}</style>
    </div>
  );
};

export default DepositPage;
