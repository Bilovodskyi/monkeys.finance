export interface TradeData {
    date: string;
    cashBalance: number;
    capitalChange: number | null;
    totalEquity: number;
    entryPrice: number;
    positionType: string;
}

export type Exchange = "binance" | "binanceus" | "bybit" | "okx" | "kraken" | "coinbase";
