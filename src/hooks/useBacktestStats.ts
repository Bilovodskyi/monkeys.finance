import groupTradesIntoPairs from "@/utils/groupTradesIntoPairs";

export type BacktestTrade = {
    date: string;
    cashBalance: number;
    totalEquity: number;
    entryPrice: number;
    positionType: string;
    capitalChange: number | null;
};

export type TradePair = {
    firstTrade: BacktestTrade;
    secondTrade: BacktestTrade;
    totalChange: number;
};

export type BacktestStats = {
    pairs: TradePair[];
    numTrades: number; // number of completed trades (pairs)
    winTradesCount: number; // count of winning pairs
    lossTradesCount: number; // count of losing pairs
    neutralTradesCount: number; // pairs with exactly 0 change
    profitableTradesPct: number; // wins / (wins + losses)
    capitalChangePct: number; // 0-100, clamped growth for UI pies
    winPct: number; // wins / pairs
    lossPct: number; // losses / pairs
    totalGain: number;
};

export const EMPTY_BACKTEST_STATS: BacktestStats = {
    pairs: [],
    numTrades: 0,
    winTradesCount: 0,
    lossTradesCount: 0,
    neutralTradesCount: 0,
    profitableTradesPct: 0,
    capitalChangePct: 0,
    winPct: 0,
    lossPct: 0,
    totalGain: 0,
};

const isFiniteNumber = (n: unknown): n is number =>
    typeof n === "number" && Number.isFinite(n);

export function useBacktestStats(
    tradesInput: ReadonlyArray<BacktestTrade> | null | undefined
): BacktestStats {
    // Guard: tolerate undefined/null and filter out malformed rows
    const trades: BacktestTrade[] = Array.isArray(tradesInput)
        ? tradesInput.filter(
              (t): t is BacktestTrade => !!t && isFiniteNumber(t.totalEquity)
          )
        : [];

    // Early return if nothing to compute
    if (trades.length === 0) {
        return EMPTY_BACKTEST_STATS;
    }

    // Use the shared groupTradesIntoPairs utility that handles Buy/Sell/Hold logic
    const pairs = groupTradesIntoPairs(trades);

    // Pair-based win/loss/neutral counts
    let winTradesCount = 0;
    let lossTradesCount = 0;
    let neutralTradesCount = 0;
    for (const p of pairs) {
        if (p.totalChange > 0) winTradesCount += 1;
        else if (p.totalChange < 0) lossTradesCount += 1;
        else neutralTradesCount += 1;
    }

    const numTrades = pairs.length;
    const decided = Math.max(winTradesCount + lossTradesCount, 1);
    const profitableTradesPct = (winTradesCount / decided) * 100;
    const winPct = (winTradesCount / Math.max(numTrades, 1)) * 100;
    const lossPct = (lossTradesCount / Math.max(numTrades, 1)) * 100;

    // Capital change percentage based on equity growth from first to last entry
    const startEquity = trades[0]?.totalEquity ?? 0;
    const endEquity = trades[trades.length - 1]?.totalEquity ?? 0;
    let growthPct = 0;
    if (startEquity > 0) {
        growthPct = ((endEquity - startEquity) / startEquity) * 100;
    }
    // Clamp for UI pies to 0..100 (negative growth shows as 0 with red color in pie)
    const capitalChangePct = Math.max(0, Math.min(100, growthPct));

    const totalGain = endEquity - startEquity;

    return {
        pairs,
        numTrades,
        winTradesCount,
        lossTradesCount,
        neutralTradesCount,
        profitableTradesPct,
        capitalChangePct,
        winPct,
        lossPct,
        totalGain,
    };
}
