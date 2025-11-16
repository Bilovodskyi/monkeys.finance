export const locales = ["en", "uk", "ru", "es"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "en";