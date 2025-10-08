type Exchange = "binance" | "binanceus" | "kraken" | "coinbase" | "okx" | "bybit";

export type InstanceRecord = {
    id: string;
    name: string;
    exchange: Exchange;
    instrument: string;
    strategy: string;
    status: "active" | "paused";
    createdAt: Date | null;
};