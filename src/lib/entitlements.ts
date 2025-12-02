import "server-only"; // throws at build if a client import sneaks in
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { hasEntitlement } from "./has-entitelment-client";
import { EntitlementResponse } from "@/types/entitlement";
import { getTranslations } from "next-intl/server";

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
