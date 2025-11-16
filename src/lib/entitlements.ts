import "server-only"; // throws at build if a client import sneaks in
import { EntitlementResponse } from "@/types/entitlement";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

export type UserRow = {
    billingStatus: "trialing" | "active" | "past_due" | "canceled" | "unpaid";
    subscriptionEndsAt: Date;
    cancelAtPeriodEnd: boolean | null;
};

export function hasEntitlement(
    user: Pick<
        UserRow,
        "billingStatus" | "subscriptionEndsAt" | "cancelAtPeriodEnd"
    >,
    now = new Date()
): boolean {
    // Case 1: Active subscription that hasn't expired yet
    if (
        user.billingStatus === "active" &&
        user.subscriptionEndsAt &&
        user.subscriptionEndsAt > now
    ) {
        return true;
    }

    // Case 2: In trial period that hasn't expired
    if (
        user.billingStatus === "trialing" &&
        user.subscriptionEndsAt &&
        user.subscriptionEndsAt > now
    ) {
        return true;
    }

    // Case 3: Canceled but still in paid period (they paid until end date)
    if (
        user.billingStatus === "active" &&
        user.cancelAtPeriodEnd &&
        user.subscriptionEndsAt &&
        user.subscriptionEndsAt > now
    ) {
        return true;
    }

    // Default: No access
    return false;
}

export async function formatEntitlementHeading(
    data: EntitlementResponse
): Promise<string> {
    const { billingStatus, daysLeft, cancelAtPeriodEnd } = data;
    const t = await getTranslations("entitlements");

    // Active paid subscription - check if canceled
    if (billingStatus === "active") {
        if (cancelAtPeriodEnd && daysLeft >= 0) {
            return t("proPlanCanceled");
        }
        return t("proPlanActive");
    }

    // Trial period with time remaining
    if (billingStatus === "trialing") {
        if (daysLeft > 1) {
            const daysWord = t("days");
            return t("proTrialDaysLeft", { days: daysLeft, daysWord });
        }
        if (daysLeft === 1) return t("proTrialOneDayLeft");
        if (daysLeft === 0) return t("proTrialEndsToday");
        // If somehow daysLeft < 0, trial expired (shouldn't happen due to Math.max in calculation)
        return t("freeTrialEnded");
    }

    // Payment issues - subscription exists but payment failed
    if (
        billingStatus === "past_due" ||
        billingStatus === "unpaid" ||
        billingStatus === "canceled"
    ) {
        return t("proInactive");
    }

    // Trial/subscription ended
    return t("freeTrialEnded");
}

export async function getActiveSubscriptionStatusForUI() {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        return { user: false, hasActiveSubscription: false };
    }

    const user = await db.query.UserTable.findFirst({
        where: (UserTable) => eq(UserTable.clerkId, clerkId),
    });

    return {
        user: true,
        hasActiveSubscription: user ? hasEntitlement(user) : false,
    };
}
