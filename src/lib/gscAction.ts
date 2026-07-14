import { Prisma } from "@prisma/client";
import { db } from "./db";

export type ActionResult =
  | {
      success: false;
      code: number;
      message: string;
    }
  | {
      success: true;
      execute: (tx: Prisma.TransactionClient) => Promise<ActionResult | void>;
    };

export const errorResult = (code: number, message: string): ActionResult => ({
  success: false,
  code,
  message,
});

export const successResult = (
  execute: (tx: Prisma.TransactionClient) => Promise<ActionResult | void>,
): ActionResult => ({
  success: true,
  execute,
});

export const rollback = async ({
  id,
  userId,
  amount,
  betAmount,
}: {
  id: string;
  wagerCode?: string;
  roundId?: string;
  userId: string;
  amount: number;
  betAmount: number;
}): Promise<ActionResult> => {
  const existingBet = await db.bettingRecord.findFirst({
    where: {
      orderNo: id,
      status: "SETTLED",
    },
  });

  if (!existingBet) {
    return errorResult(1006, "API bet does not exist");
  }

  const type = amount > 0 ? "Positive" : amount < 0 ? "Negative" : "Zero";

  if (type === "Negative") {
    const wallet = await db.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || Number(wallet.balance) < Math.abs(amount)) {
      return errorResult(1001, "API member balance is insufficient");
    }
  }

  return successResult(async (tx) => {
    try {
      const updateWallet: Prisma.WalletUpdateInput = {};
      const updateBettingRecord: Prisma.BettingRecordUpdateInput = {};

      if (type === "Positive") {
        updateWallet.balance = { increment: amount };
        updateBettingRecord.profit = amount - betAmount;
        updateBettingRecord.loss = 0;
      } else {
        updateWallet.balance = { decrement: Math.abs(amount) };
        updateBettingRecord.profit = 0;
        updateBettingRecord.loss = Math.abs(amount) - betAmount;
      }

      await tx.wallet.update({
        where: { userId },
        data: updateWallet,
      });
      await tx.bettingRecord.update({
        where: { id: existingBet.id },
        data: updateBettingRecord,
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};

export const placeBet = async ({
  id,
  wagerCode,
  roundId,
  userId,
  amount,
  category,
  name,
}: {
  id: string;
  wagerCode: string;
  roundId: string;
  userId: string;
  amount: number;
  category: any;
  name: string;
}): Promise<ActionResult> => {
  const existingTrx = await db.bettingRecord.findFirst({
    where: {
      orderNo: id,
    },
  });

  if (existingTrx) {
    return errorResult(1003, "Duplicate API transactions");
  }

  const wallet = await db.wallet.findUnique({
    where: { userId },
  });

  if (!wallet || Number(wallet.balance) < amount) {
    return errorResult(1001, "API member balance is insufficient");
  }

  return successResult(async (tx) => {
    try {
      await tx.bettingRecord.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          orderNo: id,
          wagerCode,
          roundId,
          status: "RUNNING",
          betAmount: amount,
          category,
          name,
        },
      });
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};

export const getTip = async ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}): Promise<ActionResult> => {
  const wallet = await db.wallet.findUnique({
    where: { userId },
  });

  if (!wallet || Number(wallet.balance) < amount) {
    return errorResult(1001, "API member balance is insufficient");
  }

  return successResult(async (tx) => {
    try {
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};

export const cancelBet = async ({
  id,
  amount,
  userId,
}: {
  id: string;
  amount: number;
  userId: string;
}): Promise<ActionResult> => {
  const existingBet = await db.bettingRecord.findFirst({
    where: {
      orderNo: id,
      status: "RUNNING",
    },
  });

  if (!existingBet) {
    return errorResult(1006, "API bet does not exist");
  }

  return successResult(async (tx) => {
    try {
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
      await tx.bettingRecord.update({
        where: { id: existingBet.id },
        data: {
          status: "CANCELED",
        },
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};

export const adjustment = async ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}): Promise<ActionResult> => {
  const type = amount > 0 ? "Positive" : amount < 0 ? "Negative" : "Zero";

  if (type === "Negative") {
    const wallet = await db.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || Number(wallet.balance) < Math.abs(amount)) {
      return errorResult(1001, "API member balance is insufficient");
    }
  }

  return successResult(async (tx) => {
    try {
      const updateWallet: Prisma.WalletUpdateInput = {};

      if (type === "Positive") {
        updateWallet.balance = { increment: amount };
      } else {
        updateWallet.balance = { decrement: Math.abs(amount) };
      }

      await tx.wallet.update({
        where: { userId },
        data: updateWallet,
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};

export const freeBet = async ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}): Promise<ActionResult> => {
  return successResult(async (tx) => {
    try {
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
      await tx.notification.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          title: "Free bet Bonus",
          description: "You have received Freebet Bonus",
        },
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};

export const jackPot = async ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}): Promise<ActionResult> => {
  return successResult(async (tx) => {
    try {
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
      await tx.notification.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          title: "Jackpot Bonus",
          description: "You have received Jackpot Bonus",
        },
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};

export const bonus = async ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}): Promise<ActionResult> => {
  return successResult(async (tx) => {
    try {
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
      await tx.notification.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          title: "Bonus added",
          description: "You have Bonus",
        },
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};

export const promo = async ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}): Promise<ActionResult> => {
  return successResult(async (tx) => {
    try {
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
      await tx.notification.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          title: "Bonus added",
          description: "You have Bonus",
        },
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};

export const leaderboardReward = async ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}): Promise<ActionResult> => {
  return successResult(async (tx) => {
    try {
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
      await tx.notification.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          title: "Loaderboard reward",
          description: "You have Bonus",
        },
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};

export const settled = async ({
  id,
  roundId,
  amount,
  userId,
  betAmount,
}: {
  id: string;
  roundId: string;
  amount: number;
  userId: string;
  betAmount: number;
}): Promise<ActionResult> => {
  const existingBet = await db.bettingRecord.findFirst({
    where: {
      orderNo: id,
      roundId,
      status: "RUNNING",
    },
  });

  if (!existingBet) {
    return errorResult(1006, "API bet does not exist");
  }

  return successResult(async (tx) => {
    try {
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
      await tx.bettingRecord.update({
        where: {
          id: existingBet.id,
        },
        data: {
          status: "SETTLED",
          profit: amount - betAmount,
        },
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};

export const betPreserve = async ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}): Promise<ActionResult> => {
  const wallet = await db.wallet.findUnique({
    where: { userId },
  });

  if (!wallet || Number(wallet.balance) < amount) {
    return errorResult(1001, "API member balance is insufficient");
  }

  return successResult(async (tx) => {
    try {
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};

export const betPreserveRefund = async ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}): Promise<ActionResult> => {
  return successResult(async (tx) => {
    try {
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    } catch {
      return errorResult(999, "Internal Server Error");
    }
  });
};
