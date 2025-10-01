export interface TradeData {
    date: string;
    cashBalance: number;
    capitalChange: number | null;
    totalEquity: number;
    entryPrice: number;
    positionType: string;
}