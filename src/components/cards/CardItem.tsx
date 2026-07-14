"use client";

import { format } from "date-fns";
import { CARD_THEMES } from "./CardThemes";

interface CardItemProps {
  card: any;
}

function formatCardNumber(num: string) {
  // Show last 4 digits, mask rest
  const cleaned = num.replace(/\s/g, "");
  if (cleaned.length <= 4) return cleaned;
  const masked = "•••• •••• •••• " + cleaned.slice(-4);
  return masked;
}

export default function CardItem({ card }: CardItemProps) {
  const theme = CARD_THEMES[card.cardName];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 shadow-xl ${theme.bg}`}
      style={{ minHeight: 200, color: theme.textPrimary }}
    >
      {/* SVG Background Graphic */}
      <div
        dangerouslySetInnerHTML={{ __html: theme.graphic }}
        className="pointer-events-none select-none"
      />

      {/* Card Content */}
      <div className="relative z-10 flex flex-col h-full gap-4">
        {/* Top Row: Logo + Active Badge */}
        <div className="flex items-center justify-between">
          {theme.logo}
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
          >
            Active
          </span>
        </div>

        {/* Card Number */}
        <div className="mt-4">
          <p
            className="text-xs font-medium tracking-widest uppercase mb-1"
            style={{ color: theme.textSecondary }}
          >
            Card Number
          </p>
          <p className="text-xl font-bold tracking-widest font-mono">
            {formatCardNumber(card.cardNumber)}
          </p>
        </div>

        {/* Bottom Row: Name + Date */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p
              className="text-xs uppercase tracking-wider mb-0.5"
              style={{ color: theme.textSecondary }}
            >
              Cardholder
            </p>
            <p className="font-semibold text-sm">{card.payerName}</p>
          </div>
          <div className="text-right">
            <p
              className="text-xs uppercase tracking-wider mb-0.5"
              style={{ color: theme.textSecondary }}
            >
              Member Since
            </p>
            <p className="font-semibold text-sm">
              {format(new Date(card.createdAt), "MMM yyyy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
