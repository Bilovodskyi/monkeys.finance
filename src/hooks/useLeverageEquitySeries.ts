"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";

export type SeriesPoint = { date: string; value: number };

type UseLeverageEquitySeriesOptions = {
    /** Starting capital for equity calculation (default: 100000) */
    initialCapital?: number;
};

/**
 * Hook to fetch and parse leverage backtest Excel files for equity series chart data.
 * Reads the "Trades" sheet and calculates cumulative equity from pnl_usdt values.
 */
export function useLeverageEquitySeries(
    filePath: string | null | undefined,
    options: UseLeverageEquitySeriesOptions = {}
) {
    const { initialCapital = 100000 } = options;

    const [data, setData] = useState<SeriesPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!filePath) {
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                setError(null);
                setLoading(true);
                abortRef.current?.abort();
                abortRef.current = new AbortController();

                const res = await fetch(filePath, { signal: abortRef.current.signal });
                if (!res.ok) throw new Error(`Failed to fetch Excel file: ${res.status}`);

                const arrayBuffer = await res.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: "array" });

                // Find the Trades sheet
                const tradesSheetIndex = workbook.SheetNames.findIndex(
                    (name) => name.toLowerCase() === "trades"
                );

                if (tradesSheetIndex === -1) {
                    throw new Error("Trades sheet not found in workbook");
                }

                const worksheet = workbook.Sheets[workbook.SheetNames[tradesSheetIndex]];
                const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

                // Column mappings
                const col = {
                    exitDate: "exit_date",
                    pnlUsdt: "pnl_usdt",
                };

                // Build equity series from trades
                let cumulativeEquity = initialCapital;
                const series: SeriesPoint[] = [];

                // Add initial point
                if (json.length > 0) {
                    const firstEntryDate = parseDateString(json[0]["entry_date"]);
                    if (firstEntryDate) {
                        series.push({
                            date: firstEntryDate.split("T")[0],
                            value: initialCapital,
                        });
                    }
                }

                // Add equity after each trade
                for (const row of json) {
                    const pnlUsdt = toNum(row[col.pnlUsdt]);
                    cumulativeEquity += pnlUsdt;

                    const exitDate = parseDateString(row[col.exitDate]);
                    if (exitDate) {
                        series.push({
                            date: exitDate.split("T")[0],
                            value: cumulativeEquity,
                        });
                    }
                }

                setData(series);
            } catch (e) {
                if (e instanceof Error && e.name === "AbortError") return;
                setError(e instanceof Error ? e.message : "Failed to load data");
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        load();
        return () => abortRef.current?.abort();
    }, [filePath, initialCapital]);

    // Memoize the series output
    const series = useMemo(() => data, [data]);

    return { series, loading, error };
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
        return s;
    }

    return "";
}

function toNum(v: unknown): number {
    if (typeof v === "number") return v;
    const n = parseFloat(String(v ?? ""));
    return Number.isFinite(n) ? n : 0;
}
