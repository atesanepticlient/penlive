import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const {
      CompanyKey,
      ProductType,
      GameType,
      Username,
      Amount,
      TransferCode,
      TransactionId,
      BonusTime,
    } = await req.json();

    // Validate the request parameters
    if (
      !CompanyKey ||
      !ProductType ||
      !GameType ||
      !Username ||
      !Amount ||
      !TransferCode ||
      !TransactionId ||
      !BonusTime
    ) {
      return Response.json(
        { ErrorCode: 400, ErrorMessage: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Ensure Amount is valid
    if (Amount <= 0) {
      return Response.json(
        { ErrorCode: 4001, ErrorMessage: "Invalid amount provided" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { playerId: Username },
      include: { wallet: true },
    });

    if (!user) {
      return Response.json(
        { ErrorCode: 1, ErrorMessage: "User not found" },
        { status: 200 }
      );
    }

    // Update the user's wallet balance
    const updatedWallet = await db.wallet.update({
      where: { userId: user.id },
      data: {
        balance: {
          increment: Amount,
        },
      },
    });

    // Return success response
    return Response.json(
      {
        AccountName: user.name,
        Balance: updatedWallet.balance,
        ErrorCode: 0,
        ErrorMessage: "Bonus applied successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing bonus request:", error);
    return Response.json(
      { ErrorCode: 7, ErrorMessage: "Internal Error" },
      { status: 500 }
    );
  }
};
