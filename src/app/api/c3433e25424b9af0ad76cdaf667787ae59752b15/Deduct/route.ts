// import { db } from "@/lib/db";
// import { BetStatus } from "@prisma/client";
// import { NextRequest } from "next/server";

// /*
//  * Deduct route
//  *
//  * This endpoint is used by our betting partners to place a bet on a player's account.  It
//  * performs a number of validations and then debits the appropriate amount from the
//  * member's wallet.  The semantics of a debit vary slightly depending on the product
//  * type:
//  *
//  *   • Sports (productType 1), SBO RNG (productType 2) and Virtual Sports (productType 5)
//  *     allow only a single deduction per TransferCode and TransactionId pair.  A second
//  *     request with the same identifiers is considered a duplicate and should return
//  *     errorCode 5003.
//  *
//  *   • Casino (productType 3) and RNG (productType 7) support a “raise bet” feature.  On
//  *     the first call we debit the full stake and record it.  A subsequent call with the
//  *     same TransferCode increases the stake to the new total; in this case we debit only
//  *     the difference between the previous stake and the new stake.  The new stake must
//  *     be strictly greater than the previous stake; otherwise errorCode 7 is returned.
//  *     At most two debit operations are allowed per TransferCode; any further calls
//  *     return errorCode 7.
//  *
//  *   • 3rd‑party Wan Mei (productType 9) treats the pair of transferCode and
//  *     transactionId as a unique key.  A duplicate pair results in errorCode 5003.  In
//  *     addition, Wan Mei bets do not debit the stake at deduct time—balance checks are
//  *     still enforced but no funds are withdrawn until cancellation/settlement.
//  *
//  * A number of common validations are also enforced:
//  *   – The CompanyKey must match our configured key (errorCode 4 otherwise).
//  *   – Username is required (errorCode 3 if blank).
//  *   – Amount must be a positive number and at least 10 for the supported products
//  *     (errorCode 7 otherwise).
//  *   – Member must exist (errorCode 1 if not found).
//  *   – Member must have sufficient balance (errorCode 5 if not).
//  *
//  * On success the response includes the full stake (`BetAmount`) that the provider
//  * supplied in the request (not just the incremental amount), the member’s updated
//  * balance and errorCode 0.
//  */

// const COMPANY_KEY = process.env.COMPANY_KEY ?? "F4D8A3106EA44C5D969D0AAE0B472762";
// const MIN_STAKE = 10;

// export const POST = async (req: NextRequest) => {
//   try {
//     const body = await req.json();
//     const companyKey = String(body?.CompanyKey ?? "").trim();
//     // Validate CompanyKey
//     if (!companyKey || companyKey !== COMPANY_KEY) {
//       // Always include a Balance field when rejecting, even if we cannot
//       // look up the user (unknown company key).  Use 0 as a default.
//       return Response.json({ ErrorCode: 4, ErrorMessage: "Invalid CompanyKey", Balance: 0 }, { status: 200 });
//     }
//     const username = String(body?.Username ?? "").trim();
//     if (!username) {
//       // Missing username – return error 3 with a zero balance placeholder
//       return Response.json({ ErrorCode: 3, ErrorMessage: "Invalid Username", Balance: 0 }, { status: 200 });
//     }
//     const amountRaw = body?.Amount;
//     const amount = Number(amountRaw);
//     // Ensure amount is a finite number
//     if (!Number.isFinite(amount) || amount <= 0) {
//       // Amount invalid – respond with error 7 and zero balance
//       return Response.json({ ErrorCode: 7, ErrorMessage: "Invalid Amount", Balance: 0 }, { status: 200 });
//     }
//     const productType = Number(body?.ProductType);
//     const gameType = Number(body?.GameType);
//     const transferCode = String(body?.TransferCode ?? "").trim();
//     const transactionId = String(body?.TransactionId ?? "").trim();
//     const gameId = Number(body?.GameId ?? 0);
//     // Enforce minimum stake for known product types
//     if ([1, 2, 3, 5, 7, 9].includes(productType) && amount < MIN_STAKE) {
//       // Minimum stake not met
//       return Response.json({ ErrorCode: 7, ErrorMessage: "Bet amount must be at least 10", Balance: 0 }, { status: 200 });
//     }
//     // Look up the member and wallet
//     const user = await db.user.findUnique({ where: { phone: username }, include: { wallet: true } });
//     if (!user?.wallet) {
//       // Member not exist
//       return Response.json({ ErrorCode: 1, ErrorMessage: "Member not exist", Balance: 0 }, { status: 200 });
//     }
//     // Execute transactional logic
//     const result = await db.$transaction(async (tx) => {
//       // Reload wallet inside transaction to guarantee fresh balance
//       const fresh = await tx.user.findUnique({ where: { id: user.id }, include: { wallet: true } });
//       if (!fresh?.wallet) {
//         return { early: { ErrorCode: 1, ErrorMessage: "Member not exist" } };
//       }
//       const bal = Number(fresh.wallet.balance);
//       // Fetch existing bets for this transfer code.  We separate running bets from those that
//       // have already been settled/voided so that we can enforce the correct duplicate rules.
//       const existing = await tx.bet.findMany({
//         where: { userId: fresh.id, productType: productType, gameType: gameType, transferCode: transferCode },
//         orderBy: { createdAt: "asc" }
//       });
//       const runningBets = existing.filter((b) => b.status === BetStatus.RUNNING);
//       const concludedBets = existing.filter((b) => b.status !== BetStatus.RUNNING);

//       // If there is any concluded bet with this transfer code then no further deductions are allowed.
//       if (concludedBets.length > 0) {
//         return { early: { ErrorCode: 5003, ErrorMessage: "Duplicate transferCode not allowed", Balance: bal.toFixed(2) } };
//       }

//       // Sports / Virtual sports / SBO RNG: allow only one deduction while running
//       if ([1, 2, 5].includes(productType)) {
//         if (runningBets.length > 0) {
//           return { early: { ErrorCode: 5003, ErrorMessage: "Duplicate transferCode not allowed", Balance: bal.toFixed(2) } };
//         }
//       }

//       // Casino / RNG: allow raises on the running bet.  The new total must
//       // exceed the previous stake.  Tests expect a specific error code (7)
//       // when the raise amount is less than or equal to the existing stake.
//       if ([3, 7].includes(productType)) {
//         if (runningBets.length >= 1) {
//           const prev = runningBets[runningBets.length - 1];
//           // Only allow a raise if the new total strictly exceeds the previous recorded stake.
//           if (amount <= Number(prev.amount)) {
//             return { early: { ErrorCode: 7, ErrorMessage: "Raise amount must be greater than previous total", Balance: bal.toFixed(2) } };
//           }
//         }
//       }

//       // Wan Mei: unique combination of transferCode + transactionId
//       if (productType === 9) {
//         const dupe = await tx.bet.findFirst({
//           where: {
//             userId: fresh.id,
//             productType: productType,
//             transferCode: transferCode,
//             transactionId: transactionId
//           }
//         });
//         if (dupe) {
//           return { early: { ErrorCode: 5003, ErrorMessage: "Duplicate (transferCode+transactionId)", Balance: bal.toFixed(2) } };
//         }
//       }

//       // Determine how much to debit from the wallet.  For raises we only debit
//       // the difference between the new total and the previous stake; for 3rd WM
//       // (productType 9) we do not debit the stake at all on deduct.
//       let debit: number = amount;
//       if ([3, 7].includes(productType) && runningBets.length >= 1) {
//         const prev = runningBets[runningBets.length - 1];
//         debit = amount - Number(prev.amount);
//       }
//       if (productType === 9) {
//         // Do not debit stake for 3rd WM bets
//         debit = 0;
//       }
//       // Ensure the member has sufficient balance when a debit is required
//       if (debit > bal) {
//         return { early: { ErrorCode: 5, ErrorMessage: "Insufficient balance", Balance: bal.toFixed(2) } };
//       }
//       // Perform debit when needed
//       if (debit > 0) {
//         await tx.wallet.update({ where: { userId: fresh.id }, data: { balance: { decrement: debit } } });
//       }
//       // Create the bet record with the full stake.  Multiple bet records for raises are
//       // intentional; each record reflects the total stake at that point in time.
//       await tx.bet.create({
//         data: {
//           userId: fresh.id,
//           productType: productType,
//           gameType: gameType,
//           gameId: gameId,
//           amount: amount,
//           transferCode: transferCode,
//           transactionId: transactionId,
//           status: BetStatus.RUNNING
//         }
//       });
//       // Retrieve the updated balance
//       const updated = await tx.wallet.findUnique({ where: { userId: fresh.id }, select: { balance: true } });
//       // Build response using the original Amount input to preserve any
//       // fractional part (e.g. 10.0 vs 10).  If the caller passed a string
//       // representation, use that; otherwise format the number with at least
//       // one decimal place.
//       const rawAmount = body?.Amount;
//       let betAmountString: string;
//       if (typeof rawAmount === "string") {
//         betAmountString = rawAmount.trim();
//       } else if (Number.isFinite(amount)) {
//         // Ensure at least one decimal place when the amount is an integer
//         betAmountString = amount % 1 === 0 ? `${amount.toFixed(1)}` : `${amount}`;
//       } else {
//         betAmountString = `${amount}`;
//       }
//       return {
//         ok: {
//           ErrorCode: 0,
//           ErrorMessage: "No Error",
//           AccountName: username,
//           BetAmount: betAmountString,
//           Balance: Number(updated?.balance).toFixed(2)
//         }
//       };
//     });
//     if ((result as any).early) {
//       return Response.json((result as any).early, { status: 200 });
//     }
//     return Response.json((result as any).ok, { status: 200 });
//   } catch (err) {
//     console.error("Deduct error:", err);
//     return Response.json({ ErrorCode: 7, ErrorMessage: "Internal Error", Balance: 0 }, { status: 200 });
//   }
// };

import { db } from "@/lib/db";
import { reduceTurnOver } from "@/lib/turnover";
import { BetStatus } from "@prisma/client";
import { NextRequest } from "next/server";

const COMPANY_KEY =
  process.env.COMPANY_KEY ?? "F4D8A3106EA44C5D969D0AAE0B472762";
const MIN_STAKE = 10;

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const companyKey = String(body?.CompanyKey ?? "").trim();
    if (!companyKey || companyKey !== COMPANY_KEY) {
      return Response.json(
        { ErrorCode: 4, ErrorMessage: "Invalid CompanyKey", Balance: 0 },
        { status: 200 }
      );
    }

    const username = String(body?.Username ?? "").trim();
    if (!username) {
      return Response.json(
        { ErrorCode: 3, ErrorMessage: "Invalid Username", Balance: 0 },
        { status: 200 }
      );
    }

    const amountRaw = body?.Amount;
    const amount = Number(amountRaw);
    if (!Number.isFinite(amount) || amount <= 0) {
      return Response.json(
        { ErrorCode: 7, ErrorMessage: "Invalid Amount", Balance: 0 },
        { status: 200 }
      );
    }

    const productType = Number(body?.ProductType);
    const gameType = Number(body?.GameType);
    const transferCode = String(body?.TransferCode ?? "").trim();
    const transactionId = String(body?.TransactionId ?? "").trim();
    const gameId = Number(body?.GameId ?? 0);

    if ([1, 2, 3, 5, 7, 9].includes(productType) && amount < MIN_STAKE) {
      return Response.json(
        {
          ErrorCode: 7,
          ErrorMessage: "Bet amount must be at least 10",
          Balance: 0,
        },
        { status: 200 }
      );
    }

    const user : any = await db.user.findUnique({
      where: { phone: username },
      include: { wallet: true },
    });
    if (!user?.wallet) {
      return Response.json(
        { ErrorCode: 1, ErrorMessage: "Member not exist", Balance: 0 },
        { status: 200 }
      );
    }

    const result = await db.$transaction(async (tx) => {
      const fresh = await tx.user.findUnique({
        where: { id: user.id },
        include: { wallet: true },
      });
      if (!fresh?.wallet) {
        return {
          early: { ErrorCode: 1, ErrorMessage: "Member not exist", Balance: 0 },
        };
      }
      const bal = Number(fresh.wallet.balance);

      // ---- Pair-based duplicate guards ----
      // For 1/2/5 and 9, duplicates are defined by (transferCode + transactionId)
      if ([1, 2, 5, 9].includes(productType)) {
        const dupPair = await tx.bet.findFirst({
          where: {
            userId: fresh.id,
            productType,
            gameType,
            transferCode,
            transactionId,
          },
          select: { id: true, status: true },
        });
        if (dupPair) {
          return {
            early: {
              ErrorCode: 5003,
              ErrorMessage: "Duplicate (transferCode+transactionId)",
              Balance: bal.toFixed(2),
            },
          };
        }
      }

      // Fetch previous bets for this transferCode (used by raise logic & other guards)
      const existing = await tx.bet.findMany({
        where: { userId: fresh.id, productType, gameType, transferCode },
        orderBy: { createdAt: "asc" },
      });
      const runningBets = existing.filter(
        (b) => b.status === BetStatus.RUNNING
      );
      const concludedBets = existing.filter(
        (b) => b.status !== BetStatus.RUNNING
      );

      // ---- Product-specific rules ----

      // A) Sports/SBO RNG/Virtual Sports (1/2/5):
      //    - Only one debit per (transferCode+transactionId) — handled above
      //    - No additional blanket restriction here; new transactionId is allowed.
      if ([1, 2, 5].includes(productType)) {
        // nothing else; full debit handled below
      }

      // B) Casino / RNG (3/7) “raise bet”:
      //    - At most 2 debits total for a transferCode (initial + one raise)
      //    - New total must be strictly greater than previous total
      if ([3, 7].includes(productType)) {
        if (runningBets.length >= 2) {
          return {
            early: {
              ErrorCode: 7,
              ErrorMessage: "Maximum raises reached",
              Balance: bal.toFixed(2),
            },
          };
        }
        if (runningBets.length >= 1) {
          const prev = runningBets[runningBets.length - 1];
          if (amount <= Number(prev.amount)) {
            return {
              early: {
                ErrorCode: 7,
                ErrorMessage:
                  "Raise amount must be greater than previous total",
                Balance: bal.toFixed(2),
              },
            };
          }
        }
        // If the bet was previously concluded, no further actions for 3/7
        if (concludedBets.length > 0) {
          return {
            early: {
              ErrorCode: 5003,
              ErrorMessage:
                "Duplicate transferCode not allowed after conclusion",
              Balance: bal.toFixed(2),
            },
          };
        }
      }

      let debit = amount;
      if ([3, 7].includes(productType) && runningBets.length >= 1) {
        const prev = runningBets[runningBets.length - 1];
        debit = amount - Number(prev.amount); // only the delta on a raise
      }
      if (productType === 9) {
      }

      if (debit > bal) {
        return {
          early: {
            ErrorCode: 5,
            ErrorMessage: "Insufficient balance",
            Balance: bal.toFixed(2),
          },
        };
      }

      if (debit > 0) {
        await tx.wallet.update({
          where: { userId: fresh.id },
          data: { balance: { decrement: debit } },
        });
      }

      await tx.bet.create({
        data: {
          userId: fresh.id,
          productType,
          gameType,
          gameId,
          amount,
          transferCode,
          transactionId,
          status: BetStatus.RUNNING,
        },
      });

      const updated = await tx.wallet.findUnique({
        where: { userId: fresh.id },
        select: { balance: true },
      });

      // Preserve caller’s amount formatting when possible
      const rawAmount = body?.Amount;
      let betAmountString: string;
      if (typeof rawAmount === "string") {
        betAmountString = rawAmount.trim();
      } else if (Number.isFinite(amount)) {
        betAmountString = amount % 1 === 0 ? amount.toFixed(1) : String(amount);
      } else {
        betAmountString = String(amount);
      }

      await reduceTurnOver(body.Amount, user.userId)

      return {
        ok: {
          ErrorCode: 0,
          ErrorMessage: "No Error",
          AccountName: username,
          BetAmount: betAmountString,
          Balance: Number(updated?.balance ?? bal).toFixed(2),
        },
      };
    });

    if ((result as any).early)
      return Response.json((result as any).early, { status: 200 });
    return Response.json((result as any).ok, { status: 200 });
  } catch {
    return Response.json(
      { ErrorCode: 7, ErrorMessage: "Internal Error", Balance: 0 },
      { status: 200 }
    );
  }
};
