"use client";

import { useState, useRef, useEffect} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import bkashLogo from "@/../public/wallet/bkash-circle.png";
import nagadLogo from "@/../public/wallet/nagad-sqr.png";
import { CardName } from "@prisma/client";
import { ActiveCard, useGetCardsQuery } from "@/lib/features/cardSlice";
import { useGetWithdrawStatusQuery } from "@/lib/features/withdrawSlice";
import BKashCard from "@/components/cards/bkash-card";
import NagadCard from "@/components/cards/nagad-card";
import SiteHeader from "@/components/SiteHeader";

import emptyCard from "@/../public/empty-card.png";

const MIN = 500;
const MAX = 50000;

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WithdrawPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CardName>("BKASH");
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const { data: cardsData, isLoading: cardsLoading } = useGetCardsQuery();
  const {
    data: wdStatus,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = useGetWithdrawStatusQuery();

  const allCards = cardsData?.cards ?? [];
  const bkashCards = allCards.filter((c) => c.cardName === "BKASH");
  const nagadCards = allCards.filter((c) => c.cardName === "NAGAD");
  const tabCards = activeTab === "BKASH" ? bkashCards : nagadCards;
  const activeCard = tabCards[activeCardIdx] ?? null;

  const balance = wdStatus?.balance ?? 0;
  const remainingWithdraws = wdStatus?.remainingWithdraws ?? 0;
  const dailyLimit = wdStatus?.dailyWithdrawLimit ?? 10;
  const turnoverRows = wdStatus?.turnoverRows ?? [];
  const hasTurnover =
    turnoverRows.length > 0 && (wdStatus?.remainingTurnover ?? 0) > 0;

  const tabColor = activeTab === "BKASH" ? "#E2136E" : "#F6821F";
  const tabColorLight = activeTab === "BKASH" ? "#fce7f3" : "#fff7ed";

  const handleWithdraw = async () => {
    if (!activeCard) return toast.error("Please select a card");
    if (!amount || Number(amount) < MIN)
      return toast.error(`Minimum withdrawal is ৳${MIN}`);
    if (Number(amount) > MAX)
      return toast.error(`Maximum withdrawal is ৳${MAX}`);
    if (!password) return toast.error("Enter your withdraw password");

    // try {
    //   await submitWithdraw({
    //     amount: Number(amount),
    //     password,
    //     cardId: activeCard.id,
    //   }).unwrap();
    //   toast.success("Withdrawal request submitted!");
    //   setAmount("");
    //   setPassword("");
    // } catch (err: any) {
    //   toast.error(err?.data?.error ?? "Something went wrong");
    // }
  };

  return (
    <div>
      <SiteHeader title="Withdraw"></SiteHeader>
      <div className="min-h-screen bg-slate-50 pb-10">
        <div className="px-1 py-1  space-y-2">
          {/* ── Wallet Tabs ── */}
          <Section className="!p-3">
            <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
              <WalletTab
                name="BKASH"
                logo={bkashLogo}
                label="bKash"
                active={activeTab === "BKASH"}
                count={bkashCards.length}
                onClick={() => {
                  setActiveTab("BKASH");
                  setActiveCardIdx(0);
                }}
              />
              <WalletTab
                name="NAGAD"
                logo={nagadLogo}
                label="Nagad"
                active={activeTab === "NAGAD"}
                count={nagadCards.length}
                onClick={() => {
                  setActiveTab("NAGAD");
                  setActiveCardIdx(0);
                }}
              />
            </div>

            {/* Card Slider or Empty */}
            <div className="mt-4 ">
              {cardsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-slate-500 animate-spin" />
                </div>
              ) : tabCards.length > 0 ? (
                <CardSlider
                  cards={tabCards}
                  activeIdx={activeCardIdx}
                  onSelect={setActiveCardIdx}
                  type={activeTab}
                />
              ) : (
                <div className="text-center ">
                  <Image
                    src={emptyCard}
                    alt="Card Empty"
                    className="w-[80%] mx-auto"
                  />
                </div>
              )}
            </div>
          </Section>

          {/* ── Add Card CTA ── */}
          <button
            onClick={() => router.push("/card")}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm active:scale-[0.98] transition-all duration-150"
          >
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <CardIcon />
              </div>
              <span className="text-sm font-semibold">Manage Cards</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                style={{ background: tabColor }}
              >
                <PlusIcon />
              </div>
              <ChevronIcon />
            </div>
          </button>

          {/* ── Withdraw Info ── */}
          <Section>
            {/* <SectionLabel>Withdraw Info</SectionLabel> */}
            <div className="space-y-2.5">
              <p>
                <span className="text-xs text-slate-500 font-medium">
                  Withdraw Time
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {" "}
                  24 Hours
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {" "}
                  Daily Withdraw Limit
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {" "}
                  {dailyLimit} Times
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {" "}
                  Remaining Today
                </span>
                <span
                  className="text-xs font-black"
                  style={{
                    color: remainingWithdraws > 0 ? "#16a34a" : "#ef4444",
                  }}
                >
                  {" "}
                  {statusLoading ? "—" : `${remainingWithdraws} Times`}
                </span>
              </p>
            </div>
          </Section>

          {/* ── Balance ── */}
          <Section>
            {/* <SectionLabel>Main Wallet</SectionLabel> */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">
                  Available Amount
                </p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">
                  ৳{statusLoading ? "—" : balance}
                </p>
              </div>
              <button
                onClick={() => refetchStatus()}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 bg-[#3276ff2b] hover:bg-[#3276ff2b] px-3 py-2 rounded-xl transition-colors active:scale-95"
              >
                <RefreshIcon />
                Refresh
              </button>
            </div>
          </Section>

          {/* ── Turnover OR Withdraw Form ── */}
          {statusLoading ? (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-slate-500 animate-spin" />
            </div>
          ) : hasTurnover ? (
            /* Turnover Requirements */
            <Section>
              <SectionLabel>
                <p className="text-center">Turnover Requirements</p>
              </SectionLabel>
              {/* Warning */}
              <div className="flex items-start gap-2.5 rounded-xl px-3  mb-2">
                <p className="text-xs leading-relaxed text-slate-600">
                  <span className="font-black text-orange-600">
                    Please complete the required turnover for withdrawal
                  </span>
                </p>
              </div>
              {/* Table */}
              <div className="rounded-xl overflow-hidden border border-slate-100">
                <table className="w-full border border-slate-200 border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-200 text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Game Type
                      </th>
                      <th className="border border-slate-200 text-right px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Remaining
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {turnoverRows.map((row, i) => (
                      <tr key={i}>
                        <td className="border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
                          {row.gameType}
                        </td>
                        <td
                          className="border border-slate-200 px-4 py-3 text-sm font-black text-right"
                          style={{ color: tabColor }}
                        >
                          ৳{row.remaining}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Home Button */}
              <button
                onClick={() => router.push("/")}
                className="w-full mt-4 py-3.5 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all duration-150"
                style={{
                  background: `linear-gradient(135deg, ${tabColor}, ${tabColor}cc)`,
                  boxShadow: `0 6px 20px ${tabColor}44`,
                }}
              >
                OK
              </button>
            </Section>
          ) : (
            /* Withdraw Form */
            <Section>
              <SectionLabel>Withdraw Form</SectionLabel>

              {/* Selected wallet number display */}
              {activeCard && (
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4"
                  style={{ background: tabColorLight }}
                >
                  <div className="w-5 h-5 relative flex-shrink-0">
                    <Image
                      src={activeTab === "BKASH" ? bkashLogo : nagadLogo}
                      alt={activeTab}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    Wallet:{" "}
                    <span className="font-mono tracking-wider">
                      {activeCard.walletNumber}
                    </span>
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {/* Amount */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      ৳
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`Min ৳${MIN} – Max ৳${MAX}`}
                      className="w-full pl-8 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:ring-2 transition-all"
                      style={{ "--tw-ring-color": tabColor } as any}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">
                    Withdraw Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3.5 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:ring-2 transition-all"
                      style={{ "--tw-ring-color": tabColor } as any}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleWithdraw}
                  disabled={!activeCard || remainingWithdraws === 0}
                  className="w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                  style={{
                    background: !activeCard
                      ? "#94a3b8"
                      : `linear-gradient(135deg, ${tabColor}, ${tabColor}cc)`,
                    boxShadow: !activeCard
                      ? "none"
                      : `0 6px 20px ${tabColor}44`,
                  }}
                >
                  {/* handle submission loading state */}
                  {false ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
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
                      Withdraw Now
                    </>
                  )}
                </button>

                {remainingWithdraws === 0 && (
                  <p className="text-center text-xs text-red-400 font-semibold">
                    Daily withdraw limit reached. Try again tomorrow.
                  </p>
                )}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const RefreshIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

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
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
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

const PlusIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const CardIcon = () => (
  <svg
    className="w-5 h-5"
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

const ChevronIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// const WarningIcon = () => (
//   <svg
//     className="w-4 h-4 flex-shrink-0"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//     />
//   </svg>
// );

// ─── Tab Button ───────────────────────────────────────────────────────────────

function WalletTab({
  name,
  logo,
  label,
  active,
  count,
  onClick,
}: {
  name: CardName;
  logo: any;
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  const color = name === "BKASH" ? "#E2136E" : "#F6821F";
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
        active ? "text-white shadow-md" : "text-slate-500 bg-transparent"
      }`}
      style={
        active ? { background: color, boxShadow: `0 4px 16px ${color}44` } : {}
      }
    >
      <div className="w-5 h-5 relative flex-shrink-0">
        <Image src={logo} alt={label} fill className="object-contain" />
      </div>
      <span>E-Wallet</span>
      {count > 0 && (
        <span
          className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
            active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-400"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Card Slider ──────────────────────────────────────────────────────────────

function CardSlider({
  cards,
  activeIdx,
  onSelect,
  type,
}: {
  cards: ActiveCard[];
  activeIdx: number;
  onSelect: (i: number) => void;
  type: CardName;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const color = type === "BKASH" ? "#E2136E" : "#F6821F";
  const max = 5;

  useEffect(() => {
    console.log({ activeIdx });
    if (!sliderRef.current) return;

    const container = sliderRef.current;
    const child = container.children[activeIdx] as HTMLElement;

    if (child) {
      child.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeIdx]);

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      requestAnimationFrame(() => {
        const children = Array.from(container.children) as HTMLElement[];

        const containerCenter =
          container.scrollLeft + container.offsetWidth / 2;

        let closestIdx = 0;
        let minDistance = Infinity;

        children.forEach((child, i) => {
          const childCenter = child.offsetLeft + child.offsetWidth / 2;
          const distance = Math.abs(containerCenter - childCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestIdx = i;
          }
        });

        onSelect(closestIdx); // 🔥 update active index from swipe
        ticking = false;
      });

      ticking = true;
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-sm font-black text-slate-700">
          Bonus E-Wallet{" "}
          <span className="font-normal text-slate-400">
            ({cards.length}/{max})
          </span>
        </p>
      </div>

      {/* Slides */}
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {cards.map((card, i) => (
          <div
            key={card.id}
            className="flex-shrink-0 w-full snap-center"
            onClick={() => onSelect(i)}
          >
            {type === "BKASH" ? (
              <BKashCard
                mobileNumber={card.walletNumber}
                accountHolder={card.payerName}
                // isActive={i === activeIdx}
              />
            ) : (
              <NagadCard
                mobileNumber={card.walletNumber}
                accountHolder={card.payerName}
                // isActive={i === activeIdx}
              />
            )}
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      {cards.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === activeIdx ? 20 : 6,
                height: 6,
                background: i === activeIdx ? color : "#e2e8f0",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-transparent rounded-2xl px-4 py-2  ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-3">
      {children}
    </p>
  );
}
