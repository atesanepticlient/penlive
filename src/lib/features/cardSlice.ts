import { CardName } from "@prisma/client";
import { apiSlice } from "./apiSlice";

export interface UserStatusResponse {
  hasWithdrawPassword: boolean;
  cards: {
    id: string;
    cardName: CardName;
    walletNumber: string;
    payerName: string;
    cardNumber: string;
    isActive: boolean;
    createdAt: string;
  }[];
}

export interface CreateCardRequest {
  payerName: string;
  walletNumber: string;
  cardName: CardName;
  password: string;
}

export interface CreateCardResponse {
  success: boolean;
  card: {
    id: string;
    cardName: CardName;
    walletNumber: string;
    payerName: string;
    cardNumber: string;
    isActive: boolean;
    createdAt: string;
  };
}
export interface ActiveCard {
  id: string;
  cardName: CardName;
  cardNumber: string;
  walletNumber: string;
  payerName: string;
  createdAt: string;
}
export const cardsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserStatus: builder.query<UserStatusResponse, void>({
      query: () => "/api/card/status",
      providesTags: ["UserStatus"],
    }),
    createCard: builder.mutation<CreateCardResponse, CreateCardRequest>({
      query: (body) => ({
        url: "/api/card",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserStatus"],
    }),
    getCards: builder.query<{ cards: ActiveCard[] }, void>({
      query: () => "/api/card",
      providesTags: ["card"],
    }),
  }),
});

export const { useCreateCardMutation, useGetUserStatusQuery, useGetCardsQuery } =
  cardsApi;
