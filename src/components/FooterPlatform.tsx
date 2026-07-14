"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import logo_sq from "@/../public/logo-sq.png";

const FooterPlatform = () => {
  return (
    <div
      className="w-full pb-[120px] px-4"
      style={{
        background: "linear-gradient(180deg, #0a0514 0%, #070510 100%)",
        borderTop: "1px solid rgba(255,215,0,0.15)",
      }}
    >
      {/* ── DEPOSIT / WITHDRAW ── */}
      <div className="flex gap-3 pt-5 mb-6">
        <ActionCard href="#" sublabel="অংশীদার" label="Partner" primary />
        <ActionCard
          href="/chat"
          label="Support"
          sublabel="সহযোগিতা"
          primary={false}
        />
      </div>

      {/* ── GAME CENTER TITLE ── */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-[3px] h-5 rounded-full"
          style={{ background: "linear-gradient(180deg,#FFD700,#FF8C00)" }}
        />
        <h3
          className="text-sm font-bold uppercase tracking-[0.2em]"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            background: "linear-gradient(90deg,#FFD700,#FFE97A)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Game Center
        </h3>
      </div>

      {/* ── GAME CATEGORIES ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          "Slots",
          "Live Casino",
          "Poker",
          "Fish",
          "Sports",
          "E-sports",
          "Lottery",
        ].map((category) => (
          <div
            key={category}
            className="px-4 py-[7px] rounded-lg cursor-pointer transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,215,0,0.2)",
            }}
          >
            <span
              className="text-[13px] font-medium tracking-wide"
              style={{ color: "rgba(240,230,255,0.7)" }}
            >
              {category}
            </span>
          </div>
        ))}
      </div>

      {/* ── LOGO + LEGAL ── */}
      <div
        className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center p-5 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Image
          src={logo_sq}
          alt="Mbuzz88"
          className="w-[80px] h-[80px] rounded-xl object-cover"
          style={{
            boxShadow: "0 0 15px rgba(212,175,55,0.2)",
            border: "1px solid rgba(212,175,55,0.3)",
          }}
        />
        <p
          className="text-[11px] leading-relaxed max-w-2xl font-light"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <a href="https://penliveofficial.com" className="hover:underline">penliveofficial.com</a> website is operated by company, under license number
          GLH-OCCHKTW07080120 issued to it and regulated by Gaming Services
          Provider N.V., authorized by the Government of Curaçao under license
          number 365JAZ.
          <span
            className="block mt-2 italic"
            style={{ color: "rgba(212,175,55,0.6)", fontFamily: "serif" }}
          >
            Responsible gaming is our priority.
          </span>
        </p>
      </div>

      {/* ── SOCIAL + AGE ── */}
      <div
        className="flex items-center gap-6 mb-8 pb-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <SocialIcon url="https://c.animaapp.com/m9cwtgo4xBXHVx/img/facebook.png" />
        <SocialIcon url="https://c.animaapp.com/m9cwtgo4xBXHVx/img/telegram.png" />
        <div className="ml-auto opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          <img
            src="https://c.animaapp.com/m9cwtgo4xBXHVx/img/age-d182eefd-png.png"
            className="h-8 w-auto"
            alt="18+"
          />
        </div>
      </div>

      {/* ── PROVIDER LOGOS ── */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 opacity-40 hover:opacity-80 transition-opacity duration-700">
        {providerImages.map((img, idx) => (
          <div
            key={idx}
            className="h-10 flex items-center justify-center p-1 rounded cursor-crosshair transition-all"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <img
              src={img}
              className="max-h-full max-w-full object-contain"
              style={{ filter: "brightness(1.2) contrast(1.2)" }}
              alt="Provider"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Deposit / Withdraw Card ─────────────────────────────────── */
const ActionCard = ({
  href,
  label,
  sublabel,
  primary,
}: {
  href: string;
  label: string;
  sublabel: string;
  primary: boolean;
}) => (
  <Link href={href} className="flex-1">
    {/* gradient-border wrapper */}
    <div
      className="p-[1.5px] rounded-2xl"
      style={{
        background: primary
          ? "linear-gradient(135deg, rgba(255,215,0,0.8) 0%, rgba(255,140,0,0.4) 40%, transparent 100%)"
          : "linear-gradient(135deg, rgba(180,130,255,0.7) 0%, rgba(100,60,200,0.35) 40%, transparent 100%)",
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-[13px] rounded-[14px]"
        style={{
          background: primary
            ? "linear-gradient(135deg, #2a1800 0%, #1a1000 50%, #0e0a00 100%)"
            : "linear-gradient(135deg, #1e1040 0%, #130930 55%, #080514 100%)",
          boxShadow: primary
            ? "inset 0 1px 0 rgba(255,215,0,0.08)"
            : "inset 0 1px 0 rgba(180,130,255,0.08)",
        }}
      >
        {/* icon circle */}

        {/* text */}
        <div className="flex-1 flex flex-col items-center">
          <div
            className="text-[13px] font-black tracking-widest leading-none mb-[4px]"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: primary ? "#FFD700" : "#C0A0FF",
              textShadow: primary
                ? "0 0 10px rgba(255,215,0,0.5)"
                : "0 0 10px rgba(180,130,255,0.5)",
            }}
          >
            {label}
          </div>
          <div
            className="text-[11px] font-medium"
            style={{
              fontFamily: "'Noto Sans Bengali', sans-serif",
              color: primary
                ? "rgba(240,220,180,0.7)"
                : "rgba(200,180,240,0.7)",
            }}
          >
            {sublabel}
          </div>
        </div>
      </div>
    </div>
  </Link>
);

/* ─── Social Icon ──────────────────────────────────────────────── */
const SocialIcon = ({ url }: { url: string }) => (
  <div
    className="w-8 h-8 bg-cover bg-center cursor-pointer transition-all opacity-70 hover:opacity-100 hover:scale-110"
    style={{ backgroundImage: `url(${url})`, filter: "brightness(0.8)" }}
  />
);

/* ─── Provider images ─────────────────────────────────────────── */
const providerImages = [
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/jl-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/pg-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/spb-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/pp-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/pt-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/bng-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/ng-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/btg-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/jff-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/l22-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/jdb-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/mnp-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/fc-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/sg-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/obs-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/fp-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/ezg-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/5g-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/ae-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/bt-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/759-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/bom-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/ne-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/rt-color-png.png",
];

export default FooterPlatform;
