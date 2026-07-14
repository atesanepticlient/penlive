"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LiaHeartSolid } from "react-icons/lia";
import { LocalArrayStorage } from "@/lib/favorites";
import { providers } from "../../../data/api-providers";
import Image from "next/image";
import useOpenGame from "@/hook/useOpenGame";
import GameBoard from "./game-board";

const storage = LocalArrayStorage<string>();

/* ---------------- TYPES ---------------- */

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface GameCardWithProviderProps {
  game: {
    game_name: string;
    image_url: string;
    product_code: number;
    game_code: string;
    game_type: string;
  } | any;
  onImageSettled?: () => void;
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

// function darken(rgb: RGB, amount: number): RGB {
//   return {
//     r: Math.max(0, rgb.r - amount),
//     g: Math.max(0, rgb.g - amount),
//     b: Math.max(0, rgb.b - amount),
//   };
// }

/* ---------------- COLOR CACHE (module-level) ---------------- */

const colorCache = new Map<string, RGB>();

/* ---------------- COMPONENT ---------------- */

export const GameCardWithProvider = ({
  game,
  onImageSettled,
}: GameCardWithProviderProps) => {
  const { game_name, image_url, product_code, game_code, game_type } = game;

  const cardRef = useRef<HTMLDivElement>(null);

  // Whether card has entered viewport
  const [inView, setInView] = useState(false);
  // Whether 500ms delay has passed — controls visibility
  const [visible, setVisible] = useState(false);
  // Color from image
  const [color, setColor] = useState<RGB | null>(
    colorCache.get(image_url) ?? null,
  );
  const [isFav, setFav] = useState(false);

  // ─── Reset on image change ────────────────────────────────────────────────
  useEffect(() => {
    setVisible(false);
    setColor(colorCache.get(image_url) ?? null);
  }, [image_url]);

  // ─── IntersectionObserver — start loading when in viewport ───────────────
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // only need to trigger once
        }
      },
      { rootMargin: "100px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ─── 500ms fixed delay after entering viewport ───────────────────────────
  useEffect(() => {
    if (!inView) return;

    const timer = setTimeout(() => {
      setVisible(true);
      onImageSettled?.();
    }, 500);

    return () => clearTimeout(timer);
  }, [inView]);

  // ─── Extract color on image load ─────────────────────────────────────────
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (colorCache.has(image_url)) {
      setColor(colorCache.get(image_url) as RGB);
      return;
    }

    try {
      const imgEl = e.currentTarget;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = 50;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(imgEl, 0, 0, size, size);

      const data = ctx.getImageData(0, 0, size, size).data;
      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      for (let i = 0; i < data.length; i += 16) {
        const rr = data[i],
          gg = data[i + 1],
          bb = data[i + 2];
        if (rr < 20 && gg < 20 && bb < 20) continue;
        r += rr;
        g += gg;
        b += bb;
        count++;
      }

      if (count === 0) return;

      const extracted = saturate(
        {
          r: Math.floor(r / count),
          g: Math.floor(g / count),
          b: Math.floor(b / count),
        },
        20,
      );

      colorCache.set(image_url, extracted);
      setColor(extracted);
    } catch {
      // CORS taint — skip color
    }
  };

  const handleAddToFav = () => {
    setFav((prev) => !prev);
    storage.push("favorites-games", game_name);
  };

  const provider = providers.find((p) => p.product_code == product_code);
  const name = provider?.name ?? "";
  const imageWh = provider?.imageWh ?? null;

  const colorReady = color !== null;
  const safeColor: RGB = color ?? { r: 40, g: 20, b: 60 };

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
        onClick={() => openGame()}
        ref={cardRef}
        className="relative"
        title={game_name}
      >
        {/* ---------------- SKELETON (shown until 500ms delay passes) ---------------- */}
        {!visible && (
          <div className="w-full aspect-square rounded-xl animate-pulse bg-violet-300/60 " />
        )}

        {/* ---------------- IMAGE — only fetched once in viewport ---------------- */}
        <Link href="#" className="relative block overflow-hidden">
          <div className={visible ? "visible" : "invisible absolute inset-0"}>
            <div
              className="shiny-card w-full rounded-xl overflow-hidden"
              style={{
                outline: colorReady
                  ? `1.5px solid ${rgbToCss(safeColor, 0.7)}`
                  : "1.5px solid transparent",
                boxShadow: colorReady
                  ? `0 0 18px ${rgbToCss(safeColor, 0.35)}, 0 8px 24px rgba(0,0,0,0.5)`
                  : "0 8px 24px rgba(0,0,0,0.5)",
                transition: "outline-color 0.4s ease, box-shadow 0.4s ease",
              }}
            >
              {/* Only set src once card is in viewport — lazy load */}
              <img
                alt={game_name}
                src={inView ? image_url : undefined}
                className="w-full align-middle aspect-square object-cover"
                onLoad={handleLoad}
              />
            </div>
          </div>
        </Link>

        {/* ---------------- FAV BUTTON ---------------- */}
        {visible && (
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={handleAddToFav}
              className="w-[18px] h-[18px] rounded-full bg-white/10 flex justify-center items-center"
            >
              <LiaHeartSolid
                className={`w-[15px] h-[15px] transition-colors duration-200 ${
                  isFav ? "text-pink-500" : "text-white"
                }`}
              />
            </button>
          </div>
        )}

        {/* ---------------- PROVIDER LOGO ---------------- */}
        {imageWh && visible && (
          <div
            className="inset-0 absolute w-full h-full pointer-events-none"
            style={{
              background: `linear-gradient(180deg, transparent 50%, #000000d4)`,
            }}
          >
            <div className="left-1/2 -translate-x-1/2 bottom-1 absolute">
              <Image
                src={imageWh}
                alt={name || "Provider"}
                className="w-[50px]"
                loading="lazy"
              />
            </div>
          </div>
        )}
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
};
