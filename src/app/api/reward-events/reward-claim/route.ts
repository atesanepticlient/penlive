import { decryptText } from "@/lib/helpers";
import { db } from "@/lib/db";
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { NextRequest, NextResponse } from "next/server";
import { findRequireMentsProgress } from "../route";

export const PUT = async (req: NextRequest) => {
  try {
    const { rewardId, rewardType, prizeHash, prize } = await req.json();

    if (!rewardId || !rewardType || !prizeHash || !prize) {
      return NextResponse.json(
        { error: "Required Fills is missing!" },
        { status: 400 },
      );
    }

    const user = await findCurrentUser();
    if (!user)
      return NextResponse.json(
        { error: "Authentication Failed!" },
        { status: 401 },
      );

    const secureRequest = decryptText(prizeHash);
    if (!secureRequest) {
      return NextResponse.json(
        { error: "Request is not secure" },
        { status: 400 },
      );
    }
    const now = new Date();
    if (rewardType == "Live") {
      const reward = await db.rewardEvent.findUnique({
        where: { id: rewardId, isActive: true },
      });
      const userData: any = reward.usersData.find(
        (data: any) => data.userId == user.id,
      );
      if (!userData) {
        return NextResponse.json(
          { error: "Reward is not available for you" },
          { status: 404 },
        );
      }

      const eventsExpiry = await db.rewardEventExpiry.findFirst();

      if (reward.name == "EGGHUNT" && eventsExpiry.eggHunt < now) {
        return NextResponse.json(
          { error: "Reward was expired" },
          { status: 400 },
        );
      } else if (reward.name == "SPIN" && eventsExpiry.spin < now) {
        return NextResponse.json(
          { error: "Reward was expired" },
          { status: 400 },
        );
      } else if (reward.name == "ENVELOP" && eventsExpiry.envelop < now) {
        return NextResponse.json(
          { error: "Reward was expired" },
          { status: 400 },
        );
      }

      const { deposit, bet, invite } = await findRequireMentsProgress(
        userData.createdAt,
        "BOTH",
        user.id,
        { removeDeposits: true },
      );

      if (reward.ticketType == "DEPOSIT") {
        if (+reward.account > deposit) {
          return NextResponse.json(
            { error: "Please Fullfill the requirements" },
            { status: 400 },
          );
        }
      } else if (reward.ticketType == "BET") {
        if (+reward.account > bet) {
          return NextResponse.json(
            { error: "Please Fullfill the requirements" },
            { status: 400 },
          );
        }
      } else if (reward.ticketType == "INVITE") {
        if (+reward.account > invite) {
          return NextResponse.json(
            { error: "Please Fullfill the requirements" },
            { status: 400 },
          );
        }
      }
      await db.$transaction(async (tx) => {
        await tx.wallet.update({
          where: {
            userId: user.id,
          },
          data: {
            balance: {
              increment: prize,
            },
            turnOver: {
              increment: prize * 3,
            },
          },
        });

        const updatedUsesrData = reward.usersData.filter(
          (data: any) => data.userId != user.id,
        );
        await tx.rewardEvent.update({
          where: {
            id: rewardId,
          },
          data: {
            usersData: updatedUsesrData,
          },
        });

        if (reward.ticketType == "DEPOSIT") {
          await tx.rewardEvent.updateMany({
            where: {
              name: reward.name,
              ticketType: { not: "DEPOSIT" },
            },
            data: {
              usersData: {
                push: {
                  claimable: true,
                  userId: user.id,
                  createdAt: new Date(),
                },
              },
            },
          });
        }
      });

      return NextResponse.json({ success: true }, { status: 201 });
    } else if (rewardType == "Custom") {
      const reward = await db.customRewardEvent.findUnique({
        where: { id: rewardId, userId: user.id },
      });

      if (!reward)
        return NextResponse.json(
          { error: "Reward is not available for you" },
          { status: 404 },
        );
      if (reward.expiry < now) {
        return NextResponse.json(
          { error: "Reward was expired" },
          { status: 400 },
        );
      }

      await db.$transaction([
        db.wallet.update({
          where: {
            userId: user.id,
          },
          data: {
            balance: {
              increment: prize,
            },
            turnOver: {
              increment: prize,
            },
          },
        }),
        db.customRewardEvent.delete({
          where: {
            id: rewardId,
            userId: user.id,
          },
        }),
      ]);

      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch  {
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
