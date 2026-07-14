import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import {  NextResponse } from "next/server";

export const GET = async () => {
  try {
    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const notification = await db.notification.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gt: twoDaysAgo, // older than 2 days
        },
        isRead: false,
      },
      orderBy: {
        createdAt: "desc", // latest one
      },
    });
    console.log({ notification });
    return NextResponse.json({ payload: notification }, { status: 200 });
  } catch {
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
