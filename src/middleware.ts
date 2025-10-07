// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/locales";

const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale,
    localePrefix: "always",   // /en/... always present
    localeDetection: true
});

// Public routes (with and without a locale prefix)
const isPublicRoute = createRouteMatcher([
    "/",
    "/:locale",                       // e.g. /en
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/:locale/sign-in(.*)",
    "/:locale/sign-up(.*)",
    "/api/webhooks/stripe(.*)",
    "/api/webhooks/clerk(.*)",
]);

function isApiPath(pathname: string) {
    return pathname.startsWith("/api") || pathname.startsWith("/trpc");
}

export default clerkMiddleware(async (auth, request) => {
    // Protect everything except public routes
    if (!isPublicRoute(request)) {
        await auth.protect();
    }

    // Do NOT run next-intl on API/TRPC — only on pages/app routes
    if (isApiPath(request.nextUrl.pathname)) {
        return; // let the request continue
    }

    // Run next-intl’s locale routing & redirects
    return intlMiddleware(request);
});

export const config = {
    matcher: [
        // Run on all app routes with an optional locale prefix, exclude static files
        "/((?!_next|.*\\..*).*)",
        // Always run on API/TRPC for Clerk auth
        "/(api|trpc)(.*)",
    ],
};