"use client";

import { useState, CSSProperties } from "react";

type CardTheme = {
  background: string;
  border: string;
  boxShadow: string;
  texture: CSSProperties;
  accent: CSSProperties;
};

const CARD_STYLES: Record<string, CardTheme> = {
  purple: {
    background: "linear-gradient(145deg, #1a003a, #4d00aa, #8800ff)",
    border: "1px solid rgba(155,48,255,0.6)",
    boxShadow:
      "0 0 0 1px rgba(200,150,255,0.1) inset, 0 6px 20px rgba(136,0,255,0.45), 0 2px 6px rgba(0,0,0,0.6)",
    texture: {
      background:
        "repeating-linear-gradient(-55deg, transparent, transparent 8px, rgba(180,120,255,0.06) 8px, rgba(180,120,255,0.06) 9px)",
    },
    accent: {
      top: 0,
      left: 0,
      right: 0,
      height: "2px",
      background:
        "linear-gradient(90deg, transparent, rgba(200,150,255,0.9), transparent)",
      borderRadius: "14px 14px 0 0",
    },
  },
  emerald: {
    background: "linear-gradient(145deg, #003300, #006600, #00cc44)",
    border: "1px solid rgba(0,200,68,0.5)",
    boxShadow:
      "0 0 0 1px rgba(0,255,136,0.08) inset, 0 6px 20px rgba(0,180,60,0.45), 0 2px 6px rgba(0,0,0,0.6)",
    texture: {
      backgroundImage:
        "radial-gradient(circle, rgba(0,255,100,0.1) 1px, transparent 1px)",
      backgroundSize: "10px 10px",
    },
    accent: {
      top: 0,
      left: 0,
      right: 0,
      height: "2px",
      background:
        "linear-gradient(90deg, transparent, rgba(0,255,100,0.8), transparent)",
      borderRadius: "14px 14px 0 0",
    },
  },
  crimson: {
    background: "linear-gradient(145deg, #330000, #990000, #cc0033)",
    border: "1px solid rgba(255,0,60,0.55)",
    boxShadow:
      "0 0 0 1px rgba(255,80,80,0.1) inset, 0 6px 20px rgba(200,0,40,0.5), 0 2px 6px rgba(0,0,0,0.6)",
    texture: {
      backgroundImage: `
        repeating-linear-gradient(0deg,   rgba(255,60,60,0.07) 0px, rgba(255,60,60,0.07) 1px, transparent 1px, transparent 10px),
        repeating-linear-gradient(90deg,  rgba(255,60,60,0.07) 0px, rgba(255,60,60,0.07) 1px, transparent 1px, transparent 10px)
      `,
    },
    accent: {
      bottom: 0,
      left: 0,
      right: 0,
      height: "3px",
      background:
        "linear-gradient(90deg, transparent, rgba(255,60,60,0.9), transparent)",
      borderRadius: "0 0 14px 14px",
    },
  },
  ocean: {
    background: "linear-gradient(145deg, #001a33, #004499, #0066cc)",
    border: "1px solid rgba(0,120,255,0.5)",
    boxShadow:
      "0 0 0 1px rgba(100,180,255,0.08) inset, 0 6px 20px rgba(0,80,200,0.5), 0 2px 6px rgba(0,0,0,0.6)",
    texture: {
      background:
        "repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(100,180,255,0.06) 12px, rgba(100,180,255,0.06) 13px)",
    },
    accent: {
      top: 0,
      left: 0,
      bottom: 0,
      width: "2px",
      background:
        "linear-gradient(180deg, transparent, rgba(100,200,255,0.8), transparent)",
      borderRadius: "14px 0 0 14px",
    },
  },
  amber: {
    background: "linear-gradient(145deg, #331a00, #996600, #cc9900)",
    border: "1px solid rgba(255,200,0,0.55)",
    boxShadow:
      "0 0 0 1px rgba(255,230,80,0.12) inset, 0 6px 20px rgba(200,140,0,0.5), 0 2px 6px rgba(0,0,0,0.6)",
    texture: {
      backgroundImage:
        "radial-gradient(circle at 50% 50%, rgba(255,220,0,0.12) 0%, transparent 60%)",
    },
    accent: {
      top: 0,
      left: 0,
      right: 0,
      height: "2px",
      background:
        "linear-gradient(90deg, transparent, rgba(255,230,80,1), rgba(255,180,0,1), transparent)",
      borderRadius: "14px 14px 0 0",
    },
  },
  violet: {
    background: "linear-gradient(145deg, #2d0060, #660099, #9900cc)",
    border: "1px solid rgba(180,0,220,0.55)",
    boxShadow:
      "0 0 0 1px rgba(220,100,255,0.1) inset, 0 6px 20px rgba(140,0,200,0.5), 0 2px 6px rgba(0,0,0,0.6)",
    texture: {
      backgroundImage: `
        radial-gradient(ellipse at 80% 50%, rgba(200,50,255,0.15) 0%, transparent 55%),
        radial-gradient(ellipse at 20% 50%, rgba(100,0,180,0.2) 0%, transparent 40%)
      `,
    },
    accent: {
      top: 0,
      right: 0,
      bottom: 0,
      width: "2px",
      background:
        "linear-gradient(180deg, transparent, rgba(220,100,255,0.9), transparent)",
      borderRadius: "0 14px 14px 0",
    },
  },
  sapphire: {
    background: "linear-gradient(145deg, #001433, #003399, #0055cc)",
    border: "1px solid rgba(0,100,255,0.5)",
    boxShadow:
      "0 0 0 1px rgba(80,160,255,0.08) inset, 0 6px 20px rgba(0,60,200,0.5), 0 2px 6px rgba(0,0,0,0.6)",
    texture: {
      background:
        "repeating-linear-gradient(55deg, transparent, transparent 8px, rgba(80,160,255,0.05) 8px, rgba(80,160,255,0.05) 9px)",
    },
    accent: {
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "40%",
      height: "2px",
      background:
        "linear-gradient(90deg, transparent, rgba(100,180,255,0.9), transparent)",
      borderRadius: "0 0 14px 14px",
    },
  },
  blaze: {
    background: "linear-gradient(145deg, #331400, #993d00, #cc5500)",
    border: "1px solid rgba(255,100,0,0.5)",
    boxShadow:
      "0 0 0 1px rgba(255,150,50,0.1) inset, 0 6px 20px rgba(200,80,0,0.5), 0 2px 6px rgba(0,0,0,0.6)",
    texture: {
      background:
        "repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,120,0,0.06) 5px, rgba(255,120,0,0.06) 6px)",
    },
    accent: {
      top: 0,
      left: 0,
      right: 0,
      height: "2px",
      background:
        "linear-gradient(90deg, rgba(255,150,50,0.9), transparent, rgba(255,150,50,0.9))",
      borderRadius: "14px 14px 0 0",
    },
  },
  olive: {
    background: "linear-gradient(145deg, #1a1a00, #666600, #999900)",
    border: "1px solid rgba(180,180,0,0.5)",
    boxShadow:
      "0 0 0 1px rgba(220,220,80,0.08) inset, 0 6px 20px rgba(140,140,0,0.45), 0 2px 6px rgba(0,0,0,0.6)",
    texture: {
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(180,180,0,0.07) 0px, rgba(180,180,0,0.07) 1px, transparent 1px, transparent 14px)",
    },
    accent: {
      top: 0,
      left: 0,
      bottom: 0,
      width: "3px",
      background:
        "linear-gradient(180deg, rgba(220,220,80,0.8), rgba(140,140,0,0.5), rgba(220,220,80,0.8))",
      borderRadius: "14px 0 0 14px",
    },
  },
  teal: {
    background: "linear-gradient(145deg, #001a1a, #005566, #008899)",
    border: "1px solid rgba(0,180,180,0.5)",
    boxShadow:
      "0 0 0 1px rgba(0,220,220,0.08) inset, 0 6px 20px rgba(0,130,150,0.5), 0 2px 6px rgba(0,0,0,0.6)",
    texture: {
      backgroundImage: `
        radial-gradient(ellipse at 0% 0%, rgba(0,220,220,0.18) 0%, transparent 50%),
        radial-gradient(ellipse at 100% 100%, rgba(0,180,180,0.15) 0%, transparent 50%)
      `,
    },
    accent: {
      top: 0,
      left: 0,
      right: 0,
      height: "2px",
      background:
        "linear-gradient(90deg, rgba(0,220,220,0.9), transparent, rgba(0,220,220,0.5))",
      borderRadius: "14px 14px 0 0",
    },
  },
};

const base = {
  card: {
    borderRadius: "14px",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    flexShrink: 0,
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
  },
  layer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  body: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: "32px",
    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.82) 100%)",
    zIndex: 3,
    display: "flex",
    alignItems: "flex-end",
    padding: "5px 7px",
  },
  name: {
    fontSize: "9px",
    fontWeight: 600,
    color: "white",
    lineHeight: 1.2,
    textShadow: "0 1px 3px rgba(0,0,0,0.9)",
    fontFamily: "'Noto Sans Bengali', sans-serif",
  },
} as const satisfies Record<string, CSSProperties>;

interface GameCardProps {
  emoji: any;
  text: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

export default function GameCard({
  emoji,
  text,
  color = "purple",
  onClick,
  className = "w-[90px] h-[97px]",
}: GameCardProps) {
  const theme = CARD_STYLES[color] ?? CARD_STYLES.purple;
  const [, setHovered] = useState(false);

  return (
    <div
      style={{
        ...base.card,
        background: theme.background,
        border: theme.border,
        boxShadow: theme.boxShadow,
      }}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* texture layer */}
      <div style={{ ...base.layer, zIndex: 0, ...theme.texture }} />

      {/* accent line */}
      <div
        style={{
          position: "absolute",
          pointerEvents: "none",
          zIndex: 1,
          ...theme.accent,
        }}
      />

      {/* emoji */}
      <div style={base.body}>
        <span style={base.emoji}>{emoji}</span>
      </div>

      {/* name overlay */}
      <div style={base.overlay}>
        <span style={base.name}>{text}</span>
      </div>
    </div>
  );
}