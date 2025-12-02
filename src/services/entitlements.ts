import "server-only";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import type { EntitlementResponse } from "@/types/entitlement";
import { auth } from "@clerk/nextjs/server";
import { computeDaysLeft, hasEntitlement } from "@/lib/has-entitelment-client";


export async function getEntitlementForUser(): Promise<EntitlementResponse | null> {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.query.UserTable.findFirst({
        where: (userTable) => eq(userTable.clerkId, userId),
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
        cancelAtPeriodEnd: user.cancelAtPeriodEnd ?? false,
        daysLeft: computeDaysLeft(user.subscriptionEndsAt),
        allowed: hasEntitlement({
            billingStatus: user.billingStatus,
            subscriptionEndsAt: user.subscriptionEndsAt,
            cancelAtPeriodEnd: user.cancelAtPeriodEnd ?? false,
        }),
    };
}
