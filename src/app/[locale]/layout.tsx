import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/locales";
import "../globals.css";
import { enUS, esES, ruRU, ukUA } from "@clerk/localizations";
import { Toaster } from "sonner";
import { dark } from "@clerk/themes";

const CLERK_LOCALES = { en: enUS, es: esES, ru: ruRU, uk: ukUA };

export const metadata: Metadata = {
    title: "Monkeys",
    description: "Machine Learning Cryptocurrency Trading Bot",
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: "en" | "es" | "ru" | "uk" }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!locales.includes(locale)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className="antialiased">
                <ClerkProvider
                    appearance={{
                        baseTheme: dark,
                        variables: {
                            colorPrimary: "#1fd5f9",
                            colorBackground: "rgb(18, 18, 18)",
                        },
                    }}
                    localization={
                        CLERK_LOCALES[locale as keyof typeof CLERK_LOCALES]
                    }>
                    <NextIntlClientProvider messages={messages}>
                        {children}
                        <Toaster richColors position="top-right" />
                    </NextIntlClientProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
