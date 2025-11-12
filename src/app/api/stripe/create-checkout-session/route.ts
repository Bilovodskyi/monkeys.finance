// app/api/create-checkout-session/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import {
    getPriceIdForCountry,
    getTierForCountry,
    getPriceForTier,
    type BillingInterval,
} from "@/lib/pricingTiers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate user
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Parse request body for billing interval
        const body = await req.json();
        const { interval = "monthly" } = body as { interval?: BillingInterval };

        // Validate interval
        if (interval !== "monthly" && interval !== "yearly") {
            return NextResponse.json(
                { error: "Invalid billing interval" },
                { status: 400 }
            );
        }

        // 3. Get user from database
        const user = await db.query.UserTable.findFirst({
            where: eq(UserTable.clerkId, userId),
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // 4. Use country from database (fallback to US if not set)
        const countryCode = user.country || "US";

        console.log(`User ${user.email} using stored country: ${countryCode}`);

        // 5. Determine appropriate price
        const tier = getTierForCountry(countryCode);
        const priceId = getPriceIdForCountry(countryCode, interval);
        const price = getPriceForTier(tier, interval);

        console.log(
            `Assigning ${tier} ${interval}: $${price} for ${countryCode}`
        );

        // 6. Create or retrieve Stripe customer
        let stripeCustomerId = user.stripeCustomerId;

        // Verify customer exists in Stripe, or create new one
        if (stripeCustomerId) {
            try {
                await stripe.customers.retrieve(stripeCustomerId);
                console.log(
                    `Using existing Stripe customer: ${stripeCustomerId}`
                );
            } catch (err: any) {
                // Customer doesn't exist in Stripe (deleted or wrong account)
                console.warn(
                    `Customer ${stripeCustomerId} not found in Stripe, creating new one`
                );
                stripeCustomerId = null; // Force creation of new customer
            }
        }

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    clerkId: userId,
                    userId: user.id,
                },
            });

            stripeCustomerId = customer.id;

            // Save Stripe customer ID to database
            await db
                .update(UserTable)
                .set({ stripeCustomerId: customer.id })
                .where(eq(UserTable.id, user.id));

            console.log(`Created Stripe customer: ${customer.id}`);
        }

        // 7. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            billing_address_collection: "required", // Important: verify billing address
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/plan`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/plan`,
            metadata: {
                userId: user.id,
                clerkId: userId,
                detectedCountry: countryCode,
                tier: tier,
                interval: interval,
            },
        });

        console.log(`Checkout session created: ${session.id} (${interval})`);

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
        });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
