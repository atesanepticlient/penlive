"use client";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "PLATFORM" | "NORMAL";
};

const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "PLATFORM",
  ...props
}) => {
  /* -------------------------------------------------------------------------- */
  /*                               PLATFORM STYLE                               */
  /* -------------------------------------------------------------------------- */

  if (variant === "PLATFORM") {
    return (
      <button
        onClick={props.onClick}
        className={`
          px-3
          py-[6px]
          rounded-[20px]
          text-[11px]
          font-semibold
          text-[#ffd700]
          cursor-pointer
          border
          border-[rgba(255,215,0,0.28)]
          relative
          overflow-hidden
          bg-[linear-gradient(135deg,rgba(255,215,0,0.12),rgba(255,215,0,0.05))]
          transition-all
          active:scale-[0.97]
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                NORMAL STYLE                                */
  /* -------------------------------------------------------------------------- */

  return (
    <button
      onClick={props.onClick}
      className={className}
      style={{
        height: 30,
        minWidth: 80,
        padding: "0 18px",

        background: "linear-gradient(180deg, #2F2F2F 0%, #1A1A1A 100%)",

        borderRadius: 8,
        border: "1px solid #3A3A3A",

        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",

        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 3px 8px rgba(0,0,0,0.6)",

        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontFamily: "Segoe UI",
          fontWeight: "600",
          color: "#E5E5E5",
          letterSpacing: "0.3px",
        }}
      >
        {children}
      </div>
    </button>
  );
};

export default SecondaryButton;

// <button
//   className={` px-4 py-2 ${className}`}
//   style={{
//     minWidth: 70.72,

//     background:
//       "linear-gradient(180deg, var(--color-yellow-50, #FFE600) 0%, var(--color-orange-50, #FFB800) 100%)",
//     boxShadow: "0px 1.0399999618530273px 0px #B64100",
//     overflow: "hidden",
//     borderRadius: 6.24,
//     outline:
//       "1px var(--color-yellow-83-50%, rgba(255, 242, 166, 0.50)) solid",
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
//       color: "var(--color-orange-36, #B64100)",
//       fontSize: 14,
//       fontFamily: "Segoe UI",
//       fontWeight: "700",

//       wordWrap: "break-word",
//       textShadow: "0px 1px 0px rgba(159, 52, 0, 0.20)",
//     }}
//   >
//     {children}
//   </div>
// </button>
