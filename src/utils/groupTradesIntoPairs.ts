import type { TradePair } from "@/hooks/useBacktestStats";
import type { TradeData } from "@/types/global";

// Runtime type guards to avoid crashing on malformed rows
function isFiniteNumber(n: unknown): n is number {
    return typeof n === "number" && Number.isFinite(n);
}

function isValidTrade(t: unknown): t is TradeData {
    if (!t || typeof t !== "object") return false;
    // Intentional 'any' - type guard needs to inspect unknown object properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyT: any = t;
    return (
        typeof anyT.date === "string" &&
        anyT.date.length > 0 &&
        isFiniteNumber(anyT.totalEquity) &&
        typeof anyT.positionType === "string"
    );
}

/**
 * Groups trades into pairs based on Buy logic
 * - Only "Buy" trades have positionType field
 * - The very next trade after a "Buy" is the closing trade (Sell or Hold)
 * - Skips trades without positionType (already closed positions)
 */
const groupTradesIntoPairs = (
    trades: TradeData[] | undefined | null
): TradePair[] => {
    if (!Array.isArray(trades) || trades.length < 2) return [];

    // Filter out malformed entries
    const cleaned: TradeData[] = trades.filter(isValidTrade);
    if (cleaned.length < 2) return [];

    const pairs: TradePair[] = [];
    let i = 0;

    while (i < cleaned.length - 1) {
        const currentTrade = cleaned[i];

        // Check if this is a Buy trade (has positionType with "buy")
        if (
            currentTrade.positionType &&
            currentTrade.positionType.toLowerCase().includes("buy")
        ) {
            // The very next trade is the closing trade
            const nextTrade = cleaned[i + 1];

            const totalChange =
                nextTrade.totalEquity - currentTrade.totalEquity;

            if (Number.isFinite(totalChange)) {
                pairs.push({
                    firstTrade: currentTrade,
                    secondTrade: nextTrade,
                    totalChange,
                });
            }

            // Move past both the Buy and its closing trade
            i += 2;
        } else {
            // Not a Buy trade (no positionType or different type), skip it
            i++;
        }
    }

    return pairs;
};

export default groupTradesIntoPairs;
