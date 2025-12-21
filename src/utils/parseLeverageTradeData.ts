import * as XLSX from "xlsx";
import { LeverageTradeData } from "@/types/global";

/**
 * Parse leverage backtest Excel file from the Trades and Filtered_Signals sheets
 * Each row in the Trades sheet represents a complete trade with entry/exit info
 * The Filtered_Signals sheet contains signals that were filtered out (not traded)
 *
 * @param source - XLSX WorkBook, Buffer, or ArrayBuffer
 * @param initialCapital - Starting capital to calculate cumulative equity (default: 100000)
 */
export function parseLeverageTradeData(
    source: XLSX.WorkBook | Buffer | ArrayBuffer,
    initialCapital: number = 100000
): LeverageTradeData[] {
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

    // Parse Trades sheet
    const trades = parseTradesSheet(workbook, initialCapital);

    // Parse Filtered_Signals sheet
    const filteredSignals = parseFilteredSignalsSheet(workbook);

    // Merge and sort by date
    const allTrades = [...trades, ...filteredSignals];
    allTrades.sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());

    return allTrades;
}

/**
 * Parse the Trades sheet from the workbook
 */
function parseTradesSheet(workbook: XLSX.WorkBook, initialCapital: number): LeverageTradeData[] {
    const tradesSheetIndex = workbook.SheetNames.findIndex(
        (name) => name.toLowerCase() === "trades"
    );

    if (tradesSheetIndex === -1) {
        console.warn("Trades sheet not found in workbook");
        return [];
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[tradesSheetIndex]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

    // Column name mapping from xlsx to our fields
    const col = {
        entryDate: "entry_date",
        exitDate: "exit_date",
        entryPrice: "entry_price",
        exitPrice: "exit_price",
        entryFee: "entry_fee",
        exitFee: "exit_fee",
        exitType: "exit_type",
        positionSize: "position_size",
        leverage: "leverage",
        initialMargin: "initial_margin",
        liquidationPrice: "liquidation_price",
        fundingFeesTotal: "funding_fees_total",
        fundingIntervals: "funding_intervals",
        totalFees: "total_fees",
        pnlUsdt: "pnl_usdt",
        pnlPct: "pnl_pct",
        marginReturnPct: "margin_return_pct",
    };

    // Track cumulative equity
    let cumulativeEquity = initialCapital;

    const rows: LeverageTradeData[] = json.map((row) => {
        const pnlUsdt = toNum(row[col.pnlUsdt]);
        const equityBefore = cumulativeEquity;
        const equityAfter = cumulativeEquity + pnlUsdt;
        cumulativeEquity = equityAfter;

        return {
            entryDate: parseDateString(row[col.entryDate]),
            exitDate: parseDateString(row[col.exitDate]),
            entryPrice: toNum(row[col.entryPrice]),
            exitPrice: toNum(row[col.exitPrice]),
            entryFee: toNum(row[col.entryFee]),
            exitFee: toNum(row[col.exitFee]),
            exitType: String(row[col.exitType] ?? "normal"),
            positionSize: toNum(row[col.positionSize]),
            leverage: toNum(row[col.leverage]),
            initialMargin: toNum(row[col.initialMargin]),
            liquidationPrice: toNum(row[col.liquidationPrice]),
            fundingFeesTotal: toNum(row[col.fundingFeesTotal]),
            fundingIntervals: toNum(row[col.fundingIntervals]),
            totalFees: toNum(row[col.totalFees]),
            pnlUsdt,
            pnlPct: toNum(row[col.pnlPct]),
            marginReturnPct: toNum(row[col.marginReturnPct]),
            equityBefore,
            equityAfter,
            isFiltered: false,
        };
    });

    return rows;
}

/**
 * Parse the Filtered_Signals sheet from the workbook
 * These are signals that were filtered out and not traded
 */
function parseFilteredSignalsSheet(workbook: XLSX.WorkBook): LeverageTradeData[] {
    const sheetIndex = workbook.SheetNames.findIndex(
        (name) => name.toLowerCase() === "filtered_signals"
    );

    if (sheetIndex === -1) {
        console.warn("Filtered_Signals sheet not found in workbook");
        return [];
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[sheetIndex]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

    // Filtered_Signals columns: Date, signal, p_bad, pred_remaining
    const rows: LeverageTradeData[] = json.map((row) => {
        return {
            entryDate: parseDateString(row["Date"]),
            exitDate: "",
            entryPrice: 0,
            exitPrice: 0,
            entryFee: 0,
            exitFee: 0,
            exitType: "filtered",
            positionSize: 0,
            leverage: 0,
            initialMargin: 0,
            liquidationPrice: 0,
            fundingFeesTotal: 0,
            fundingIntervals: 0,
            totalFees: 0,
            pnlUsdt: 0,
            pnlPct: 0,
            marginReturnPct: 0,
            equityBefore: 0,
            equityAfter: 0,
            isFiltered: true,
        };
    });

    return rows;
}

/**
 * Parse date string from Excel, handling various formats
 */
function parseDateString(rawDate: unknown): string {
    if (typeof rawDate === "number") {
        // Excel serial date number
        const excelEpoch = (rawDate - 25569) * 86400 * 1000;
        return new Date(excelEpoch).toISOString();
    }

    if (rawDate != null) {
        const s = String(rawDate);
        // Handle format like "2024-03-20 17:00:00 PDT-0700"
        const cleanedDateStr = s.replace(/\s+[A-Z]{3}(-\d{4})/, "$1");
        const d = new Date(cleanedDateStr);

        if (!Number.isNaN(d.getTime())) {
            return d.toISOString();
        }
        // Fallback: keep the original string
        return s;
    }

    return "";
}

function toNum(v: unknown): number {
    if (typeof v === "number") return v;
    const n = parseFloat(String(v ?? ""));
    return Number.isFinite(n) ? n : 0;
}

