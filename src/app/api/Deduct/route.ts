import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Extract the required fields from the request body
    const {
      CompanyKey,
      Username,
      ProductType,
      GameType,
      GameId,
      Amount,
      TransferCode,
      TransactionId,
    } = await req.json();

    // Validate that the necessary fields are provided
    if (
      !CompanyKey ||
      !Username ||
      !ProductType ||
      !GameType ||
      !Amount ||
      !TransferCode ||
      !TransactionId
    ) {
      return Response.json(
        { ErrorCode: 400, ErrorMessage: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Fetch the user from the database
    const user = await db.user.findUnique({
      where: { playerId: Username },
      include: { wallet: true },
    });

    if (!user) {
      return Response.json(
        { ErrorCode: 1, ErrorMessage: "Member not exist" },
        { status: 200 }
      );
    }

    // Update the user's wallet balance and betting record
    const updatedWallet = await db.wallet.update({
      where: { userId: user.id },
      data: {
        balance: {
          decrement: Amount,
        },
      },
    });

    // Create a new bet record in the database
    await db.bet.create({
      data: {
        productType: ProductType,
        gameType: GameType,
        gameId: GameId,
        transferCode: TransferCode,
        transactionId: TransactionId,
        amount: Amount,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    await db.bettingRecord.create({
      data: {
        userId: user.id,
        betAmount: Amount,
        status: "RUNNING",
      },
    });

    // Return a successful response with the account information
    return Response.json(
      {
        AccountName: user.name,
        Balance: updatedWallet.balance,
        ErrorCode: 0,
        ErrorMessage: "No Error",
        BetAmount: Amount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing bet request:", error);
    return Response.json(
      { ErrorCode: 7, ErrorMessage: "Internal Error" },
      { status: 500 }
    );
  }
};
