/**
 * Global toast singleton.
 *
 * Usage anywhere (client components, utils, API handlers on client, etc.):
 *   import { toast } from "@/lib/toast";
 *   toast.success("Saved!");
 *   toast.error("Something went wrong", { title: "Error" });
 */

import type { ToastItem, ToastType } from "@/components/toast/toast-context";

export type ToastOptions = {
  title?: string;
  duration?: number; // ms, 0 = sticky
  onTrigger?: () => void; // called when toast appears
  onManualClose?: () => void;
  onClick?: () => void;
};

type AddFn = (toast: Omit<ToastItem, "id">) => string;

// Internal ref — gets wired up by ToastProvider via useEffect
let addToastRef: AddFn | null = null;

export function registerAddToast(fn: AddFn): void {
  addToastRef = fn;
}

function emit(type: ToastType, message: string, options: ToastOptions = {}): string {
  if (!addToastRef) {
    console.warn("[toast] ToastProvider is not mounted yet.");
    return "";
  }
  return addToastRef({ type, message, ...options });
}

export const toast = {
  success: (message: string, options?: ToastOptions): string =>
    emit("success", message, options),
  error: (message: string, options?: ToastOptions): string =>
    emit("error", message, options),
  info: (message: string, options?: ToastOptions): string =>
    emit("info", message, options),
  warning: (message: string, options?: ToastOptions): string =>
    emit("warning", message, options),
  custom: (type: ToastType, message: string, options?: ToastOptions): string =>
    emit(type, message, options),
};