import "server-only"; // throws at build if a client import sneaks in
import { EntitlementResponse } from "@/types/entitlement";
import { getTranslations } from "next-intl/server";

export type UserRow = {
    billingStatus: "trialing" | "active" | "past_due" | "canceled" | "unpaid";
    subscriptionEndsAt: Date;
    cancelAtPeriodEnd: boolean;
};

export function hasEntitlement(user: UserRow, now = new Date()): boolean {
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
        user.billingStatus === "canceled" &&
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
    const { billingStatus, daysLeft } = data;
    const t = await getTranslations("entitlements");

    // Active paid subscription
    if (billingStatus === "active") return t("proPlanActive");

    // Canceled but still has access until period end
    if (billingStatus === "canceled" && daysLeft > 0) {
        const daysWord = daysLeft === 1 ? t("day") : t("days");
        return t("proTrialDaysLeft", { days: daysLeft, daysWord });
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
    if (billingStatus === "past_due" || billingStatus === "unpaid") {
        return t("proInactive");
    }

    // Trial/subscription ended
    return t("freeTrialEnded");
}
