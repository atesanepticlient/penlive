import { db } from "@/lib/db";  // Ensure db is properly set up with Prisma
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Extract fields from the request body
    const {
      TransferCode,
      WinLoss,
      ResultType,
      ResultTime,
   
      Username,
      ProductType,
      GameType,
   
    } = await req.json();

    // Validate required fields
    if (!TransferCode || !Username || !ProductType || !GameType || WinLoss === undefined || !ResultType || !ResultTime) {
      return new Response(
        JSON.stringify({
          ErrorCode: 1,
          ErrorMessage: "Missing required fields",
        }),
        { status: 400 }
      );
    }

    // Fetch the bet from the database based on TransferCode and TransactionId
    const bet = await db.bet.findFirst({
      where: {
        transferCode: TransferCode,
        transactionId: Username,  // Assuming Username is used as TransactionId
      },
    });

    // If the bet is not found
    if (!bet) {
      return new Response(
        JSON.stringify({
          ErrorCode: 2,
          ErrorMessage: "Bet not found",
        }),
        { status: 200 }
      );
    }

    // Check if it's a resettle or initial settle
    let newStatus: "RUNNING" | "SETTLED" = "SETTLED";

    // If the bet is already settled, we are handling a resettle, so we first roll it back to running
    if (bet.status === "SETTLED") {
      // Rollback: Change status back to running
      await db.bet.update({
        where: {
          id: bet.id,  // Using the `id` for update since it's the unique identifier
        },
        data: {
          status: "RUNNING",  // Rollback to running
          result: null,  // Clear any previous result
          winloss: null,  // Reset win/loss value
        },
      });

      // Now, proceed with resettling the bet
      newStatus = "SETTLED";
    } else if (bet.status !== "RUNNING") {
      return new Response(
        JSON.stringify({
          ErrorCode: 3,
          ErrorMessage: "Bet cannot be settled as it is not in RUNNING status",
        }),
        { status: 200 }
      );
    }

    // Update the bet status and win/loss result based on the provided WinLoss and ResultType
    let betResult: "WON" | "LOST" | "TIE" | "VOID" = "VOID";  // Default to VOID if no valid result is provided

    // Determine the result based on ResultType
    if (ResultType === 1) {
      betResult = WinLoss > 0 ? "WON" : "LOST";
    }

    // Update the bet status to settled and record the win/loss
     await db.bet.update({
      where: {
        id: bet.id, // Using bet's unique id for update
      },
      data: {
        status: newStatus,
        result: betResult,  // Set the result as a valid enum value
        winloss: WinLoss,
      },
    });

    // If the user won the bet, update their wallet balance (if needed)
    if (betResult === "WON") {
      const user = await db.user.findUnique({
        where: { playerId: Username },
        include: { wallet: true },
      });

      if (!user || !user.wallet) {
        return new Response(
          JSON.stringify({
            ErrorCode: 5,
            ErrorMessage: "User or wallet not found",
          }),
          { status: 500 }
        );
      }

      const newBalance = user.wallet.balance + WinLoss;

      // Update the user's wallet balance
      await db.wallet.update({
        where: { userId: user.id },
        data: { balance: newBalance },
      });
    }

    // Prepare the response body
    const responseBody = {
      ErrorCode: 0,
      ErrorMessage: "Bet settled successfully",
    };

    // Return the response in the required format
    return new Response(JSON.stringify(responseBody), {
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      status: 200,
    });
  } catch (error) {
    console.error("Error settling bet:", error);

    // In case of an internal error
    return new Response(
      JSON.stringify({
        ErrorCode: 6,
        ErrorMessage: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
