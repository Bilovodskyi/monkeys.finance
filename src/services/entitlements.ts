import "server-only";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { hasEntitlement } from "@/lib/entitlements";

export type Plan = "free" | "pro";
export type BillingStatus = "none" | "trialing" | "active" | "past_due" | "canceled";

export interface EntitlementResponse {
    plan: Plan;
    billingStatus: BillingStatus;
    trialEndsAt: string | null;
    daysLeft: number;
    allowed: boolean;
}

function computeDaysLeft(trialEndsAt: Date | null) {
    if (!trialEndsAt) return 0;
    const MS_PER_DAY = 86_400_000;
    return Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / MS_PER_DAY));
}

export async function getEntitlementForUser(clerkId: string): Promise<EntitlementResponse | null> {
    const user = await db.query.UserTable.findFirst({
        where: (userTable) => eq(userTable.clerkId, clerkId),
        columns: { plan: true, billingStatus: true, trialEndsAt: true },
    });
    if (!user) return null;

    return {
        plan: user.plan,
        billingStatus: user.billingStatus,
        trialEndsAt: user.trialEndsAt?.toISOString() ?? null,
        daysLeft: computeDaysLeft(user.trialEndsAt),
        allowed: hasEntitlement({
            plan: user.plan,
            billingStatus: user.billingStatus,
            trialEndsAt: user.trialEndsAt,
        }),
    };
}