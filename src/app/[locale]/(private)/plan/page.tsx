import { Check } from "lucide-react";
import { CustomButton } from "@/components/CustomButton";
import { formatEntitlementHeading } from "@/lib/entitlements";
import { auth } from "@clerk/nextjs/server";
import { EntitlementResponse, getEntitlementForUser } from "@/services/entitlements";
import { parseIsoToDateTime } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function Plan() {
    const { userId } = await auth();
    if (!userId) return null;

    const data: EntitlementResponse | null = await getEntitlementForUser(userId);
    if (!data || !data.trialEndsAt) return null;

    const t = await getTranslations("plan");
    const heading = await formatEntitlementHeading(data);
    return (
        <div className="flex flex-col items-center justify-center h-full w-1/4 mx-auto gap-2">
            <h1 className="text-lg font-bold">{heading}</h1>
            <p className="text-center text-sm text-tertiary">{t("trialEndsMessage", { date: parseIsoToDateTime(data.trialEndsAt).date, time: parseIsoToDateTime(data.trialEndsAt).time })}</p>
            <div className="flex gap-4 mt-6">
                <div className="border border-zinc-800 p-6 space-y-3 h-full w-[250px]">
                    <h2 className="text-lg font-bold">{t("monthly")}</h2>
                    <span className="text-2xl">29$ / {t("monthlyShort")} <span className="text-xs text-tertiary">{t("excVat")}</span></span>
                    <p className="text-secondary">{t("including")}</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.algorithms")}</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.mlModels")}</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.tradingBot")}</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.unlimitedInstances")}</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.unlimitedBacktests")}</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.unlimitedNotifications")}</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.supportProject")}</li>
                    </ul>
                    <div className="h-[1px] bg-zinc-800 my-4" />
                    <div className="flex justify-center">

                        <CustomButton isBlue={false}>{t("selectPlan")}</CustomButton>
                    </div>
                </div>
                <div className="border border-zinc-800 p-6 space-y-3 h-full w-[250px]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">{t("yearly")}</h2>
                        <span className="text-secondary text-xs bg-zinc-900 px-2 py-1 rounded-full border border-zinc-800">{t("savePercent")}</span>
                    </div>
                    <span className="text-2xl">279$ / {t("yearlyShort")} <span className="text-xs text-tertiary">{t("excVat")}</span></span>
                    <p className="text-secondary">{t("including")}</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.algorithms")}</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.mlModels")}</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.tradingBot")}</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.unlimitedInstances")}</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.unlimitedBacktests")}</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.unlimitedNotifications")}</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />{t("features.supportProject")}</li>
                    </ul>
                    <div className="h-[1px] bg-zinc-800 my-4" />
                    <div className="flex justify-center">

                        <CustomButton isBlue={false}>{t("selectPlan")}</CustomButton>
                    </div>
                </div>
            </div>
        </div>
    )
}