"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import SiteHeader from "@/components/SiteHeader";
import NoData from "@/components/no-data";

// ─── Types ────────────────────────────────────────────────────────────────────

type BetStatus = "RUNNING" | "SETTLED" | "CANCELED" | "VOID";
type BettingCategory = "SLOT" | "LIVE" | "POKER" | "FISH" | "SPORTS";

interface BettingRecord {
  id: string;
  createdAt: string;
  name: string | null;
  category: BettingCategory;
  betAmount: number;
  profit: number | null;
  loss: number | null;
  status: BetStatus;
  orderNo: string | null;
}

interface Summary {
  totalBet: number;
  validBet: number;
  totalProfit: number;
  totalLoss: number;
  profitAndLoss: number;
  totalRecords: number;
}

interface ApiResponse {
  records: BettingRecord[];
  nextCursor: string | null;
  hasMore: boolean;
  summary: Summary;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number | null | undefined, decimals = 2) {
  if (n == null) return "—";
  return n.toFixed(decimals);
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}

function toInputDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

const STATUS_STYLE: Record<
  BetStatus,
  { label: string; color: string; bg: string }
> = {
  RUNNING: { label: "Running", color: "#f59e0b", bg: "#fef3c7" },
  SETTLED: { label: "Settled", color: "#10b981", bg: "#d1fae5" },
  CANCELED: { label: "Canceled", color: "#6b7280", bg: "#f3f4f6" },
  VOID: { label: "Void", color: "#ef4444", bg: "#fee2e2" },
};

const CAT_COLOR: Record<BettingCategory, string> = {
  SLOT: "#a855f7",
  LIVE: "#3b82f6",
  POKER: "#f97316",
  FISH: "#06b6d4",
  SPORTS: "#22c55e",
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const CopyIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

// ─── Category Tabs ────────────────────────────────────────────────────────────

const CATEGORIES: { key: BettingCategory | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "SLOT", label: "Slot" },
  { key: "LIVE", label: "Live" },
  { key: "POKER", label: "Poker" },
  { key: "FISH", label: "Fish" },
  { key: "SPORTS", label: "Sports" },
];

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function fetchRecords(params: {
  cursor?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse> {
  const qs = new URLSearchParams();
  if (params.cursor) qs.set("cursor", params.cursor);
  if (params.search) qs.set("search", params.search);
  if (params.startDate) qs.set("startDate", params.startDate);
  if (params.endDate) qs.set("endDate", params.endDate);

  const res = await fetch(`/api/bet-records?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

// ─── Record Card ──────────────────────────────────────────────────────────────

function RecordCard({ record }: { record: BettingRecord }) {
  const [copied, setCopied] = useState(false);
  const status = STATUS_STYLE[record.status];
  const catColor = CAT_COLOR[record.category];
  const pnl = (record.profit ?? 0) - (record.loss ?? 0);
  const isWin = pnl > 0;
  const isLoss = pnl < 0;

  const copyOrder = () => {
    if (!record.orderNo) return;
    navigator.clipboard.writeText(record.orderNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
      style={{ animation: "slideIn 0.25s ease-out both" }}
    >
      {/* Top bar with category color */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
        <div className="flex items-center gap-2">
          {/* Category dot */}
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: catColor }}
          />
          <span className="text-sm font-black text-slate-800 tracking-tight">
            {record.name ?? record.category}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ color: status.color, background: status.bg }}
          >
            {status.label}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {fmtDate(record.createdAt)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-slate-100" />

      {/* Body */}
      <div className="px-4 pt-2.5 pb-3 space-y-2">
        {/* Upline */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Upline</span>
          <span className="text-[11px] text-slate-500">—</span>
        </div>

        {/* Order no */}
        {record.orderNo && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 font-medium flex-shrink-0">
              Order no.
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] text-slate-600 font-mono truncate max-w-[160px]">
                {record.orderNo}
              </span>
              <button
                onClick={copyOrder}
                className="flex-shrink-0 text-slate-300 hover:text-slate-500 transition-colors active:scale-90"
              >
                {copied ? (
                  <span className="text-[9px] text-green-500 font-bold">✓</span>
                ) : (
                  <CopyIcon />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Bet / Valid bet */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <p className="text-[10px] text-slate-400 font-medium mb-0.5">
              Bet amount
            </p>
            <p className="text-sm font-bold text-slate-700">
              {fmt(record.betAmount)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium mb-0.5">
              Valid bet
            </p>
            <p className="text-sm font-bold text-slate-700">
              {fmt(record.betAmount)}
            </p>
          </div>
        </div>

        {/* P&L / Winnings */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] text-slate-400 font-medium mb-0.5">
              Profit &amp; loss
            </p>
            <p
              className="text-sm font-black"
              style={{
                color: isWin ? "#10b981" : isLoss ? "#ef4444" : "#94a3b8",
              }}
            >
              {pnl === 0 ? "—" : (isWin ? "+" : "") + fmt(pnl)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium mb-0.5">
              Winnings
            </p>
            <p className="text-sm font-bold text-slate-500">
              {record.profit != null && record.profit > 0
                ? fmt(record.profit)
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom category tag */}
      <div className="px-4 pb-3">
        <span
          className="text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded"
          style={{ color: catColor, background: `${catColor}18` }}
        >
          {record.category}
        </span>
      </div>
    </div>
  );
}

// ─── Summary Bar ──────────────────────────────────────────────────────────────

function SummaryBar({ summary }: { summary: Summary }) {
  const pnl = summary.profitAndLoss;
  const isPos = pnl >= 0;

  return (
    <div className="bg-gray-200 p-4 mx-0 bottom-0 left-1/2 -translate-x-1/2 fixed right-0 w-full md:w-[480px]">
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Bet amount",
            value: fmt(summary.totalBet),
            color: "text-black",
          },
          {
            label: "Valid bet",
            value: fmt(summary.validBet),
            color: "text-black",
          },
          {
            label: "Profit & loss",
            value: (isPos ? "+" : "") + fmt(pnl),
            color: isPos ? "text-emerald-400" : "text-red-400",
          },
          {
            label: "Winnings",
            value: fmt(summary.totalProfit),
            color: "text-emerald-400",
          },
          {
            label: "Total bets",
            value: String(summary.totalRecords),
            color: "text-amber-400",
          },
          {
            label: "Loss",
            value: fmt(summary.totalLoss),
            color: "text-red-400",
          },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className={`text-sm font-black ${item.color}`}>{item.value}</p>
            <p className="text-[9px] text-slate-700 uppercase tracking-widest mt-0.5 leading-tight">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Search Drawer ────────────────────────────────────────────────────────────

function SearchDrawer({
  open,
  onClose,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (q: { search: string; startDate: string; endDate: string }) => void;
}) {
  const def3days = () => {
    const d = new Date();
    d.setDate(d.getDate() - 3);
    return toInputDate(d);
  };
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(def3days);
  const [endDate, setEndDate] = useState(toInputDate(new Date()));

  const apply = () => {
    onApply({ search, startDate, endDate });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-in panel from right */}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col`}
        style={{
          width: "82vw",
          maxWidth: 360,
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <h2 className="text-base font-black text-slate-800">
            Search &amp; Filter
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Game name search */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
              Game Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Aviator, Mines…"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
              />
            </div>
          </div>

          {/* Date range */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
              Date Range
            </label>
            <div className="space-y-2.5">
              <div>
                <p className="text-[10px] text-slate-400 mb-1 font-medium">
                  Start Date
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                    <CalendarIcon />
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
                  />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 mb-1 font-medium">
                  End Date
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                    <CalendarIcon />
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Quick presets */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {[
                { label: "Today", days: 0 },
                { label: "3 Days", days: 3 },
                { label: "7 Days", days: 7 },
                { label: "30 Days", days: 30 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() - p.days);
                    setStartDate(toInputDate(d));
                    setEndDate(toInputDate(new Date()));
                  }}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Apply */}
        <div className="px-5 pb-8 pt-3 border-t border-slate-100">
          <button
            onClick={apply}
            className="w-full py-3.5 rounded-2xl text-white text-sm font-black bg-blue-600 active:scale-95 transition-all shadow-lg shadow-slate-900/20"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BettingRecordsPage() {
  const def3days = () => {
    const d = new Date();
    d.setDate(d.getDate() - 3);
    return toInputDate(d);
  };

  const [records, setRecords] = useState<BettingRecord[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<BettingCategory | "ALL">("ALL");
  const [filters, setFilters] = useState({
    search: "",
    startDate: def3days(),
    endDate: toInputDate(new Date()),
  });

  const loaderRef = useRef<HTMLDivElement>(null);

  // Initial / filter load
  const load = useCallback(async (f: typeof filters) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchRecords({
        search: f.search || undefined,
        startDate: f.startDate,
        endDate: f.endDate,
      });
      setRecords(res.records);
      setSummary(res.summary);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more (lazy)
  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await fetchRecords({
        cursor,
        search: filters.search || undefined,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      setRecords((prev) => [...prev, ...res.records]);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, filters, hasMore, loadingMore]);

  // Infinite scroll observer
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  // Re-fetch when filters change
  useEffect(() => {
    load(filters);
  }, [filters, load]);

  const handleApply = (q: {
    search: string;
    startDate: string;
    endDate: string;
  }) => {
    setFilters(q);
  };

  // Filtered records by tab
  const displayed =
    activeTab === "ALL"
      ? records
      : records.filter((r) => r.category === activeTab);

  return (
    <div>
      <SiteHeader title="Bet Records" />

      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Category tabs + search icon */}
        <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
          <div className="flex items-center">
            {/* Tabs scroll */}
            <div
              className="flex-1 flex overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeTab === cat.key;
                const color =
                  cat.key === "ALL"
                    ? "#1e293b"
                    : CAT_COLOR[cat.key as BettingCategory];
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveTab(cat.key)}
                    className="flex-shrink-0 px-4 py-3.5 text-sm font-bold transition-all duration-200 relative"
                    style={{ color: isActive ? color : "#94a3b8" }}
                  >
                    {cat.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                        style={{ background: color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active filter chips */}
          <div className="flex justify-between">
            {(filters.search || filters.startDate || filters.endDate) && (
              <div
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-4 pb-2.5 mt-2 overflow-x-auto select-none cursor-pointer"
                style={{ scrollbarWidth: "none" }}
              >
                {filters.search && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white whitespace-nowrap">
                    {filters.search}
                    <button
                      onClick={() => setFilters((f) => ({ ...f, search: "" }))}
                      className="ml-1 opacity-70"
                    >
                      ×
                    </button>
                  </span>
                )}
                <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md bg-transparent text-blue-500 border border-blue-500 whitespace-nowrap">
                  <CalendarIcon />
                  {filters.startDate} → {filters.endDate}
                </span>
              </div>
            )}

            <button
              onClick={() => setSearchOpen(true)}
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-blue-500 hover:text-blue-600 transition-colors"
            >
              <SearchIcon />
            </button>
          </div>
        </div>

        <div className="px-4 pt-4 space-y-3">
          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-9 h-9 rounded-full border-4 border-slate-200 border-t-slate-800 animate-spin" />
              <p className="text-xs text-slate-400 font-medium">
                Loading records…
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-16">
              <p className="text-sm text-red-400 font-semibold">
                Failed to load records
              </p>
              <button
                onClick={() => load(filters)}
                className="mt-2 text-xs text-slate-500 underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Records */}
          {!loading && !error && (
            <>
              {displayed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="w-36 h-16 rounded-2xl  flex items-center justify-center">
                    {/* <svg
                      className="w-7 h-7 text-slate-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg> */}
                    <NoData />
                  </div>
                  {/* <p className="text-sm font-bold text-slate-500">
                    No records found
                  </p>
                  <p className="text-xs text-slate-400">
                    Try adjusting the filters
                  </p> */}
                </div>
              ) : (
                displayed.map((rec) => <RecordCard key={rec.id} record={rec} />)
              )}

              {/* Lazy load sentinel */}
              {hasMore && activeTab === "ALL" && (
                <div ref={loaderRef} className="flex justify-center py-4">
                  {loadingMore && (
                    <div className="w-7 h-7 rounded-full border-3 border-slate-200 border-t-slate-600 animate-spin" />
                  )}
                </div>
              )}
            </>
          )}

          {/* Summary Bar — always at bottom */}
          {summary && !loading && (
            <div className="pt-2">
              <SummaryBar summary={summary} />
            </div>
          )}
        </div>
      </div>

      {/* Search drawer */}
      <SearchDrawer
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onApply={handleApply}
      />

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
