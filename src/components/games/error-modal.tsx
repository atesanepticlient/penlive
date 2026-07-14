"use client";

import { getHotGames } from "@/lib/games";
import { useState, useRef, useEffect } from "react";

export default function GameErrorModal({
  isOpen = true,
  onClose,
  gameName = "Celestial Wars",
}) {
  const [visible, setVisible] = useState(false);
  const rowRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    if (isOpen) setTimeout(() => setVisible(true), 20);
    else setVisible(false);
  }, [isOpen]);

  function onDragStart(e) {
    isDragging.current = true;
    startX.current = e.pageX - rowRef.current.offsetLeft;
    scrollLeft.current = rowRef.current.scrollLeft;
  }
  function onDragMove(e) {
    if (!isDragging.current) return;
    rowRef.current.scrollLeft =
      scrollLeft.current -
      (e.pageX - rowRef.current.offsetLeft - startX.current);
  }
  function onDragEnd() {
    isDragging.current = false;
  }

  if (!isOpen && !visible) return null;
  const games = getHotGames({});
  return (
    <>
      <style>{`
   
        @keyframes float-icon  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes gear-spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes gear-rev    { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes wrench-wig  { 0%,100%{transform:rotate(-12deg)} 50%{transform:rotate(12deg)} }
        @keyframes modal-in    { 0%{opacity:0;transform:scale(.93)} 100%{opacity:1;transform:scale(1)} }
        @keyframes dot-blink   { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes backdrop-in { from{opacity:0} to{opacity:1} }

        .gem-backdrop {
          animation: backdrop-in .3s ease forwards;
        }
        .gem-modal {
          animation: modal-in .5s cubic-bezier(.25,1,.5,1) forwards;
        }
        .gem-float { animation: float-icon 3.5s ease-in-out infinite; }
        .gem-gear-a { animation: gear-spin 9s linear infinite; transform-origin: 24px 24px; }
        .gem-gear-b { animation: gear-rev 6s linear infinite; transform-origin: 35px 13px; }
        .gem-wrench { animation: wrench-wig 1.4s ease-in-out infinite; transform-origin: 16px 34px; }
        .gem-dot    { animation: dot-blink 1.8s ease-in-out infinite; }

        .gem-surface {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='t'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23t)'/%3E%3C/svg%3E"),
            linear-gradient(160deg, #1a0840 0%, #120630 40%, #1e0a50 70%, #150535 100%);
          background-blend-mode: soft-light, normal;
          background-size: 512px 512px, 100% 100%;
        }
        .gem-scroll::-webkit-scrollbar { display: none; }
        .gem-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .gem-close:hover { background: rgba(200,50,50,.28) !important; border-color: rgba(255,100,100,.4) !important; }
      `}</style>

      {/* Backdrop */}
      <div
        className="gem-backdrop fixed inset-0 z-50 flex items-center justify-center p-5"
        style={{
          background:
            "radial-gradient(ellipse at 35% 25%, rgba(80,30,160,.5) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(180,120,0,.3) 0%, transparent 50%), #0a0414",
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="gem-modal relative w-full max-w-sm overflow-hidden rounded-2xl"
          style={{
            boxShadow:
              "0 40px 100px rgba(0,0,0,.75), 0 0 0 1px rgba(255,215,0,.18), 0 0 80px rgba(80,30,180,.2)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="gem-surface">
            {/* Top golden line */}
            <div
              style={{
                height: 3,
                background:
                  "linear-gradient(90deg,transparent,rgba(255,215,0,.3) 20%,rgba(255,215,0,.9) 50%,rgba(255,215,0,.3) 80%,transparent)",
              }}
            />

            <div className="relative px-7 pt-7 pb-7">
              {/* Animated gear icon */}
              <div className="flex justify-center mb-6">
                <div
                  className="gem-float flex items-center justify-center rounded-2xl"
                  style={{
                    width: 72,
                    height: 72,
                    background:
                      "linear-gradient(135deg,rgba(255,215,0,.1),rgba(120,60,255,.15))",
                    border: "1px solid rgba(255,215,0,.28)",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08)",
                  }}
                >
                  <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
                    <g className="gem-gear-a">
                      <circle
                        cx="24"
                        cy="24"
                        r="8"
                        stroke="rgba(255,215,0,.85)"
                        strokeWidth="2"
                      />
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                        <rect
                          key={deg}
                          x="22"
                          y="11"
                          width="4"
                          height="4"
                          rx="1"
                          fill="rgba(255,215,0,.85)"
                          transform={`rotate(${deg} 24 24)`}
                        />
                      ))}
                    </g>
                    <g className="gem-gear-b">
                      <circle
                        cx="35"
                        cy="13"
                        r="4.5"
                        stroke="rgba(180,140,255,.85)"
                        strokeWidth="1.5"
                      />
                      {[0, 60, 120, 180, 240, 300].map((deg) => (
                        <rect
                          key={deg}
                          x="33.2"
                          y="7"
                          width="3.6"
                          height="2.5"
                          rx=".6"
                          fill="rgba(180,140,255,.85)"
                          transform={`rotate(${deg} 35 13)`}
                        />
                      ))}
                    </g>
                    <g className="gem-wrench">
                      <path
                        d="M13 31.5 Q10.5 34 11.5 36.5 Q12.5 38.5 15.5 37 L22 30 L20 27.5 Z"
                        fill="rgba(255,215,0,.8)"
                      />
                      <circle
                        cx="12.5"
                        cy="36"
                        r="2.6"
                        stroke="rgba(255,215,0,.8)"
                        strokeWidth="1.5"
                      />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex-1 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg,transparent,rgba(255,215,0,.4))",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,215,0,.6)",
                  }}
                >
                  Maintenance
                </span>
                <div
                  className="flex-1 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg,rgba(255,215,0,.4),transparent)",
                  }}
                />
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 21,
                  fontWeight: 900,
                  textAlign: "center",
                  lineHeight: 1.25,
                  color: "#F5E6B0",
                  letterSpacing: ".01em",
                  marginBottom: 10,
                }}
              >
                We are Upgrading
                <br />
                <span style={{ color: "#C4A0FF" }}>Your Realm</span>
              </h1>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: 14,
                  color: "rgba(210,190,255,.72)",
                  textAlign: "center",
                  lineHeight: 1.65,
                  marginBottom: 0,
                }}
              >
                <strong
                  style={{ color: "rgba(255,220,100,.88)", fontWeight: 600 }}
                >
                  {gameName}
                </strong>{" "}
                is temporarily offline while our team adds new features and
                improvements. We will be back soon!
              </p>

         

              {/* Section divider */}
              <div className="flex items-center gap-3  my-4">
                <div
                  className="flex-1 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg,transparent,rgba(139,92,246,.4),transparent)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(167,139,250,.5)",
                  }}
                >
                  Play While You Wait
                </span>
                <div
                  className="flex-1 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg,transparent,rgba(139,92,246,.4),transparent)",
                  }}
                />
              </div>

              {/* Scrollable game images */}
              <div className="relative">
                <div
                  className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg,rgba(18,6,48,.95),transparent)",
                  }}
                />
                <div
                  className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg,transparent,rgba(18,6,48,.95))",
                  }}
                />
                <div
                  ref={rowRef}
                  className="gem-scroll flex gap-2.5 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing"
                  style={{ userSelect: "none" }}
                  onMouseDown={onDragStart}
                  onMouseMove={onDragMove}
                  onMouseUp={onDragEnd}
                  onMouseLeave={onDragEnd}
                >
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="flex-shrink-0 rounded-xl overflow-hidden"
                      style={{
                        width: 100,
                        border: "1px solid rgba(255,255,255,.1)",
                        boxShadow: "0 4px 16px rgba(0,0,0,.5)",
                      }}
                    >
                      <img
                        src={game.image_url}
                        alt={game.image_name}
                        className="select-none cursor-move"
                        style={{
                          objectFit: "cover",
                          display: "block",
                          filter: "brightness(.9)",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <p
                style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: 11,
                  color: "rgba(180,160,220,.4)",
                  textAlign: "center",
                  marginTop: 8,
                  letterSpacing: ".05em",
                }}
              >
                Swipe to explore ›
              </p>
            </div>

            {/* Bottom line */}
            <div
              style={{
                height: 2,
                background:
                  "linear-gradient(90deg,transparent,rgba(120,60,255,.5) 30%,rgba(255,215,0,.4) 50%,rgba(120,60,255,.5) 70%,transparent)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
