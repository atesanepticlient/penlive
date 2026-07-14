"use server";
import zod from "zod";
import { registerSchema } from "@/schema";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { findUserByPhone, findUserByReferId } from "@/data/user";
import { playerIdGenerate, referIdGenerate } from "@/lib/helpers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { LOGIN_SUCCESS } from "@/success";
import { CredentialsSignin } from "next-auth";
import { v4 as uuidv4 } from "uuid";

import { RewardName } from "@prisma/client";

export const register = async (data: zod.infer<typeof registerSchema>) => {
  try {
    const {
      password,
      confirmPassword,
      phone,
      ageCheck,
      bonusCheck,
      referralId,
      affiliateCode,
      ipSign,
    } = data;
    if (password !== confirmPassword) {
      return { error: "Confirm Password Did not match" };
    }
    if (!ageCheck) {
      return { error: "Read Out age Restrictions" };
    }

    const existingUserWithPhone = await findUserByPhone(phone);

    if (existingUserWithPhone) {
      return { error: "Number is already registered" };
    }

    await db.affiliate.findUnique({
      where: { phone },
    });
    // if (existingAffiliateWithPhone) {
    //   return { error: "Affiliates are not allowed for user account" };
    // }

    let isReferralBonusActive = false;

    let invitedBy = {};
    const referralUser = await findUserByReferId(referralId || "");
    if (referralId && referralUser) {
      if (referralUser) {
        await db.invitationBonus.update({
          where: { userId: referralUser!.id },
          data: { totalRegisters: { increment: 1 } },
        });

        isReferralBonusActive = !!referralUser;
        const referralInvitation = await db.invitation.findUnique({
          where: {
            userId: referralUser.id,
          },
        });

        if (referralInvitation) {
          invitedBy = {
            connect: {
              id: referralInvitation.id,
            },
          };
        }
      }
    }
    const playerId = await playerIdGenerate();
    const referId = await referIdGenerate();
    const hasedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        phone,
        password: hasedPassword,
        playerId: playerId!,
        referId,
        isBanned: false,
        invitedBy: {
          ...invitedBy,
        },
        wallet: {
          create: {
            balance: 0,
            signinBonus: bonusCheck,
            referralBonus: isReferralBonusActive,
          },
        },
        Invitation: {
          create: {
            validRerredUsers: [],
          },
        },
        inviationBonus: {
          create: {},
        },
        dailyCheck: {
          create: {
            firstPrice: 3.5,
          },
        },
      },
    });

    const localStore = [];

    if (affiliateCode) {
      const affiliate = await db.affiliate.findUnique({
        where: {
          uniqueCode: affiliateCode,
          status: { not: "SUSPENDED" },
          emailVerified: true,
        },
      });

      if (affiliate) {
        const bonusConfig = await db.affiliateRegisterBonus.findUnique({
          where: { affiliateId: affiliate.id },
        });
        await userConnectToAffiliate(newUser.id, affiliate.id, {
          reward: bonusConfig ? bonusConfig.rewardName : null,
          ipSign,
          callback: ({ newIpSignKey, newIpSignValue }) => {
            localStore.push({
              key: newIpSignKey,
              value: newIpSignValue,
            });
          },
        });
      } else {
        if (referralId && referralUser) {
          await userConnectToRefererUser(referralUser.id, newUser.id);
        }
      }
    } else {
      if (referralId && referralUser) {
        await userConnectToRefererUser(referralUser.id, newUser.id);
      }
    }

    try {
      await signIn("credentials", {
        phone: newUser.phone,
        password,
        redirect: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== "AccessDenied") {
          const credentialsError = error as CredentialsSignin;
          return { error: credentialsError?.cause?.err?.message };
        }
      }
    }

    // await registerPlayer(playerId);

    return { success: LOGIN_SUCCESS, localStore };
  } catch (error) {
    console.log({ error });
    return { error: INTERNAL_SERVER_ERROR };
  }
};

const userConnectToAffiliate = async (
  userId: string,
  affiliateId: string,
  {
    reward,
    ipSign,
    callback,
  }: {
    reward?: RewardName;
    ipSign?: string;
    callback?: (props: {
      newIpSignValue: string;
      newIpSignKey: string;
    }) => void;
  },
) => {
  let uniqueIPCode = ipSign;
  const sameIpLinks = await db.affiliateUser.findMany({
    where: { userIp: uniqueIPCode, isValid: true },
    orderBy: { createdAt: "asc" },
  });

  const isValid = sameIpLinks.length === 0;
  const invalidReason = isValid
    ? null
    : "Duplicate IP address — another account from this IP is already registered";
  console.log({ isValid });
  await db.$transaction(async (tx) => {
    if (isValid) {
      uniqueIPCode = uuidv4();
      callback({
        newIpSignKey: "-entry-token",
        newIpSignValue: uniqueIPCode,
      });

      if (reward) {
        await tx.customRewardEvent.create({
          data: {
            user: { connect: { id: userId } },
            title: "Welcome Reward",
            rewardFor: "GIFT",
            size: 1,
            expiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
            name: reward,
          },
        });

        await tx.notification.create({
          data: {
            user: { connect: { id: userId } },
            title: "Welcome Reward added",
            description: "You Got a reward for newly register to this account",
          },
        });
      }
    }

    await tx.affiliateUser.create({
      data: {
        affiliateId: affiliateId,
        userId,
        userIp: uniqueIPCode,
        isValid,
        invalidReason,
      },
    });
  });
};

const userConnectToRefererUser = async (
  referraUserId: string,
  userId: string,
) => {
  await db.invitation.update({
    where: {
      userId: referraUserId,
    },
    data: {
      referredUsers: {
        connect: {
          id: userId,
        },
      },
    },
  });
};
