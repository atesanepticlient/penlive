import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { getAllDeposistAndBetting } from "@/lib/helpers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const vipRequirements = await db.vIPLevelRequirements.findFirst({
      where: {},
    });

    const { deposit, betting } = await getAllDeposistAndBetting(user.id);

    const currentStatus = {
      totalDeposit: deposit,
      totalDepositCount: 0,
      totalBet: betting,
    };

    const userVipLeve = await db.userVIPLevel.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json(
      {
        payload: {
          requiremnents: vipRequirements,
          progress: currentStatus,
          currentLevel: userVipLeve.level,
        },
      },
      { status: 200 },
    );
  } catch  {
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
