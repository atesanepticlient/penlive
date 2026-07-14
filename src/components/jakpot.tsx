"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import jakpoImage from "@/../public/jakpot.png";
import Image from "next/image";
import { getJackpotGames } from "@/lib/games";
import JakpotGameCard from "./games/jakpot-game-card";
import Marquee from "react-fast-marquee";

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "jakpot_counter";
const DIGIT_COUNT = 9;
const INITIAL_NUMBER = 701_100_281;
const ANIM_DURATION = 380; // ms — must match CSS transition below

function randomIncrement(): number {
  const weights = [1, 1, 1, 2, 2, 3, 4, 5, 6, 7];
  return weights[Math.floor(Math.random() * weights.length)];
}

function randomDelay(): number {
  return Math.floor(Math.random() * 1700) + 800;
}

function toDigits(n: number): string[] {
  return String(n).padStart(DIGIT_COUNT, "0").slice(-DIGIT_COUNT).split("");
}

// ─── AnimatedDigit ─────────────────────────────────────────────────────────────
// Queues incoming digits so each one gets a full animation slot — no flicker.
const AnimatedDigit = ({ digit }: { digit: string }) => {
  const [from, setFrom] = useState(digit);
  const [to, setTo] = useState(digit);
  const [animating, setAnimating] = useState(false);

  const queue = useRef<string[]>([]);
  const busy = useRef(false);
  const lastQueued = useRef(digit);
  // Track the settled value so we always animate FROM the correct digit
  const settled = useRef(digit);

  const runNext = useCallback(() => {
    if (queue.current.length === 0) {
      busy.current = false;
      return;
    }
    const next = queue.current.shift()!;
    busy.current = true;

    // Snap "from" to the currently settled value before starting
    setFrom(settled.current);
    setTo(next);
    setAnimating(true);

    setTimeout(() => {
      settled.current = next;
      setFrom(next);
      setAnimating(false);
      // Small gap between chained animations
      setTimeout(runNext, 20);
    }, ANIM_DURATION);
  }, []);

  useEffect(() => {
    if (digit === lastQueued.current) return;
    lastQueued.current = digit;
    queue.current.push(digit);
    if (!busy.current) runNext();
  }, [digit, runNext]);

  const digitStyle: React.CSSProperties = {
    fontFamily: "'Helvetica Neue', Helvetica",
    fontWeight: "bold",
    fontSize: "40.5px",
    color: "white",
    lineHeight: "46.61px",
    letterSpacing: 0,
    // Glowing purple halo + hard bottom shadow for depth
    textShadow: "0px 0px 10px rgba(192,132,252,0.85), 0px 2px 0px #1e1b4b",
  };

  return (
    <div
      role="img"
      aria-label={`Digit ${settled.current}`}
      style={{
        display: "flex",
        height: "56px",
        width: "30px",
        borderRadius: "5.33px",
        border: "1px solid #c084fc",
        background: "linear-gradient(180deg,#4f46e5 0%,#4c1d95 100%)",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/*
        Sliding column — two rows, each 56 px tall (= container height).
        At rest:   translateY(0)   → top row (from) fills the viewport.
        Animating: translateY(-56px) → bottom row (to) slides up into view.
      */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          transform: animating ? "translateY(-56px)" : "translateY(0px)",
          transition: animating
            ? `transform ${ANIM_DURATION}ms cubic-bezier(0.32,0,0.2,1)`
            : "none",
          willChange: "transform",
        }}
      >
        {/* Row 1 — digit sliding OUT (top) */}
        <div
          style={{
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={digitStyle}>{from}</span>
        </div>

        {/* Row 2 — digit sliding IN (bottom) */}
        <div
          style={{
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={digitStyle}>{to}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Separator ─────────────────────────────────────────────────────────────────
const Separator = () => (
  <span className="text-white font-extrabold text-3xl translate-y-6 px-0.5 inline-block">
    ❜
  </span>
);

// ─── Jakpot ────────────────────────────────────────────────────────────────────
const Jakpot = () => {
  const [counter, setCounter] = useState<number>(() => {
    if (typeof window === "undefined") return INITIAL_NUMBER;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? parseInt(saved, 10) : INITIAL_NUMBER;
    } catch {
      return INITIAL_NUMBER;
    }
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(counter));
    } catch {
      // ignore
    }
  }, [counter]);

  // Recursive random-interval ticker
  const tick = useCallback(() => {
    const inc = randomIncrement();
    setCounter((prev) => prev + inc);
    timerRef.current = setTimeout(tick, randomDelay());
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(tick, randomDelay());
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [tick]);

  const digits = toDigits(counter);

  return (
    <div className="px-3">
      <div className=" py-3 rounded-lg border-[2px] border-violet-900 mt-8 relative">
        {/* ── Top area — untouched from original ── */}
        <div className="flex items-center justify-between px-4">
          <Image src={jakpoImage} alt="Jakpot" className="w-[160px] relative" />
          <div className="h-[63px] -translate-y-6 flex items-center justify-center text-center whitespace-nowrap font-bold text-[#ffee41] !text-5xl font-['Kohinoor_Bangla',_Helvetica] [text-shadow:0px_5.33px_0px_#ca5500] tracking-[0px] leading-[62.87px]">
            জ্যাকপট
          </div>
        </div>

        {/* ── Number row ── */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 px-2">
          <div className="flex gap-1.5">
            <AnimatedDigit digit={digits[0]} />
            <AnimatedDigit digit={digits[1]} />
            <AnimatedDigit digit={digits[2]} />

            <Separator />

            <AnimatedDigit digit={digits[3]} />
            <AnimatedDigit digit={digits[4]} />
            <AnimatedDigit digit={digits[5]} />

            <Separator />

            <AnimatedDigit digit={digits[6]} />
            <AnimatedDigit digit={digits[7]} />
            <AnimatedDigit digit={digits[8]} />
          </div>
        </div>

        <div className="pt-8 px-2 overflow-x-auto">
          <Marquee gradient={false} speed={40}>
            <GamesList />
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default Jakpot;

const GamesList = () => {
  const games = getJackpotGames({ limit: 50, nameSearch: "" });

  if (!games) return;
  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-none max-w-full ">
      {games?.map((game) => (
        <JakpotGameCard
          key={`${game.product_id}-${game.product_code}-${game.game_code}`}
          name={game.game_name}
          image_url={game.gif_url || game.image_url}
        />
      ))}
    </div>
  );
};
