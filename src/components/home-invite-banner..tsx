// PromoStrip.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface PromoStripProps {
  title?: string;
  subtitle?: string;
  href?: string;
  onClick?: () => void;
}

const PromoStrip = ({
  title = "রেফার করুন, টাকা জিতুন!",
  subtitle = "প্রতি রেফারে পান ৳৫০০ বোনাস",
  href = "/invite-friends",
  onClick,
}: PromoStripProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    else router.push(href);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap');

        /*
          Gradient border trick:
          Outer div = the "border" (gradient bg + 1.5px padding)
          Inner div = the actual card content (solid dark bg)
        */
        .promo-strip-outer {
          margin: 0 16px 20px;
          border-radius: 16px;
          padding: 1.5px;
          /* Bright violet/lavender top-left → transparent bottom-right */
          background: linear-gradient(
            135deg,
            rgba(190, 140, 255, 0.9) 0%,
            rgba(150, 90, 230, 0.55) 22%,
            rgba(90, 45, 160, 0.25) 50%,
            transparent 100%
          );
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
          cursor: pointer;
          transition: transform 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .promo-strip-outer:active {
          transform: scale(0.98);
        }

        .promo-strip {
          padding: 13px 14px;
          /* Vivid purple top-left bleeding to near-black bottom-right — matches screenshot */
          background: linear-gradient(
            135deg,
            #3d1a6e 0%,
            #2a1050 28%,
            #160930 60%,
            #0a0514 100%
          );
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .promo-strip-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .promo-strip-icon {
          font-size: 30px;
          filter: drop-shadow(0 2px 6px rgba(255, 140, 0, 0.4));
          flex-shrink: 0;
        }

        .promo-strip-text h4 {
          font-family: 'Noto Sans Bengali', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #FFD700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          margin-bottom: 3px;
          line-height: 1.3;
        }

        .promo-strip-text p {
          font-family: 'Noto Sans Bengali', sans-serif;
          font-size: 11px;
          color: rgba(220, 210, 240, 0.65);
          line-height: 1.3;
        }

        .promo-strip-arrow {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #FFD700, #FF8C00);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(255, 150, 0, 0.55);
          flex-shrink: 0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .promo-strip-outer:active .promo-strip-arrow {
          transform: scale(0.92);
          box-shadow: 0 0 8px rgba(255, 150, 0, 0.35);
        }

        .promo-strip-arrow svg {
          width: 17px;
          height: 17px;
          fill: none;
          stroke: #1a0800;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>

      {/* Outer = gradient border shell */}
      <div
        className="promo-strip-outer !mt-8"
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        {/* Inner = card with dark bg */}
        <div className="promo-strip">
          <div className="promo-strip-info">
            <div className="promo-strip-icon">🎁</div>
            <div className="promo-strip-text">
              <h4>{title}</h4>
              <p>{subtitle}</p>
            </div>
          </div>
          <div className="promo-strip-arrow">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoStrip;
