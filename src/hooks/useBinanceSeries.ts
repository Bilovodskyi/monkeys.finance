"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type SeriesPoint = { date: string; value: number };

type UseBinanceSeriesParams = {
    symbol?: string; // e.g. "BTCUSDT"
    interval?: string; // e.g. "4h", "1d"
    startDate?: Date; // inclusive
    endDate?: Date;   // inclusive
    baseUrl?: string; // api host, default binance.com
    outputMode?: "price" | "investment"; // price closes or investment value over time
    initialInvestmentUsd?: number; // used when outputMode = "investment"
    sampleEveryDays?: number; // downsample cadence; e.g., 14 for bi-weekly
    straightLine?: boolean; // if true, return only start and end points
};

// Binance US API for klines: https://api.binance.us/api/v3/klines?symbol=BTCUSD&interval=1d&startTime=1704067200000&endTime=...
// Note: Binance US supports different symbols than Binance.com; use BTCUSD for spot.
export function useBinanceSeries(params: UseBinanceSeriesParams = {}) {
    const {
        symbol = "BTCUSDT",
        interval = "1d",
        startDate = new Date("2024-01-01T00:00:00Z"),
        endDate = new Date(),
        baseUrl = "https://api.binance.com",
        outputMode = "price",
        initialInvestmentUsd = 100000,
        sampleEveryDays,
        straightLine = false,
    } = params;

    const [series, setSeries] = useState<SeriesPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        abortRef.current?.abort();
        abortRef.current = controller;
        setLoading(true);
        setError(null);

        const fetchKlines = async () => {
            try {
                const startTime = startDate.getTime();
                const endTime = endDate.getTime();
                const all: SeriesPoint[] = [];
                let nextStart = startTime;
                // Paginate by requesting chunks up to 1000 candles until we reach endTime
                // Binance returns up to 'limit' candles starting from startTime
                while (nextStart < endTime) {
                    const url = new URL("/api/v3/klines", baseUrl);
                    url.searchParams.set("symbol", symbol);
                    url.searchParams.set("interval", interval);
                    url.searchParams.set("startTime", String(nextStart));
                    url.searchParams.set("endTime", String(endTime));
                    url.searchParams.set("limit", "1000");

                    const res = await fetch(url.toString(), { signal: controller.signal });
                    if (!res.ok) throw new Error(`Failed to fetch klines: ${res.status}`);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const data: any[] = await res.json(); // Binance API - external, may change
                    if (!Array.isArray(data) || data.length === 0) break;

                    const mapped: SeriesPoint[] = data.map((row) => ({
                        date: new Date(row[0]).toISOString(),
                        value: Number(row[4]), // close
                    }));
                    all.push(...mapped);

                    const lastCloseTime = Number(data[data.length - 1][6]);
                    if (!Number.isFinite(lastCloseTime) || lastCloseTime <= nextStart) break;
                    nextStart = lastCloseTime + 1; // move past last candle
                    if (data.length < 1000) break; // no more pages
                }

                let output = all;
                if (outputMode === "investment") {
                    if (all.length === 0) {
                        setSeries([]);
                        return;
                    }
                    const firstClose = all[0].value;
                    const numCoins = firstClose > 0 ? initialInvestmentUsd / firstClose : 0;
                    output = all.map(p => ({ date: p.date, value: Number.isFinite(p.value) ? numCoins * p.value : 0 }));
                }

                if (!straightLine && sampleEveryDays && sampleEveryDays > 0) {
                    output = downsampleByDays(output, sampleEveryDays);
                }

                if (straightLine && output.length > 0) {
                    const first = output[0];
                    const last = output[output.length - 1];
                    setSeries([first, last]);
                } else {
                    setSeries(output);
                }
            } catch (e) {
                // Check for AbortError using type narrowing
                if (e instanceof Error && e.name === "AbortError") return;
                setError(e instanceof Error ? e.message : "Failed to fetch Binance data");
            } finally {
                setLoading(false);
            }
        };

        fetchKlines();
        return () => controller.abort();
    }, [symbol, interval, startDate, endDate, baseUrl]);

    const deduped = useMemo(() => {
        // In case of overlapping pagination in the future, keep last occurrence per date
        const map = new Map<string, number>();
        for (const p of series) map.set(p.date, p.value);
        return Array.from(map, ([date, value]) => ({ date, value })).sort((a, b) => a.date.localeCompare(b.date));
    }, [series]);

    return { series: deduped, loading, error };
}

function downsampleByDays(points: SeriesPoint[], everyDays: number): SeriesPoint[] {
    if (!Array.isArray(points) || points.length === 0) return points;
    const out: SeriesPoint[] = [];
    const dayMs = 24 * 60 * 60 * 1000;
    let anchor = new Date(points[0].date).getTime();
    if (Number.isNaN(anchor)) return points; // bail if dates malformed

    for (const p of points) {
        const t = new Date(p.date).getTime();
        if (Number.isNaN(t)) continue;
        if (out.length === 0 || t - anchor >= everyDays * dayMs) {
            out.push(p);
            anchor = t;
        } else {
            // keep the latest within the current bucket
            out[out.length - 1] = p;
        }
    }
    return out;
}


