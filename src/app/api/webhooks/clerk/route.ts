export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import {
    UserTable,
    InstanceTable,
    UserTelegramNotificationSettingsTable,
    NotificationPreferencesTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";

const SECRET = process.env.CLERK_WEBHOOK_SECRET!;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
});

type ClerkWebhookEvent = {
    type: string;
    data: {
        id: string;
        user_id?: string;
        email_addresses?: Array<{
            email_address: string;
            id: string;
        }>;
        first_name?: string;
        last_name?: string;
        username?: string;
        image_url?: string;
    };
    event_attributes?: {
        http_request?: {
            client_ip?: string;
            user_agent?: string;
        };
    };
};

export async function POST(req: Request) {
    console.log("🔥🔥🔥 [clerk-webhook] REQUEST RECEIVED 🔥🔥🔥");
    console.log("[clerk-webhook] URL:", req.url);
    console.log("[clerk-webhook] Method:", req.method);

    // Validate webhook secret is configured
    if (!SECRET) {
        console.error("[clerk-webhook] CLERK_WEBHOOK_SECRET not configured");
        return new Response("Webhook secret not configured", { status: 500 });
    }

    const body = await req.text();
    const SKIP_VERIFY = process.env.CLERK_WEBHOOK_SKIP_VERIFY === "1";

    if (SKIP_VERIFY) {
        console.warn(
            "[clerk-webhook] ⚠️  SKIP_VERIFY enabled - use only for local dev"
        );
    }

    let evt: ClerkWebhookEvent;

    try {
        // Debug: Log ALL headers
        const allHeaders: Record<string, string> = {};
        req.headers.forEach((value, key) => {
            allHeaders[key] = value;
        });
        console.log("[clerk-webhook] All headers:", allHeaders);

        // Get headers directly from request object
        const svixId = req.headers.get("svix-id");
        const svixTs = req.headers.get("svix-timestamp");
        const svixSig = req.headers.get("svix-signature");

        console.log("[clerk-webhook] Svix headers:", {
            svixId,
            svixTs,
            svixSig,
        });

        // Skip verification in local dev mode
        if (SKIP_VERIFY && !svixId && !svixTs && !svixSig) {
            console.log("[clerk-webhook] DEV: skipping verification");
            evt = JSON.parse(body);
        } else {
            // Verify webhook signature
            if (!svixId || !svixTs || !svixSig) {
                console.error("[clerk-webhook] Missing Svix headers");
                return new Response("Missing Svix headers", { status: 400 });
            }

            const wh = new Webhook(SECRET);
            evt = wh.verify(body, {
                "svix-id": svixId,
                "svix-timestamp": svixTs,
                "svix-signature": svixSig,
            }) as ClerkWebhookEvent;
        }
    } catch (e) {
        console.error("[clerk-webhook] Verification failed:", e);
        return new Response("Invalid signature", { status: 400 });
    }

    console.log("[clerk-webhook] Event received:", {
        type: evt.type,
        userId: evt.data.id || evt.data.user_id,
    });

    // ========================================
    // HANDLE USER CREATION
    // ========================================
    if (evt.type === "user.created") {
        const { data } = evt;
        const clerkId = data.id;
        const email = data.email_addresses?.[0]?.email_address;

        console.log("[clerk-webhook] Processing user.created event");

        // Validate required fields
        if (!email) {
            console.error("[clerk-webhook] No email found for user:", clerkId);
            return new Response("Email required", { status: 400 });
        }

        // Generate name from available data
        const name =
            data.first_name?.trim() ||
            data.username?.trim() ||
            email.split("@")[0] ||
            "User";

        try {
            // Check if user already exists by clerkId OR email (prevent abuse)
            const existing = await db.query.UserTable.findFirst({
                where: (table, { eq, or }) =>
                    or(eq(table.clerkId, clerkId), eq(table.email, email)),
            });

            if (existing) {
                console.log("[clerk-webhook] User already exists:", email);

                // Update clerkId if it changed
                if (existing.clerkId !== clerkId) {
                    console.log(
                        `[clerk-webhook] Updating clerkId to ${clerkId}`
                    );
                    await db
                        .update(UserTable)
                        .set({
                            clerkId,
                            name,
                            updatedAt: new Date(),
                        })
                        .where(eq(UserTable.email, email));
                }

                return new Response("User already exists", { status: 200 });
            }

            // ========================================
            // STEP 1: CREATE USER IMMEDIATELY
            // ========================================
            console.log("[clerk-webhook] 📝 Creating user immediately...");

            function addMonths(date: Date, months: number) {
                const d = new Date(date);
                d.setMonth(d.getMonth() + months);
                return d;
            }

            const [createdUser] = await db
                .insert(UserTable)
                .values({
                    clerkId,
                    email,
                    name,
                    subscriptionEndsAt: addMonths(new Date(), 1), // 1 month trial
                    billingStatus: "trialing",
                    country: "US", // Default - will be updated below
                    cancelAtPeriodEnd: false,
                })
                .returning();
            console.log("[clerk-webhook] ✅ User created immediately:", {
                id: createdUser.id,
                email: createdUser.email,
                country: "US (default)",
            });

            // ========================================
            // STEP 2: UPDATE COUNTRY IN BACKGROUND (non-blocking)
            // ========================================
            // Don't await - let this run in background
            updateUserCountry(clerkId).catch((error) => {
                console.error(
                    "[clerk-webhook] ⚠️  Background country update failed:",
                    error
                );
                // Non-critical - user is already created
            });

            console.log(
                "[clerk-webhook] 🔄 Country detection running in background..."
            );
            return new Response("User created", { status: 201 });
        } catch (e: any) {
            console.error("[clerk-webhook] Database error:", e);

            // Handle duplicate email error gracefully
            if (
                e.code === "23505" ||
                e.message?.includes("unique constraint")
            ) {
                console.log(
                    "[clerk-webhook] User already exists (unique constraint)"
                );
                return new Response("User already exists", { status: 200 });
            }

            return new Response("Database error", { status: 500 });
        }
    }

    // ========================================
    // HANDLE USER DELETION
    // ========================================
    if (evt.type === "user.deleted") {
        const { data } = evt;
        const clerkId = data.id;

        console.log("[clerk-webhook] Processing user.deleted event:", clerkId);

        try {
            // Find user in database
            const user = await db.query.UserTable.findFirst({
                where: (table, { eq }) => eq(table.clerkId, clerkId),
            });

            if (!user) {
                console.log("[clerk-webhook] User not found in DB:", clerkId);
                return new Response("User not found", { status: 404 });
            }

            console.log("[clerk-webhook] Found user:", {
                email: user.email,
                stripeSubscriptionId: user.stripeSubscriptionId,
                billingStatus: user.billingStatus,
            });

            // ========================================
            // DELETE ALL USER INSTANCES
            // ========================================
            try {
                const deletedInstances = await db
                    .delete(InstanceTable)
                    .where(eq(InstanceTable.userId, user.id))
                    .returning();

                console.log(
                    `[clerk-webhook] ✅ Deleted ${deletedInstances.length} instances for user`
                );
            } catch (instanceError: any) {
                console.error(
                    "[clerk-webhook] ⚠️  Failed to delete instances:",
                    instanceError.message
                );
            }

            // ========================================
            // DELETE PROVIDER
            // ========================================
            try {
                const deletedProvider = await db
                    .delete(UserTelegramNotificationSettingsTable)
                    .where(
                        eq(
                            UserTelegramNotificationSettingsTable.userId,
                            user.id
                        )
                    )
                    .returning();

                console.log(
                    `[clerk-webhook] ✅ Deleted ${deletedProvider} for user`
                );
            } catch (instanceError: any) {
                console.error(
                    "[clerk-webhook] ⚠️  Failed to delete instances:",
                    instanceError.message
                );
                // Continue anyway - we still want to process deletion
            }

            // ========================================
            // DELETE NOTIFICATIONS SETTINGS
            // ========================================
            try {
                const deletedNotificationsSettings = await db
                    .delete(NotificationPreferencesTable)
                    .where(eq(NotificationPreferencesTable.userId, user.id))
                    .returning();

                console.log(
                    `[clerk-webhook] ✅ Deleted ${deletedNotificationsSettings.length} notification settings for user`
                );
            } catch (instanceError: any) {
                console.error(
                    "[clerk-webhook] ⚠️  Failed to delete instances:",
                    instanceError.message
                );
                // Continue anyway - we still want to process deletion
            }

            // ========================================
            // CANCEL STRIPE SUBSCRIPTION (if exists)
            // ========================================
            if (user.stripeSubscriptionId) {
                try {
                    console.log(
                        "[clerk-webhook] Canceling Stripe subscription:",
                        user.stripeSubscriptionId
                    );

                    // Cancel subscription at period end
                    const canceledSubscription =
                        await stripe.subscriptions.update(
                            user.stripeSubscriptionId,
                            {
                                cancel_at_period_end: true,
                            }
                        );

                    console.log(
                        "[clerk-webhook] ✅ Stripe subscription canceled:",
                        canceledSubscription.id
                    );
                } catch (stripeError: any) {
                    console.error(
                        "[clerk-webhook] ⚠️  Failed to cancel Stripe subscription:",
                        stripeError.message
                    );
                    // Continue anyway - we still want to mark user as deleted
                }
            } else {
                console.log(
                    "[clerk-webhook] No subscription to cancel (trial user)"
                );
            }

            console.log("[clerk-webhook] Record kept for abuse prevention");

            return new Response("User deleted and subscription canceled", {
                status: 200,
            });
        } catch (e: any) {
            console.error("[clerk-webhook] Error processing deletion:", e);
            return new Response("Failed to process deletion", {
                status: 500,
            });
        }
    }

    return new Response("Event processed", { status: 200 });
}

// ========================================
// BACKGROUND FUNCTION: Update User Country
// ========================================
async function updateUserCountry(clerkId: string): Promise<void> {
    console.log(`[updateUserCountry] Starting for user: ${clerkId}`);

    try {
        const clerk = await clerkClient();

        // Wait a moment for session to be fully created
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Fetch sessions from Clerk API
        const sessions = await clerk.sessions.getSessionList({
            userId: clerkId,
        });

        if (!sessions || !sessions.data || sessions.data.length === 0) {
            console.log(
                `[updateUserCountry] No sessions found for user: ${clerkId}`
            );
            return;
        }

        // Get country from most recent session
        const latestSession = sessions.data[0];
        const country = latestSession.latestActivity?.country;

        if (!country) {
            console.log(`[updateUserCountry] No country data in session`);
            return;
        }

        // Only update if country is different from default
        if (country === "US") {
            console.log(
                `[updateUserCountry] Country is US (default), skipping update`
            );
            return;
        }

        // Update user's country in database
        await db
            .update(UserTable)
            .set({
                country: country,
                updatedAt: new Date(),
            })
            .where(eq(UserTable.clerkId, clerkId));

        console.log(
            `[updateUserCountry] ✅ Country updated to: ${country} for user: ${clerkId}`
        );
    } catch (error: any) {
        console.error(
            `[updateUserCountry] Failed for user ${clerkId}:`,
            error.message
        );
        // Don't throw - this is background work, failure is non-critical
    }
}
