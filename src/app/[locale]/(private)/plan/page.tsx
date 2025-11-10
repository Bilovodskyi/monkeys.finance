// app/plan/page.tsx

import { auth } from "@clerk/nextjs/server";
import { getEntitlementForUser } from "@/services/entitlements";
import { formatEntitlementHeading } from "@/lib/entitlements";
import { getTranslations } from "next-intl/server";
import type { EntitlementResponse } from "@/types/entitlement";
import { PlanClient } from "@/components/private/plan/PlanClient";
import { getTierForCountry, getTierInfo } from "@/lib/pricingTiers";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function PlanPage() {
    const { userId } = await auth();
    if (!userId) return null;

    // Fetch user entitlement
    const data: EntitlementResponse | null = await getEntitlementForUser(
        userId
    );
    if (!data || !data.subscriptionEndsAt) return null;

    // Get translations
    const t = await getTranslations("plan");
    const heading = await formatEntitlementHeading(data);

    // Get user from database to retrieve country
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.clerkId, userId),
        columns: { country: true, billingStatus: true },
    });

    console.log("User billing status:", user?.billingStatus);

    // Use country from database (fallback to US if not set)
    const countryCode = user?.country || "US";

    // Get pricing tier info
    const tier = getTierForCountry(countryCode);
    const tierInfo = getTierInfo(tier);

    // Pass everything to client component
    return (
        <PlanClient
            heading={heading}
            subscriptionEndsAt={data.subscriptionEndsAt}
            countryCode={countryCode}
            monthlyPrice={tierInfo.monthly}
            yearlyPrice={tierInfo.yearly}
            currency={tierInfo.symbol}
            plan={user?.billingStatus || undefined}
        />
    );
}
