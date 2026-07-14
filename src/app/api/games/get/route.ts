// app/api/games/route.ts

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const BASE_URL = process.env.GSC_BASE_URL!;
const OPERATOR_CODE = process.env.GSC_OPERATOR_CODE!;
const SECRET_KEY = process.env.GSC_SECRET_KEY!;

function generateSign(request_time: string, name: string) {
  const raw = `${request_time}${SECRET_KEY}${name}${OPERATOR_CODE}`;
  return crypto.createHash("md5").update(raw).digest("hex");
}

function shuffle(array: any[]) {
  return array.sort(() => Math.random() - 0.5);
}

const GAME_LIST_TIME_CODE = "100";
const PRODUCT_LIST_TIME_CODE = "200";

const GAME_LIST_SIGN_KEY = "gamelist";
const PRODUCT_LIST_SIGN_KEY = "product list";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const productParam = searchParams.get("product_code") || "all";
    const size = parseInt(searchParams.get("size") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const signForGamesList = generateSign(
      GAME_LIST_TIME_CODE,
      GAME_LIST_SIGN_KEY,
    );

    const allGames: any[] = [];

    // ✅ CASE 1: SINGLE PRODUCT
    if (productParam !== "all") {
      const params = new URLSearchParams({
        operator_code: OPERATOR_CODE,
        request_time: GAME_LIST_TIME_CODE,
        sign: signForGamesList,
        product_code: productParam,
        size: size.toString(),
        offset: offset.toString(),
      });

      const res = await fetch(
        `${BASE_URL}/api/operators/provider-games?${params}`,
        { signal: AbortSignal.timeout(100000) },
      );

      if (!res.ok) {
        throw new Error(`Upstream error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log({ games: data });

      return NextResponse.json({
        success: true,
        data: data?.provider_games || [],
      });
    }

    // ✅ CASE 2: ALL PRODUCTS

   generateSign(
      PRODUCT_LIST_TIME_CODE,
      PRODUCT_LIST_SIGN_KEY,
    );

    // STEP 1: GET PRODUCT LIST
    const productParams = new URLSearchParams({
      operator_code: OPERATOR_CODE,
      request_time: "10",
      sign: "3e33c6c36b55bf6890febbbabf2e44a2",
    });

    const productRes = await fetch(
      `${BASE_URL}/api/operators/available-products?${productParams}`,
      { signal: AbortSignal.timeout(100000) },
    );

    if (!productRes.ok) {
      throw new Error(
        `Failed to fetch products: ${productRes.status} ${productRes.statusText}`,
      );
    }

    const productData = await productRes.json();
    console.log({ productData });
    const products = productData || [];

    // STEP 2: FETCH ALL PROVIDERS IN PARALLEL
    const results = await Promise.allSettled(
      products.map((product: any) => {
        const params = new URLSearchParams({
          operator_code: OPERATOR_CODE,
          request_time: GAME_LIST_TIME_CODE,
          sign: signForGamesList,
          product_code: String(product.product_code),
          size: "100",
          offset: "0",
        });

        return fetch(`${BASE_URL}/api/operators/provider-games?${params}`, {
          signal: AbortSignal.timeout(100000),
        }).then((r) => {
          if (!r.ok) {
            throw new Error(`Upstream error: ${r.status} ${r.statusText}`);
          }
          return r.json();
        });
      }),
    );

    for (const result of results) {
      if (result.status === "fulfilled" && result.value?.provider_games) {
        allGames.push(...result.value.provider_games);
      } else if (result.status === "rejected") {
        console.warn("Provider fetch failed:", result.reason);
      }
    }

    // STEP 3: RANDOMIZE
    const shuffled = shuffle(allGames);

    // STEP 4: PAGINATE
    const paginated = shuffled.slice(offset, offset + size);

    return NextResponse.json({
      success: true,
      total: shuffled.length,
      games: paginated,
    });
  } catch (error) {
    console.error("GET GAMES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch games",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
