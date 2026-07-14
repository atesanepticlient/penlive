import { GameContent, GamesList } from "@/types/game";
import { apiSlice } from "./apiSlice";


const depositApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Existing endpoint for old provider
    fetchGamesList: builder.query<
      any,
      { product_code?: string; size?: string; offset?: string }
    >({
      query: ({ product_code = "all", size = "21", offset = "0" }) => ({
        url: `api/games/get?product_code=${product_code}&size=${size}&offset=${offset}`,
        method: "GET",
      }),
    }),

    // New endpoint for new provider
    fetchNewProviderGamesList: builder.query<
      { success: boolean; gamesList: GamesList },
      void
    >({
      query: () => ({
        url: "api/newprovider",
        method: "GET",
      }),
    }),

    // Existing mutation for opening a game
    openGame: builder.mutation<GameContent, { gameId: string; demo: string }>({
      query: (body) => ({
        url: `api/open-game`,
        method: "POST",
        body: body,
      }),
    }),

    openGSCGame: builder.mutation<any, any>({
      query: (body) => ({
        url: `/api/games/open`,
        method: "POST",
        body: body,
      }),
    }),

    fetch568WinGames: builder.query({
      query: () => ({
        url: "api/568win",
        method: "GET",
      }),
    }),
    login568Win: builder.mutation({
      query: (body) => ({
        url: "api/568win/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useFetchGamesListQuery,
  useOpenGameMutation,
  useFetchNewProviderGamesListQuery,
  useFetch568WinGamesQuery,
  useLogin568WinMutation,
  useOpenGSCGameMutation,
} = depositApiSlice;
