import { InstanceRecord } from "@/types/instance";

// Map DB enum value to UI label used by <SelectItem value="...">
export const mapExchangeEnumToLabel = (value: InstanceRecord["exchange"] | undefined): string => {
    switch (value) {
        case "binance":
            return "Binance";
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

