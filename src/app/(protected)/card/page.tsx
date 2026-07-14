"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import CardToggler from "@/components/cards/CardToggler";
import {
  useCreateCardMutation,
  useGetUserStatusQuery,
} from "@/lib/features/cardSlice";
import { CardName } from "@prisma/client";
import SiteHeader from "@/components/SiteHeader";
import { useSearchParams } from "next/navigation";
import { useLangStore } from "@/lib/store.zustond";

// Icons (inline SVG to avoid extra deps)
const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ) : (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );

const LockIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const CardIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
export default function CreateCardPage() {
  const { lang, toggleLang } = useLangStore();
  console.log({lang})
  useEffect(()=>{
    toggleLang()
  },[])

  const searchParams = useSearchParams();
  const cardParam = searchParams.get("card")?.toUpperCase();
  const initialCard: CardName = cardParam === "NAGAD" ? "NAGAD" : "BKASH";

  const [selectedCard, setSelectedCard] = useState<CardName>(initialCard);
  const [payerName, setPayerName] = useState("");
  const [walletNumber, setWalletNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { data: userStatus, isLoading: statusLoading } =
    useGetUserStatusQuery();
  const [createCard, { isLoading: creating }] = useCreateCardMutation();

  const hasWithdrawPassword = userStatus?.hasWithdrawPassword ?? false;
  const bkashCount =
    userStatus?.cards.filter((c) => c.cardName === "BKASH").length ?? 0;
  const nagadCount =
    userStatus?.cards.filter((c) => c.cardName === "NAGAD").length ?? 0;

  const cardColor = selectedCard === "BKASH" ? "#E2136E" : "#F6821F";
  const cardColorLight = selectedCard === "BKASH" ? "#fce7f3" : "#fff7ed";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!payerName.trim()) return toast.error("Payer name is required");
    if (!walletNumber.trim()) return toast.error("Wallet number is required");
    if (!password) return toast.error("Password is required");

    try {
      await createCard({
        payerName: payerName.trim(),
        walletNumber: walletNumber.trim(),
        cardName: selectedCard,
        password,
      }).unwrap();

      toast.success("Card added successfully!");
      setPayerName("");
      setWalletNumber("");
      setPassword("");
    } catch (err: any) {
      toast.error(err?.data?.error ?? "Something went wrong");
    }
  };

  if (statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{
              borderColor: `${cardColor} transparent transparent transparent`,
            }}
          />
          <p className="text-sm text-slate-500 font-medium">
            Loading your account…
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SiteHeader title="Card"></SiteHeader>

      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 py-1 px-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Card Toggler */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <CardToggler
              selected={selectedCard}
              onChange={setSelectedCard}
              bkashCount={bkashCount}
              nagadCount={nagadCount}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-1">
            {/* Payer Name */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <UserIcon />
                Payer Name
              </label>
              <input
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Your full name"
                className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-300 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": cardColor } as any}
              />
              <p className="text-[11px] text-slate-400 leading-snug pt-1">
                ✦ Your Real Payer Name That Used for Wallet
              </p>
            </div>

            {/* Wallet Number */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <PhoneIcon />
                {selectedCard === "BKASH" ? "bKash" : "Nagad"} Wallet Number
              </label>
              <input
                type="tel"
                value={walletNumber}
                onChange={(e) => setWalletNumber(e.target.value)}
                placeholder="e.g. 01XXXXXXXXX"
                className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-300 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": cardColor } as any}
              />
              <p className="text-[11px] text-slate-400 leading-snug pt-1">
                ✦ Remember: You can create One Card per Wallet Number
              </p>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
              {/* Banner */}
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-2"
                style={{ background: cardColorLight }}
              >
                <LockIcon />
                <div>
                  <p className="text-xs font-bold text-slate-700">
                    {hasWithdrawPassword
                      ? "Enter Your Card Password"
                      : "Set a New Card Password"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {hasWithdrawPassword
                      ? "Enter your existing withdraw/card password to verify your identity."
                      : "You don't have a card password yet. Set one now — it will be used for all future cards."}
                  </p>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <LockIcon />
                  {hasWithdrawPassword ? "Card Password" : "New Card Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-300 bg-slate-50 rounded-xl px-4 py-3 pr-11 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                    style={{ "--tw-ring-color": cardColor } as any}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={creating}
              className="w-full py-4 rounded-2xl text-white font-black text-base tracking-wide shadow-lg active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: creating
                  ? "#94a3b8"
                  : `linear-gradient(135deg, ${cardColor}, ${cardColor}dd)`,
                boxShadow: creating ? "none" : `0 8px 24px ${cardColor}50`,
              }}
            >
              {creating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding Card…
                </>
              ) : (
                <>
                  <CardIcon />
                  Add {selectedCard === "BKASH" ? "bKash" : "Nagad"} Card
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
