export interface TradeData {
    date: string;
    cashBalance: number;
    capitalChange: number | null;
    totalEquity: number;
    entryPrice: number;
    positionType: string;
}

/**
 * Trade data from the new leverage backtest format (Trades sheet)
 * Each row represents a complete trade with entry and exit information
 */
export interface LeverageTradeData {
    entryDate: string;
    exitDate: string;
    entryPrice: number;
    exitPrice: number;
    entryFee: number;
    exitFee: number;
    exitType: string; // 'normal', 'stopped', 'liquidated'
    positionSize: number;
    leverage: number;
    initialMargin: number;
    liquidationPrice: number;
    fundingFeesTotal: number;
    fundingIntervals: number;
    totalFees: number;
    pnlUsdt: number;
    pnlPct: number;
    marginReturnPct: number;
    // Computed fields for UI display (cumulative)
    equityBefore: number;
    equityAfter: number;
    // Flag for filtered signals (not traded)
    isFiltered?: boolean;
}

export type Exchange = "binance" | "binanceus" | "bybit" | "okx" | "kraken" | "coinbase";

