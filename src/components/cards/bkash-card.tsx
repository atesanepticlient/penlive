import React from "react";
import bkashLogo from "@/../public/wallet/bkash-circle.png";
import Image from "next/image";
const BKashCard = ({
  mobileNumber = "01912 345 678",
  accountHolder = "AHMED KHAN",
}) => {
  return (
    <div className="flex flex-col items-center justify-center  w-full overflow-hidden rounded-xl px-2">
      {/* Main Card */}
      <div
        className="relative w-full h-32 rounded-xl p-4 text-white overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #E91E63 0%, #C2185B 100%)",
          boxShadow: "0 8px 20px rgba(233, 30, 99, 0.3)",
        }}
      >
        {/* SVG Pattern Overlay - Diagonal Lines */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-10 z-0"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="diagonal-lines"
              x="0"
              y="0"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
        </svg>

        {/* Textured Background with Noise */}
        <div
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(0,0,0,0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)
            `,
          }}
        ></div>

        {/* Subtle grid texture overlay */}
        <div
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "12px 12px",
          }}
        ></div>

        {/* Animated Shimmer Effect */}
        {/* <div
          className="absolute -top-1/2 -left-1/2 w-screen h-screen bg-gradient-to-br from-transparent via-white to-transparent z-0 opacity-60"
          style={{
            animation: "shimmer 8s infinite",
          }}
        ></div> */}

        {/* Top accent line with gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-1 z-20"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.4) 100%)",
          }}
        ></div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-2 right-4 w-20 h-20 border border-white/10 rounded-full z-0"></div>
        <div className="absolute bottom-2 left-4 w-16 h-16 border border-white/5 rounded-full z-0"></div>

        {/* Card content wrapper */}
        <div className="relative z-20 h-full flex flex-col justify-between">
          {/* Top Row: Logo and Chip */}
          <div className="flex justify-between items-center">
            {/* bKash Logo with glow */}
            <div
              className="flex items-center gap-1.5"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
            >
              <Image src={bkashLogo} alt="bkash" className="w-6" />
              <span
                className="text-base font-bold tracking-wide"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
              >
                bKash
              </span>
            </div>

            {/* EMV Chip with enhanced reflection */}
            <div
              className="relative w-9 h-7 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded border border-yellow-700/50"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(3, 1fr)",
                gap: "1.5px",
                padding: "2.5px",
                boxShadow:
                  "inset 0 2px 4px rgba(0,0,0,0.2), inset -1px -1px 2px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="bg-black/15 rounded"
                  style={{ borderRadius: "1px" }}
                ></div>
              ))}
              {/* Reflection highlight */}
              <div
                className="absolute top-0.5 left-0.5 pointer-events-none"
                style={{
                  width: "70%",
                  height: "35%",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 100%)",
                  borderRadius: "2px",
                }}
              ></div>
            </div>
          </div>

          {/* Middle Row: Mobile number with depth */}
          <div className="relative">
            <div
              className="text-lg font-bold tracking-widest font-mono"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.15)" }}
            >
              {mobileNumber}
            </div>
            {/* Subtle underline */}
            <div className="absolute -bottom-1 left-0 w-2/5 h-px bg-white/20"></div>
          </div>

          {/* Bottom Row: Name and Details */}
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <div
                className="text-xs font-bold tracking-wider"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
              >
                {accountHolder}
              </div>
            </div>

            <div
              className="text-xs text-white/80"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
            >
              ROYELCARD
            </div>
          </div>
        </div>
      </div>

      <style>{`
        // @keyframes shimmer {
        //   0% {
        //     transform: translateX(-100%) translateY(-100%);
        //   }
        //   100% {
        //     transform: translateX(100%) translateY(100%);
        //   }
        // }
      `}</style>
    </div>
  );
};

export default BKashCard;
