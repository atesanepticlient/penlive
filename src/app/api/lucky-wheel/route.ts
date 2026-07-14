import { findCurrentUser } from "@/data/user";
import { db } from "@/lib/db";
import {  NextResponse } from "next/server";

export const GET = async () => {
  try {
    const user = await findCurrentUser();
    const wheel = await db.luckyWheelActive.findFirst({
      where: {
        userId: user.id,
      },
    });
    return NextResponse.json({ payload: wheel }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
};

export const DELETE = async () => {
  try {
    const user = await findCurrentUser();
    await db.luckyWheelActive.deleteMany({
      where: {
        userId: user.id,
      },
    });
    return NextResponse.json(
      { message: "Lucky wheel procced" },
      { status: 200 }
    );
  } catch  {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
};
