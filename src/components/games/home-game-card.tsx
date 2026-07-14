/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { providers } from "../../../data/api-providers";
import NextImage from "next/image";
import GameBoard from "./game-board";
import useOpenGame from "@/hook/useOpenGame";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface GameCardProps {
  image: string;
  label: string;
  className?: string;
  badge?: CardBadge;
  product_code: number;
  game_code: string;
  game_type: string;
}

/* ---------------- COLOR UTILS ---------------- */

function rgbToCss(rgb: RGB, alpha = 1) {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function saturate(rgb: RGB, amount: number): RGB {
  return {
    r: Math.min(255, rgb.r + amount),
    g: Math.min(255, rgb.g + amount),
    b: Math.min(255, rgb.b + amount),
  };
}

function darken(rgb: RGB, amount: number): RGB {
  return {
    r: Math.max(0, rgb.r - amount),
    g: Math.max(0, rgb.g - amount),
    b: Math.max(0, rgb.b - amount),
  };
}

/* ---------------- COLOR DETECTION ---------------- */

async function getDominantColor(imageUrl: string): Promise<RGB> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return resolve({ r: 0, g: 120, b: 255 });

      const size = 50;
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, 0, 0, size, size);

      const data = ctx.getImageData(0, 0, size, size).data;

      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      for (let i = 0; i < data.length; i += 16) {
        const rr = data[i];
        const gg = data[i + 1];
        const bb = data[i + 2];

        if (rr < 20 && gg < 20 && bb < 20) continue;

        r += rr;
        g += gg;
        b += bb;
        count++;
      }

      resolve({
        r: Math.floor(r / count),
        g: Math.floor(g / count),
        b: Math.floor(b / count),
      });
    };

    img.onerror = () => resolve({ r: 0, g: 120, b: 255 });
  });
}

/* ---------------- BADGE ---------------- */

export type CardBadge = "fire" | "new" | "live" | "hot";

const BADGE_CONFIG: Record<
  CardBadge,
  {
    text: string;
    bg: string;
    color: string;
    shadow: string;
    position: "top-left" | "top-right";
    isEmoji?: boolean;
  }
> = {
  fire: {
    text: "🔥",
    bg: "transparent",
    color: "#fff",
    shadow: "",
    position: "top-right",
    isEmoji: true,
  },
  new: {
    text: "NEW",
    bg: "#00ff88",
    color: "#001a00",
    shadow: "0 0 12px rgba(0,255,136,0.55)",
    position: "top-left",
  },
  live: {
    text: "LIVE",
    bg: "#ff003c",
    color: "#fff",
    shadow: "0 0 12px rgba(255,0,60,0.65)",
    position: "top-left",
  },
  hot: {
    text: "HOT",
    bg: "linear-gradient(90deg, #f43f5e, #fb923c)",
    color: "#fff",
    shadow: "0 0 12px rgba(255,170,0,0.55)",
    position: "top-left",
  },
};

/* ---------------- MODULE-LEVEL CACHE ---------------- */
// Persists across re-renders and SPA navigation; resets only on full page reload.
// Stores image URLs that have already completed the skeleton+load sequence.
const loadedImageCache = new Set<string>();

/* ---------------- COMPONENT ---------------- */

export default function GameCard({
  image,
  label,
  className,
  game_code,
  game_type,
  badge,
  product_code,
}: GameCardProps) {
  // If this image was already loaded in a previous render/visit, skip skeleton immediately
  const [color, setColor] = useState<RGB>({ r: 0, g: 120, b: 255 });
  const [loaded, setLoaded] = useState(() => loadedImageCache.has(image));
  const [inView, setInView] = useState(() => loadedImageCache.has(image));

  const cardRef = useRef<HTMLDivElement>(null);

  /* ---- Intersection Observer: trigger load only when card enters viewport ---- */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Already seen before — no observer needed
    if (loadedImageCache.has(image)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // load once, no need to keep watching
        }
      },
      {
        // Start loading slightly before the card is fully visible
        // rootMargin covers both vertical scroll and horizontal scroll containers
        rootMargin: "100px 100px 100px 100px",
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [image]);

  /* ---- Once in view: run 500ms skeleton + color extraction ---- */
  useEffect(() => {
    if (!inView) return;

    // Already cached — skip the 500ms delay entirely and go straight to loaded
    if (loadedImageCache.has(image)) {
      setLoaded(true);
      return;
    }

    setLoaded(false);

    const skeletonTimer = setTimeout(() => {
      setLoaded(true);
      loadedImageCache.add(image); // mark as done so revisits skip the delay
    }, 500);

    getDominantColor(image)
      .then((c) => setColor(saturate(c, 20)))
      .catch(() => {});

    return () => clearTimeout(skeletonTimer);
  }, [inView, image]);

  const border = rgbToCss(color, 0.9);
  const glow = rgbToCss(color, 0.45);
  const dark = darken(color, 80);

  const b = badge ? BADGE_CONFIG[badge] : null;

  const getProvider = (product_code: number) => {
    return providers.find((provider) => provider.product_code == product_code);
  };

  const { name, imageWh } = getProvider(product_code) ?? {};

  const {
    openGame,
    gameContent,
    gameUrl,
    gameError,
    gameOpen,
    reset,
    isLoading,
  } = useOpenGame({ product_code, game_code, game_type });

  return (
    <>
      <div
        ref={cardRef}
        onClick={() => openGame()}
        className={`relative overflow-hidden min-h-[136px] rounded-[10px] cursor-pointer active:scale-[0.97] transition-all duration-300 ${className}`}
        style={{
          border: `2px solid ${border}`,
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.05),
            0 0 25px ${glow},
            0 15px 35px rgba(0,0,0,0.6)
          `,
        }}
      >
        {/* ---------------- SKELETON ---------------- */}
        {/* Shows while not yet in view OR within the 500ms window */}
        {(!inView || !loaded) && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: `linear-gradient(135deg,
                ${rgbToCss(color, 0.35)},
                ${rgbToCss(dark, 0.7)})`,
            }}
          />
        )}

        {/* ---------------- IMAGE (only rendered after entering viewport) ---------------- */}
        {inView && (
          <img
            src={image}
            alt={label}
            draggable={false}
            loading="lazy"
            className="w-full h-auto object-cover"
          />
        )}

        {/* ---------------- OVERLAY ---------------- */}
        {inView && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, transparent 50%, #000000d4`,
            }}
          >
            {inView && imageWh && (
              <div className="left-1/2 -translate-x-1/2 bottom-1 absolute">
                <NextImage
                  src={imageWh}
                  alt={name || "Provider"}
                  className="w-[50px]"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}

        {/* ---------------- BADGE ---------------- */}
        {b && (
          <span
            className={[
              "absolute z-[5]",
              b.position === "top-right"
                ? "top-[6px] right-[6px]"
                : "top-[6px] left-[6px]",
              b.isEmoji
                ? "text-[14px]"
                : "text-[7px] font-black px-[6px] py-[3px] rounded-[6px] tracking-[1px]",
            ].join(" ")}
            style={{
              background: b.bg,
              color: b.color,
              boxShadow: b.shadow,
              fontFamily: b.isEmoji ? undefined : "Orbitron, sans-serif",
            }}
          >
            {b.text}
          </span>
        )}

        <div
          className="absolute top-0 left-0 right-0 h-[35%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.14), transparent)",
          }}
        />
      </div>

      {gameOpen && (
        <GameBoard
          isLoading={isLoading}
          url={gameUrl}
          content={gameContent}
          onCloseGame={() => reset()}
          error={gameError}
        />
      )}
    </>
  );
}
