import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * GoldenLiquidSlider – a fresh, "liquid gold" UI
 * ------------------------------------------------
 * - Color: #faca15
 * - Range: 100 → 10000 (step=1)
 * - Animated fluid fill with floating bubbles + shimmer
 * - Glass value chip follows the thumb
 * - Tick labels at key stops
 * - Accessible: native <input type="range"> overlays the custom track
 */

const GOLD = "#faca15";
const MIN = 100;
const MAX = 10000;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const toPct = (v) => ((clamp(v, MIN, MAX) - MIN) / (MAX - MIN)) * 100;

export default function GoldenLiquidSlider({ initialValue = 3200, onChange }) {
  const [val, setVal] = React.useState(clamp(initialValue, MIN, MAX));
  const pct = toPct(val);

  const handleChange = (e) => {
    const next = clamp(Number(e.target.value), MIN, MAX);
    setVal(next);
    onChange?.(next);
  };

  return (
    <div className="w-full flex items-center justify-center p-2">
      <div className="w-[400px] max-w-full">
        <div className="ml-3 flex items-end justify-between">
          <div className="text-white text-sm">
            {MIN.toLocaleString()} – {MAX.toLocaleString()}
          </div>
        </div>

        {/* Slider shell */}
        <div className="relative h-[42px] rounded-[40px] select-none">
          {/* Outer glass shell */}
          <div
            className="absolute inset-0 rounded-[40px]"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%)",
              boxShadow:
                "0 30px 60px rgba(31,41,55,0.12), 0 10px 28px rgba(31,41,55,0.08), inset 0 0 0 2px rgba(255,255,255,0.6)",
            }}
          />

          {/* Track cavity */}
          <div
            className="absolute inset-[12px] rounded-[32px] overflow-hidden"
            style={{
              background:
                "radial-gradient(120% 120% at 50% -10%, #FFF 0%, #F7F7FA 60%, #ECEEF3 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -2px 6px rgba(0,0,0,0.08)",
            }}
          >
            {/* Liquid fill */}
            <motion.div
              className="h-full relative rounded-[32px] overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 16 }}
            >
              {/* Gold gradient body */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${GOLD} 0%, #f2b60c 55%, #dba007 100%)`,
                  boxShadow:
                    "inset 0 -10px 16px rgba(0,0,0,0.14), 0 10px 18px rgba(250,202,21,0.32)",
                }}
              />

              {/* Wavy liquid mask (animated) */}
              <motion.div
                className="absolute -top-6 left-0 right-0 h-14 opacity-70 mix-blend-overlay"
                animate={{ x: [0, -40, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "radial-gradient(40px 10px at 10% 60%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%),\n                     radial-gradient(60px 14px at 40% 50%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%),\n                     radial-gradient(50px 12px at 70% 55%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)",
                  filter: "blur(2px)",
                }}
              />

              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0"
                animate={{ backgroundPositionX: [0, 240, 480] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  background:
                    "linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 55%, rgba(255,255,255,0) 100%)",
                  backgroundSize: "480px 100%",
                }}
              />

              {/* Floating bubbles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${(i * 12) % 96}%`,
                      bottom: `${(i % 3) * 10 + 8}%`,
                      background: "rgba(255,255,255,0.85)",
                      filter: "blur(0.2px)",
                      mixBlendMode: "screen",
                    }}
                    animate={{ y: [-4, 4, -4] }}
                    transition={{
                      duration: 2 + (i % 5) * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Rounded end-cap */}
              <div
                className="absolute top-0 h-full aspect-square rounded-full"
                style={{
                  right: "-50%",
                  background: `linear-gradient(180deg, ${GOLD} 0%, #f2b60c 55%, #dba007 100%)`,
                  boxShadow: "inset 0 -12px 16px rgba(0,0,0,0.12)",
                }}
              />
            </motion.div>

            {/* Thumb + value chip */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 z-10"
              animate={{ left: `calc(${pct}% + 12px)` }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
              style={{ pointerEvents: "none" }}
            >
              <div className="relative">
                {/* 3D thumb */}
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: `radial-gradient(60% 60% at 30% 30%, #fff 0%, ${GOLD} 60%, #d69c05 100%)`,
                    boxShadow:
                      "0 10px 18px rgba(250,202,21,0.35), inset 0 -8px 10px rgba(0,0,0,0.18)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                />

                {/* Value chip (glass) */}
                <AnimatePresence>
                  <motion.div
                    key={val}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -18 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: "spring", stiffness: 140, damping: 14 }}
                    className="absolute left-1/2 -translate-x-1/2 -top-6 px-2.5 py-1 rounded-md text-[12px] font-semibold text-gray-900 backdrop-blur"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(243,244,246,0.9))",
                      boxShadow:
                        "0 8px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    {val.toLocaleString()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Real input */}
            <input
              type="range"
              min={MIN}
              max={MAX}
              disabled={true}
              step={1}
              value={val}
              onChange={handleChange}
              aria-label="Amount"
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{ WebkitAppearance: "none", appearance: "none" }}
            />
          </div>
        </div>

        {initialValue && (
          <h3 className="text-[#faca15] font-2xl font-bold">{initialValue}</h3>
        )}
      </div>
    </div>
  );
}
