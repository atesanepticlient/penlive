import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export default {
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        phone: { name: "phone", type: "text" },
        password: { name: "password", type: "password" },
      },

      async authorize(credentials) {
        const user: string = (credentials!.phone as string) || "";
        const password: string = (credentials!.password as string) || "";

        if (!user || !password) {
          throw new Error("Invalid Credentials");
        }

        const account = await db.user.findUnique({
          where: {
            phone: user,
          },
        });

        if (!account) {
          throw new Error("Account not found");
        }

        const passwordIsMatch = await bcrypt.compare(
          password,
          account.password,
        );

        if (!passwordIsMatch) {
          throw new Error("Invalid Password");
        }
        return account;
      },
    }),
  ],
} satisfies NextAuthConfig;
