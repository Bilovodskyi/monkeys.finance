export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { Webhook } from "svix";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";

const SECRET = process.env.CLERK_WEBHOOK_SECRET!;


export async function POST(req: Request) {
    const body = await req.text();        // IMPORTANT: Svix needs the raw string

    const SKIP_VERIFY = process.env.CLERK_WEBHOOK_SKIP_VERIFY === "1";
    console.log("[clerk-webhook] SKIP_VERIFY:", SKIP_VERIFY);

    let evt: any;
    try {
        const svixId = req.headers.get("svix-id");
        const svixTs = req.headers.get("svix-timestamp");
        const svixSig = req.headers.get("svix-signature");

        if (SKIP_VERIFY && !svixId && !svixTs && !svixSig) {
            console.log("[clerk-webhook] DEV: skipping verify (no Svix headers, SKIP_VERIFY=1)");
            evt = JSON.parse(body);
        } else {
            if (!svixId || !svixTs || !svixSig) {
                console.error("[clerk-webhook] Missing Svix headers");
                return new Response("Missing Svix headers", { status: 400 });
            }
            evt = new Webhook(SECRET).verify(body, {
                "svix-id": svixId,
                "svix-timestamp": svixTs,
                "svix-signature": svixSig,
            });
        }
    } catch (e) {
        console.error("[clerk-webhook] Verify error:", e);
        return new Response("Invalid signature/payload", { status: 400 });
    }

    console.log("[clerk-webhook] verified", { type: evt?.type, id: evt?.data?.id });

    if (evt.type === "user.created") {
        const u = evt.data;
        const clerkId = String(u.id);
        const email = u.email_addresses?.[0]?.email_address ?? null;
        const name =
            (u.first_name?.trim()) ||
            (u.username?.trim()) ||
            (email ? email.split("@")[0] : null) ||
            "User";

        try {
            const existing = await db.query.UserTable.findFirst({
                where: (t, { eq }) => eq(t.clerkId, clerkId),
            });
            console.log("[clerk-webhook] existing?", !!existing);

            if (!existing) {
                console.log("[clerk-webhook] inserting", { clerkId, email, name });
                await db.insert(UserTable).values({
                    // id omitted -> uuid defaultRandom()
                    clerkId,
                    email: email!,  // your schema requires NOT NULL + UNIQUE
                    name,           // NOT NULL
                    // notifyEmail is TEXT in your schema; set if you want a default string
                    // notifyEmail: "true",
                });
                console.log("[clerk-webhook] insert OK");
            }
        } catch (e) {
            console.error("[clerk-webhook] DB error:", e);
            return new Response("DB error", { status: 500 });
        }
    }

    return new Response("ok", { status: 200 });
}