import "server-only";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { hasEntitlement } from "@/lib/entitlements";
import type { EntitlementResponse } from "@/types/entitlement";

function computeDaysLeft(subscriptionEndsAt: Date | null) {
    if (!subscriptionEndsAt) return 0;
    const MS_PER_DAY = 86_400_000;
    return Math.max(
        0,
        Math.ceil((subscriptionEndsAt.getTime() - Date.now()) / MS_PER_DAY)
    );
}

export async function getEntitlementForUser(
    clerkId: string
): Promise<EntitlementResponse | null> {
    const user = await db.query.UserTable.findFirst({
        where: (userTable) => eq(userTable.clerkId, clerkId),
        columns: {
            billingStatus: true,
            subscriptionEndsAt: true,
            cancelAtPeriodEnd: true,
        },
    });
    if (!user) return null;

    return {
        billingStatus: user.billingStatus,
        subscriptionEndsAt: user.subscriptionEndsAt?.toISOString() ?? null,
        daysLeft: computeDaysLeft(user.subscriptionEndsAt),
        allowed: hasEntitlement({
            billingStatus: user.billingStatus,
            subscriptionEndsAt: user.subscriptionEndsAt,
            cancelAtPeriodEnd: user.cancelAtPeriodEnd ?? false,
        }),
    };
}
