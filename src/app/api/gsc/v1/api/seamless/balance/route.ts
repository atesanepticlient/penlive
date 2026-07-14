import { db } from "@/lib/db";
import { generateGSCPlatformSignature } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import pMap from "p-map";

type BatchRequest = {
  member_account: string;
  product_code: number;
};

type BalanceResponse = {
  member_account: string;
  code: number;
  message: string;
  balance: number;
  product_code: number;
};

export async function POST(req: NextRequest) {
  try {
    let body: {
      operator_code: string;
      currency: string;
      sign: string;
      request_time: string;
      batch_requests: BatchRequest[];
    };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          code: 999,
          message: "Invalid JSON body",
        },
        { status: 200 },
      );
    }

    const { operator_code, currency, sign, request_time, batch_requests } =
      body;

    if (
      !operator_code ||
      !currency ||
      !sign ||
      !request_time ||
      !Array.isArray(batch_requests)
    ) {
      return NextResponse.json(
        {
          code: 999,
          message: "Invalid Parameters",
        },
        { status: 200 },
      );
    }

    const isValidRequests = batch_requests.every(
      (item) =>
        typeof item.member_account === "string" &&
        typeof item.product_code === "number",
    );

    if (!isValidRequests) {
      return NextResponse.json(
        {
          code: 999,
          message: "Invalid Parameters",
        },
        { status: 200 },
      );
    }

    let responseData: BalanceResponse[] = batch_requests.map((item) => ({
      member_account: item.member_account,
      product_code: item.product_code,
      code: 0,
      message: "",
      balance: 0,
    }));

    const MEMBER_OP_CODE = process.env.GSC_OPERATOR_CODE!;
    const SECRET_KEY = process.env.GSC_SECRET_KEY!;

    if (operator_code !== MEMBER_OP_CODE) {
      responseData = responseData.map((entry) => ({
        ...entry,
        code: 999,
        message: "Invalid Operator code",
      }));

      return NextResponse.json({ data: responseData }, { status: 200 });
    }

    const platformSign = generateGSCPlatformSignature(
      request_time,
      SECRET_KEY,
      MEMBER_OP_CODE,
      "getbalance",
    );

    if (platformSign !== sign) {
      responseData = responseData.map((entry) => ({
        ...entry,
        code: 1004,
        message: "API signature is invalid",
      }));

      return NextResponse.json({ data: responseData }, { status: 200 });
    }

    // Uncomment if you only support BDT
    // if (currency !== "BDT") {
    //   responseData = responseData.map((entry) => ({
    //     ...entry,
    //     code: 999,
    //     message: "Currency is not supported",
    //   }));
    //
    //   return NextResponse.json({ data: responseData }, { status: 200 });
    // }

    responseData = await pMap(responseData, async (entry) => {
      const user = await db.user.findFirst({
        where: {
          phone: entry.member_account,
        },
        select: {
          wallet: {
            select: {
              balance: true,
            },
          },
        },
      });

      if (!user) {
        return {
          ...entry,
          code: 1000,
          message: "API member does not exist",
        };
      }

      return {
        ...entry,
        code: 0,
        message: "",
        // IMPORTANT: return a NUMBER, not a string
        balance: Number(Number(user.wallet.balance).toFixed(4)),
      };
    });

    return NextResponse.json(
      {
        data: responseData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("ERROR ON GET_BALANCE API:", error);

    return NextResponse.json(
      {
        code: 999,
        message: "Internal server error",
      },
      { status: 200 },
    );
  }
}
