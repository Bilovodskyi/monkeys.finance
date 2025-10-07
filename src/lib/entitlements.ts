import "server-only"; // throws at build if a client import sneaks in
import { EntitlementResponse } from "@/types/entitlement";
import { getTranslations } from "next-intl/server";

export type UserRow = {
    plan: "free" | "pro";
    billingStatus: "none" | "trialing" | "active" | "past_due" | "canceled";
    trialEndsAt: Date | null;
};

export function hasEntitlement(u: UserRow, now = new Date()): boolean {
    if (u.plan === "pro" && (u.billingStatus === "active" || u.billingStatus === "trialing")) return true;
    if (u.plan === "free") {
        if (u.billingStatus === "trialing" && u.trialEndsAt && now < u.trialEndsAt) return true;
        return false;
    }
    return false;
}

export async function formatEntitlementHeading(data: EntitlementResponse): Promise<string> {
    const { plan, billingStatus, daysLeft } = data;
    const t = await getTranslations("entitlements");

    // Pro + active billing → just "Pro"
    if (plan === "pro" && billingStatus === "active") return t("proPlanActive");

    // Pro but not active (edge) → show state
    if (plan === "pro" && billingStatus !== "active") {
        return t("proInactive");
    }

    // Free plan during trial
    if (plan === "free" && billingStatus === "trialing") {
        if (daysLeft > 1) {
            const daysWord = daysLeft === 1 ? t("day") : t("days");
            return t("proTrialDaysLeft", { days: daysLeft, daysWord });
        }
        if (daysLeft === 1) return t("proTrialOneDayLeft");
        return t("proTrialEndsToday");
    }

    // Free plan, not trialing anymore
    return t("freeTrialEnded");
}