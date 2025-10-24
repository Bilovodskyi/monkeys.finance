import { TradeData } from "@/types/global";
import { parseExcelTradeData } from "./parseExcelTradeData";

/**
 * Process multiple xlsx files and return organized data by symbol
 * @param files - Array of files with buffer data
 * @returns Object with symbol as key and processed data as value
 */
export function processBacktestFiles(
    files: Array<{ key: string; filename: string; buffer: Buffer }>
): Record<string, TradeData[]> {
    const result: Record<string, TradeData[]> = {};

    for (const file of files) {
        try {
            // Extract symbol from filename (first 3 characters, e.g., "BTC.xlsx" -> "BTC")
            const symbol = file.filename.substring(0, 3).toUpperCase();

            // Parse the Excel file using shared helper
            const rows = parseExcelTradeData(file.buffer);

            result[symbol] = rows;

            console.log(`✅ Processed ${symbol}: ${rows.length} rows`);
        } catch (error) {
            console.error(`❌ Error processing ${file.filename}:`, error);
        }
    }

    return result;
}
