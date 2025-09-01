export type BacktestTrade = {
    date: string;
    totalEquity: number;
    entryPrice?: number;
    positionType: string;
    capitalChange?: number | null;
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
};

export function useBacktestStats(trades: BacktestTrade[]): BacktestStats {
    // Group consecutive entries into trade pairs (open, close)
    const pairs: TradePair[] = [];
    for (let i = 0; i + 1 < trades.length; i += 2) {
        const firstTrade = trades[i];
        const secondTrade = trades[i + 1];
        if (!firstTrade || !secondTrade) continue;
        const totalChange = (secondTrade.totalEquity ?? 0) - (firstTrade.totalEquity ?? 0);
        pairs.push({ firstTrade, secondTrade, totalChange });
    }

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
    };
}


