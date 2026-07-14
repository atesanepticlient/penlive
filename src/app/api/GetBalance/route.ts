// import { db } from "@/lib/db";  
// import { NextRequest } from "next/server";

// export const POST = async (req: NextRequest) => {
//   try {
  
//     const { CompanyKey, Username, ProductType, GameType } = await req.json();

   
//     if (!CompanyKey || !Username || !ProductType || !GameType) {
//       return new Response(
//         JSON.stringify({
//           ErrorCode: 1,
//           ErrorMessage: "Missing required fields",
//         }),
//         { status: 400 }
//       );
//     }

  
//     const user = await db.user.findUnique({
//       where: { playerId: Username },
//       include: { wallet: true },
//     });

    
//     if (!user) {
//       return new Response(
//         JSON.stringify({
//           ErrorCode: 2,
//           ErrorMessage: "User does not exist",
//         }),
//         { status: 200 }
//       );
//     }

 
//     const balance = user.wallet?.balance || 0;

//     // Prepare the response body
//     const responseBody = {
//       AccountName: user.playerId,  // Assuming playerId is the username
//       Balance: balance,
//       ErrorCode: 0,  // No error
//       ErrorMessage: "No error",
//     };

//     // Return the response in the required format
//     return new Response(JSON.stringify(responseBody), {
//       headers: { "Content-Type": "application/json; charset=UTF-8" },
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error fetching balance:", error);

   
//     return new Response(
//       JSON.stringify({
//         ErrorCode: 3,
//         ErrorMessage: "Internal server error",
//       }),
//       { status: 500 }
//     );
//   }
// };




import { db } from "@/lib/db";  // Import your Prisma instance
import { NextRequest } from "next/server";

// Public API to fetch member balance for 'YourDomain/GetBalance'
export const POST = async (req: NextRequest) => {
  try {
    // Parse the request body to get the CompanyKey and Username
    const { CompanyKey, Username } = await req.json();

    // Validate the incoming request for required fields (CompanyKey and Username)
    if (!CompanyKey || !Username) {
      return Response.json(
        { ErrorCode: 1, ErrorMessage: "Missing CompanyKey or Username" },
        { status: 400 }
      );
    }

    // For now, just validate if the provided CompanyKey matches the expected one
    const expectedCompanyKey = "7b277d9ad9f146a591a6d40bf4290d62c65bf0bcda32b50404a011733cfb7b1e";
    if (CompanyKey !== expectedCompanyKey) {
      return Response.json(
        { ErrorCode: 2, ErrorMessage: "Invalid CompanyKey" },
        { status: 401 }
      );
    }

    // Fetch the user from the database
    const user = await db.user.findUnique({
      where: { playerId: Username },  // Match using playerId
      include: { wallet: true },      // Include the associated wallet data
    });

    // If the user doesn't exist, return an error response
    if (!user) {
      return Response.json(
        { ErrorCode: 3, ErrorMessage: "Member not found" },
        { status: 404 }
      );
    }

    // If the wallet doesn't exist, handle that case as well
    if (!user.wallet) {
      return Response.json(
        { ErrorCode: 4, ErrorMessage: "Wallet not found" },
        { status: 404 }
      );
    }

    // Return the user account name and balance in the response
    return Response.json({
      AccountName: user.name,
      Balance: user.wallet.balance.toFixed(5),  // Format balance to 5 decimal places
      ErrorCode: "0",
      ErrorMessage: "No Error",
    });
  } catch  {
    // Handle any internal errors
    return Response.json(
      { ErrorCode: 7, ErrorMessage: "Internal Error" },
      { status: 500 }
    );
  }
};
