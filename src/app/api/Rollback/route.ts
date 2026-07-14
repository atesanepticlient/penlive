import { db } from "@/lib/db";  // Ensure db is properly set up with Prisma
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Extract fields from the request body
    const {
      CompanyKey,
      Username,
      TransferCode,
      ProductType,
      GameType,
    } = await req.json();

    // Validate required fields
    if (!CompanyKey || !Username || !TransferCode || !ProductType || !GameType) {
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
        userId: Username,  // Assuming Username is used for user identification
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

    // Check if the bet is already in settled state before proceeding with the rollback
    if (bet.status !== "SETTLED") {
      return new Response(
        JSON.stringify({
          ErrorCode: 3,
          ErrorMessage: "Bet cannot be rolled back as it is not in SETTLED status",
        }),
        { status: 200 }
      );
    }

    // Perform the rollback by changing the bet status back to running
    await db.bet.update({
      where: {
        id: bet.id,  // Using the unique `id` for update
      },
      data: {
        status: "RUNNING",  // Rollback the bet to running
        result: null,  // Clear any previous result
        winloss: null,  // Reset win/loss value
      },
    });

    // Prepare the response body
    const responseBody = {
      ErrorCode: 0,
      ErrorMessage: "Bet successfully rolled back to running state",
    };

    // Return the response in the required format
    return new Response(JSON.stringify(responseBody), {
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      status: 200,
    });
  } catch (error) {
    console.error("Error rolling back bet:", error);

    // In case of an internal error
    return new Response(
      JSON.stringify({
        ErrorCode: 4,
        ErrorMessage: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
