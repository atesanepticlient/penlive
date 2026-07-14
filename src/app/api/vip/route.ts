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

    const vipLevelRequrireMents: any = await db.vIPLevelRequirements.findFirst({
      where: {},
    });

    let vipLevel = await db.userVIPLevel.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!vipLevel) {
      const firstLevelRequireMents = vipLevelRequrireMents.levels.find(
        (leveRequirement) => leveRequirement.level == 1,
      );
      vipLevel = await db.userVIPLevel.create({
        data: {
          level: 0,
          nextLevelRequirements: firstLevelRequireMents,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    const { deposit, betting } = await getAllDeposistAndBetting(user.id);

    const currentStatus = {
      totalDeposit: deposit,
      totalDepositCount: 0,
      totalBet: betting,
    };

    return NextResponse.json(
      {
        payload: { level: vipLevel, progress: currentStatus },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
