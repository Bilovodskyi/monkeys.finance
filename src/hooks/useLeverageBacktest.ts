import { LeverageTradeData } from "@/types/global";

export type LeverageBacktestStats = {
    trades: LeverageTradeData[];
    numTrades: number;
    winTradesCount: number;
    lossTradesCount: number;
    neutralTradesCount: number;
    profitableTradesPct: number;
    capitalChangePct: number;
    winPct: number;
    lossPct: number;
    totalGain: number;
    startEquity: number;
    endEquity: number;
    avgLeverage: number;
    totalFees: number;
};

export const EMPTY_LEVERAGE_BACKTEST_STATS: LeverageBacktestStats = {
    trades: [],
    numTrades: 0,
    winTradesCount: 0,
    lossTradesCount: 0,
    neutralTradesCount: 0,
    profitableTradesPct: 0,
    capitalChangePct: 0,
    winPct: 0,
    lossPct: 0,
    totalGain: 0,
    startEquity: 0,
    endEquity: 0,
    avgLeverage: 0,
    totalFees: 0,
};

const isFiniteNumber = (n: unknown): n is number =>
    typeof n === "number" && Number.isFinite(n);

/**
 * Calculate statistics from leverage backtest trade data
 * Each trade in the input is already a complete trade (no pairing needed)
 */
export function useLeverageBacktest(
    tradesInput: ReadonlyArray<LeverageTradeData> | null | undefined
): LeverageBacktestStats {
    // Guard: tolerate undefined/null and filter out malformed rows
    const trades: LeverageTradeData[] = Array.isArray(tradesInput)
        ? tradesInput.filter(
              (t): t is LeverageTradeData =>
                  !!t && isFiniteNumber(t.pnlUsdt) && isFiniteNumber(t.equityAfter)
          )
        : [];

    // Early return if nothing to compute
    if (trades.length === 0) {
        return EMPTY_LEVERAGE_BACKTEST_STATS;
    }

    // Count wins/losses based on pnlUsdt
    let winTradesCount = 0;
    let lossTradesCount = 0;
    let neutralTradesCount = 0;
    let totalFees = 0;
    let leverageSum = 0;

    for (const trade of trades) {
        if (trade.pnlUsdt > 0) winTradesCount += 1;
        else if (trade.pnlUsdt < 0) lossTradesCount += 1;
        else neutralTradesCount += 1;

        totalFees += trade.totalFees;
        leverageSum += trade.leverage;
    }

    const numTrades = trades.length;
    const decided = Math.max(winTradesCount + lossTradesCount, 1);
    const profitableTradesPct = (winTradesCount / decided) * 100;
    const winPct = (winTradesCount / Math.max(numTrades, 1)) * 100;
    const lossPct = (lossTradesCount / Math.max(numTrades, 1)) * 100;

    // Capital change based on first and last trade equity
    const startEquity = trades[0]?.equityBefore ?? 0;
    const endEquity = trades[trades.length - 1]?.equityAfter ?? 0;
    let capitalChangePct = 0;
    if (startEquity > 0) {
        capitalChangePct = ((endEquity - startEquity) / startEquity) * 100;
    }

    const totalGain = endEquity - startEquity;
    const avgLeverage = leverageSum / Math.max(numTrades, 1);

    return {
        trades,
        numTrades,
        winTradesCount,
        lossTradesCount,
        neutralTradesCount,
        profitableTradesPct,
        capitalChangePct,
        winPct,
        lossPct,
        totalGain,
        startEquity,
        endEquity,
        avgLeverage,
        totalFees,
    };
}
