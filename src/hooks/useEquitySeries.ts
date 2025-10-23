"use client";

import { useMemo } from "react";
import { useExcelTradeData } from "./useExcelTradeData";

export type SeriesPoint = { date: string; value: number };

type UseEquitySeriesOptions = {
    sheetIndex?: number;
    valueField?: "totalEquity" | "cashBalance";
};

export function useEquitySeries(filePath: string | null | undefined, options: UseEquitySeriesOptions = {}) {
    const { sheetIndex = 0, valueField = "totalEquity" } = options;

    const { data, loading, error } = useExcelTradeData(filePath || "", { sheetIndex });

    const series: SeriesPoint[] = useMemo(() => {
        if (!data?.length) return [];
        return data
            .filter((row) => row?.date)
            .map((row) => ({
                // keep full ISO when available from parser, fall back to date-only normalization
                date: row.date.includes("T") ? row.date : normalizeToISODate(row.date),
                value: valueField === "cashBalance" ? row.cashBalance : row.totalEquity,
            }));
    }, [data, valueField]);

    return { series, loading, error };
}

function normalizeToISODate(input: string): string {
    const s = String(input ?? "").trim();
    if (!s) return s;
    // Already ISO-like YYYY-MM-DD...
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;

    // Try Date parsing and convert to ISO date
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return d.toISOString().split("T")[0];

    // Try common dd/mm/yyyy or mm/dd/yyyy by relying on Date again
    const m2 = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (m2) {
        const guess = new Date(s);
        if (!Number.isNaN(guess.getTime())) return guess.toISOString().split("T")[0];
    }

    // Fallback: return as-is; XAxis formatter will guard
    return s;
}


