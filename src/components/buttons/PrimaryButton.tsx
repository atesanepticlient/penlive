"use client";
import React from "react";
import { FaGift } from "react-icons/fa";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "PLATFORM" | "NORMAL";
};

const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "PLATFORM",
  ...props
}) => {
  if (variant === "PLATFORM") {
    return (
      <button
        className={`
          relative
          overflow-hidden
          px-3
          py-[6px]
          rounded-[20px]
          text-[11px]
          font-bold
          text-white
          border-0
          cursor-pointer
          bg-[linear-gradient(135deg,#ff003c,#ff6b00)]
          shadow-[0_0_18px_rgba(255,0,60,0.55),inset_0_1px_0_rgba(255,255,255,0.2)]
          transition-transform
          active:scale-[0.97]
          ${className}
        `}
        {...props}
      >
        {/* TEXT */}
        {!children && (
          <span className="relative z-10 animate-pulse flex items-center gap-2">
            ৳2000
            <FaGift />
          </span>
        )}

        {children && children}

        {/* SHINE */}
        <span
          className="
            absolute
            top-0
            left-[-60%]
            h-full
            w-[60%]
            bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]
            animate-[shine_2.2s_linear_infinite]
          "
        />

        {/* SAFE GLOBAL ANIMATION (no style jsx) */}
        <style>{`
          @keyframes shine {
            0% { left: -60%; }
            100% { left: 130%; }
          }
        `}</style>
      </button>
    );
  }

  return (
    <button
      className={`
        px-3
        py-[6px]
        rounded-[20px]
        text-[11px]
        font-semibold
        text-[#ffd700]
        border
        border-[rgba(255,215,0,0.28)]
        bg-[linear-gradient(135deg,rgba(255,215,0,0.12),rgba(255,215,0,0.05))]
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
// <button
//   className={`px-4 py-2 ${className}`}
//   style={{
//     background:
//       "linear-gradient(180deg, var(--color-cyan-27, #0F727C) 0%, var(--color-cyan-17, #004E56) 100%)",
//     boxShadow: "0px 1.0399999618530273px 0px #003941",
//     borderRadius: 6.24,
//     outline: "1px var(--color-cyan-30-50%, rgba(17, 134, 125, 0.50)) solid",
//     outlineOffset: "-1px",
//     justifyContent: "center",
//     alignItems: "center",
//     display: "inline-flex",
//   }}
//   {...props}
// >
//   {" "}
//   <div
//     style={{
//       textAlign: "center",
//       justifyContent: "center",
//       display: "flex",
//       flexDirection: "column",
//       color: "var(--color-orange-64, #FFAB49)",
//       fontSize: 15,
//       fontFamily: "Segoe UI",
//       fontWeight: "700",

//       wordWrap: "break-word",
//       textShadow: "0px 1px 0px rgba(17, 0, 0, 0.30)",
//     }}
//   >
//     {children}
//   </div>
// </button>
