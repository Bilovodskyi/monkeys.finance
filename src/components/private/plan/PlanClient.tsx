// app/plan/plan-client.tsx

"use client";

import { useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import { CustomButton } from "@/components/CustomButton";
import { parseIsoToDateTime } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

interface PlanClientProps {
    heading: string;
    subscriptionEndsAt: string;
    daysLeft: number;
    countryCode: string;
    monthlyPrice: number;
    yearlyPrice: number;
    currency: string;
    plan?: string | undefined;
}

export function PlanClient({
    heading,
    subscriptionEndsAt,
    daysLeft,
    countryCode,
    monthlyPrice,
    yearlyPrice,
    currency,
    plan,
}: PlanClientProps) {
    const t = useTranslations("plan");
    const locale = useLocale(); // Get current locale: "en", "es", "uk", or "ru"
    const [loadingMonthly, setLoadingMonthly] = useState(false);
    const [loadingYearly, setLoadingYearly] = useState(false);
    const [loadingPortal, setLoadingPortal] = useState(false);

    const handleSubscribe = async (interval: "monthly" | "yearly") => {
        const setLoading =
            interval === "monthly" ? setLoadingMonthly : setLoadingYearly;
        setLoading(true);

        try {
            const response = await fetch(
                "/api/stripe/create-checkout-session",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ interval, locale }), // Pass monthly/yearly and locale
                }
            );

            const data = await response.json();

            if (data.url) {
                // Redirect in same tab to avoid Safari popup blocker
                window.location.href = data.url;
            } else {
                setLoading(false);
                throw new Error(data.error || "Failed to create checkout");
            }
        } catch (error) {
            console.error("Error creating checkout:", error);
            alert("Failed to start checkout. Please try again.");
            setLoading(false);
        }
    };

    const handleManageSubscription = async () => {
        setLoadingPortal(true);

        try {
            const response = await fetch("/api/stripe/create-portal-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ locale }), // Pass locale
            });

            const data = await response.json();

            if (data.url) {
                // Redirect in same tab to avoid Safari popup blocker
                window.location.href = data.url;
            } else {
                setLoadingPortal(false);
                throw new Error(data.error || "Failed to open portal");
            }
        } catch (error) {
            console.error("Error opening portal:", error);
            alert("Failed to open subscription management. Please try again.");
            setLoadingPortal(false);
        }
    };

    const { date, time } = parseIsoToDateTime(
        subscriptionEndsAt,
        locale,
        countryCode
    );

    // Use the daysLeft already calculated on the server
    // Determine the appropriate message key and parameters
    let messageKey = "planEndsMessage";
    const messageParams: Record<string, string> = { date, time };

    if (daysLeft < 0) {
        // Plan expired
        messageKey = "planExpiredMessage";
    } else if (daysLeft === 0) {
        // Plan expires today
        messageKey = "planEndsTodayMessage";
    } else if (daysLeft === 1) {
        // Plan expires tomorrow
        messageKey = "planEndsTomorrowMessage";
    }

    return (
        <div className="flex flex-col items-center justify-center lg:h-full w-full lg:w-1/4 lg:mx-auto px-4 lg:px-0 gap-2 pt-8 lg:py-0 pb-12 lg:pb-0">
            <h1 className="text-lg font-bold">{heading}</h1>
            <p className="text-center text-tertiary">
                {t(messageKey, messageParams)}
            </p>
            {plan === "active" && (
                <div className="flex items-center gap-3 mt-2">
                    <CustomButton
                        isBlue={true}
                        onClick={handleManageSubscription}
                        disabled={loadingPortal}>
                        {loadingPortal ? t("loading") : "Manage Subscription"}
                    </CustomButton>
                </div>
            )}
            {plan !== "active" && (
                <div className="flex flex-col max-md:items-center lg:flex-row gap-4 mt-6 max-md:w-full">
                    {/* Monthly Plan */}
                    <div className="border border-zinc-800 p-4 md:p-6 space-y-3 h-full w-[320px] lg:w-[250px]">
                        <h2 className="text-lg font-bold">{t("monthly")}</h2>
                        <span className="text-2xl">
                            {currency}
                            {monthlyPrice.toFixed(2)} / {t("monthlyShort")}{" "}
                            <span className="text-xs text-tertiary">
                                {t("excVat")}
                            </span>
                        </span>
                        <p className="text-secondary">{t("including")}</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {t("features.algorithms")}
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {t("features.mlModels")}
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {t("features.tradingBot")}
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {t("features.unlimitedInstances")}
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {t("features.unlimitedNotifications")}
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {t("features.supportProject")}
                            </li>
                        </ul>
                        <div className="h-[1px] bg-zinc-800 my-4" />
                        <div className="flex justify-center">
                            <CustomButton
                                isBlue={false}
                                onClick={() => handleSubscribe("monthly")}
                                disabled={loadingMonthly}>
                                {loadingMonthly
                                    ? t("loading")
                                    : t("selectPlan")}
                            </CustomButton>
                        </div>
                    </div>

                    {/* Yearly Plan */}
                    <div className="border border-zinc-800 p-4 md:p-6 space-y-3 h-full w-[320px] lg:w-[250px]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold">{t("yearly")}</h2>
                            <span className="text-secondary text-xs bg-zinc-900 px-2 py-1 rounded-full border border-zinc-800">
                                {t("savePercent")}
                            </span>
                        </div>
                        <span className="text-2xl">
                            {currency}
                            {yearlyPrice.toFixed(2)} / {t("yearlyShort")}{" "}
                            <span className="text-xs text-tertiary">
                                {t("excVat")}
                            </span>
                        </span>
                        <p className="text-secondary">{t("including")}</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {t("features.algorithms")}
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {t("features.mlModels")}
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {t("features.tradingBot")}
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {t("features.unlimitedInstances")}
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {t("features.unlimitedNotifications")}
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {t("features.supportProject")}
                            </li>
                        </ul>
                        <div className="h-[1px] bg-zinc-800 my-4" />
                        <div className="flex justify-center">
                            <CustomButton
                                isBlue={false}
                                onClick={() => handleSubscribe("yearly")}
                                disabled={loadingYearly}>
                                {loadingYearly ? t("loading") : t("selectPlan")}
                            </CustomButton>
                        </div>
                    </div>
                </div>
            )}
            <Link 
                href={`https://docs.monkeys.finance/${locale}/payments`} 
                target="_blank" 
                className="hidden md:flex text-sm text-secondary hover:text-highlight hover:underline transition-colors mt-6"
            >
                {t("learnMorePayments")}
                <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
        </div>
    );
}
