import coin from "@/../public/coin-bag.png";
import Image from "next/image";
import Link from "next/link";

const BUTTONS = [
  {
    id: "dep",
    label: "DEPOSIT",
    sub: "জমা দিন",
    border:
      "linear-gradient(160deg,#c8860a 0%,#f5c128 30%,#8a5c04 60%,#c8860a 100%)",
    bg: "linear-gradient(to right,#2a0050,#190028,#0d0615)",
    labelColor: "#f0b820",
    subColor: "rgba(220,180,90,.7)",
    labelGlow: "rgba(240,184,32,.35)",
    link: "/deposit",
  },
  {
    id: "wd",
    label: "WITHDRAW",
    sub: "উতোলন করুন",
    border:
      "linear-gradient(160deg,#a06c04 0%,#d4a020 30%,#7a5002 60%,#a87008 100%)",
    bg: "linear-gradient(to right,#2b1b00,#1a1200,#0d0902)",
    labelColor: "#d4a020",
    subColor: "rgba(200,160,70,.65)",
    labelGlow: "rgba(212,160,32,.3)",
    link: "/withdraw",
  },
];

export default function DepositWithdrawButtons() {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
      className="px-4"
    >
      {BUTTONS.map((btn) => (
        <Link
          href={btn.link}
          key={btn.id}
          style={{
            flex: 1,
            borderRadius: 15,
            padding: 1,
            background: btn.border,
            cursor: "pointer",
          }}
        >
          <div>
            <div
              style={{
                borderRadius: 15,
                background: btn.bg,
                padding: "10px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <Image src={coin} alt="Coin" className="w-[35px]" />
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                    textShadow: `0 0 10px ${btn.labelGlow}`,
                  }}
                  className="text-[#ffca3a]"
                >
                  {btn.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#fff",
                    marginTop: 3,
                    letterSpacing: 0.2,
                  }}
                >
                  {btn.sub}
                </div>
              </div>
            </div>
          </div>{" "}
        </Link>
      ))}
    </div>
  );
}
