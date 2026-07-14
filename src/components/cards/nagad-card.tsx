import React from "react";
import nagadLogo from "@/../public/wallet/nagad-sqr.png";
import Image from "next/image";
const NagadCard = ({
  mobileNumber = "01912 345 678",
  accountHolder = "AHMED KHAN",
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full overflow-hidden rounded-xl px-2 ">
      {/* Main Card */}
      <div
        className="relative w-full h-32 rounded-xl p-4 text-white overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2C2C2C 0%, #1F1F1F 100%)",
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 10px 20px rgba(0, 0, 0, 0.3),
            0 0 1px rgba(0, 0, 0, 0.1)
          `,
        }}
      >
        {/* SVG Geometric Pattern Overlay */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-8 z-0"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="geometric-pattern"
              x="0"
              y="0"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="8"
                cy="8"
                r="1.5"
                stroke="#FF6B35"
                strokeWidth="0.5"
                fill="none"
                opacity="0.5"
              />
              <line
                x1="0"
                y1="8"
                x2="16"
                y2="8"
                stroke="#FF6B35"
                strokeWidth="0.3"
                opacity="0.3"
              />
              <line
                x1="8"
                y1="0"
                x2="8"
                y2="16"
                stroke="#FF6B35"
                strokeWidth="0.3"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geometric-pattern)" />
        </svg>

        {/* Textured Background */}
        <div
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, rgba(255, 107, 53, 0.05) 0%, transparent 40%)
            `,
          }}
        ></div>

        {/* Grid Texture */}
        <div
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255, 107, 53, 0.03) 1px, transparent 1px),
              linear-gradient(rgba(255, 107, 53, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        ></div>

        {/* Left Side Accent Bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 z-10"
          style={{
            background: "linear-gradient(180deg, #FF6B35 0%, #E84D1F 100%)",
          }}
        ></div>

        {/* Realistic Light Reflection */}
        <div
          className="absolute top-0 left-0 w-full h-1/3 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
            borderRadius: "10px 10px 0 0",
          }}
        ></div>

        {/* Ambient Light Glow from Top */}
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-0 pointer-events-none"
          style={{
            width: "120%",
            height: "60px",
            background:
              "radial-gradient(ellipse at center, rgba(255, 107, 53, 0.15) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        ></div>

        {/* Soft Edge Highlight */}
        <div
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(255,255,255,0.1) 0%, 
                transparent 20%),
              linear-gradient(90deg, 
                rgba(255,255,255,0.08) 0%, 
                transparent 15%, 
                transparent 85%, 
                rgba(255,255,255,0.04) 100%)
            `,
            borderRadius: "10px",
          }}
        ></div>

        {/* Subtle Inner Shadow for Depth */}
        <div
          className="absolute inset-0 rounded-xl z-0 pointer-events-none"
          style={{
            boxShadow:
              "inset 0 1px 2px rgba(255,255,255,0.1), inset 0 -2px 8px rgba(0,0,0,0.3)",
          }}
        ></div>

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 z-20 rounded-t-xl"
          style={{
            background:
              "linear-gradient(90deg, rgba(255, 107, 53, 0.5) 0%, rgba(255,255,255,0.12) 50%, rgba(255, 107, 53, 0.5) 100%)",
          }}
        ></div>

        {/* Decorative Right Side Element */}
        <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-32 h-32 border border-white/5 rounded-full z-0"></div>

        {/* Card content wrapper */}
        <div className="relative z-20 h-full flex flex-col justify-between">
          {/* Top Row: Logo and Badge */}
          <div className="flex justify-between items-center">
            {/* Nagad Logo Text */}
            <div
              className="flex items-center gap-2"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
            >
              <Image src={nagadLogo} alt="Nagad" className="w-6" />
              <span
                className="text-base font-bold tracking-wider"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
              >
                Nagad
              </span>
            </div>

            {/* Mastercard-style circles (Network Badge) */}
            <div className="flex gap-1">
              <div
                className="w-5 h-5 rounded-full"
                style={{
                  background: "#FF6B35",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              ></div>
              <div
                className="w-5 h-5 rounded-full -ml-2"
                style={{
                  background: "rgba(255, 107, 53, 0.6)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              ></div>
            </div>
          </div>

          {/* Middle Row: Mobile number with label */}
          <div className="relative">
            <div
              className="text-lg font-bold tracking-widest font-mono mt-4 "
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.15)" }}
            >
              {mobileNumber}
            </div>
            {/* Subtle underline */}
            <div
              className="absolute -bottom-1 left-0 w-2/3 h-px"
              style={{ background: "rgba(255, 107, 53, 0.3)" }}
            ></div>
          </div>

          {/* Bottom Row: Name and Details */}
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <div
                className="text-sm font-bold tracking-wider mt-2.5"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
              >
                {accountHolder}
              </div>
            </div>

            <div className="text-right">
              <div
                className="text-sm "
                style={{
                  textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                  color: "#FF6B35",
                }}
              >
                ROYELCARD
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NagadCard;
