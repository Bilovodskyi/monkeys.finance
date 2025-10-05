import "server-only"; // throws at build if a client import sneaks in
import { EntitlementResponse } from "@/types/entitlement";

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

const plural = (n: number, word: string) => (n === 1 ? word : `${word}s`);

export function formatEntitlementHeading(data: EntitlementResponse): string {
    const { plan, billingStatus, daysLeft } = data;

    // Pro + active billing → just "Pro"
    if (plan === "pro" && billingStatus === "active") return "Pro plan - active";

    // Pro but not active (edge) → show state
    if (plan === "pro" && billingStatus !== "active") {
        return "Pro (inactive)";
    }

    // Free plan during trial
    if (plan === "free" && billingStatus === "trialing") {
        if (daysLeft > 1) return `Pro Trial – ${daysLeft} ${plural(daysLeft, "day")} left`;
        if (daysLeft === 1) return "Pro Trial – 1 day left";
        return "Pro Trial – ends today";
    }

    // Free plan, not trialing anymore
    return "Free (trial ended)";
}