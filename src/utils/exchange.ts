import { InstanceRecord } from "@/types/instance";

// Map DB enum value to UI label used by <SelectItem value="...">
export const mapExchangeEnumToLabel = (
    value: InstanceRecord["exchange"] | undefined
): string => {
    switch (value) {
        case "binance":
            return "Binance";
        case "binanceus":
            return "Binance US";
        case "bybit":
            return "Bybit";
        case "kraken":
            return "Kraken";
        case "coinbase":
            return "Coinbase";
        case "okx":
            return "OKX";
        default:
            return "";
    }
};

// Map UI label to DB enum value
export const mapLabelToExchangeEnum = (
    label: string
): InstanceRecord["exchange"] | null => {
    const normalized = label.toLowerCase();
    switch (normalized) {
        case "binance":
            return "binance";
        case "binance us":
            return "binanceus";
        case "bybit":
            return "bybit";
        case "kraken":
            return "kraken";
        case "coinbase":
            return "coinbase";
        case "okx":
            return "okx";
        default:
            return null;
    }
};
