"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import bkashLogo from "@/../public/wallet/bkash-circle.png";
import nagadLogo from "@/../public/wallet/nagad-sqr.png";
import { ActiveCard, useGetCardsQuery } from "@/lib/features/cardSlice";
import SiteHeader from "@/components/SiteHeader";

// ─── Seeded RNG ───────────────────────────────────────────────────────────────

function makeRng(seed: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return () => {
    h ^= h << 13;
    h ^= h >> 7;
    h ^= h << 17;
    return (h >>> 0) / 4294967296;
  };
}

// ─── Realistic fintech palettes ───────────────────────────────────────────────
// Soft deep gradients inspired by real card issuers

const PALETTES = [
  // Classic bank navy
  {
    bg1: "#1a2e4a",
    bg2: "#2a5080",
    hi: "#6aacdd",
    lo: "#c0dff5",
    text: "#e8f4ff",
  },
  // Rose gold prestige
  {
    bg1: "#5c2d3a",
    bg2: "#9c5060",
    hi: "#dda0b0",
    lo: "#f5d8df",
    text: "#fff0f3",
  },
  // Investment green
  {
    bg1: "#16352a",
    bg2: "#265c45",
    hi: "#5eb88a",
    lo: "#b0ddc5",
    text: "#ebf7f1",
  },
  // Midnight neobank
  {
    bg1: "#18182c",
    bg2: "#28284a",
    hi: "#8080cc",
    lo: "#c0c0ee",
    text: "#f0f0ff",
  },
  // Warm gold
  {
    bg1: "#3a2208",
    bg2: "#6e4418",
    hi: "#c8901c",
    lo: "#eac880",
    text: "#fff8e8",
  },
  // Royal plum
  {
    bg1: "#2c1248",
    bg2: "#4e2280",
    hi: "#9a64cc",
    lo: "#ccaaee",
    text: "#f8f0ff",
  },
  // Corporate teal
  {
    bg1: "#0e3038",
    bg2: "#1e5560",
    hi: "#46a0aa",
    lo: "#9ad0d8",
    text: "#e5f6f8",
  },
  // Graphite
  {
    bg1: "#1e2228",
    bg2: "#323a44",
    hi: "#7890aa",
    lo: "#b8c8d8",
    text: "#eef2f6",
  },
  // Deep crimson
  {
    bg1: "#3c1010",
    bg2: "#6e2020",
    hi: "#c86060",
    lo: "#eab0b0",
    text: "#fff2f2",
  },
  // Ocean blue — Revolut style
  {
    bg1: "#08203a",
    bg2: "#123660",
    hi: "#3888d0",
    lo: "#88c4ef",
    text: "#e5f2ff",
  },
];

type StyleName =
  | "circles"
  | "waves"
  | "geo"
  | "dots"
  | "diagonal"
  | "circuit"
  | "contour"
  | "minimal";
const STYLES: StyleName[] = [
  "circles",
  "waves",
  "geo",
  "dots",
  "diagonal",
  "circuit",
  "contour",
  "minimal",
];

interface Design {
  bg1: string;
  bg2: string;
  hi: string;
  lo: string;
  text: string;
  style: StyleName;
}

function getDesign(id: string): Design {
  const rng = makeRng(id);
  const p = PALETTES[Math.floor(rng() * PALETTES.length)];
  const style = STYLES[Math.floor(rng() * STYLES.length)];
  return { ...p, style };
}

// ─── Background shapes ────────────────────────────────────────────────────────

function CardShapes({ id, hi, lo }: { id: string; hi: string; lo: string }) {
  const { style } = getDesign(id);
  const rng = makeRng(id + "bg");
  const W = 320;
  const H = 110;

  if (style === "circles") {
    // Big overlapping soft circles — Mastercard / classic bank
    const cx1 = 230 + rng() * 40,
      cy1 = -15 + rng() * 15;
    const cx2 = 290 + rng() * 20,
      cy2 = 75 + rng() * 20;
    return (
      <>
        <circle cx={cx1} cy={cy1} r="95" fill={hi} fillOpacity="0.13" />
        <circle cx={cx1 + 8} cy={cy1 + 8} r="65" fill={lo} fillOpacity="0.08" />
        <circle cx={cx2} cy={cy2} r="82" fill={hi} fillOpacity="0.09" />
        <circle
          cx={cx2 - 18}
          cy={cy2 - 18}
          r="52"
          fill={lo}
          fillOpacity="0.06"
        />
      </>
    );
  }

  if (style === "waves") {
    // Gentle layered waves at bottom — N26 / Monzo feel
    return (
      <>
        {Array.from({ length: 4 }, (_, i) => {
          const yBase = 58 + i * 18 + (rng() - 0.5) * 8;
          const amp = 8 + rng() * 7;
          const freq = 0.014 + rng() * 0.008;
          const phase = rng() * Math.PI;
          const pts = Array.from({ length: 33 }, (_, j) => {
            const x = (j / 32) * W;
            const y = yBase + Math.sin(x * freq + phase) * amp;
            return `${j === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(" ");
          return (
            <path
              key={i}
              d={pts + ` L${W},${H} L0,${H} Z`}
              fill={i % 2 === 0 ? hi : lo}
              fillOpacity={0.07 + i * 0.022}
            />
          );
        })}
      </>
    );
  }

  if (style === "geo") {
    // Sharp corner polygons — AmEx Centurion / premium card
    return (
      <>
        <polygon
          points={`${W * 0.58},0 ${W},0 ${W},${H * 0.52}`}
          fill={hi}
          fillOpacity="0.11"
        />
        <polygon
          points={`${W * 0.72},0 ${W},0 ${W},${H * 0.3}`}
          fill={lo}
          fillOpacity="0.09"
        />
        <polygon
          points={`0,${H * 0.62} ${W * 0.32},${H} 0,${H}`}
          fill={hi}
          fillOpacity="0.09"
        />
        <line
          x1={W * 0.58}
          y1="0"
          x2="0"
          y2={H}
          stroke={hi}
          strokeOpacity="0.06"
          strokeWidth="1"
        />
      </>
    );
  }

  if (style === "dots") {
    // Embossed dot matrix — Revolut / Stripe card
    const dots: React.ReactNode[] = [];
    for (let col = 0; col < 9; col++) {
      for (let row = 0; row < 4; row++) {
        const x = 175 + col * 18 + (row % 2) * 9;
        const y = 10 + row * 26;
        if (x < W + 8)
          dots.push(
            <circle
              key={`${col}-${row}`}
              cx={x}
              cy={y}
              r="2.2"
              fill={col % 2 === 0 ? hi : lo}
              fillOpacity={0.1 + rng() * 0.07}
            />,
          );
      }
    }
    return <>{dots}</>;
  }

  if (style === "diagonal") {
    // Angled band — classic bank card stripe
    const off = 50 + rng() * 30;
    return (
      <>
        <polygon
          points={`${W - off - 55},0 ${W},0 ${W},${H} ${W - off - 115},${H}`}
          fill={hi}
          fillOpacity="0.11"
        />
        <polygon
          points={`${W - off - 25},0 ${W - off + 8},0 ${W - off + 68},${H} ${W - off + 35},${H}`}
          fill={lo}
          fillOpacity="0.07"
        />
        <line
          x1={W - off - 25}
          y1="0"
          x2={W - off + 68}
          y2={H}
          stroke={hi}
          strokeOpacity="0.12"
          strokeWidth="1"
        />
      </>
    );
  }

  if (style === "circuit") {
    // Thin PCB traces — tech fintech card
    const nodes = Array.from({ length: 6 }, () => ({
      x: 150 + rng() * 150,
      y: 8 + rng() * 94,
    }));
    return (
      <>
        {nodes.map((n, i) =>
          i < nodes.length - 1 ? (
            <line
              key={`l${i}`}
              x1={n.x}
              y1={n.y}
              x2={nodes[i + 1].x}
              y2={nodes[i + 1].y}
              stroke={hi}
              strokeOpacity="0.16"
              strokeWidth="0.9"
            />
          ) : null,
        )}
        {nodes.map((n, i) => (
          <>
            <circle
              key={`o${i}`}
              cx={n.x}
              cy={n.y}
              r="3"
              fill="none"
              stroke={hi}
              strokeOpacity="0.18"
              strokeWidth="0.8"
            />
            <circle
              key={`i${i}`}
              cx={n.x}
              cy={n.y}
              r="1.2"
              fill={hi}
              fillOpacity="0.22"
            />
          </>
        ))}
      </>
    );
  }

  if (style === "contour") {
    // Topographic rings — luxury card feel
    const cx = 270 + rng() * 30,
      cy = 30 + rng() * 30;
    return (
      <>
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={52 + i * 24}
            ry={35 + i * 16}
            fill="none"
            stroke={i % 2 === 0 ? hi : lo}
            strokeOpacity={0.14 - i * 0.02}
            strokeWidth="1"
          />
        ))}
      </>
    );
  }

  // minimal — soft ambient blobs only
  return (
    <>
      <ellipse
        cx={W * 0.76}
        cy={H * 0.38}
        rx="110"
        ry="65"
        fill={hi}
        fillOpacity="0.12"
      />
      <ellipse
        cx={W * 0.18}
        cy={H * 0.72}
        rx="75"
        ry="48"
        fill={lo}
        fillOpacity="0.08"
      />
    </>
  );
}

// ─── EMV Chip ─────────────────────────────────────────────────────────────────

function ChipSvg({ color }: { color: string }) {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="33"
        height="25"
        rx="4"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeOpacity="0.35"
      />
      <rect
        x="12"
        y="1"
        width="10"
        height="5"
        rx="1"
        fill={color}
        fillOpacity="0.25"
      />
      <rect
        x="12"
        y="20"
        width="10"
        height="5"
        rx="1"
        fill={color}
        fillOpacity="0.25"
      />
      <rect
        x="1"
        y="9"
        width="5"
        height="8"
        rx="1"
        fill={color}
        fillOpacity="0.25"
      />
      <rect
        x="28"
        y="9"
        width="5"
        height="8"
        rx="1"
        fill={color}
        fillOpacity="0.25"
      />
      <rect
        x="12"
        y="8"
        width="10"
        height="10"
        rx="2"
        fill={color}
        fillOpacity="0.35"
      />
      <line
        x1="17"
        y1="8"
        x2="17"
        y2="18"
        stroke={color}
        strokeOpacity="0.45"
        strokeWidth="0.7"
      />
      <line
        x1="12"
        y1="13"
        x2="22"
        y2="13"
        stroke={color}
        strokeOpacity="0.45"
        strokeWidth="0.7"
      />
    </svg>
  );
}

// ─── Contactless ──────────────────────────────────────────────────────────────

function ContactlessIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path
        d="M6.5 9c0-1.38 1.12-2.5 2.5-2.5"
        stroke={color}
        strokeOpacity="0.55"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M4 9c0-2.76 2.24-5 5-5"
        stroke={color}
        strokeOpacity="0.35"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M1.5 9C1.5 4.86 4.86 1.5 9 1.5"
        stroke={color}
        strokeOpacity="0.18"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="9" cy="9" r="1.3" fill={color} fillOpacity="0.65" />
    </svg>
  );
}

// ─── Full card background ─────────────────────────────────────────────────────

function CardBg({ id }: { id: string }) {
  const { bg1, bg2, hi, lo } = getDesign(id);
  const uid = id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
  const gid = `g${uid}`;

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 320 110"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bg1} />
          <stop offset="100%" stopColor={bg2} />
        </linearGradient>
      </defs>
      <rect width="320" height="110" fill={`url(#${gid})`} />
      <CardShapes id={id} hi={hi} lo={lo} />
      <rect width="320" height="110" fill="black" fillOpacity="0.05" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function maskWallet(n: string) {
  const d = n.replace(/\D/g, "");
  return d.length >= 8
    ? `•••• •••• ${d.slice(-8, -4)} ${d.slice(-4)}`
    : d.length >= 4
      ? `•••• ${d.slice(-4)}`
      : n;
}

const CARD_META = {
  BKASH: { logo: bkashLogo, label: "bKash" },
  NAGAD: { logo: nagadLogo, label: "Nagad" },
} as const;

// ─── Payment Card component ───────────────────────────────────────────────────

function PaymentCard({ card, index }: { card: ActiveCard; index: number }) {
  const meta = CARD_META[card.cardName];
  const { hi, text } = getDesign(card.id);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden select-none"
      style={{
        height: 110,
        boxShadow: "0 4px 18px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.1)",
        animation: "fadeUp 0.32s ease-out both",
        animationDelay: `${index * 65}ms`,
      }}
    >
      <CardBg id={card.id} />

      <div className="relative z-10 flex items-center h-full px-4 gap-3">
        {/* Chip + contactless */}
        <div className="flex flex-col items-start gap-1.5 flex-shrink-0">
          <ChipSvg color={hi} />
          <ContactlessIcon color={hi} />
        </div>

        {/* Wallet + name */}
        <div className="flex-1 min-w-0 pl-1">
          <p
            className="font-mono text-[11px] tracking-[0.18em]"
            style={{ color: `${text}88` }}
          >
            {maskWallet(card.walletNumber)}
          </p>
          <p
            className="text-[11px] font-bold mt-1.5 truncate uppercase tracking-wide"
            style={{ color: text }}
          >
            {card.payerName}
          </p>
        </div>

        {/* Logo + date */}
        <div className="flex flex-col items-end justify-between h-full py-3 flex-shrink-0">
          <div className="w-9 h-9 relative drop-shadow-md">
            <Image
              src={meta.logo}
              alt={meta.label}
              fill
              className="object-contain"
            />
          </div>
          <div className="text-right">
            <p
              style={{ color: `${text}55` }}
              className="text-[8px] uppercase tracking-widest leading-tight"
            >
              Valid
            </p>
            <p
              className="text-[10px] font-semibold leading-tight"
              style={{ color: `${text}bb` }}
            >
              {formatDate(card.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg,transparent,${hi}40,transparent)`,
        }}
      />
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

function AddCardDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">
              Add New
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Choose your wallet type
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-4 pb-10 space-y-3">
          {[
            {
              name: "BKASH" as const,
              logo: bkashLogo,
              label: "bKash",
              bg: "bg-pink-50",
              border: "border-pink-200",
            },
            {
              name: "NAGAD" as const,
              logo: nagadLogo,
              label: "Nagad",
              bg: "bg-orange-50",
              border: "border-orange-200",
            },
          ].map((opt) => (
            <button
              key={opt.name}
              onClick={() => {
                onClose();
                router.push(`/card?card=${opt.name}`);
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 ${opt.bg} ${opt.border} active:scale-[0.98] transition-all duration-150`}
            >
              <div className="w-12 h-12 relative flex-shrink-0">
                <Image
                  src={opt.logo}
                  alt={opt.label}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-800">{opt.label}</p>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  E-Wallet
                </p>
              </div>
              <div className="ml-auto">
                <svg
                  className="w-4 h-4 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CardsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data, isLoading, isError } = useGetCardsQuery();
  const cards = data?.cards ?? [];

  return (
    <div>
      <SiteHeader title="My Cards" />
      <div className="min-h-screen bg-slate-50 pb-28">
        <div className="bg-white border-b relative border-slate-100 px-5 py-5 top-0">
          <div className="w-2 h-2 bg-yellow-300 rounded-full absolute left-2 top-1/2 -translate-y-1/2" />
          <p className="text-base font-medium mt-0.5">
            {cards.length > 0
              ? `E-wallet${cards.length > 1 ? "s" : ""} Linked ${cards.length}`
              : "No cards yet"}
          </p>
        </div>

        <div className="px-4 pt-5 space-y-3">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-9 h-9 rounded-full border-4 border-slate-200 border-t-slate-600 animate-spin" />
              <p className="text-xs text-slate-400 font-medium">
                Loading cards…
              </p>
            </div>
          )}
          {isError && (
            <div className="text-center py-16">
              <p className="text-sm text-red-400 font-semibold">
                Failed to load cards
              </p>
            </div>
          )}
          {!isLoading && !isError && cards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-[72px] h-[72px] rounded-3xl bg-slate-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-600">
                  No cards added yet
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Tap + to add your first wallet
                </p>
              </div>
            </div>
          )}
          {cards.map((card, i) => (
            <PaymentCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* FAB */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-none">
          <button
            onClick={() => setDrawerOpen(true)}
            className="pointer-events-auto w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-2xl shadow-slate-900/40 active:scale-95 transition-all duration-150"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <AddCardDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <style jsx global>{`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
