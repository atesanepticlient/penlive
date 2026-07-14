import { findCurrentUser } from "@/data/user";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { AirDropName } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  try {
    const AIRDROP_NAME = req.nextUrl.searchParams.get("airdrop") || "";
    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const airDrop = await db.airDropEvent.findUnique({
      where: {
        name: AirDropName[AIRDROP_NAME as keyof typeof AirDropName],
      },
    });

    if (!airDrop)
      return NextResponse.json(
        { error: "Likely The AirDrop was expired!" },
        { status: 389 },
      );

    const airdropUserStatus = (
      await db.airDrop.findMany({
        where: {
          userId: user.id,
        },
        include: {
          airDrop: true,
        },
      })
    ).find((data) => data.airDropId == airDrop.id);

    return NextResponse.json(
      { payload: { airdropUserStatus } },
      { status: 200 },
    );
  } catch  {
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const AIRDROP_ID = req.nextUrl.searchParams.get("airdrop") || "";

    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const airDropUserStatus = await db.airDrop.findUnique({
      where: { id: AIRDROP_ID },
      include: { airDrop: true },
    });

    if (airDropUserStatus.status == "CLAIMED") {
      return NextResponse.json(
        { error: "AirDrop already claimed" },
        { status: 403 },
      );
    }

    if (airDropUserStatus.prizeCliamed < airDropUserStatus.airDrop.prize) {
      return NextResponse.json({ error: "Get the ticket" });
    }

    if (!airDropUserStatus) {
      return NextResponse.json(
        { error: "AirDrop Not Found!" },
        { status: 404 },
      );
    }

    await db.$transaction([
      db.wallet.update({
        where: { userId: user.id },
        data: {
          balance: { increment: airDropUserStatus.airDrop.prize },
          turnOver: { increment: +airDropUserStatus.airDrop.prize * 2 },
        },
      }),
      db.airDrop.update({
        where: { id: airDropUserStatus.id },
        data: { status: "CLAIMED" },
      }),
    ]);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch  {
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const AIRDROP_NAME = req.nextUrl.searchParams.get("airdrop") || "";

    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const airDrop = await db.airDropEvent.findUnique({
      where: {
        name: AirDropName[AIRDROP_NAME as keyof typeof AirDropName],
      },
    });

    if (!airDrop)
      return NextResponse.json(
        { error: "Likely The AirDrop was expired!" },
        { status: 389 },
      );

    await db.airDrop.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        airDrop: {
          connect: {
            id: airDrop.id,
          },
        },
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch  {
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
};
