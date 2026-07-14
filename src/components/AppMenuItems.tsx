"use client";
import React from "react";
import { Trophy, Clock, Gamepad } from "lucide-react";

import slotPIcon from "@/../public/games-cat/platform/slot.png";
import pockerPIcon from "@/../public/games-cat/platform/pocker.png";
import livePIcon from "@/../public/games-cat/platform/live.png";
import fishPIcon from "@/../public/games-cat/platform/fish.png";
import sportsPIcon from "@/../public/games-cat/platform/sports.png";
import Image from "next/image";
import GameCard from "./game-card";

const GameSelectionMenu = () => {
  const gameCategories = [
    {
      id: 1,
      name: "Slot",
      icon: <Trophy />,
      href: "/slot",
      pIcon: slotPIcon,
    },
    {
      id: 3,
      name: "Pocker",
      icon: <Clock />,
      href: "/pocker",
      pIcon: pockerPIcon,
    }, // Shortened text for cleaner UI
    {
      id: 4,
      name: "Fish",
      icon: <Gamepad />,
      href: "/fish",
      pIcon: fishPIcon,
    },
    {
      id: 5,
      name: "Live",
      icon: <Gamepad />,
      href: "/live",
      pIcon: livePIcon,
    },
    {
      id: 5,
      name: "Sports",
      icon: <Gamepad />,
      href: "/sports",
      pIcon: sportsPIcon,
    },
  ];
  return (
    <nav className="w-full ">
      {/* <GoldenThemeMenu categories={gameCategories} /> */}
      <PlatFormThemeMenu categories={gameCategories} />
    </nav>
  );
};

export default GameSelectionMenu;

// const GoldGradientSVG = () => {
//   return (
//     <svg width="0" height="0" className="absolute">
//       <defs>
//         {/* We give this gradient a unique ID to reference it */}
//         <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
//           <stop offset="0%" stopColor="#F9E498" /> {/* Light Gold */}
//           <stop offset="50%" stopColor="#D4AF37" /> {/* Medium Gold */}
//           <stop offset="100%" stopColor="#8A6E2F" /> {/* Deep Gold */}
//         </linearGradient>
//       </defs>
//     </svg>
//   );
// };

// const GoldenThemeMenu = ({ categories }) => {
//   return (
//     <>
//       <GoldGradientSVG />

//       <div className=" px-2 h-20">
//         {/* The Navigation Container (Center Aligned) */}
//         <div className="flex gap-1 flex-nowrap scrollbar-none overflow-x-auto">
//           {categories.map((game) => {
//             return (
//               <Link
//                 key={game.id}
//                 href={game.href}
//                 className="relative flex items-center gap-2.5 px-6 py-3 rounded-full group cursor-pointer transition-all duration-300"
//               >
//                 {/* 2. The Dynamic Icon (SVG Gradient Applied Here) */}
//                 <div
//                   className={`relative z-10 transition-colors duration-300 ${"opacity-100"}`}
//                 >
//                   {React.cloneElement(game.icon, {
//                     className: "w-6 h-6",
//                     strokeWidth: 1.5,
//                     // IF active, reference the gradient. IF not, use a simple text color.
//                     style: { stroke: "url(#gold-gradient)" },
//                   })}
//                 </div>

//                 {/* 3. The Dynamic Text */}
//                 <span
//                   className={`relative z-10 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
//                     "text-[#F9E498]" // Text matches the top stop of the gradient
//                   }`}
//                 >
//                   {game.name}
//                 </span>

//                 {/* 4. Active "Pill" Background (Framer Motion) */}

//                 <div
//                   className="absolute inset-0 rounded-full z-0"
//                   style={{
//                     background:
//                       "linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%)",
//                     border: "1px solid rgba(212, 175, 55, 0.2)",
//                     boxShadow: "0 4px 15px rgba(0, 0, 0, 0.6)",
//                   }}
//                 ></div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// };

const PlatFormThemeMenu = ({ categories }) => {
  return (
    <div className="flex flex-nowrap gap-3 overflow-x-auto px-3 scrollbar-none">
      {categories.map((cat, i) => (
        // <Link
        //   href={cat.href}
        //   key={i}
        //   className={`casino-card ${cat.name == "Slot" ? "purple" : cat.name == "Live" ? "green" : cat.name == "Fish" ? "blue" : "red"} w-[150px] h-[120px] flex justify-center items-center relative`}
        // >
        //   <Image src={cat.pIcon} alt={cat.name} className="w-[55px] mx-auto" />
        //   <span className="text-sm absolute left-1/2 -translate-x-1/2 bottom-2">
        //     {cat.name}
        //   </span>
        // </Link>

        <GameCard
          key={i}
          emoji={
            <Image
              src={cat.pIcon}
              alt={cat.name}
              className="w-[50px] mx-auto"
            />
          }
          text={cat.name}
          color={
            cat.name == "Slot"
              ? "purple"
              : cat.name == "Fish"
                ? "ocean"
                : cat.name == "Live"
                  ? "emerald"
                  : cat.name == "Pocker"
                    ? "crimson"
                    : cat.name == "Sports"
                      ? "amber"
                      : "blaze"
          }
          onClick={() => console.log("clicked")}
        />
      ))}
    </div>
  );
};
