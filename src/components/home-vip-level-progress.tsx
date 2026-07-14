// VipBanner.tsx
"use client";

import React from "react";

interface VipBannerProps {
  currentAmount?: number; // how much more to play
  targetAmount?: number; // total needed for next level
  level?: number;
  progressPercent?: number; // 0-100
}

const VipBanner = ({
  currentAmount = 3550,
  level = 4,
  progressPercent = 65,
}: VipBannerProps) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Noto+Sans+Bengali:wght@400;600;700&display=swap');

        .vip-banner {
          margin: 0 16px 20px;
          padding: 14px 16px;
          background: linear-gradient(135deg, #1a0900, #2d1500, #1a0900);
          border: 1px solid rgba(255,215,0,0.4);
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow:
            0 4px 20px rgba(0,0,0,0.4),
            0 0 30px rgba(255,140,0,0.08);
          position: relative;
          overflow: hidden;
        }

        /* Shimmer sweep */
        .vip-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,215,0,0.08), transparent);
          animation: vipShimmer 2.5s linear infinite;
          pointer-events: none;
        }
        @keyframes vipShimmer {
          0%   { left: -100%; }
          100% { left: 200%; }
        }

        .vip-crown {
          font-size: 36px;
          filter: drop-shadow(0 0 10px rgba(255,215,0,0.6));
          flex-shrink: 0;
          z-index: 1;
        }

        .vip-info {
          flex: 1;
          z-index: 1;
        }

        .vip-info h4 {
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          font-weight: 900;
          color: #FFD700;
          text-shadow: 0 0 12px rgba(255,215,0,0.6);
          letter-spacing: 2px;
          margin-bottom: 3px;
        }

        .vip-info p {
          font-family: 'Noto Sans Bengali', sans-serif;
          font-size: 11px;
          color: rgba(240,220,180,0.8);
          margin-bottom: 6px;
        }

        .vip-progress-bg {
          height: 5px;
          background: rgba(255,215,0,0.15);
          border-radius: 3px;
          overflow: hidden;
        }

        .vip-progress-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, #FFD700, #FF8C00);
          box-shadow: 0 0 8px rgba(255,150,0,0.6);
          transition: width 0.6s ease;
        }

        .vip-level-badge {
          background: linear-gradient(135deg, #FFD700, #FF8C00);
          color: #1a0800;
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          font-weight: 900;
          padding: 6px 12px;
          border-radius: 20px;
          box-shadow: 0 0 12px rgba(255,150,0,0.5);
          flex-shrink: 0;
          letter-spacing: 1px;
          z-index: 1;
          white-space: nowrap;
        }
      `}</style>

      <div className="vip-banner">
        <div className="vip-crown">👑</div>
        <div className="vip-info">
          <h4>VIP GOLD</h4>
          <p>
            আরও ৳{currentAmount.toLocaleString("bn-BD")} খেলুন, পরবর্তী লেভেলে
            যান
          </p>
          <div className="vip-progress-bg">
            <div
              className="vip-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="vip-level-badge">LV.{level}</div>
      </div>
    </>
  );
};

export default VipBanner;
