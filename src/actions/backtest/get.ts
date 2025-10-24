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

        // Step 2: Filter to only .xlsx files and exclude "folder" entries
        const xlsxFiles = listResponse.Contents.filter((item: _Object) => {
            const key = item.Key || "";
            return key.toLowerCase().endsWith(".xlsx") && !key.endsWith("/");
        }).map((item: _Object) => item.Key as string);

        console.log(`📊 Found ${xlsxFiles.length} xlsx file(s)`);

        if (xlsxFiles.length === 0) {
            console.log(`⚠️  No .xlsx files found in: ${fullPrefix}`);
            return {};
        }

        // Step 3: Download all files in parallel
        const filePromises = xlsxFiles.map(async (key) => {
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
