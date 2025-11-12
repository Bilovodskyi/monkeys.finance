// app/api/webhooks/stripe/route.ts

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing stripe-signature header" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json(
            {
                error: `Webhook Error: ${
                    err instanceof Error ? err.message : "Unknown error"
                }`,
            },
            { status: 400 }
        );
    }

    console.log(`Received webhook: ${event.type}`);

    try {
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutCompleted(
                    event.data.object as Stripe.Checkout.Session
                );
                break;

            case "customer.subscription.created":
            case "customer.subscription.updated":
                await handleSubscriptionUpdate(
                    event.data.object as Stripe.Subscription
                );
                break;

            case "customer.subscription.deleted":
                await handleSubscriptionDeleted(
                    event.data.object as Stripe.Subscription
                );
                break;

            case "invoice.payment_succeeded":
                await handlePaymentSucceeded(
                    event.data.object as Stripe.Invoice
                );
                break;

            case "invoice.payment_failed":
                await handlePaymentFailed(event.data.object as Stripe.Invoice);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error(`Error handling webhook ${event.type}:`, error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    console.log(`Checkout completed: ${session.id}`);

    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (!customerId || !subscriptionId) {
        console.error(
            "Missing customer or subscription ID in checkout session"
        );
        return;
    }

    try {
        // Retrieve the subscription to get current_period_end
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription: any = await stripe.subscriptions.retrieve(
            subscriptionId
        );

        console.log(`Subscription status: ${subscription.status}`);

        // Extract current_period_end from the first subscription item
        const currentPeriodEnd =
            subscription.items?.data?.[0]?.current_period_end;

        console.log(`Current period end: ${currentPeriodEnd}`);

        // Validate current_period_end exists
        if (!currentPeriodEnd) {
            console.error(
                `No current_period_end found in subscription items for ${subscriptionId}`
            );
            return;
        }

        await db
            .update(UserTable)
            .set({
                stripeSubscriptionId: subscriptionId,
                billingStatus: subscription.status,
                subscriptionEndsAt: new Date(currentPeriodEnd * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
                updatedAt: new Date(),
            })
            .where(eq(UserTable.stripeCustomerId, customerId));

        console.log(`User subscription activated: ${subscriptionId}`);
    } catch (error) {
        console.error(`Error in handleCheckoutCompleted:`, error);
        throw error;
    }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const sub = subscription as any;
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔔 WEBHOOK: customer.subscription.updated");
    console.log("⏰ Time:", new Date().toISOString());

    // Log key subscription properties
    console.log("📋 Subscription ID:", subscription.id);
    console.log("👤 Customer ID:", subscription.customer);
    console.log("📊 Status:", subscription.status);
    console.log("🚫 cancel_at_period_end:", sub.cancel_at_period_end);
    console.log(
        "📅 cancel_at:",
        sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : "null"
    );
    console.log(
        "📅 canceled_at:",
        sub.canceled_at
            ? new Date(sub.canceled_at * 1000).toISOString()
            : "null"
    );

    // Log items to see where current_period_end is
    if (
        subscription.items &&
        subscription.items.data &&
        subscription.items.data.length > 0
    ) {
        console.log(
            "📦 Items[0] current_period_end:",
            subscription.items.data[0].current_period_end
                ? new Date(
                      subscription.items.data[0].current_period_end * 1000
                  ).toISOString()
                : "null"
        );
    }

    // Type assertion for accessing properties TypeScript doesn't recognize

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔔 WEBHOOK: customer.subscription.updated");
    console.log("⏰ Time:", new Date().toISOString());
    console.log("📋 Subscription ID:", subscription.id);
    console.log("👤 Customer ID:", subscription.customer);
    console.log("📊 Status:", subscription.status);
    console.log("🚫 cancel_at_period_end:", sub.cancel_at_period_end);

    // Debug: Log the entire subscription object to see structure
    console.log("📦 Full subscription keys:", Object.keys(subscription));
    console.log("📦 current_period_end raw value:", sub.current_period_end);

    const customerId = subscription.customer as string;

    // Try multiple places where current_period_end might be
    let currentPeriodEnd =
        sub.current_period_end ||
        sub.current_period_end_at ||
        subscription.items?.data?.[0]?.current_period_end;

    if (currentPeriodEnd) {
        console.log(
            "📅 current_period_end:",
            new Date(currentPeriodEnd * 1000).toISOString()
        );
    } else {
        console.log("⚠️ current_period_end not found in expected locations");
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (!currentPeriodEnd) {
        console.error(
            "❌ No current_period_end found - dumping full subscription object:"
        );
        console.error(JSON.stringify(subscription, null, 2));
        return;
    }

    // Map Stripe status to your billing status
    let billingStatus:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid";
    let cancelAtPeriodEnd = false;

    // ✅ Check BOTH cancel_at_period_end AND cancel_at
    const isScheduledForCancellation =
        sub.cancel_at_period_end === true || sub.cancel_at !== null;

    if (subscription.status === "canceled") {
        billingStatus = "canceled";
        cancelAtPeriodEnd = false;
        console.log("→ Mapping to: canceled (subscription fully ended)");
    } else if (isScheduledForCancellation) {
        // ✅ Subscription is scheduled to cancel (either flag or timestamp)
        billingStatus = "active";
        cancelAtPeriodEnd = true;
        console.log("→ Mapping to: active (but cancelAtPeriodEnd=true)");
        console.log(
            `   Cancellation method: ${
                sub.cancel_at_period_end
                    ? "cancel_at_period_end flag"
                    : "cancel_at timestamp"
            }`
        );
        if (sub.cancel_at) {
            console.log(
                `   Will cancel at: ${new Date(
                    sub.cancel_at * 1000
                ).toISOString()}`
            );
        }
    } else if (subscription.status === "active") {
        billingStatus = "active";
        cancelAtPeriodEnd = false;
        console.log("→ Mapping to: active");
    } else if (subscription.status === "past_due") {
        billingStatus = "past_due";
        console.log("→ Mapping to: past_due");
    } else if (subscription.status === "trialing") {
        billingStatus = "trialing";
        console.log("→ Mapping to: trialing");
    } else if (subscription.status === "unpaid") {
        billingStatus = "unpaid";
        console.log("→ Mapping to: unpaid");
    } else {
        // Fallback to active for unknown statuses
        billingStatus = "active";
        console.log(
            `→ Mapping to: active (unknown status: ${subscription.status})`
        );
    }

    console.log("💾 Attempting database update...");
    console.log("   stripeCustomerId to match:", customerId);
    console.log("   New billingStatus:", billingStatus);
    console.log("   New cancelAtPeriodEnd:", cancelAtPeriodEnd);
    console.log(
        "   New subscriptionEndsAt:",
        new Date(currentPeriodEnd * 1000).toISOString()
    );

    try {
        const result = await db
            .update(UserTable)
            .set({
                stripeSubscriptionId: subscription.id,
                billingStatus: billingStatus,
                cancelAtPeriodEnd: cancelAtPeriodEnd, // ✅ Now we update this
                subscriptionEndsAt: new Date(currentPeriodEnd * 1000),
                updatedAt: new Date(),
            })
            .where(eq(UserTable.stripeCustomerId, customerId))
            .returning();

        if (result.length === 0) {
            console.error("❌ DATABASE UPDATE FAILED - No rows matched!");
            console.error("   Looking for stripeCustomerId:", customerId);

            // Debug: Try to find the user
            const userByCustomerId = await db.query.UserTable.findFirst({
                where: eq(UserTable.stripeCustomerId, customerId),
            });

            if (!userByCustomerId) {
                console.error(
                    "   ❌ No user found with stripeCustomerId:",
                    customerId
                );

                // Check if user exists with this subscription ID instead
                const userBySubId = await db.query.UserTable.findFirst({
                    where: eq(UserTable.stripeSubscriptionId, subscription.id),
                });

                if (userBySubId) {
                    console.log(
                        "   ⚠️ Found user by subscriptionId, but stripeCustomerId mismatch!"
                    );
                    console.log(
                        "   User stripeCustomerId in DB:",
                        userBySubId.stripeCustomerId
                    );
                    console.log("   Subscription customer ID:", customerId);
                }
            } else {
                console.log(
                    "   ✅ User found, but update did not affect rows (data might be identical)"
                );
                console.log("   Current user data:", userByCustomerId);
            }
        } else {
            console.log("✅ DATABASE UPDATED SUCCESSFULLY!");
            console.log("   Updated billingStatus:", result[0].billingStatus);
            console.log(
                "   Updated cancelAtPeriodEnd:",
                result[0].cancelAtPeriodEnd
            );
            console.log(
                "   Updated subscriptionEndsAt:",
                result[0].subscriptionEndsAt
            );
        }
    } catch (error) {
        console.error("❌ Database update error:", error);
        throw error;
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionDeleted(subscription: any) {
    console.log(`Subscription deleted: ${subscription.id}`);

    const customerId = subscription.customer as string;

    // Extract current_period_end from the first subscription item
    const currentPeriodEnd = subscription.items?.data?.[0]?.current_period_end;

    // Validate current_period_end exists
    if (!currentPeriodEnd) {
        console.error(
            `No current_period_end found in subscription items for ${subscription.id}`
        );
        return;
    }

    await db
        .update(UserTable)
        .set({
            billingStatus: "canceled",
            subscriptionEndsAt: new Date(currentPeriodEnd * 1000),
            // Keep stripeSubscriptionId for audit trail - it's set to null
            // Keep stripeCustomerId (not updated here, stays forever)
            cancelAtPeriodEnd: false, // No longer canceling, already canceled
            updatedAt: new Date(),
        })
        .where(eq(UserTable.stripeCustomerId, customerId));

    console.log(`User subscription marked as canceled`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
    console.log(`Payment succeeded for invoice: ${invoice.id}`);

    // Payment successful - subscription should already be "active" from subscription.updated event
    // You might want to send a confirmation email here
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    console.log(`Payment failed for invoice: ${invoice.id}`);

    const customerId = invoice.customer as string;

    await db
        .update(UserTable)
        .set({
            billingStatus: "past_due",
            updatedAt: new Date(),
        })
        .where(eq(UserTable.stripeCustomerId, customerId));

    console.log(`User marked as past_due`);

    // TODO: Send email notification about failed payment
}
