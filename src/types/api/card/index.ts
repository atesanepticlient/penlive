import type { Prisma } from "@prisma/client";

export interface CreateCardInput {
  walletNumber: string;
  password: string;
  paymentWalletId: string;
}

export interface CreateNewCardInput {
  walletNumber: string;
  password: string;
  ownerName: string;
  paymentWalletId: string;
}

// 1. Include paymentWallet (or whichever relation actually exists on Card)
export type ExtendedCard = Prisma.CardGetPayload<any>;

// 2. Output structure containing array of cards
export interface CardOutput {
  cards: ExtendedCard[];
}

export interface CreateCardOutput {
  message: string;
  card: ExtendedCard;
}
