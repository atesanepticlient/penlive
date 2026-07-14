// English → Bangla numeral conversion
const EN_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/**
 * Converts English digits in a number or string to Bangla numerals
 * @param num - Number or string (e.g., 1234 or "1234")
 * @returns String with Bangla numerals
 */
export function toBanglaNumber(num: number | string): string {
  return String(num).replace(/[0-9]/g, (d) => BN_DIGITS[parseInt(d)]);
}

/**
 * Converts English digits in a number or string to English numerals
 * @param num - Number or string
 * @returns String with English numerals
 */
export function toEnglishNumber(num: number | string): string {
  return String(num).replace(/[০-৯]/g, (d) => EN_DIGITS[BN_DIGITS.indexOf(d)]);
}

/**
 * Formats a number with locale-appropriate numerals based on language
 * @param num - The number to format
 * @param lang - Current language ("ENG" or "BN")
 * @param decimals - Number of decimal places (default 2)
 * @returns Formatted number string
 */
export function formatNumber(
  num: number,
  lang: "ENG" | "BN",
  decimals = 2,
): string {
  const fixed = Number(num).toFixed(decimals);
  return lang === "BN" ? toBanglaNumber(fixed) : fixed;
}

/**
 * Formats a date in locale-appropriate format based on language
 * @param date - Date object or ISO string
 * @param lang - Current language ("ENG" or "BN")
 * @returns Formatted date string (DD/MM/YYYY)
 */
export function formatDate(date: Date | string, lang: "ENG" | "BN"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear().toString();
  const parts = `${day}/${month}/${year}`;
  return lang === "BN" ? toBanglaNumber(parts) : parts;
}

/**
 * Formats a date with time in locale-appropriate format
 * @param date - Date object or ISO string
 * @param lang - Current language ("ENG" or "BN")
 * @returns Formatted date+time string
 */
export function formatDateTime(
  date: Date | string,
  lang: "ENG" | "BN",
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const dateStr = formatDate(d, lang);
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;
  return lang === "BN" ? `${toBanglaNumber(time)} ${dateStr}` : `${time} ${dateStr}`;
}

/**
 * Intercepts a template string and replaces placeholders with dynamic values
 * Supports {key} syntax
 * @param template - Template string with {placeholder} tokens
 * @param values - Object mapping placeholder names to values
 * @param lang - Current language for number formatting
 * @returns Interpolated string
 */
export function interpolate(
  template: string,
  values: Record<string, unknown>,
  lang: "ENG" | "BN" = "ENG",
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const val = values[key];
    if (val === undefined) return `{${key}}`;
    if (typeof val === "number") {
      return lang === "BN" ? toBanglaNumber(val) : String(val);
    }
    return String(val);
  });
}