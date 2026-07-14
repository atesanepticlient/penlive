"use client";
import { useLangStore } from "@/lib/store.zustond";

export function useLang() {
  return useLangStore((s) => s.lang);
}
