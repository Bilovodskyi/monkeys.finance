export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { Webhook } from "svix";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const SECRET = process.env.CLERK_WEBHOOK_SECRET!;

type ClerkWebhookEvent = {
    type: string;
    data: {
        id: string;
        email_addresses?: Array<{
            email_address: string;
            id: string;
        }>;
        first_name?: string;
        last_name?: string;
        username?: string;
        image_url?: string;
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
        console.warn("[clerk-webhook] ⚠️  SKIP_VERIFY enabled - use only for local dev");
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

        console.log("[clerk-webhook] Svix headers:", { svixId, svixTs, svixSig });

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
        userId: evt.data.id,
    });

    // Handle user.created event
    if (evt.type === "user.created") {
        const { data } = evt;
        const clerkId = data.id;
        const email = data.email_addresses?.[0]?.email_address;

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
            // Check if user already exists
            const existing = await db.query.UserTable.findFirst({
                where: eq(UserTable.clerkId, clerkId),
            });

            if (existing) {
                console.log("[clerk-webhook] User already exists:", clerkId);
                return new Response("User already exists", { status: 200 });
            }

            // Insert new user
            console.log("[clerk-webhook] Creating user:", { clerkId, email, name });

            await db.insert(UserTable).values({
                clerkId,
                email,
                name,
                // Optional: set default timezone based on user data if available
                // timezone: data.timezone || "UTC",
            });

            console.log("[clerk-webhook] ✅ User created successfully");
            return new Response("User created", { status: 201 });
        } catch (e: any) {
            console.error("[clerk-webhook] Database error:", e);

            // Handle duplicate email error gracefully
            if (e.code === "23505" || e.message?.includes("unique constraint")) {
                console.log("[clerk-webhook] User already exists (unique constraint)");
                return new Response("User already exists", { status: 200 });
            }

            return new Response("Database error", { status: 500 });
        }
    }


    return new Response("Event processed", { status: 200 });
}