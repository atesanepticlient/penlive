import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://igamingapis.com/provider", {
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch  {
    return NextResponse.json(
      { status: false, message: "Failed to fetch providers" },
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
