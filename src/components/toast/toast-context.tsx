"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms, 0 = persist
  onTrigger?: () => void;
  onManualClose?: () => void;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
  onClick?: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error("useToastContext must be used inside ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).slice(2);
      const duration = toast.duration ?? 4000;

      setToasts((prev) => [...prev, { ...toast, id, duration }]);
      toast.onTrigger?.();
      if (duration > 0) {
        const timer = setTimeout(() => removeToast(id), duration);
        timers.current.set(id, timer);
      }

      return id;
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
