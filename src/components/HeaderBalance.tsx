"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useMemo, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logout } from "@/action/logout";
import { getCurrencySymbol } from "@/lib/utils";
import Link from "next/link";
import useCurrentUser from "@/hook/useCurrentUser";
import { useFetchVipLevelQuery } from "@/lib/features/vipApiSlice";
import { useNotificationBadge } from "@/lib/store.zustond";

type Props = {
  balance: number;
  currency: string;
  variant?: "PLATFORM" | "NORMAL";
};

const HeaderBalance = ({ balance, currency, variant = "PLATFORM" }: Props) => {
  return (
    <section className="flex items-center h-full">
      <div className="flex items-center gap-3 h-full">
        <UserAvatar variant={variant} />

        {/* BALANCE BOX */}
        {variant === "PLATFORM" ? (
          <div className="flex items-center gap-[6px] px-3 py-1 rounded-[18px] border border-[rgba(255,215,0,0.28)] bg-[linear-gradient(135deg,#1a1030,#0e0b1c)] shadow-[0_0_10px_rgba(255,215,0,0.1)] backdrop-blur-md">
            {/* CURRENCY */}
            <div className="w-[19px] h-[19px] text-white rounded-full flex items-center justify-center text-[10px] bg-[linear-gradient(135deg,#ffd700,#ff8c00)] shadow-[0_0_9px_rgba(255,150,0,0.55)]">
              {getCurrencySymbol(currency)}
            </div>

            {/* TEXT */}
            <div>
              <div className="text-[8px] text-[rgba(255,215,0,0.6)] tracking-[0.8px] font-medium">
                BALANCE
              </div>

              <div
                className="text-[14px] font-black  "
                style={{
                  background: "linear-gradient(90deg,#fbbf24,#f59e0b,#fcd34d)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {balance.toLocaleString()}
              </div>
            </div>

            <RefreshButton variant="PLATFORM" />
          </div>
        ) : (
          <div className="flex items-center px-4 rounded-full border border-[#D4AF37]/30 bg-black/60 h-[36px] backdrop-blur-md shadow-[0_0_10px_rgba(212,175,55,0.1)]">
            <span className="mr-1 text-sm font-bold text-[#D4AF37]">
              {getCurrencySymbol(currency)}
            </span>

            <span className="text-sm font-medium text-white tracking-wide">
              {balance.toLocaleString()}
            </span>

            <RefreshButton />
          </div>
        )}
      </div>
    </section>
  );
};

export default HeaderBalance;
export const UserAvatar = ({ variant }: { variant: "PLATFORM" | "NORMAL" }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative cursor-pointer">
          {variant === "PLATFORM" && (
            <div className="absolute inset-0 rounded-full bg-[#D4AF37] opacity-40 blur-md" />
          )}

          <div
            className={`
              relative
              w-[38px] h-[38px]
              rounded-full
              overflow-hidden
              border-2
              ${
                variant === "PLATFORM"
                  ? "border-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,0.4)]"
                  : "border-black"
              }
            `}
          >
            <img
              src="https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
              className="w-full h-full object-cover"
              alt="user"
            />
          </div>

          {/* ONLINE DOT */}
          <span className="absolute bottom-0 right-0 w-[9px] h-[9px] bg-[#00ff88] rounded-full border-2 border-[#070510] shadow-[0_0_5px_#00ff88]" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="bg-transparent border-none p-0">
        <CasinoDropdownMenu />
      </PopoverContent>
    </Popover>
  );
};
const RefreshButton = ({
  variant = "NORMAL",
}: {
  variant?: "PLATFORM" | "NORMAL";
}) => {
  return (
    <button className="ml-3 group">
      <HiOutlineRefresh
        className={`
          w-4 h-4 transition-all duration-500
          ${
            variant === "PLATFORM"
              ? "text-[#D4AF37]/60 group-hover:text-[#D4AF37]"
              : "text-white/60 group-hover:text-white"
          }
        `}
      />
    </button>
  );
};

// const DropdownMenu = () => {
//   const router = useRouter();

//   const handleLogout = () => {
//     logout().then((res: any) => {
//       if (res.success) window.location.reload();
//     });
//   };

//   const menuItems = [
//     {
//       icon: <RiAccountPinCircleFill />,
//       label: "Profile",
//       action: () => router.push("/member"),
//     },
//     {
//       icon: <MdHistory />,
//       label: "History",
//       action: () => router.push("/history"),
//     },
//     {
//       icon: <FaRegFileAlt />,
//       label: "Profit & Loss",
//       action: () => router.push("/profitandloss"),
//     },
//     {
//       icon: <PiHandDepositFill />,
//       label: "Deposit",
//       action: () => router.push("/deposit"),
//     },
//     {
//       icon: <PiHandWithdrawFill />,
//       label: "Withdrawal",
//       action: () => router.push("/withdraw"),
//     },
//     {
//       icon: <RiCustomerService2Line />,
//       label: "Concierge",
//       action: () => router.push("/support"),
//     },
//     {
//       icon: <IoLogOut />,
//       label: "Logout",
//       action: handleLogout,
//       isExit: true,
//     },
//   ];

//   return (
//     <div className="w-[240px] mt-4 bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
//       <div className="p-2 space-y-1">
//         {menuItems.map((item, idx) => (
//           <button
//             key={idx}
//             onClick={item.action}
//             className={`
//               w-full flex items-center gap-4
//               px-4 py-3 rounded-xl
//               transition-all duration-300 group
//               ${item.isExit ? "hover:bg-red-950/20" : "hover:bg-[#D4AF37]/10"}
//             `}
//           >
//             <div
//               className={`
//                 text-xl transition-transform group-hover:scale-110
//                 ${item.isExit ? "text-red-500" : "text-[#D4AF37]"}
//               `}
//             >
//               {item.icon}
//             </div>

//             <span className="text-sm font-light tracking-wide text-neutral-300 group-hover:text-white">
//               {item.label}
//             </span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

function CasinoDropdownMenu() {
  const icons = {
    profile: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="18"
        height="18"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    history: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="18"
        height="18"
      >
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 15" />
      </svg>
    ),
    profit: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="18"
        height="18"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
      </svg>
    ),
    deposit: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="18"
        height="18"
      >
        <path d="M12 5v14" />
        <path d="M5 12l7 7 7-7" />
        <path d="M5 5h14" />
      </svg>
    ),
    withdraw: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="18"
        height="18"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
        <path d="M5 19h14" />
      </svg>
    ),
    support: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="18"
        height="18"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.9 19.8 19.8 0 0 1 1.61 3.27 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    logout: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="18"
        height="18"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    crown: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M2 19l2-9 4.5 4L12 5l3.5 9L20 10l2 9H2z" />
      </svg>
    ),
  };
  const [hovered, setHovered] = useState(null);
  const [active, setActive] = useState(null);
  const badge = useNotificationBadge((state) => state.badge);
  const profileNotificationCount =
    badge.achivementRewardsCount + badge.bonusReceivingRewardCount + 2;
  const menuItems = useMemo(
    () => [
      {
        icon: icons.profile,
        label: "Profile",
        color: "#a78bfa",
        glow: "rgba(167,139,250,0.35)",
        isExit: false,
        link: "/member",
        badge: profileNotificationCount,
      },
      {
        icon: icons.history,
        label: "History",
        color: "#60a5fa",
        glow: "rgba(96,165,250,0.35)",
        isExit: false,
        link: "/history",
      },
      {
        icon: icons.profit,
        label: "Profit & Loss",
        color: "#34d399",
        glow: "rgba(52,211,153,0.35)",
        isExit: false,
        link: "/profitandloss",
      },
      {
        icon: icons.deposit,
        label: "Deposit",
        color: "#fbbf24",
        glow: "rgba(251,191,36,0.45)",
        isExit: false,
        link: "/deposit",
      },
      {
        icon: icons.withdraw,
        label: "Withdrawal",
        color: "#f472b6",
        glow: "rgba(244,114,182,0.35)",
        isExit: false,
        link: "/withdraw",
      },
      {
        icon: icons.support,
        label: "Concierge",
        color: "#38bdf8",
        glow: "rgba(56,189,248,0.35)",
        isExit: false,
        link: "/chat",
      },
      {
        icon: icons.logout,
        label: "Logout",
        color: "#f87171",
        glow: "rgba(248,113,113,0.4)",
        isExit: true,
        onclick: async () => {
          await logout();
          location.reload();
        },
      },
    ],
    [badge],
  );
  const { data } = useFetchVipLevelQuery();
  const level = data?.payload?.level?.level || 0;
  const user: any = useCurrentUser();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
      className="mt-4"
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(251,191,36,0); }
        }
        @keyframes item-slide-in {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .menu-item {
          animation: item-slide-in 0.28s ease both;
        }
        .menu-item:nth-child(1) { animation-delay: 0.03s; }
        .menu-item:nth-child(2) { animation-delay: 0.06s; }
        .menu-item:nth-child(3) { animation-delay: 0.09s; }
        .menu-item:nth-child(4) { animation-delay: 0.12s; }
        .menu-item:nth-child(5) { animation-delay: 0.15s; }
        .menu-item:nth-child(6) { animation-delay: 0.18s; }
        .menu-item:nth-child(7) { animation-delay: 0.21s; }
      `}</style>

      <div
        style={{
          width: 260,
          background:
            "linear-gradient(160deg, #12101e 0%, #0e0c1c 60%, #0a0818 100%)",
          border: "1px solid rgba(251,191,36,0.25)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow:
            "0 0 0 1px rgba(251,191,36,0.08), 0 24px 60px rgba(0,0,0,0.85), 0 0 40px rgba(139,92,246,0.08)",
          position: "relative",
        }}
      >
        {/* Gold top edge glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(251,191,36,0.7), rgba(251,191,36,0.9), rgba(251,191,36,0.7), transparent)",
          }}
        />

        {/* User header */}
        <div
          style={{
            padding: "18px 16px 14px",
            borderBottom: "1px solid rgba(251,191,36,0.12)",
            background:
              "linear-gradient(180deg, rgba(251,191,36,0.06) 0%, transparent 100%)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              border: "2px solid rgba(251,191,36,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse-ring 3s ease-in-out infinite",
              flexShrink: 0,
            }}
          >
            <img
              src="https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
              className="w-full h-full object-cover rounded-full"
              alt="user"
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 0.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                marginTop: 3,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background:
                  "linear-gradient(90deg, rgba(251,191,36,0.18), rgba(251,191,36,0.08))",
                border: "1px solid rgba(251,191,36,0.3)",
                borderRadius: 6,
                padding: "2px 7px",
              }}
            >
              <span style={{ color: "#fbbf24" }}>{icons.crown}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#fbbf24",
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                }}
              >
                VIP LV.{level}
              </span>
            </div>
          </div>
        </div>

        {/* Balance pill */}
        <div
          style={{
            margin: "10px 12px",
            padding: "8px 14px",
            background:
              "linear-gradient(90deg, rgba(251,191,36,0.1), rgba(139,92,246,0.1))",
            border: "1px solid rgba(251,191,36,0.2)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 0.5,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Balance
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ৳{user?.wallet?.balance || 0}
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(251,191,36,0.1), transparent)",
            margin: "2px 0",
          }}
        />

        {/* Menu items */}
        <div style={{ padding: "6px 8px 10px" }}>
          {menuItems.map((item, idx) => {
            const isHov = hovered === idx;
            const isAct = active === idx;
            return (
              <button
                onClick={() => item.onclick?.()}
                key={idx}
                className="menu-item"
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => {
                  setHovered(null);
                  setActive(null);
                }}
                onMouseDown={() => setActive(idx)}
                onMouseUp={() => setActive(null)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 12px",
                  borderRadius: 12,
                  border: isHov
                    ? `1px solid ${item.isExit ? "rgba(248,113,113,0.3)" : "rgba(251,191,36,0.2)"}`
                    : "1px solid transparent",
                  background: isHov
                    ? item.isExit
                      ? "rgba(248,113,113,0.08)"
                      : "linear-gradient(90deg, rgba(251,191,36,0.07), rgba(139,92,246,0.05))"
                    : "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: isAct ? "scale(0.97)" : "scale(1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {item.link && (
                  <Link
                    href={item.link}
                    className="w-full h-full absolute top-0 left-0 right-0"
                  ></Link>
                )}
                {/* Hover shimmer line */}
                {isHov && !item.isExit && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      background: `linear-gradient(180deg, transparent, ${item.color}, transparent)`,
                      borderRadius: "12px 0 0 12px",
                    }}
                  />
                )}

                {/* Icon container */}
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: isHov
                      ? `linear-gradient(135deg, ${item.glow.replace("0.35", "0.25")}, rgba(0,0,0,0.3))`
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isHov ? item.color + "44" : "rgba(255,255,255,0.06)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isHov ? item.color : "rgba(255,255,255,0.45)",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                    boxShadow: isHov ? `0 0 12px ${item.glow}` : "none",
                    transform: isHov ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isHov ? 600 : 400,
                    color: isHov
                      ? item.isExit
                        ? "#f87171"
                        : "#fff"
                      : "rgba(255,255,255,0.6)",
                    letterSpacing: 0.2,
                    transition: "all 0.2s ease",
                    flex: 1,
                    textAlign: "left",
                  }}
                >
                  {item.label}
                </span>

                {/* Arrow on hover (non-exit) */}
                {isHov && !item.isExit && (
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="12"
                    height="12"
                    style={{ opacity: 0.7 }}
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                )}

                {/* Separator before logout */}
                {idx === menuItems.length - 2 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -1,
                      left: 12,
                      right: 12,
                      height: 1,
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
                    }}
                  />
                )}

                {item.badge && (
                  <span className="notification-badge absolute top-1/2 -translate-y-1/2 left-28 !text-[8px] !h-[12px] !w-[12px] !bg-[#ffc32c] !text-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom glow */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "20%",
            right: "20%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)",
          }}
        />
      </div>
    </div>
  );
}
