"use client";

import { useEffect } from "react";
import { useToastContext } from "./toast-context";
import { registerAddToast } from "@/lib/toast";
import { ToastCard } from "./ToastCard";


/**
 * ToastContainer
 * Renders the live toast stack and wires up the global `toast` singleton.
 * Place this once inside <ToastProvider>.
 */
export function ToastContainer() {
  const { toasts, addToast, removeToast } = useToastContext();

  // Wire the global singleton to the React context
  useEffect(() => {
    registerAddToast(addToast);
  }, [addToast]);

  return (
    <div className="toast-viewport" aria-label="Notifications">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={removeToast} />
      ))}
    </div>
  );
}
