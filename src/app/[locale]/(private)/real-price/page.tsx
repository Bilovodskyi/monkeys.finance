"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType } from "lightweight-charts";
import type { IChartApi, ISeriesApi, CandlestickData, Time, LineData } from "lightweight-charts";
import MetaballsLoader from "@/components/Loader";

interface BinanceKline {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface FairPricePoint {
    date: string;
    fair_value: number;
    floor_price: number;
    upper_q50: number;
    lower_q50: number;
}

interface FairPriceData {
    points: FairPricePoint[];
}

interface BandData {
    fairValue: LineData<Time>[];
    floorPrice: LineData<Time>[];
    upperQ50: LineData<Time>[];
    lowerQ50: LineData<Time>[];
}

export default function RealPricePage() {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllBitcoinData = async (): Promise<BinanceKline[]> => {
        const allKlines: BinanceKline[] = [];
        const symbol = "BTCUSDT";
        const interval = "1d";
        const limit = 1000; // Max per request
        
        // Start from Jan 1, 2017 (earliest Binance data)
        let startTime = new Date("2017-01-01").getTime();
        const endTime = Date.now();
        
        try {
            while (startTime < endTime) {
                const url = `/api/binance/klines?symbol=${symbol}&interval=${interval}&limit=${limit}&startTime=${startTime}`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to fetch data: ${response.statusText}`);
                }
                
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data: any[] = await response.json();
                
                if (data.length === 0) break;
                
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const klines: BinanceKline[] = data.map((k: any[]) => ({
                    time: Math.floor(k[0] / 1000),
                    open: parseFloat(k[1]),
                    high: parseFloat(k[2]),
                    low: parseFloat(k[3]),
                    close: parseFloat(k[4]),
                }));
                
                allKlines.push(...klines);
                
                // Move startTime to after the last candle
                const lastCandle = data[data.length - 1];
                startTime = lastCandle[0] + 1;
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Sort by time and deduplicate (pagination may cause overlaps)
            const uniqueKlines = allKlines
                .sort((a, b) => a.time - b.time)
                .filter((kline, index, arr) => 
                    index === 0 || kline.time !== arr[index - 1].time
                );
            
            // Filter out bad tick data (flash wicks > 50% from open price)
            const cleanKlines = uniqueKlines.map(kline => {
                const maxReasonableHigh = kline.open * 1.5;
                const minReasonableLow = kline.open * 0.5;
                
                return {
                    ...kline,
                    high: Math.min(kline.high, maxReasonableHigh),
                    low: Math.max(kline.low, minReasonableLow),
                };
            });
            
            return cleanKlines;
        } catch (err) {
            console.error("Error fetching Bitcoin data:", err);
            throw err;
        }
    };

    const fetchBandData = async (): Promise<BandData> => {
        try {
            const response = await fetch("/data/fair-price/real_price_series_BTC-USD.json");
            if (!response.ok) {
                throw new Error("Failed to fetch band data");
            }
            
            const data: FairPriceData = await response.json();
            
            // Convert to line series format for all lines
            const fairValue: LineData<Time>[] = data.points.map(point => ({
                time: (new Date(point.date).getTime() / 1000) as Time,
                value: point.fair_value,
            }));
            
            const floorPrice: LineData<Time>[] = data.points.map(point => ({
                time: (new Date(point.date).getTime() / 1000) as Time,
                value: point.floor_price,
            }));
            
            const upperQ50: LineData<Time>[] = data.points.map(point => ({
                time: (new Date(point.date).getTime() / 1000) as Time,
                value: point.upper_q50,
            }));
            
            const lowerQ50: LineData<Time>[] = data.points.map(point => ({
                time: (new Date(point.date).getTime() / 1000) as Time,
                value: point.lower_q50,
            }));
            
            // Sort by time
            return {
                fairValue: fairValue.sort((a, b) => (a.time as number) - (b.time as number)),
                floorPrice: floorPrice.sort((a, b) => (a.time as number) - (b.time as number)),
                upperQ50: upperQ50.sort((a, b) => (a.time as number) - (b.time as number)),
                lowerQ50: lowerQ50.sort((a, b) => (a.time as number) - (b.time as number)),
            };
        } catch (err) {
            console.error("Error fetching band data:", err);
            throw err;
        }
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Create chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "rgb(18, 18, 18)" },
                textColor: "#d1d5db",
            },
            grid: {
                vertLines: { color: "#27272a" },
                horzLines: { color: "#27272a" },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        chartRef.current = chart;

        // Create candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: "#22c55e",
            downColor: "#ef4444",
            wickUpColor: "#22c55e",
            wickDownColor: "#ef4444",
        });

        candlestickSeriesRef.current = candlestickSeries;

        // Create fair value line series (yellow)
        const fairValueSeries = chart.addLineSeries({
            color: "#eab308", // Yellow
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: true,
            title: "Fair Value",
        });

        // Create upper Q50 line series (red)
        // const upperQ50Series = chart.addLineSeries({
        //     color: "#ef4444", // Red
        //     lineWidth: 2,
        //     priceLineVisible: false,
        //     lastValueVisible: true,
        //     title: "Upper Q50",
        // });

        // Create lower Q50 line series (green)
        // const lowerQ50Series = chart.addLineSeries({
        //     color: "#22c55e", // Green
        //     lineWidth: 2,
        //     priceLineVisible: false,
        //     lastValueVisible: true,
        //     title: "Lower Q50",
        // });

        // Fetch both datasets
        Promise.all([fetchAllBitcoinData(), fetchBandData()])
            .then(([klines, bandData]) => {
                if (klines.length > 0) {
                    candlestickSeries.setData(klines as CandlestickData<Time>[]);
                }
                if (bandData.fairValue.length > 0) {
                    fairValueSeries.setData(bandData.fairValue);
                }
                // if (bandData.upperQ50.length > 0) {
                //     upperQ50Series.setData(bandData.upperQ50);
                // }
                // if (bandData.lowerQ50.length > 0) {
                //     lowerQ50Series.setData(bandData.lowerQ50);
                // }
                chart.timeScale().fitContent();
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Failed to fetch chart data");
                setIsLoading(false);
            });

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []);

    return (
        <div className="w-full h-[calc(100vh-64px)] relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[rgb(18,18,18)] z-10">
                    <MetaballsLoader />
                </div>
            )}
            
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-[rgb(18,18,18)] z-10">
                    <p className="text-red-500">{error}</p>
                </div>
            )}
            
            <div 
                ref={chartContainerRef} 
                className="w-full h-full"
            />
        </div>
    );
}