import type { TradePair } from "@/hooks/useBacktestStats";
import type { TradeData } from "@/types/global";

// Runtime type guards to avoid crashing on malformed rows
function isFiniteNumber(n: unknown): n is number {
    return typeof n === "number" && Number.isFinite(n);
}

function isValidTrade(t: unknown): t is TradeData {
    if (!t || typeof t !== "object") return false;
    const anyT: any = t;
    return typeof anyT.date === "string" && anyT.date.length > 0 && isFiniteNumber(anyT.totalEquity);
}


const groupTradesIntoPairs = (trades: TradeData[] | undefined | null): TradePair[] => {
    if (!Array.isArray(trades) || trades.length < 2) return [];

    // Filter out malformed entries; keep order
    const cleaned: TradeData[] = trades.filter(isValidTrade);
    if (cleaned.length < 2) return [];

    const pairs: TradePair[] = [];

    // Group every 2 consecutive valid trades
    for (let i = 0; i < cleaned.length - 1; i += 2) {
        const firstTrade = cleaned[i];
        const secondTrade = cleaned[i + 1];

        if (!firstTrade || !secondTrade) continue; // odd tail safeguard

        const totalChange = secondTrade.totalEquity - firstTrade.totalEquity;

        if (!Number.isFinite(totalChange)) continue; // skip if weird numbers slipped in

        pairs.push({ firstTrade, secondTrade, totalChange });
    }

    return pairs;
};

export default groupTradesIntoPairs;