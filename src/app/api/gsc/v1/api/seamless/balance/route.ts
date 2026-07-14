import { db } from "@/lib/db";
import { generateGSCPlatformSignature } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import pMap from "p-map";

export const POST = async (req: NextRequest) => {
  try {
    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { code: 999, message: "Invalid JSON body" },
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
      !batch_requests
    ) {
      return NextResponse.json(
        { message: "Invalid Parameters", code: 999 },
        { status: 200 },
      );
    }

    const isValidRequests =
      Array.isArray(batch_requests) &&
      batch_requests.every((item) => {
        const keys = Object.keys(item);

        return (
          keys.length === 2 &&
          keys.includes("member_account") &&
          keys.includes("product_code") &&
          typeof item.member_account === "string" &&
          typeof item.product_code === "number"
        );
      });

    if (!isValidRequests) {
      return NextResponse.json(
        { message: "Invalid Parameters", code: 999 },
        { status: 200 },
      );
    }

    let responseData = batch_requests.map((reqItem) => {
      return {
        member_account: reqItem.member_account,
        code: 0,
        message: "",
        balance: 0,
        product_code: reqItem.product_code,
      };
    });

    const MEMBER_OP_CODE = process.env.GSC_OPERATOR_CODE;
    const SECRET_KEY = process.env.GSC_SECRET_KEY;

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

    // if (currency !== "BDT") {
    //   responseData = responseData.map((entry) => ({
    //     ...entry,
    //     code: 999,
    //     message: "Currency is not supported",
    //   }));

    //   return NextResponse.json({ data: responseData }, { status: 200 });
    // }

    responseData = await pMap(responseData, async (entry: any) => {
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
        balance: Number(user.wallet.balance).toFixed(4),
      };
    });

    return NextResponse.json({ data: responseData }, { status: 200 });
  } catch (error) {
    console.log("ERROR ON GET_BALANCE API", error);

    return NextResponse.json(
      { code: 999, message: "Internal server error" },
      { status: 200 },
    );
  }
};
