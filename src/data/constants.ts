export type Instrument = "Bitcoin" | "Ripple" | "BNB" | "Ethereum";

export const instruments: Instrument[] = ["Bitcoin", "BNB", "Ethereum", "Ripple"];

// Display name to cloud symbol mapping (for saving to DB)
export const INSTRUMENT_TO_SYMBOL: Record<Instrument, string> = {
    Bitcoin: "BTCUSDC",
    Ethereum: "ETHUSDC",
    "BNB": "BNBUSDC",
    Ripple: "XRPUSDC",
};

// Reverse mapping for displaying DB records in UI
export const SYMBOL_TO_INSTRUMENT: Record<string, Instrument> = {
    BTCUSDC: "Bitcoin",
    ETHUSDC: "Ethereum",
    BNBUSDC: "BNB",
    XRPUSDC: "Ripple",
};

// Ticker to display name mapping (for S3 filenames like BTC-USD, ETH-USD)
export const TICKER_TO_INSTRUMENT: Record<string, Instrument> = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    BNB: "BNB",
    XRP: "Ripple",
};

export const strategies = ["Trend V3"];

export const exchanges = ["Binance"];

export const providers = ["Telegram"];

