"use client";

/**
 * ToastWrapper
 * Drop this in your root layout. It combines ToastProvider + ToastContainer
 * so you only need one import in layout.tsx.
 *
 * Usage in app/layout.tsx:
 *   import { ToastWrapper } from "@/components/ToastWrapper";
 *   <ToastWrapper>{children}</ToastWrapper>
 */

import { ToastProvider } from "@/components/toast/toast-context";
import { ToastContainer } from "@/components/toast/Toastcontainer";
import type { ReactNode } from "react";

export function ToastWrapper({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  );
}
