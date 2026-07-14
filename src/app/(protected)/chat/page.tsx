"use client";

import { useState, useEffect, useRef } from "react";
import useGetCurrentUser from "@/hook/useCurrentUser";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
}

// ─── Bot Logo ─────────────────────────────────────────────────────────────────
function BotAvatar({
  size = 36,
  pulse = false,
}: {
  size?: number;
  pulse?: boolean;
}) {
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {pulse && (
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: "rgba(220,38,38,0.3)" }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="botGrad"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient
            id="botShine"
            x1="0"
            y1="0"
            x2="40"
            y2="20"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Base circle */}
        <circle cx="20" cy="20" r="20" fill="url(#botGrad)" />
        <circle cx="20" cy="20" r="20" fill="url(#botShine)" />
        {/* Suit symbol: spade */}
        <path
          d="M20 8 C20 8 12 15 12 20 C12 23.3 14.7 24 16.5 23 C15.8 25 14.5 26.5 13 28 L27 28 C25.5 26.5 24.2 25 23.5 23 C25.3 24 28 23.3 28 20 C28 15 20 8 20 8Z"
          fill="white"
          fillOpacity="0.95"
        />
        {/* Robot eyes on spade */}
        <circle cx="17" cy="19" r="1.4" fill="#dc2626" />
        <circle cx="23" cy="19" r="1.4" fill="#dc2626" />
        {/* Antenna */}
        <line
          x1="20"
          y1="8"
          x2="20"
          y2="4"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="20" cy="3.5" r="1.5" fill="white" fillOpacity="0.8" />
      </svg>
    </div>
  );
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-end gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-red-400"
          style={{
            animation: "typingBounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Bubble({ msg }: { msg: Message; isLatest: boolean }) {
  const isBot = msg.role === "bot";

  return (
    <div
      className={`flex items-end gap-2 ${isBot ? "justify-start" : "justify-end"}`}
      style={{
        animation: "bubbleIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      {isBot && <BotAvatar size={30} />}

      <div
        className={`flex flex-col gap-0.5 max-w-[78%] ${isBot ? "items-start" : "items-end"}`}
      >
        <div
          className="px-4 py-2.5 leading-relaxed text-sm"
          style={{
            borderRadius: isBot ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
            background: isBot
              ? "white"
              : "linear-gradient(135deg,#dc2626,#991b1b)",
            color: isBot ? "#1e293b" : "white",
            boxShadow: isBot
              ? "0 2px 12px rgba(0,0,0,0.08)"
              : "0 4px 16px rgba(220,38,38,0.35)",
            fontFamily: "'Hind Siliguri', sans-serif",
            wordBreak: "break-word",
          }}
        >
          {msg.text}
        </div>
        <span className="text-[9px] text-slate-400 px-1 font-medium tracking-wide">
          {msg.time}
        </span>
      </div>

      {!isBot && (
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-black"
          style={{ background: "linear-gradient(135deg,#64748b,#334155)" }}
        >
          U
        </div>
      )}
    </div>
  );
}

// ─── Quick suggestion chips ───────────────────────────────────────────────────
const QUICK = [
  "আমার ব্যালেন্স কত?",
  "Deposit কিভাবে করবো?",
  "Withdraw কিভাবে করবো?",
  "Bonus পাবো কিভাবে?",
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const user: any = useGetCurrentUser();
  const userId = user?.id ?? "guest";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "আসসালামু আলাইকুম! 🎰 আমি আপনার সহায়তার জন্য এখানে আছি। কিভাবে সাহায্য করতে পারি?",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function now() {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", text: msg, time: now() },
    ]);
    setInput("");
    setSending(true);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: msg }),
      });
      const data = await res.json();
      console.log({ data });
      const reply = data.reply;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          text: reply ?? "কোনো উত্তর পাওয়া যায়নি।",
          time: now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          text: "দুঃখিত, কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          time: now(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

        @keyframes bubbleIn {
          from { opacity: 0; transform: scale(0.85) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes typingBounce {
          0%,60%,100% { transform: translateY(0);    opacity: 0.4; }
          30%          { transform: translateY(-6px); opacity: 1;   }
        }
        @keyframes headerShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { scrollbar-width: none; }

        textarea:focus { outline: none; }
      `}</style>

      <div
        className="flex flex-col h-screen"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        {/* ── Header ── */}
        <div
          className="flex-shrink-0 px-4 py-3 flex items-center gap-3 shadow-lg relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,#dc2626 0%,#991b1b 60%,#7f1d1d 100%)",
          }}
        >
          {/* Decorative suit watermark */}
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl pointer-events-none select-none"
            style={{ opacity: 0.07, color: "white" }}
          >
            ♠
          </span>

          <BotAvatar size={40} pulse={isTyping} />

          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-base leading-tight tracking-wide">
              Lucky Bot
            </p>
            <p className="text-red-200 text-[11px] font-medium">
              {isTyping ? (
                <span className="flex items-center gap-1">
                  <span className="inline-flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1 h-1 bg-red-300 rounded-full"
                        style={{
                          animation: `typingBounce 1.2s ease-in-out infinite`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </span>
                  টাইপ করছে...
                </span>
              ) : (
                "সবসময় সক্রিয়"
              )}
            </p>
          </div>

          {/* Casino chips decoration */}
          <div className="flex gap-1 opacity-70">
            {["♠", "♥", "♦", "♣"].map((s, i) => (
              <span key={i} className="text-white text-sm">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* ── Divider with pattern ── */}
        <div
          className="h-1 flex-shrink-0"
          style={{
            background:
              "repeating-linear-gradient(90deg,#dc2626 0px,#dc2626 4px,#991b1b 4px,#991b1b 8px)",
          }}
        />

        {/* ── Message list ── */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 hide-scroll"
          style={{
            background: "linear-gradient(180deg,#f9fafb 0%,#f3f4f6 100%)",
          }}
        >
          {/* Subtle casino watermark */}
          <div
            className="fixed inset-0 pointer-events-none select-none flex items-center justify-center"
            style={{ zIndex: 0, opacity: 0.025 }}
          >
            <span style={{ fontSize: 220, color: "#dc2626" }}>♠</span>
          </div>

          <div className="relative z-10 space-y-3">
            {messages.map((msg, i) => (
              <Bubble
                key={msg.id}
                msg={msg}
                isLatest={i === messages.length - 1}
              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div
                className="flex items-end gap-2"
                style={{ animation: "bubbleIn 0.2s ease both" }}
              >
                <BotAvatar size={30} />
                <div
                  className="bg-white rounded-tl shadow-sm"
                  style={{
                    borderRadius: "4px 18px 18px 18px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── Quick suggestions ── */}
        <div
          className="flex-shrink-0 px-3 py-2 flex gap-2 overflow-x-auto hide-scroll border-t border-slate-100"
          style={{ background: "white" }}
        >
          {QUICK.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={sending}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 disabled:opacity-40"
              style={{
                borderColor: "#fca5a5",
                color: "#dc2626",
                background: "#fff1f2",
                fontFamily: "'Hind Siliguri', sans-serif",
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* ── Input bar ── */}
        <div
          className="flex-shrink-0 px-3 py-3 flex items-end gap-2 border-t border-slate-100"
          style={{ background: "white" }}
        >
          <div
            className="flex-1 flex items-end rounded-2xl border-2 overflow-hidden transition-all"
            style={{
              borderColor: input ? "#dc2626" : "#e2e8f0",
              background: "#f8fafc",
              boxShadow: input ? "0 0 0 3px rgba(220,38,38,0.08)" : "none",
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto grow
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 100) + "px";
              }}
              onKeyDown={handleKey}
              disabled={sending}
              placeholder="এখানে লিখুন..."
              className="flex-1 px-3.5 py-2.5 bg-transparent resize-none text-sm text-slate-800 placeholder:text-slate-300 leading-relaxed"
              style={{
                fontFamily: "'Hind Siliguri', sans-serif",
                maxHeight: 100,
                overflowY: "auto",
              }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-150 active:scale-90 disabled:opacity-40"
            style={{
              background:
                input.trim() && !sending
                  ? "linear-gradient(135deg,#dc2626,#991b1b)"
                  : "#e2e8f0",
              boxShadow:
                input.trim() && !sending
                  ? "0 4px 16px rgba(220,38,38,0.4)"
                  : "none",
            }}
          >
            {sending ? (
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="3"
                  strokeOpacity="0.3"
                />
                <path
                  d="M12 2a10 10 0 0110 10"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13"
                  stroke={input.trim() ? "white" : "#94a3b8"}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke={input.trim() ? "white" : "#94a3b8"}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
