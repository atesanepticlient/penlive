"use server";

import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { generateOtp } from "@/lib/utils";
import bcrypt from "bcryptjs";

export const sendOtp = async (phone: string) => {
  try {
    const user = await db.user.findUnique({
      where: { phone: phone },
    });

    if (!user) return { error: "Acount not found" };

    const otpCode = generateOtp(5);

    const existingOtp = await db.forgetPasswordOtp.findFirst({
      where: { phone: phone },
    });

    let expiry;

    if (existingOtp) {
      const updatedOtp = await db.forgetPasswordOtp.update({
        where: { id: existingOtp.id },
        data: { code: otpCode, expiry: new Date(Date.now() + 2 * 60 * 1000) },
      });
      expiry = updatedOtp.expiry;
    } else {
      const newOtp = await db.forgetPasswordOtp.create({
        data: {
          id: crypto.randomUUID(),
          code: otpCode,
          expiry: new Date(Date.now() + 2 * 60 * 1000),
          phone,
        },
      });
      expiry = newOtp.expiry;
    }

    //     await sendSms(
    //       `Use code $${otpCode} to reset your password. Valid for 2 minutes.
    // `,
    //       phone,
    //     );

    return { sucess: true, expiry };
  } catch (error) {
    console.log({ error });
    return { error: INTERNAL_SERVER_ERROR };
  }
};

export const verifyForgetOtp = async (phone: string, otp: string) => {
  try {
    const user = await db.user.findUnique({ where: { phone } });
    if (!user) return { error: "Account not found" };

    const existingOtp = await db.forgetPasswordOtp.findFirst({
      where: { phone, code: otp },
    });

    if (!existingOtp) return { error: "Invalid OTP" };

    if (existingOtp.expiry < new Date()) {
      return { error: "OTP expired" };
    }

    await db.$transaction(async (tx) => {
      await tx.forgetPasswordOtp.delete({ where: { id: existingOtp.id } });
      const existingChangePasswordToken =
        await tx.changePasswordAccessToken.findFirst({ where: { phone } });
      if (existingChangePasswordToken) {
        await tx.changePasswordAccessToken.update({
          where: { id: existingChangePasswordToken.id },
          data: {
            expiry: new Date(Date.now() + 5 * 60 * 1000),
          },
        });
      } else {
        await tx.changePasswordAccessToken.create({
          data: {
            phone: phone,
            expiry: new Date(Date.now() + 5 * 60 * 1000),
          },
        });
      }
    });
    return { success: true };
  } catch {
    return { error: INTERNAL_SERVER_ERROR };
  }
};

export const changePassword = async (phone: string, password: string) => {
  try {
    const token = await db.changePasswordAccessToken.findFirst({
      where: {
        phone,
        expiry: {
          gt: new Date(),
        },
      },
    });

    if (!token) return { error: "This request is not valid" };

    const user = await db.user.findUnique({ where: { phone } });
    if (!user) return { error: "Account not found" };

    const hasedPassword = await bcrypt.hash(password, 10);

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { password: hasedPassword },
      });

      await tx.changePasswordAccessToken.delete({ where: { phone } });
    });

    return { success: true };
  } catch {
    return { error: INTERNAL_SERVER_ERROR };
  }
};
