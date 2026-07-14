import { db } from "./db";

export const createLuckyWheelTurn = async (
  userId: string
) => {
  try {
    const exitingLuckywheel = await db.luckyWheelActive.findFirst({
      where: {
        userId: userId,
      },
    });

    if (exitingLuckywheel) {
      return exitingLuckywheel;
    } else {
      return await db.luckyWheelActive.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }
  } catch {
    throw new Error("Lucky wheel was not activate");
  }
};
