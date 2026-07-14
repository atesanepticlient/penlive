/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import {
  Cinzel_Decorative,
  Orbitron,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import StoreProvider from "./StoreProvider";
import { Suspense } from "react";
import ShadcnToastProvider from "./shadcn-toast-provider";
import { NotificationToaster } from "@/components/notifications/notification-toaster";
import AutoUpdater from "./auto-updater";
import NotificationProvider from "./notification-provider";
import { ToastWrapper } from "./Toastwrapper";

import { TooltipProvider } from "@/components/ui/tooltip";
import Template from "./template";
// const geistSans = Geis({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const cinzelDec = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: "700",
});
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: "700",
});

export const metadata: Metadata = {
  title: "Pen live",
  description: "Bangladeshi 1No Betting Platform",
  icons: "./favicon.ico",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: any = await auth();

  return (
    <html lang="en" className={`${cinzelDec.variable} ${orbitron.variable}`}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        integrity="sha512-..."
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        className={`antialiased `}
      >
        <div className="">
          <Suspense>
            <SessionProvider session={session}>
              <Toaster
                containerStyle={{
                  zIndex: 999999,
                }}
              />
              <ShadcnToastProvider />

              <StoreProvider>
                <ToastWrapper>
                  <TooltipProvider>
                    <div className="">
                      <div className="mx-auto w-full md:w-[480px] ">
                        <Template>{children}</Template>
                      </div>
                    </div>
                  </TooltipProvider>
                </ToastWrapper>

                {session?.user && (
                  <>
                    <NotificationProvider />
                    <NotificationToaster userId={session.user.id} />
                  </>
                )}
                <AutoUpdater />
              </StoreProvider>
            </SessionProvider>
          </Suspense>
        </div>
      </body>
    </html>
  );
}
