"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { TradeData } from "@/types/global";

type UseExcelTradeDataOptions = {
    /** Which worksheet to read (defaults to the first sheet). */
    sheetIndex?: number;
    /** Column names in the Excel file (defaults match your example). */
    columns?: {
        date?: string;            // e.g. "Date"
        cashBalance?: string;     // e.g. "cash_balance"
        totalEquity?: string;     // e.g. "total_equity"
        entryPrice?: string;      // e.g. "entry_price"
        positionType?: string;    // e.g. "position_type"
    };
};

export function useExcelTradeData(
    filePath: string,
    opts: UseExcelTradeDataOptions = {}
) {
    const { sheetIndex = 0, columns } = opts;
    const col = useMemo(
        () => ({
            date: columns?.date ?? "Date",
            cashBalance: columns?.cashBalance ?? "cash_balance",
            totalEquity: columns?.totalEquity ?? "total_equity",
            entryPrice: columns?.entryPrice ?? "entry_price",
            positionType: columns?.positionType ?? "position_type",
        }),
        [columns]
    );

    const [data, setData] = useState<TradeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!filePath) return;

        const load = async () => {
            try {
                setError(null);
                abortRef.current?.abort();
                abortRef.current = new AbortController();

                const res = await fetch(filePath, { signal: abortRef.current.signal });
                if (!res.ok) throw new Error(`Failed to fetch Excel file: ${res.status}`);

                const arrayBuffer = await res.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: "array" });
                const sheetName = workbook.SheetNames[sheetIndex];
                if (!sheetName) throw new Error(`Worksheet at index ${sheetIndex} not found`);

                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

                const rows: TradeData[] = json.map((row) => {
                    // Excel date can be a serial number or a string
                    const rawDate = row[col.date];
                    let dateString = "";
                    if (typeof rawDate === "number") {
                        // Convert Excel serial date → JS Date (handles 1900 base)
                        const excelEpoch = (rawDate - 25569) * 86400 * 1000; // days → ms
                        dateString = new Date(excelEpoch).toISOString().split("T")[0];
                    } else if (rawDate != null) {
                        dateString = String(rawDate);
                    }

                    const cashBalance = toNum(row[col.cashBalance]);
                    const totalEquity = toNum(row[col.totalEquity]);
                    const entryPrice = toNum(row[col.entryPrice]);
                    const positionType = (row[col.positionType] as string) ?? "Unknown";

                    return {
                        date: dateString,
                        cashBalance,
                        capitalChange: null, // filled below
                        totalEquity,
                        entryPrice,
                        positionType,
                    };
                });

                // Calculate capitalChange as delta of totalEquity vs previous row
                for (let i = 1; i < rows.length; i++) {
                    const prev = rows[i - 1].totalEquity;
                    const curr = rows[i].totalEquity;
                    rows[i].capitalChange = curr - prev;
                }

                setData(rows);
            } catch (e: any) {
                if (e?.name === "AbortError") return;
                setError(e instanceof Error ? e.message : "Failed to load data");

                // Optional: fallback sample
                setData([
                    {
                        date: "2024-08-17",
                        cashBalance: 100000,
                        capitalChange: null,
                        totalEquity: 45230.5,
                        entryPrice: 63500.25,
                        positionType: "Buy",
                    },
                    {
                        date: "2024-08-17",
                        cashBalance: 102000,
                        capitalChange: 2000,
                        totalEquity: 47850.75,
                        entryPrice: 64200,
                        positionType: "Sell",
                    },
                    {
                        date: "2024-08-18",
                        cashBalance: 101500,
                        capitalChange: -500,
                        totalEquity: 52100.25,
                        entryPrice: 65800.5,
                        positionType: "Buy",
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        load();
        return () => abortRef.current?.abort();
    }, [filePath, sheetIndex, col]);

    return { data, loading, error };
}

// Helpers
function toNum(v: unknown): number {
    if (typeof v === "number") return v;
    const n = parseFloat(String(v ?? ""));
    return Number.isFinite(n) ? n : 0;
}