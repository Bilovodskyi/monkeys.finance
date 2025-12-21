"use server";
import {
    GetObjectCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { unstable_cache } from "next/cache";
import s3Client, { S3_BUCKET_NAME } from "@/lib/s3Client";
import { parseLeverageTradeData } from "@/utils/parseLeverageTradeData";
import { LeverageTradeData } from "@/types/global";

// Nested data type: instrument -> leverage -> trades
export type BacktestDataByLeverage = Record<string, Record<number, LeverageTradeData[]>>;

const SYMBOL_TO_INSTRUMENT: Record<string, string> = {
    BTC: "Bitcoin",
    BNB: "Binance Coin",
};

const INSTRUMENT_TO_SYMBOL: Record<string, string> = Object.fromEntries(
    Object.entries(SYMBOL_TO_INSTRUMENT).map(([k, v]) => [v, k])
);

/**
 * Get all leverage backtest xlsx files from S3 organized by instrument and leverage
 * S3 path structure: backtest_results/leverage/[BTC|BNB]/files.xlsx
 * Cached for 1 day (revalidates monthly data appropriately)
 * @returns Nested object: { "Bitcoin": { 1: [...], 2: [...], 6: [...] }, ... }
 */
export const getAllLeverageBacktestFiles = unstable_cache(
    async (): Promise<BacktestDataByLeverage> => {
        return fetchLeverageBacktestFiles();
    },
    ["leverage-backtest-files"],
    { revalidate: 86400 } // 1 day cache (data updates monthly)
);

async function fetchLeverageBacktestFiles(): Promise<BacktestDataByLeverage> {
    try {
        const fullPrefix = "backtest_results/leverage/";

        console.log(`📁 Listing leverage backtest files in: ${fullPrefix}`);

        // List all objects in the leverage folder (recursively includes subfolders)
        const listCommand = new ListObjectsV2Command({
            Bucket: S3_BUCKET_NAME,
            Prefix: fullPrefix,
        });

        const listResponse = await s3Client.send(listCommand);

        if (!listResponse.Contents || listResponse.Contents.length === 0) {
            console.log(`⚠️  No files found in: ${fullPrefix}`);
            return {};
        }

        // Filter .xlsx files
        const xlsxFiles = listResponse.Contents.filter(
            (file) =>
                file.Key &&
                file.Key.toLowerCase().endsWith(".xlsx") &&
                !file.Key.toLowerCase().includes("combined")
        ).map((file) => file.Key!);

        if (xlsxFiles.length === 0) {
            console.log("No .xlsx files found in leverage folder");
            return {};
        }

        // Get latest file per symbol+leverage combination
        const latestFiles = getLatestFilePerSymbolAndLeverage(xlsxFiles);

        console.log(
            `📁 Found ${xlsxFiles.length} total files, using ${latestFiles.length} latest files`
        );

        // Download all files in parallel
        const filePromises = latestFiles.map(async (key) => {
            console.log(`⬇️  Downloading: ${key}`);

            const getCommand = new GetObjectCommand({
                Bucket: S3_BUCKET_NAME,
                Key: key,
            });

            const response = await s3Client.send(getCommand);

            if (!response.Body) {
                throw new Error(`No data returned for: ${key}`);
            }

            const bodyContents = await response.Body.transformToByteArray();
            const buffer = Buffer.from(bodyContents);

            const filename = key.split("/").pop() || key;

            console.log(`✅ Downloaded: ${filename} (${buffer.length} bytes)`);

            return { key, filename, buffer };
        });

        const files = await Promise.all(filePromises);

        console.log(`🎉 Successfully downloaded ${files.length} file(s)`);

        // Process files and organize by instrument + leverage
        const result: BacktestDataByLeverage = {};

        for (const file of files) {
            try {
                // Extract symbol (e.g., "BTC" from path or filename)
                const symbolMatch = file.filename.match(/^([A-Z]{3})-USD/);
                if (!symbolMatch) continue;

                const symbol = symbolMatch[1];
                const instrumentName = SYMBOL_TO_INSTRUMENT[symbol] || symbol;

                // Extract leverage (e.g., "6" from "_6x_")
                const leverageMatch = file.filename.match(/_(\d+)x_/);
                if (!leverageMatch) continue;

                const leverage = parseInt(leverageMatch[1]);

                // Parse the file
                const rows = parseLeverageTradeData(file.buffer);

                // Initialize nested structure if needed
                if (!result[instrumentName]) {
                    result[instrumentName] = {};
                }

                result[instrumentName][leverage] = rows;

                console.log(`✅ Processed ${instrumentName} ${leverage}x: ${rows.length} trades`);
            } catch (error) {
                console.error(`❌ Error processing ${file.filename}:`, error);
            }
        }

        console.log(
            `📊 Processed: ${Object.entries(result)
                .map(([inst, levs]) => `${inst} (${Object.keys(levs).join(", ")}x)`)
                .join(", ")}`
        );

        return result;
    } catch (error) {
        console.error("❌ Error fetching leverage backtest files:", error);
        throw new Error(
            `Failed to fetch leverage backtest files: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

/**
 * Filter to get only the latest file per symbol+leverage based on year and month in filename
 */
function getLatestFilePerSymbolAndLeverage(files: string[]): string[] {
    const monthMap: Record<string, number> = {
        jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
        jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
    };

    // Key: "BTC_6" (symbol_leverage)
    const latestByKey = new Map<
        string,
        { key: string; year: number; month: number }
    >();

    for (const key of files) {
        const filename = key.split("/").pop()!;

        // Extract symbol
        const symbolMatch = filename.match(/^([A-Z]{3})-USD/);
        if (!symbolMatch) continue;
        const symbol = symbolMatch[1];

        // Extract leverage
        const leverageMatch = filename.match(/_(\d+)x_/);
        if (!leverageMatch) continue;
        const leverage = leverageMatch[1];

        const mapKey = `${symbol}_${leverage}`;

        // Extract year and month
        const yearMonthMatch = filename.match(/(\d{4})(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
        
        if (!yearMonthMatch) continue;

        const year = parseInt(yearMonthMatch[1]);
        const monthStr = yearMonthMatch[2].toLowerCase();
        const month = monthMap[monthStr];

        if (!month) continue;

        // Keep the file with the latest year/month
        const existing = latestByKey.get(mapKey);
        if (!existing || year > existing.year || (year === existing.year && month > existing.month)) {
            latestByKey.set(mapKey, { key, year, month });
        }
    }

    return Array.from(latestByKey.values()).map((v) => v.key);
}
