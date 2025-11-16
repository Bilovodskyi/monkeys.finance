import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumberWithCommas(value: number): string {
    return value.toLocaleString("en-US");
}

export function parseIsoToDateTime(
    isoString: string,
    locale: string,
    countryCode: string
): { date: string; time: string } {
    const dateObj = new Date(isoString);

    // Map locale codes to proper BCP 47 language tags
    const localeMap: Record<string, string> = {
        en: "en-US",
        es: "es-ES", // Spanish
        uk: "uk-UA", // Ukrainian
        ru: "ru-RU", // Russian
    };

    const browserLocale = localeMap[locale] || locale || "en-US";

    // Format date: YYYY Mon DD
    const date = dateObj.toLocaleDateString(browserLocale, {
        year: "numeric",
        month: "short", // Dec
        day: "2-digit",
    });

    // Format time: HH:MM (24h or 12h)
    const time = dateObj.toLocaleTimeString(browserLocale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12:
            locale === "en" && (countryCode === "US" || countryCode === "CA"), // show AM/PM for US and CA countries saved in user profile only if locale is English
    });

    return { date, time };
}
