import "server-only";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { hasEntitlement } from "@/lib/entitlements";
import type { EntitlementResponse } from "@/types/entitlement";

function computeDaysLeft(subscriptionEndsAt: Date | null) {
    if (!subscriptionEndsAt) return 0;

    const now = new Date();
    const endDate = new Date(subscriptionEndsAt);

    // If already expired (past the exact time)
    if (endDate.getTime() <= now.getTime()) {
        return -1; // Expired
    }

    // Calculate time difference in milliseconds
    const MS_PER_DAY = 86_400_000;
    const diffMs = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / MS_PER_DAY);

    // Special handling for same-day expiration
    // If less than 24 hours and it's today, check if same calendar day
    if (diffDays === 1) {
        const isSameDay =
            now.getFullYear() === endDate.getFullYear() &&
            now.getMonth() === endDate.getMonth() &&
            now.getDate() === endDate.getDate();

        if (isSameDay) {
            return 0; // Expires today
        }
    }

    return diffDays;
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
