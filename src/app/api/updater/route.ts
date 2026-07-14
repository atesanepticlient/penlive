import { createNotification } from "@/action/notifications";
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { getAllDeposistAndBetting } from "@/lib/helpers";
import { NextResponse } from "next/server";

export const PUT = async () => {
  try {
    console.log("Updater called");
    const user = await findCurrentUser();

    if (!user) return NextResponse.json({}, { status: 200 });

    let updatesUserDates = await db.autoUpdateDate.findUnique({
      where: { userId: user.id },
    });

    const updatesInterval = await db.autoUpdatesInterval.findFirst({
      where: {},
    });

    if (!updatesUserDates) {
      updatesUserDates = await db.autoUpdateDate.create({
        data: {
          user: { connect: { id: user.id } },
          deposit: null,
          betting: null,
        },
      });
    }

    const depositInterval = updatesInterval.deposit;
    const bettingInterval = updatesInterval.betting;

    const now = new Date();

    const lastDepositUpdatedAt = updatesUserDates?.deposit;
    const lastBettingUpdatedAt = updatesUserDates?.betting;

    const isDepositUpdateable =
      !lastDepositUpdatedAt ||
      now.getTime() - new Date(lastDepositUpdatedAt).getTime() >=
        depositInterval;

    const isBettingUpdateable =
      !lastBettingUpdatedAt ||
      now.getTime() - new Date(lastBettingUpdatedAt).getTime() >=
        bettingInterval;

    if (isDepositUpdateable) {
      await db.$transaction(async (tx) => {
        const { deposit, betting } = await getAllDeposistAndBetting(user.id);

        if (deposit || betting) {
          const vipLevel: any = await db.userVIPLevel.findUnique({
            where: { userId: user.id },
          });
          const allRequirements = await db.vIPLevelRequirements.findFirst({
            where: {},
          });
          if (
            vipLevel.level !== allRequirements.levels.length - 1 &&
            vipLevel.nextLevelRequirements?.totalDeposit <= deposit &&
            vipLevel.nextLevelRequirements?.totalBet <= betting
          ) {
            await db.userVIPLevel.update({
              where: {
                userId: user.id,
              },
              data: {
                level: vipLevel.nextLevelRequirements.level,
                nextLevelRequirements: allRequirements.levels.find(
                  (data: any) =>
                    Number(data.level) ==
                    Number(vipLevel.nextLevelRequirements.level) + 1,
                ),
              },
            });
            await createNotification({
              title: `VIP Upgrade`,
              description: `Your VIP level upgraded to level ${vipLevel.nextLevelRequirements.level}`,
              userId: user!.id!,
              icon: "MONEY",
            });

            const vipRewardRequirement =
              await db.vIPRewardRequirements.findFirst({
                where: {
                  levelRequire: Number(vipLevel.nextLevelRequirements.level),
                },
              });

            await db.$transaction([
              db.vIPRewardUserProgress.deleteMany({
                where: {
                  userId: user.id,
                  requirements: {
                    validForDay: vipRewardRequirement.validForDay,
                  },
                },
              }),
              db.vIPRewardUserProgress.create({
                data: {
                  user: { connect: { id: user.id } },
                  requirements: { connect: { id: vipRewardRequirement.id! } },
                  expiry: new Date(
                    Date.now() +
                      vipRewardRequirement.validForDay * 24 * 60 * 60 * 1000,
                  ),
                },
              }),
            ]);
          }
        }

        const deposits = await tx.deposit.findMany({
          where: {
            userId: user.id,
            status: "APPROVED",
            ...(lastDepositUpdatedAt && {
              statusUpdateAt: {
                gt: lastDepositUpdatedAt,
              },
            }),
          },
        });
        if (deposits.length != 0) {
          const airdropExpiry = await db.airDropEvent.findMany({
            where: {
              expiry: { gt: new Date() },
            },
          });

          const rewardEventExpiry = await db.rewardEventExpiry.findFirst({
            where: {
              OR: [
                {
                  spin: { gt: new Date() },
                },
                {
                  eggHunt: { gt: new Date() },
                },
                {
                  envelop: { gt: new Date() },
                },
              ],
            },
          });
          const isDepositTicketsNotNeeded =
            !airdropExpiry[0] && !rewardEventExpiry;

          if (isDepositTicketsNotNeeded) return;

          await tx.depositTicket.createMany({
            data: deposits.map((deposit) => ({
              price: +deposit.amount,
              expire: new Date(
                deposit.statusUpdateAt.getTime() + 24 * 60 * 60 * 1000,
              ),
              userId: user.id,
            })),
          });
        }

        await db.autoUpdateDate.update({
          where: {
            userId: user.id,
          },
          data: {
            deposit: new Date(),
          },
        });
      });
    }
    if (isBettingUpdateable) {
      // 1. update betting
      // 2. update dates to set last update date
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
