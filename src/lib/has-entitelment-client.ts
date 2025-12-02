import { useTranslations } from "next-intl";
import { EntitlementResponse } from "@/types/entitlement";

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

export function computeDaysLeft(subscriptionEndsAt: Date | null) {
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

export function useEntitlementHeading(data: Pick<EntitlementResponse, "billingStatus" | "daysLeft" | "cancelAtPeriodEnd">): string {
    const t = useTranslations("entitlements");
    const { billingStatus, daysLeft, cancelAtPeriodEnd } = data;

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
        // If somehow daysLeft < 0, trial expired
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