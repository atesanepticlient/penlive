"use client";
import React from "react";

interface GameLoaderProps {
  length: number;
  loading: boolean;
}

const GameLoader = ({ length, loading }: GameLoaderProps) => {
  const loader = Array.from({ length: length });

  if (!loading) return null;

  return (
    <>
      {loader.map((_, i) => (
        <Loader key={i} />
      ))}
    </>
  );
};

export default GameLoader;

export const Loader = () => {
  return (
    <div className="relative w-full h-[140px] rounded-2xl overflow-hidden  flex items-center justify-center bg-violet-300/60">
      {/* The Luxury Shimmer Effect */}
      <div className="absolute inset-0 z-0">
        {/* <div
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12 animate-shimmer"
          style={{
            animation: "shimmer 2s infinite linear",
          }}
        /> */}
      </div>

      {/* Decorative Gold Inset */}
      {/* <div
        className="w-12 h-12 rounded-full border border-[#D4AF37]/10 animate-pulse flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)",
        }}
      >
        <div className="w-6 h-6 rounded-full border-2 border-t-[#F9E498] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div> */}

      {/* Luxury Loading Text */}
      {/* <span
        className="absolute bottom-3 text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{
          color: "#D4AF37",
          opacity: 0.6,
          fontFamily: "serif",
        }}
      >
        Loading...
      </span> */}

      {/* CSS for the Shimmer Animation (Add to your global CSS or use a <style> tag) */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-150%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </div>
  );
};
