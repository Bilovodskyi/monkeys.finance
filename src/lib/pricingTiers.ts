export type PricingTier = "tier1" | "tier2" | "tier3";

export type BillingInterval = "monthly" | "yearly";

export interface TierPricing {
    monthly: number;
    yearly: number;
    currency: string;
    symbol: string;
}

export interface TierInfo extends TierPricing {
    priceIds: {
        monthly: string;
        yearly: string;
    };
}

// Country to tier mapping
export const COUNTRY_TIERS: Record<string, PricingTier> = {
    // Tier 1: High-income countries ($29.99)
    US: "tier1", // United States
    CA: "tier1", // Canada
    GB: "tier1", // United Kingdom
    AU: "tier1", // Australia
    NZ: "tier1", // New Zealand
    DE: "tier1", // Germany
    FR: "tier1", // France
    IT: "tier1", // Italy
    ES: "tier1", // Spain
    NL: "tier1", // Netherlands
    SE: "tier1", // Sweden
    NO: "tier1", // Norway
    DK: "tier1", // Denmark
    FI: "tier1", // Finland
    CH: "tier1", // Switzerland
    AT: "tier1", // Austria
    BE: "tier1", // Belgium
    IE: "tier1", // Ireland
    SG: "tier1", // Singapore
    JP: "tier1", // Japan
    KR: "tier1", // South Korea
    HK: "tier1", // Hong Kong

    // Tier 2: Mid-income countries ($19.99)
    MX: "tier2", // Mexico
    BR: "tier2", // Brazil
    AR: "tier2", // Argentina
    CL: "tier2", // Chile
    CO: "tier2", // Colombia
    PE: "tier2", // Peru
    PL: "tier2", // Poland
    CZ: "tier2", // Czech Republic
    HU: "tier2", // Hungary
    RO: "tier2", // Romania
    BG: "tier2", // Bulgaria
    HR: "tier2", // Croatia
    GR: "tier2", // Greece
    PT: "tier2", // Portugal
    MY: "tier2", // Malaysia
    TH: "tier2", // Thailand
    CN: "tier2", // China
    RU: "tier2", // Russia
    TR: "tier2", // Turkey
    ZA: "tier2", // South Africa
    AE: "tier2", // UAE
    SA: "tier2", // Saudi Arabia

    // Tier 3: Lower-income countries ($9.99)
    IN: "tier3", // India
    PK: "tier3", // Pakistan
    BD: "tier3", // Bangladesh
    VN: "tier3", // Vietnam
    PH: "tier3", // Philippines
    ID: "tier3", // Indonesia
    EG: "tier3", // Egypt
    NG: "tier3", // Nigeria
    KE: "tier3", // Kenya
    UA: "tier3", // Ukraine
    LK: "tier3", // Sri Lanka
    NP: "tier3", // Nepal
    MM: "tier3", // Myanmar
    KH: "tier3", // Cambodia
    LA: "tier3", // Laos
    ET: "tier3", // Ethiopia
    GH: "tier3", // Ghana
    TZ: "tier3", // Tanzania
    UG: "tier3", // Uganda
};

// Price IDs from environment variables
export const TIER_PRICE_IDS: Record<
    PricingTier,
    { monthly: string; yearly: string }
> = {
    tier1: {
        monthly: process.env.STRIPE_PRICE_TIER_1_MONTHLY!,
        yearly: process.env.STRIPE_PRICE_TIER_1_YEARLY!,
    },
    tier2: {
        monthly: process.env.STRIPE_PRICE_TIER_2_MONTHLY!,
        yearly: process.env.STRIPE_PRICE_TIER_2_YEARLY!,
    },
    tier3: {
        monthly: process.env.STRIPE_PRICE_TIER_3_MONTHLY!,
        yearly: process.env.STRIPE_PRICE_TIER_3_YEARLY!,
    },
};

// Display information for each tier
export const TIER_PRICING: Record<PricingTier, TierPricing> = {
    tier1: {
        monthly: 39.99,
        yearly: 383.9, // $39.99 × 12 × 0.8 (20% discount)
        currency: "USD",
        symbol: "$",
    },
    tier2: {
        monthly: 19.99,
        yearly: 191.9, // $19.99 × 12 × 0.8 (20% discount)
        currency: "USD",
        symbol: "$",
    },
    tier3: {
        monthly: 9.99,
        yearly: 95.9, // $9.99 × 12 × 0.8 (20% discount)
        currency: "USD",
        symbol: "$",
    },
};

export function getTierForCountry(countryCode: string): PricingTier {
    return COUNTRY_TIERS[countryCode.toUpperCase()] || "tier1";
}

export function getPriceIdForCountry(
    countryCode: string,
    interval: BillingInterval
): string {
    const tier = getTierForCountry(countryCode);
    return TIER_PRICE_IDS[tier][interval];
}

export function getTierInfo(tier: PricingTier): TierInfo {
    return {
        ...TIER_PRICING[tier],
        priceIds: TIER_PRICE_IDS[tier],
    };
}

export function getPriceForTier(
    tier: PricingTier,
    interval: BillingInterval
): number {
    return TIER_PRICING[tier][interval];
}

export function getCountryPricing(countryCode: string): {
    tier: PricingTier;
    info: TierInfo;
} {
    const tier = getTierForCountry(countryCode);
    const info = getTierInfo(tier);
    return { tier, info };
}
