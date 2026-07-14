/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExtendedCard } from "@/types/api/card";
import { Categories, GamesList, NetEnt } from "@/types/game";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WithdrawCardType {
  card: ExtendedCard | null;
  setCard: (card: ExtendedCard) => void;
}

export const useCard = create<WithdrawCardType>((set) => ({
  card: null,
  setCard: (card) => set((state) => ({ ...state, card })),
}));

interface GameType {
  games: GamesList | null;
  isLoading: boolean;
  error: string;

  getGames: (
    category: string,
    name?: string,
    limit?: number,
    provider?: any,
  ) => NetEnt[] | null;

  getCustomeCategoriesGames: (
    category?: string,
    search?: string,
    limit?: number,
  ) => NetEnt[] | null;

  getFavoriesGames: (gamesId: string[]) => NetEnt[] | null;

  setGames: (gamge: GamesList) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
}

export const useGames = create<GameType>((set, get) => ({
  games: null,
  isLoading: true,
  error: "",

  getGames: (category, name, limit, provider) => {
    const games = get().games!;
    if (!games) return null;
    const allGamesArrays = Object.values(games).flat();

    let flitedGames = allGamesArrays.filter((game) => {
      if (category === Categories.Slots) {
        return (
          game.categories === category ||
          game.categories == Categories.FastGames
        );
      } else {
        return game.categories === category;
      }
    });

    if (provider && provider !== "all") {
      flitedGames = allGamesArrays!.filter((game) => game.title === provider);
    }

    if (name) {
      const searchLower = name.toLowerCase();
      flitedGames = flitedGames.filter((game) =>
        game.name.toLowerCase().includes(searchLower),
      );
    }

    if (limit !== undefined && limit > 0) {
      return flitedGames.slice(0, limit);
    }

    return flitedGames;
  },

  getCustomeCategoriesGames: (category, search, limit) => {
    const games = get().games!;
    if (!games) return null;
    const allGamesArrays = Object.values(games).flat();
    let filtedGames = allGamesArrays;
    if (category && category != "all") {
      filtedGames = allGamesArrays.filter((game) => {
        return game.provider == category;
      });
    }

    if (category == "Spribe") {
      filtedGames.unshift({
        gameProviderId: 1072,
        gameID: 1,
        gameType: 1,
        newGameType: 202,
        rank: 1,
        device: "d/m",
        platform: "",
        provider: "Spribe",
        rtp: 0.97,
        rows: -1,
        reels: -1,
        lines: -1,
        gameInfos: [
          {
            language: "en",
            gameName: "Aviator",
            gameIconUrl:
              "https://cdn-test.cdn568.net/Spribe/1/1072_1_Aviator.png?v=1",
          },
        ],
        supportedCurrencies: [
          "AED",
          "AFN",
          "ALL",
          "AMD",
          "ARS",
          "AMG",
          "AOA",
          "AUD",
          "AWG",
          "AZN",
          "BAM",
          "BBD",
          "BDT",
          "BGN",
          "BHD",
          "BIF",
          "BMD",
          "BND",
          "BOB",
          "BRL",
          "BSD",
          "BTN",
          "BWP",
          "BYN",
          "BZD",
          "CAD",
          "CDF",
          "CHF",
          "CLP",
          "CNY",
          "COP",
          "CRC",
          "CUP",
          "CVE",
          "CZK",
          "DJF",
          "DKK",
          "DOP",
          "DZD",
          "EGP",
          "ERN",
          "ETB",
          "EUR",
          "FJD",
          "FKP",
          "GBP",
          "GEL",
          "GHS",
          "GIP",
          "GMD",
          "GNF",
          "GTQ",
          "GYD",
          "HKD",
          "HNL",
          "HTG",
          "HUF",
          "IDR",
          "ILS",
          "INR",
          "IQD",
          "ISK",
          "JMD",
          "JOD",
          "JPY",
          "KES",
          "KGS",
          "KHR",
          "KMF",
          "KPW",
          "KRW",
          "KWD",
          "KYD",
          "KZT",
          "LAK",
          "LBP",
          "LKR",
          "LRD",
          "LSL",
          "LYD",
          "MAD",
          "MDL",
          "MGA",
          "MKD",
          "MMK",
          "MNT",
          "MOP",
          "MRU",
          "MUR",
          "MVR",
          "MWK",
          "MXN",
          "MYR",
          "MZN",
          "NAD",
          "NGN",
          "NIO",
          "NOK",
          "NPR",
          "NZD",
          "OMR",
          "PAB",
          "PEN",
          "PGK",
          "PKR",
          "PLN",
          "PYG",
          "QAR",
          "RON",
          "RSD",
          "RWF",
          "SAR",
          "SBD",
          "SCR",
          "SDG",
          "SEK",
          "SOS",
          "SRD",
          "SYP",
          "SZL",
          "THB",
          "TMP",
          "TJS",
          "TMT",
          "TND",
          "TOP",
          "TRY",
          "TTD",
          "TZS",
          "UAH",
          "UGX",
          "USD",
          "UYU",
          "UZS",
          "VES",
          "VND",
          "VUV",
          "WST",
          "XAF",
          "XCD",
          "XOF",
          "XPF",
          "YER",
          "ZAR",
          "ZMW",
          "MYK",
        ],
        blockCountries: [],
        isMaintain: false,
        isEnabled: true,
        isProvideCommission: false,
        hasHedgeBet: false,
        providerStatus: "Online",
        isProviderOnline: true,
      });
    }
    if (category == "hot") {
      const gamesId = [
        "8892",
        "8891",
        "8890",
        "15808",
        "15814",
        "15815",
        "15813",
        "15810",
        "15809",
        "15065",
        "15056",
        "15812",
        "7053",
        "10269",
        "9896",
      ];
      filtedGames = allGamesArrays.filter((game) => gamesId.includes(game.id));
    }

    if (search) {
      filtedGames = filtedGames.filter((game: any) =>
        game.gameInfos[0]?.gameName
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }
    if (limit !== undefined && limit > 0) {
      return filtedGames.slice(1, limit);
    }

    return filtedGames;
  },
  getFavoriesGames: (gamesId) => {
    const games = get().games!;
    if (!games) return null;
    const allGamesArrays = Object.values(games).flat();

    const flitedGames = allGamesArrays.filter((game) =>
      gamesId.includes(game.id),
    );

    return flitedGames;
  },
  setGames: (games) => set((state) => ({ ...state, games })),
  setLoading: (isLoading) => set((state) => ({ ...state, isLoading })),
  setError: (error) => set((state) => ({ ...state, error })),
}));

interface NotificationBadge {
  achivementRewardsCount: number;
  airDropCount: number;
  bonusReceivingRewardCount: number;
  dailyCheckinCount: number;
  siginBonueCount: number;
  unSeenMessagesCount: number;
}
interface NotificationType {
  badge: NotificationBadge;
  setBadge: (badge: NotificationBadge) => void;
}
export const useNotificationBadge = create<NotificationType>((set) => ({
  badge: {
    achivementRewardsCount: 0,
    airDropCount: 0,
    bonusReceivingRewardCount: 0,
    dailyCheckinCount: 0,
    siginBonueCount: 0,
    unSeenMessagesCount: 0,
  },
  setBadge: (badge) => set((state) => ({ ...state, badge })),
}));

type Lang = "ENG" | "BN";

type LangState = {
  lang: Lang;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
};

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: "ENG", // default (used if nothing in localStorage)

      toggleLang: () => {
        const current = get().lang;
        set({ lang: current === "ENG" ? "BN" : "ENG" });
      },

      setLang: (lang) => set({ lang }),
    }),
    {
      name: "lang-storage",

      // optional: ensure fallback to ENG if corrupted
      onRehydrateStorage: () => (state) => {
        if (!state?.lang) {
          state?.setLang("ENG");
        }
      },
    },
  ),
);
