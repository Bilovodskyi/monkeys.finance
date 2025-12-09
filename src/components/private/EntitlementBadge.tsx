"use client";

import { useInstancesData } from "@/hooks/useInstancesData";
import { useEntitlementHeading } from "@/lib/has-entitelment-client";
import { useTranslations } from "next-intl";

export default function EntitlementBadge() {
    const { user, daysLeft, isLoading, error } = useInstancesData();
    const t = useTranslations("entitlements");
    
    // We need to call the hook unconditionally, but we can pass dummy data if user is null
    // The result won't be used if we return early for loading/error
    const heading = useEntitlementHeading({
        billingStatus: user?.billingStatus ?? "canceled",
        daysLeft: daysLeft,
        cancelAtPeriodEnd: user?.cancelAtPeriodEnd ?? false,
    });

    if (isLoading) {
        return <div className="text-secondary text-xs bg-neutral-900 px-2 py-1 rounded-full border border-zinc-800 shrink-0">
            {t("loading")}
        </div>
    }

    if (error || !user) {
        return <div className="text-secondary text-xs bg-neutral-900 px-2 py-1 rounded-full border border-zinc-800 shrink-0">
            {t("errorOccurred")}
        </div>
    }

    return  <div className="text-secondary text-xs bg-neutral-900 px-2 py-1 rounded-full border border-zinc-800 shrink-0">
                    {heading}
                </div>
}