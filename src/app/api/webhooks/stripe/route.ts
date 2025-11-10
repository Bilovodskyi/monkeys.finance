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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionUpdate(subscription: any) {
    console.log(
        `Subscription updated: ${subscription.id} - Status: ${subscription.status}`
    );

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
            stripeSubscriptionId: subscription.id,
            billingStatus: subscription.status,
            subscriptionEndsAt: new Date(currentPeriodEnd * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
            updatedAt: new Date(),
        })
        .where(eq(UserTable.stripeCustomerId, customerId));

    console.log(`User subscription updated in database`);
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
            stripeSubscriptionId: null,
            cancelAtPeriodEnd: false,
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
