import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getPersistedState } from "../localstore";

const baseQuery = fetchBaseQuery({
  baseUrl: "/",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;

    const token = state.auth?.token;
    const langState = getPersistedState<{ lang: "ENG" | "BN" }>(
      "lang-storage",
      { lang: "ENG" },
    );

    const lang = langState.lang;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    if (lang) {
      headers.set("x-lang-data", lang);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,

  tagTypes: [
    "deposit",
    "card",
    "withdraw",
    "invitationReward",
    "signinReward",
    "luckyWheel",
    "promotions",
    "wallet",
    "airdrop",
    "depositTicket",
    "spinClaim",
    "vipreward",
    "rewaredEvent",
    "UserStatus",
    "WithdrawStatus",
  ],
  endpoints: () => ({}),
});
