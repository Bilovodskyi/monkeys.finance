export const locales = ["en", "uk", "ru", "sp"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "en";