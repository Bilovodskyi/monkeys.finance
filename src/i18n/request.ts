import { getRequestConfig } from "next-intl/server";
import { locales, type Locale } from "./locales";

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used - type-safe check
    if (!locale || !isValidLocale(locale)) {
        locale = "en";
    }

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});

// Type guard to check if a string is a valid locale
export function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}
