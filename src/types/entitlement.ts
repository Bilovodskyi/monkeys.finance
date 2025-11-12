export type BillingStatus =
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid";

/**
 * Shape returned by GET /api/me/entitlement
 * Note: Dates are serialized in JSON, so `subscriptionEndsAt` is a string (ISO) or null.
 */
export interface EntitlementResponse {
    billingStatus: BillingStatus;
    subscriptionEndsAt: string | null; // e.g. "2026-04-10T00:00:00.000Z"
    daysLeft: number; // non-negative integer
    allowed: boolean; // true if user can access gated features
    cancelAtPeriodEnd: boolean; // true if user canceled but still has access until period end
}
