"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useTransition,
} from "react";
import { Search } from "lucide-react";
import { FaHeart } from "react-icons/fa";

import SideNavLayout from "@/components/SideNavLayout";
import { GameCardWithProvider } from "@/components/games/GameCards";
import PrimaryInput from "@/components/form/input";
import GameLoader from "@/components/loader/GameLoader";
import GameHeader from "@/app/slots/header";
import { getPockerGames } from "@/lib/games";

import "swiper/css";
import "swiper/css/navigation";

const PAGE_SIZE = 21;
const INCREMENT = 9;

const PockerPage = () => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isAppendingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const scrollYRef = useRef(0);
  const pendingImagesRef = useRef(0);

  const [search, setSearch] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [isAppending, setIsAppending] = useState(false);
  const [isFilterPending, startFilterTransition] = useTransition();

  // ─── Derive games — single call, no double scan ───────────────────────────
  const games = getPockerGames({
    nameSearch: committedSearch,
    limit,
  });

  const hasMore = games.length === limit;
  hasMoreRef.current = hasMore;

  // ─── Image settled callback ───────────────────────────────────────────────
  // When all new images load/error → release the fetch lock
  const onImageSettled = useCallback(() => {
    pendingImagesRef.current -= 1;
    if (pendingImagesRef.current <= 0) {
      pendingImagesRef.current = 0;
      isAppendingRef.current = false; // ← unlock next fetch
    }
  }, []);

  // ─── Append more ──────────────────────────────────────────────────────────
  const appendMore = useCallback(() => {
    // If images from previous batch still loading — skip, don't fetch
    if (isAppendingRef.current || !hasMoreRef.current) return;

    isAppendingRef.current = true; // ← lock until images settle
    setIsAppending(true);
    scrollYRef.current = window.scrollY;

    // Track how many new images need to settle before unlocking
    pendingImagesRef.current = INCREMENT;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLimit((prev) => prev + INCREMENT);
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollYRef.current, behavior: "instant" });
          setIsAppending(false);
        });
      });
    });
  }, []);

  // ─── Observer — created once on mount ────────────────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) appendMore();
      },
      { root: null, rootMargin: "300px", threshold: 0 },
    );

    observerRef.current.observe(sentinel);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  // ─── Search debounce ──────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      startFilterTransition(() => {
        setCommittedSearch(search);
        setLimit(PAGE_SIZE);
      });
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // ─── Display states ───────────────────────────────────────────────────────
  const showSkeletons = isFilterPending;
  const showEmpty = !isFilterPending && games.length === 0;
  const showGames = !isFilterPending && games.length > 0;

  return (
    <SideNavLayout>
      <div className="min-h-screen overflow-hidden bg-violet-50 text-white">
        <GameHeader title="Pocker" />
        <main className="relative pb-4 md:px-5">
          {/* Background Glow */}
          <div className="pointer-events-none min-h-screen absolute inset-0 overflow-hidden">
            <div className="absolute -left-10 -top-10 h-[500px] w-[500px] rounded-full bg-rose-300/30 blur-[120px]" />
            <div className="absolute -right-10 -top-20 h-[450px] w-[450px] rounded-full bg-violet-400/25 blur-[100px]" />
            <div className="absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-purple-300/20 blur-[130px]" />
            <div className="absolute -bottom-10 left-10 h-[350px] w-[350px] rounded-full bg-fuchsia-300/25 blur-[100px]" />
            <div className="absolute -bottom-10 right-10 h-[300px] w-[300px] rounded-full bg-indigo-400/20 blur-[90px]" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-3 px-2 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-violet-950" />
                <PrimaryInput
                  placeholder="Search Games"
                  className="pl-12"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
              </div>
              <div className="w-[54px] h-[54px] rounded-2xl relative flex items-center justify-center cursor-pointer bg-gradient-to-br from-purple-500 via-purple-700 to-purple-900 shadow border border-white overflow-hidden">
                <div className="absolute top-1 left-1 right-1 h-1/2 rounded-xl bg-white/10 blur-md" />
                <FaHeart />
              </div>
            </div>

            <div className="py-5">
              {showSkeletons && (
                <div className="grid grid-cols-3 gap-3  px-3">
                  <GameLoader length={PAGE_SIZE} loading={true} />
                </div>
              )}

              {showEmpty && (
                <div className="flex flex-col items-center justify-center rounded-[20px] border border-violet-200/40 bg-white/30 backdrop-blur-md py-14 mx-3">
                  <p className="text-xl font-bold text-violet-800">
                    No Games Found
                  </p>
                  <span className="mt-2 text-sm text-violet-400">
                    Try another provider or keyword
                  </span>
                </div>
              )}

              {showGames && (
                <div className="grid grid-cols-3 gap-3 px-3">
                  {games.map((game, i) => (
                    <div
                      key={`${game.game_name}-${game.product_code}-${i}`}
                      className="group relative overflow-hidden rounded-xl transition-all duration-300"
                    >
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/0 via-transparent to-rose-300/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative overflow-hidden">
                        <GameCardWithProvider
                          game={{
                            game_name: game.game_name,
                            image_url: game.image_url,
                            product_code: game.product_code,
                            game_code: game.game_code,
                            game_type: game.game_type,
                          }}
                          onImageSettled={
                            i >= games.length - INCREMENT
                              ? onImageSettled
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  ))}

                  {isAppending && (
                    <GameLoader length={INCREMENT} loading={true} />
                  )}
                </div>
              )}

              {/* Always in DOM — observer never loses its target */}
              <div ref={sentinelRef} className="h-px w-full" aria-hidden />

              {!hasMore && showGames && !isAppending && (
                <p className="text-center text-sm text-violet-400 py-6">
                  All games loaded
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </SideNavLayout>
  );
};

export default PockerPage;
