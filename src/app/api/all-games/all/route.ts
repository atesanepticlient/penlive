import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brand_id");

    if (!brandId) {
      return NextResponse.json(
        { status: false, message: "brand_id required" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `https://igamingapis.com/provider/brands.php?brand_id=${brandId}`,
      { cache: "no-store" },
    );

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch {
    return NextResponse.json(
      { status: false, message: "Failed to fetch brand games" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
