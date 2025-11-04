"use server";
import {
    GetObjectCommand,
    ListObjectsV2Command,
    type _Object,
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
 * Filter to get only the latest file per symbol based on timestamp in filename
 * Filename format: BTC-USD_4h_20251024-052833.xlsx
 */
function getLatestFilePerSymbol(files: string[]): string[] {
    const latestBySymbol = new Map<
        string,
        { key: string; timestamp: string }
    >();

    for (const key of files) {
        const filename = key.split("/").pop()!;

        // Extract symbol (e.g., "BTC" from "BTC-USD_4h_20251024-052833.xlsx")
        const symbolMatch = filename.match(/^([A-Z]{3})-USD/);
        if (!symbolMatch) continue;

        const symbol = symbolMatch[1];

        // Extract timestamp (e.g., "20251024-052833" from filename)
        const timestampMatch = filename.match(/(\d{8}-\d{6})/);
        const timestamp = timestampMatch?.[1] || "00000000-000000";

        // Keep the file with the latest timestamp
        const existing = latestBySymbol.get(symbol);
        if (!existing || timestamp > existing.timestamp) {
            latestBySymbol.set(symbol, { key, timestamp });
        }
    }

    return Array.from(latestBySymbol.values()).map((v) => v.key);
}
