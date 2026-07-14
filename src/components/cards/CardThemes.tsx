export const CARD_THEMES = {
  BKASH: {
    gradient: "from-[#E2136E] via-[#C4065A] to-[#8A0040]",
    bg: "bg-gradient-to-br from-[#E2136E] via-[#C4065A] to-[#8A0040]",
    accent: "#FF6EB4",
    textPrimary: "#fff",
    textSecondary: "rgba(255,255,255,0.7)",
    logo: (
      <svg
        viewBox="0 0 80 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7"
      >
        <circle cx="14" cy="14" r="14" fill="white" fillOpacity="0.2" />
        <text
          x="14"
          y="19"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="800"
          fontFamily="sans-serif"
        >
          bK
        </text>
        <text
          x="36"
          y="20"
          fill="white"
          fontSize="14"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          bKash
        </text>
      </svg>
    ),
    graphic: `
      <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.18">
        <circle cx="340" cy="-30" r="130" fill="white"/>
        <circle cx="380" cy="180" r="80" fill="white"/>
        <circle cx="60" cy="200" r="100" fill="white" opacity="0.5"/>
        <ellipse cx="200" cy="110" rx="180" ry="60" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"/>
        <ellipse cx="200" cy="110" rx="140" ry="40" fill="none" stroke="white" strokeWidth="1" opacity="0.3"/>
      </svg>
    `,
  },
  NAGAD: {
    gradient: "from-[#F7941D] via-[#E07B00] to-[#8B4500]",
    bg: "bg-gradient-to-br from-[#F7941D] via-[#E07B00] to-[#8B4500]",
    accent: "#FFD080",
    textPrimary: "#fff",
    textSecondary: "rgba(255,255,255,0.7)",
    logo: (
      <svg
        viewBox="0 0 90 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7"
      >
        <circle cx="14" cy="14" r="14" fill="white" fillOpacity="0.2" />
        <text
          x="14"
          y="19"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="800"
          fontFamily="sans-serif"
        >
          N
        </text>
        <text
          x="36"
          y="20"
          fill="white"
          fontSize="14"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          Nagad
        </text>
      </svg>
    ),
    graphic: `
      <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.18">
        <polygon points="350,0 400,80 300,80" fill="white"/>
        <polygon points="370,180 420,260 320,260" fill="white"/>
        <rect x="30" y="30" width="120" height="120" rx="20" fill="none" stroke="white" strokeWidth="2" opacity="0.5" transform="rotate(20 90 90)"/>
        <rect x="50" y="50" width="80" height="80" rx="15" fill="none" stroke="white" strokeWidth="1.2" opacity="0.3" transform="rotate(20 90 90)"/>
        <circle cx="340" cy="50" r="60" fill="white" opacity="0.5"/>
      </svg>
    `,
  },
} as const;

export type CardName = keyof typeof CARD_THEMES;
