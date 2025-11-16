// app/api/stripe/create-portal-session/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse request body for locale
        const body = await req.json();
        const { locale = "en" } = body;

        // Validate locale
        const validLocales = ["en", "es", "ru", "uk"];
        const normalizedLocale = validLocales.includes(locale) ? locale : "en";

        // Get user from database
        const [user] = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.clerkId, userId))
            .limit(1);

        if (!user || !user.stripeCustomerId) {
            return NextResponse.json(
                { error: "No Stripe customer found" },
                { status: 404 }
            );
        }

        // Create portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/plan`,
            locale: normalizedLocale, // Set the locale for the portal
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error("Error creating portal session:", error);
        return NextResponse.json(
            { error: "Failed to create portal session" },
            { status: 500 }
        );
    }
}
