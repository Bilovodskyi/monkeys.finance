"use client";

import { useState, useEffect } from "react";
import type { Instrument } from "@/data/constants";
import { TradeData } from "@/types/global";
import { parseExcelTradeData } from "@/utils/parseExcelTradeData";
import MetaballsLoader from "@/components/Loader";
import BacktestTable from "./BacktestTable";

export default function BacktestContent({
    compact = false,
}: {
    compact?: boolean;
}) {
    const [allData, setAllData] = useState<Record<string, TradeData[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch and parse all Excel files from public folder
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError(null);

                const files = [
                    {
                        instrument: "Bitcoin" as Instrument,
                        path: "/data/backtest/BTC-USD_4h_20251023-212143.xlsx",
                    },
                    {
                        instrument: "Binance Coin" as Instrument,
                        path: "/data/backtest/BNB-USD_4h_20251023-212307.xlsx",
                    },
                    {
                        instrument: "XRP" as Instrument,
                        path: "/data/backtest/XRP-USD_4h_20251023-212237.xlsx",
                    },
                ];

                const dataPromises = files.map(async ({ instrument, path }) => {
                    const response = await fetch(path);
                    if (!response.ok)
                        throw new Error(
                            `Failed to fetch ${instrument}: ${response.status}`
                        );
                    const arrayBuffer = await response.arrayBuffer();
                    const parsedData = parseExcelTradeData(arrayBuffer);
                    return { instrument, data: parsedData };
                });

                const results = await Promise.all(dataPromises);

                const dataMap: Record<string, TradeData[]> = {};
                results.forEach(({ instrument, data }) => {
                    dataMap[instrument] = data;
                });

                setAllData(dataMap);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (error)
        return (
            <div className="p-6 text-secondary h-full w-full flex items-center justify-center">
                <p>Error fetching data</p>
            </div>
        );

    if (loading) return <MetaballsLoader />;

    return <BacktestTable data={allData} compact={compact} />;
}
