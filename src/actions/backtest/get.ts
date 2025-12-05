"use server";
import {
    GetObjectCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import s3Client, { S3_BUCKET_NAME } from "@/lib/s3Client";
import { processBacktestFiles } from "@/utils/processBacktestFiles";
import { TradeData } from "@/types/global";

/**
 * Get all xlsx files from a specific folder in S3 and process them
 * @param folderPath - The folder path (e.g., "backtest_results/ml/supertrend" or "ml/supertrend")
 * @returns Object with instrument name as key and processed TradeData array as value
 */
export async function getAllXlsxFilesFromFolder(
    folderPath: string
): Promise<Record<string, TradeData[]>> {
    try {
        // Ensure the folder path doesn't start with / and ends with /
        const normalizedPath = folderPath
            .replace(/^\/+/, "") // Remove leading slashes
            .replace(/\/+$/, ""); // Remove trailing slashes

        const fullPrefix = `backtest_results/${normalizedPath}/`;

        console.log(`📁 Listing files in: ${fullPrefix}`);

        // Step 1: List all objects in the folder
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
            console.log("No .xlsx files found in folder:", folderPath);
            return {};
        }

        // Get only the latest file per symbol
        const latestFiles = getLatestFilePerSymbol(xlsxFiles);

        console.log(
            `📁 Found ${xlsxFiles.length} total files, using ${latestFiles.length} latest files`
        );

        // Step 3: Download only latest files in parallel
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

            // Convert stream to buffer
            const bodyContents = await response.Body.transformToByteArray();
            const buffer = Buffer.from(bodyContents);

            // Extract filename from full path
            const filename = key.split("/").pop() || key;

            console.log(`✅ Downloaded: ${filename} (${buffer.length} bytes)`);

            return {
                key, // Full S3 path: "backtest_results/ml/supertrend/file.xlsx"
                filename, // Just filename: "file.xlsx"
                buffer, // File content as Buffer
            };
        });

        const files = await Promise.all(filePromises);

        console.log(`🎉 Successfully downloaded ${files.length} file(s)`);

        // Step 4: Process all files and return structured data by symbol
        const processedData = processBacktestFiles(files);

        // Step 5: Map 3-letter symbols to full instrument names
        const symbolToInstrument: Record<string, string> = {
            BTC: "Bitcoin",
            ETH: "Ethereum",
            BNB: "Binance Coin",
            XRP: "XRP",
            SOL: "Solana",
            ADA: "Cardano",
        };

        // Convert symbol keys to instrument name keys
        const result: Record<string, TradeData[]> = {};
        Object.entries(processedData).forEach(([symbol, data]) => {
            const instrumentName = symbolToInstrument[symbol] || symbol;
            result[instrumentName] = data;
        });

        console.log(
            `📊 Processed instruments: ${Object.keys(result).join(", ")}`
        );

        return result;
    } catch (error) {
        console.error(
            `❌ Error fetching files from folder (${folderPath}):`,
            error
        );
        throw new Error(
            `Failed to fetch xlsx files: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

/**
 * Filter to get only the latest file per symbol based on year and month in filename
 * Old format: BTC-USD_4h_20251024-052833.xlsx
 * New format: BTC-USD_4h_2025dec.xlsx
 */
function getLatestFilePerSymbol(files: string[]): string[] {
    const monthMap: Record<string, number> = {
        jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
        jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
    };

    const latestBySymbol = new Map<
        string,
        { key: string; year: number; month: number }
    >();

    for (const key of files) {
        const filename = key.split("/").pop()!;

        // Extract symbol (e.g., "BTC" from "BTC-USD_4h_2025dec.xlsx")
        const symbolMatch = filename.match(/^([A-Z]{3})-USD/);
        if (!symbolMatch) continue;

        const symbol = symbolMatch[1];

        // Extract year and month (e.g., "2025dec" from filename)
        // Format: BTC-USD_4h_2025dec.xlsx
        const yearMonthMatch = filename.match(/(\d{4})(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
        
        if (!yearMonthMatch) {
            // Fallback: try old timestamp format for backwards compatibility
            const oldTimestampMatch = filename.match(/(\d{8})-\d{6}/);
            if (oldTimestampMatch) {
                const timestamp = oldTimestampMatch[1]; // e.g., "20251024"
                const year = parseInt(timestamp.substring(0, 4));
                const month = parseInt(timestamp.substring(4, 6));
                
                const existing = latestBySymbol.get(symbol);
                if (!existing || year > existing.year || (year === existing.year && month > existing.month)) {
                    latestBySymbol.set(symbol, { key, year, month });
                }
            }
            continue;
        }

        const year = parseInt(yearMonthMatch[1]);
        const monthStr = yearMonthMatch[2].toLowerCase();
        const month = monthMap[monthStr];

        if (!month) continue;

        // Keep the file with the latest year/month
        const existing = latestBySymbol.get(symbol);
        if (!existing || year > existing.year || (year === existing.year && month > existing.month)) {
            latestBySymbol.set(symbol, { key, year, month });
        }
    }

    return Array.from(latestBySymbol.values()).map((v) => v.key);
}
