"use server";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";
import { loginSchema } from "@/schema";
import zod from "zod";
import { LOGIN_SUCCESS } from "@/success";
import { INTERNAL_SERVER_ERROR } from "@/error";

export const login = async (data: zod.infer<typeof loginSchema>) => {
  const { phone, password } = data;
  try {
    try {
      await signIn("credentials", { phone, password, redirect: false });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== "AccessDenied") {
          const credentialsError = error as CredentialsSignin;
          return { error: credentialsError?.cause?.err?.message };
        }
        throw error;
      }
    }

    return { success: LOGIN_SUCCESS };
  } catch {
    return { error: INTERNAL_SERVER_ERROR };
  }
};
