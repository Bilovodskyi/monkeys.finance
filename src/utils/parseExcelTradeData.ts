import * as XLSX from "xlsx";
import { TradeData } from "@/types/global";

/**
 * Parse Excel workbook/buffer into TradeData array
 * Can be used both on server (with Buffer) and client (with ArrayBuffer)
 */
export function parseExcelTradeData(
    source: XLSX.WorkBook | Buffer | ArrayBuffer
): TradeData[] {
    // Convert source to workbook if needed
    let workbook: XLSX.WorkBook;
    if ("SheetNames" in source) {
        workbook = source;
    } else if (source instanceof ArrayBuffer) {
        // Client-side: ArrayBuffer
        workbook = XLSX.read(source, { type: "array" });
    } else {
        // Server-side: Buffer
        workbook = XLSX.read(source, { type: "buffer" });
    }

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

    // Column names
    const col = {
        date: "Date",
        cashBalance: "cash_balance",
        totalEquity: "total_equity",
        entryPrice: "entry_price",
        positionType: "position_type",
    };

    // Process the data
    const rows: TradeData[] = json.map((row) => {
        const rawDate = row[col.date];
        let dateString = "";
        if (typeof rawDate === "number") {
            // Excel serial date number
            const excelEpoch = (rawDate - 25569) * 86400 * 1000;
            dateString = new Date(excelEpoch).toISOString();
        } else if (rawDate != null) {
            const s = String(rawDate);

            // Try to parse the date string
            // Handle format like "2024-03-20 17:00:00 PDT-0700"
            // Remove timezone abbreviation but keep offset
            const cleanedDateStr = s.replace(/\s+[A-Z]{3}(-\d{4})/, "$1");
            const d = new Date(cleanedDateStr);

            if (!Number.isNaN(d.getTime())) {
                dateString = d.toISOString();
            } else {
                // Fallback: keep the original string
                dateString = s;
            }
        }

        return {
            date: dateString,
            cashBalance: toNum(row[col.cashBalance]),
            capitalChange: null,
            totalEquity: toNum(row[col.totalEquity]),
            entryPrice: toNum(row[col.entryPrice]),
            positionType: (row[col.positionType] as string) ?? "Unknown",
        };
    });

    // Calculate capitalChange
    for (let i = 1; i < rows.length; i++) {
        rows[i].capitalChange = rows[i].totalEquity - rows[i - 1].totalEquity;
    }

    return rows;
}

function toNum(v: unknown): number {
    if (typeof v === "number") return v;
    const n = parseFloat(String(v ?? ""));
    return Number.isFinite(n) ? n : 0;
}
