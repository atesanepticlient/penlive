"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import logo_sq from "@/../public/logo-sq.jpg";

const Footer = () => {
  // Luxury Color Palette
  // const goldGradient =
  //   "linear-gradient(180deg, #F9E498 0%, #D4AF37 50%, #8A6E2F 100%)";
  // const darkPanel = "linear-gradient(180deg, #1A1A1A 0%, #050505 100%)";

  return (
    <div className="w-full bg-[#080808] pt-10 pb-[120px] px-4 border-t border-white/5">
      <div className="relative w-full md:w-[70%] mx-auto">
        {/* Buttons Row - Metallic Beveled Look */}
        <div className="flex gap-4 mb-10">
          <FooterButton href="#" label="PARTNER" primary={true} />
          <FooterButton href="/chat" label="LIVE CHAT" primary={false} />
        </div>

        {/* Section Title with Gold Accent */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-[20px] w-[3px] bg-[#D4AF37]" />
          <h3 className="text-[#F9E498] text-sm font-bold uppercase tracking-[0.2em] font-serif">
            Game Center
          </h3>
        </div>

        {/* Game Categories - Minimalist Gold Borders */}
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
              className="px-4 py-2 rounded-lg border border-[#D4AF37]/20 bg-white/5 hover:border-[#D4AF37]/60 transition-colors cursor-pointer"
            >
              <span className="text-white/70 text-[13px] font-medium tracking-wide">
                {category}
              </span>
            </div>
          ))}
        </div>

        {/* Logo and Legal Description */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 items-start md:items-center bg-white/[0.02] p-6 rounded-2xl border border-white/5">
          <Image
            src={logo_sq}
            alt="Mbuzz88"
            className="w-[80px] h-[80px] rounded-xl object-cover shadow-[0_0_15px_rgba(212,175,55,0.2)] border border-[#D4AF37]/30"
          />
          <p className="text-white/50 text-[11px] leading-relaxed max-w-2xl font-light">
            penliveofficial.com website is operated by company, under license number
            GLH-OCCHKTW07080120 issued to it and regulated by Gaming Services
            Provider N.V., authorized by the Government of Curaçao under license
            number 365JAZ.
            <span className="block mt-2 text-[#D4AF37]/60 italic font-serif">
              Responsible gaming is our priority.
            </span>
          </p>
        </div>

        {/* Social Icons & Age Limit */}
        <div className="flex items-center gap-6 mb-10 pb-6 border-b border-white/5">
          <SocialIcon url="https://c.animaapp.com/m9cwtgo4xBXHVx/img/facebook.png" />
          <SocialIcon url="https://c.animaapp.com/m9cwtgo4xBXHVx/img/telegram.png" />
          <div className="ml-auto flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-60">
            <img
              src="https://c.animaapp.com/m9cwtgo4xBXHVx/img/age-d182eefd-png.png"
              className="h-8 w-auto"
              alt="18+"
            />
          </div>
        </div>

        {/* Game Provider Logos - Glass Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 opacity-40 hover:opacity-80 transition-opacity duration-700">
          {providerImages.map((img, idx) => (
            <div
              key={idx}
              className="h-10 flex items-center justify-center p-1 rounded bg-white/5 hover:bg-white/10 transition-all cursor-crosshair"
            >
              <img
                src={img}
                className="max-h-full max-w-full object-contain filter brightness-125 contrast-125"
                alt="Provider"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-component for Luxury Buttons
const FooterButton = ({ href, label, primary }) => (
  <Link href={href} className="flex-1 max-w-[180px]">
    <button
      className="w-full h-[52px] rounded-xl font-bold uppercase tracking-widest text-[14px] transition-all duration-300 active:scale-95 shadow-lg"
      style={{
        background: primary
          ? "linear-gradient(180deg, #F9E498 0%, #D4AF37 100%)"
          : "linear-gradient(180deg, #333 0%, #111 100%)",
        color: primary ? "#000" : "#D4AF37",
        border: primary ? "none" : "1px solid #D4AF3766",
        boxShadow: primary ? "0 4px 15px rgba(212, 175, 55, 0.3)" : "none",
      }}
    >
      {label}
    </button>
  </Link>
);

const SocialIcon = ({ url }) => (
  <div
    className="w-8 h-8 bg-cover bg-center cursor-pointer hover:scale-110 transition-transform filter brightness-75 hover:brightness-100"
    style={{ backgroundImage: `url(${url})` }}
  />
);

const providerImages = [
  // Row 1
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/jl-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/pg-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/spb-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/pp-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/pt-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/bng-color-png.png",

  // Row 2
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/ng-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/btg-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/jff-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/l22-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/jdb-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/mnp-color-png.png",

  // Row 3
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/fc-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/sg-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/obs-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/fp-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/ezg-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/5g-color-png.png",

  // Row 4
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/ae-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/bt-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/759-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/bom-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/ne-color-png.png",
  "https://c.animaapp.com/m9cwtgo4xBXHVx/img/rt-color-png.png",
];
export default Footer;
