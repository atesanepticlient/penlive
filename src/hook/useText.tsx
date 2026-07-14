"use client";

import { useEffect, useState, useCallback } from "react";
import { useLangStore } from "@/lib/store.zustond";

// Type for translation objects
type TranslationObject = Record<string, unknown>;

// Cache for loaded translations to avoid redundant fetches
const translationCache = new Map<string, TranslationObject>();

// Map language from store ("ENG" | "BN") to folder names ("en" | "bn")
const LANG_TO_FOLDER: Record<string, string> = {
  ENG: "en",
  BN: "bn",
};

// Map of page names to translation file names
// This allows mapping route paths to translation files
const PAGE_TO_FILE_MAP: Record<string, string> = {
  "/": "common",
  "/login": "auth",
  "/register": "auth",
  "/member": "member",
  "/deposit": "deposit",
  "/withdraw": "withdraw",
  "/rewardCenter": "rewardCenter",
  "/invite-friends": "inviteFriends",
  "/betting-record": "bettingRecord",
  "/profitandloss": "bettingRecord",
  "/security": "security",
  "/benefits": "benefits",
  "/my-account": "member",
  "/my-cards": "common",
  "/history": "bettingRecord",
  "/notifications": "common",
  "/chat": "common",
  "/activity/signin": "common",
  "/promotions": "rewardCenter",
  "/promoCode": "rewardCenter",
  "/receivingCenter": "receivingCenter",
};

/**
 * Custom hook for loading and accessing translations
 * Uses the existing useLangStore for language management
 *
 * @param page - The page identifier (e.g., "/member" or "member")
 * @returns An object containing the translations for the specified page
 *
 * @example
 * // In a component:
 * const t = useText("/member");
 * return <h1>{t.page.title}</h1>;
 *
 * @example
 * // Using with common translations:
 * const t = useText("/");
 * return <button>{t.buttons.submit}</button>;
 */
export function useText(page: string): TranslationObject {
  // Get language from the existing store
  const storeLang = useLangStore((state) => state.lang);
  // Convert store language ("ENG" | "BN") to folder name ("en" | "bn")
  const lang = LANG_TO_FOLDER[storeLang];

  // Normalize the page path to get the file name
  const getFileName = useCallback((pagePath: string): string => {
    // Remove trailing slash
    const normalizedPath = pagePath.replace(/\/$/, "");

    // Check if there's a direct mapping
    if (PAGE_TO_FILE_MAP[normalizedPath]) {
      return PAGE_TO_FILE_MAP[normalizedPath];
    }

    // Try to find a partial match (for dynamic routes)
    for (const [route, file] of Object.entries(PAGE_TO_FILE_MAP)) {
      if (normalizedPath.startsWith(route) && route !== "/") {
        return file;
      }
    }

    // If no mapping found, use the last segment of the path
    const segments = normalizedPath.split("/").filter(Boolean);
    return segments[segments.length - 1] || "common";
  }, []);

  const [translations, setTranslations] = useState<TranslationObject>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const fileName = getFileName(page);
        console.log({ page });
        const cacheKey = `${lang}/${fileName}`;

        // Check cache first
        if (translationCache.has(cacheKey)) {
          setTranslations(translationCache.get(cacheKey)!);
          setIsLoading(false);
          return;
        }

        // Import the translation file dynamically
        const translationModule = await import(
          `@/lib/translations/${lang}/${fileName}.json`
        );
        const data = translationModule.default;

        // Cache the translations
        translationCache.set(cacheKey, data);
        setTranslations(data);
      } catch (err) {
        console.error(
          `Failed to load translations for ${page} in ${lang}:`,
          err,
        );
        setError(
          err instanceof Error ? err.message : "Failed to load translations",
        );
        // Fallback to empty object
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [page, lang, getFileName]);

  // Return a proxy that provides helpful messages during loading/error states
  if (isLoading) {
    return { __loading: true };
  }

  if (error) {
    return { __error: error };
  }

  return translations;
}

/**
 * Helper function to get nested value from object using dot notation
 * @param obj - The object to search
 * @param path - The path string (e.g., "page.title")
 * @returns The value at the path, or undefined if not found
 */
export function getNestedValue(obj: TranslationObject, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current === "object" && current !== null) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export default useText;
