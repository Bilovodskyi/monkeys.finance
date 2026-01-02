import { db } from "@/drizzle/db";
import { ArrowUpDown, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { AlgorithmChart } from "@/components/private/algorithms/AlgorithmChart";
import { LivePrice } from "@/components/private/algorithms/LivePrice";
import { LivePercentageChange } from "@/components/private/algorithms/LivePercentageChange";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { getActiveSubscriptionStatusForUI } from "@/lib/entitlements";
import { redirect } from "next/navigation";

export default async function Algorithms() {
    const locale = await getLocale();
    const t = await getTranslations("algorithms");
    
    // Protect algorithms page - redirect if no active subscription
    const { hasActiveSubscription } = await getActiveSubscriptionStatusForUI();
    if (!hasActiveSubscription) {
        redirect(`/${locale}/plan`);
    }

    const algorithms = await db.query.SignalStateTable.findMany({
        orderBy: (table, { desc }) => [desc(table.lastUpdated)],
    });

    return (
        <div className="flex flex-col h-full">
            <Link 
                href={`https://docs.monkeys.finance/${locale}/instruments`} 
                target="_blank" 
                className="hidden md:flex text-sm text-secondary hover:text-highlight hover:underline transition-colors place-self-end pr-6 pt-4"
            >
                {t("learnAboutAlgorithms")}
                <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
            {algorithms.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-2 px-6">
                    <h1 className="text-lg font-bold">{t("emptyTitle")}</h1>
                    <p className="text-xs text-tertiary text-center">
                        {t("emptyDescription")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 p-4 md:p-6">

                    {algorithms.map((algorithm) => {
                        const signalType = algorithm.currentSignal;
                        const isBuy = signalType === "buy";
                        const isSell = signalType === "sell";
                        const isNone = signalType === "none";

                        // Get prices
                        const signalPrice = algorithm.signalPrice ? Number(algorithm.signalPrice) : null;
                        const currentPrice = algorithm.currentPrice ? Number(algorithm.currentPrice) : null;

                        return (
                            <div
                                key={algorithm.id}
                                className="border border-zinc-800">
                                {/* Main Content - Split into Left and Right */}
                                <div className="p-4 md:p-6 flex flex-col md:flex-row items-start justify-between gap-6">
                                    {/* Left Side */}
                                    <div className="flex flex-col gap-5 flex-1">
                                        {/* Header */}
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <h1 className="text-2xl font-bold text-white">
                                                {algorithm.instrument}
                                            </h1>
                                            <span className="text-zinc-600">•</span>
                                            <p className="text-base text-zinc-400">
                                                {algorithm.strategy}
                                            </p>
                                            <span className="text-zinc-600">•</span>
                                            <p className="text-sm text-zinc-500">
                                                {algorithm.interval}
                                            </p>
                                        </div>

                                        {/* Signal Status Badge */}
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {isBuy && (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded w-fit">
                                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                                        <span className="text-sm font-medium text-green-500">
                                                            {t("buySignal")}
                                                        </span>
                                                    </div>
                                                )}
                                                {isSell && (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded w-fit">
                                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                                        <span className="text-sm font-medium text-red-500">
                                                            {t("sellSignal")}
                                                        </span>
                                                    </div>
                                                )}
                                                {isNone && (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded w-fit">
                                                        <ArrowUpDown className="w-4 h-4 text-tertiary" />
                                                        <span className="text-sm font-medium text-tertiary">
                                                            {t("noSignal")}
                                                        </span>
                                                    </div>
                                                )}

                                                {algorithm.signalFiltered && (
                                                    <div className="px-2 py-1 bg-orange-500/10 border border-orange-500/30 rounded">
                                                        <span className="text-xs text-orange-400">
                                                            {t("filtered")}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Signal Price below badge */}
                                            {signalPrice && !isNone && (
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <p className="text-xs text-zinc-500">
                                                        {t("signalPrice")}
                                                    </p>
                                                    <p className="text-xl font-bold text-white">
                                                        ${signalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {algorithm.lastSignalChange && (
                                            <p className="text-xs text-zinc-500">
                                                {t("signalGenerated")}{" "}
                                                <span className="text-zinc-400">
                                                    {new Date(algorithm.lastSignalChange).toLocaleString('en-CA')}
                                                </span>
                                            </p>
                                        )}
                                        <div className="flex flex-row md:flex-col gap-1 md:gap-5 max-md:justify-between max-md:w-full">

                                       

                                        {/* Price Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {algorithm.currentPrice && (
                                                <LivePrice
                                                    instrument={algorithm.instrument}
                                                    initialPrice={currentPrice}
                                                    signalPrice={signalPrice}
                                                    signalType={algorithm.currentSignal}
                                                    label={t("currentPrice")}
                                                />
                                            )}
                                            {algorithm.flipPrice && (
                                                <div className="flex flex-col gap-1.5">
                                                    <p className="text-xs text-zinc-500 font-medium">
                                                        {t("flipPrice")}
                                                    </p>
                                                    <p className="text-base font-semibold text-white">
                                                        ${Number(algorithm.flipPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* ML Scores */}
                                        {(algorithm.pBad || algorithm.predRemaining) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {algorithm.pBad && (
                                                    <div className="flex flex-col gap-1.5">
                                                        <p className="text-xs text-zinc-500 font-medium">
                                                            pBad
                                                        </p>
                                                        <p className="text-sm font-semibold text-zinc-300">
                                                            {(Number(algorithm.pBad) * 100).toFixed(2)}%
                                                        </p>
                                                    </div>
                                                )}
                                                {algorithm.predRemaining && (
                                                    <div className="flex flex-col gap-1.5">
                                                        <p className="text-xs text-zinc-500 font-medium">
                                                            {t("predictedRemaining")}
                                                        </p>
                                                        <p className="text-sm font-semibold text-zinc-300">
                                                            {Number(algorithm.predRemaining).toFixed(4)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                         </div>
                                    </div>

                                    {/* Right Side */}
                                    <div className="flex flex-col-reverse md:flex-col items-center md:items-end justify-between h-full min-h-[100px] md:min-h-[200px] w-full md:w-auto">
                                        <AlgorithmChart
                                            instrument={algorithm.instrument}
                                            interval={algorithm.interval}
                                            flipPrice={algorithm.flipPrice ? Number(algorithm.flipPrice) : null}
                                            signalPrice={signalPrice}
                                            signalDate={algorithm.lastSignalChange ? new Date(algorithm.lastSignalChange) : null}
                                            signalType={algorithm.currentSignal}
                                        />
                                        {/* Percentage Change or No Position Badge */}
                                        {!isNone && signalPrice && currentPrice && (
                                            <>
                                                {isSell ? (
                                                    <div className="flex-1 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-tertiary">
                                                            {t("noPosition")}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <LivePercentageChange
                                                        instrument={algorithm.instrument}
                                                        initialPrice={currentPrice}
                                                        signalPrice={signalPrice}
                                                        signalType={algorithm.currentSignal}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Footer Information */}
                                <div className="h-[1px] w-full bg-zinc-800" />
                                <div className="p-4 md:p-6 bg-[rgb(20,20,20)] space-y-2">
                                    <ol className="list-disc ml-3">
                                    <li className="text-sm text-tertiary leading-relaxed">
                                       {t("pBadDescription")}
                                    </li>   
                                    <li className="text-sm text-tertiary leading-relaxed">
                                       {t("remainingDescription")}
                                    </li>
                                        <li className="text-sm text-tertiary leading-relaxed">
                                        {t("footer.line1")}
                                    </li>   
                                    <li className="text-sm text-tertiary leading-relaxed">
                                        {t("footer.line2")}
                                    </li>
                                     <li className="text-sm text-tertiary leading-relaxed">
                                        {t("footer.line3")}
                                    </li>
                                    </ol>
                                    <p className="text-xs text-tertiary">
                                        {t("footer.lastUpdated")}{" "}
                                        <span className="text-main font-medium">
                                            {new Date(algorithm.lastUpdated).toLocaleString('en-CA')}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}