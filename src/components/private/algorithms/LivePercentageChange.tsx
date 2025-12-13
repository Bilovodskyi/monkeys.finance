"use client";

import { useLivePrice } from "@/hooks/useLivePrice";

interface LivePercentageChangeProps {
    instrument: string;
    initialPrice: number | null;
    signalPrice: number | null;
    signalType: "buy" | "sell" | "none";
}

export function LivePercentageChange({
    instrument,
    initialPrice,
    signalPrice,
    signalType,
}: LivePercentageChangeProps) {
    const { percentageChange } = useLivePrice({
        instrument,
        signalPrice,
        signalType,
        initialPrice,
    });

    if (percentageChange === null) return null;

    const isPositive = percentageChange > 0;
    const isNegative = percentageChange < 0;

    return (
        <div className="flex-1 flex items-center justify-center">
            <p
                className={`!text-3xl font-bold ${
                    isPositive
                        ? "text-green-500"
                        : isNegative
                        ? "text-red-500"
                        : "text-secondary"
                }`}
            >
                {isPositive && "+"}
                {percentageChange.toFixed(2)}%
            </p>
        </div>
    );
}
