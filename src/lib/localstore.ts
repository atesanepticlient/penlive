export const getPersistedState = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return parsed?.state ?? fallback;
  } catch {
    return fallback;
  }
};
export const getLocalStoreDataByKey = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const createLocalStoreDataByKey = (key: string, value: string) => {
  localStorage.setItem(key, value);
};
