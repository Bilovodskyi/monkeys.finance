"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType } from "lightweight-charts";
import type { IChartApi, ISeriesApi } from "lightweight-charts";
import MetaballsLoader from "@/components/Loader";
import { useTranslations } from "next-intl";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface AlgorithmChartProps {
    instrument: string;
    interval: string;
    flipPrice?: number | null;
    signalPrice?: number | null;
    signalDate?: Date | null;
    signalType?: 'buy' | 'sell' | 'none';
}

interface BinanceKline {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

export function AlgorithmChart({
    instrument,
    interval,
    flipPrice,
    signalPrice,
    signalDate,
    signalType,
}: AlgorithmChartProps) {
    const t = useTranslations("algorithms");
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Convert interval format (e.g., "4h" -> "4h", "1d" -> "1d")
    const getBinanceInterval = (interval: string) => {
        return interval; // Assuming the interval is already in Binance format
    };

    // Convert instrument to Binance symbol (e.g., "BTC" -> "BTCUSDC")
    const getBinanceSymbol = (instrument: string) => {
        // Remove any hyphens and ensure proper format
        const cleanInstrument = instrument.replace('-', '').replace('_', '');
        return `${cleanInstrument}`;
    };

    const fetchBinanceData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const symbol = getBinanceSymbol(instrument);
            console.log('Fetching data for symbol:', symbol);
            
            // Use internal API route to bypass CORS
            const url = `/api/binance/klines?symbol=${symbol}&interval=4h&limit=540`;
            console.log('API URL:', url);
            
            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch data: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Raw API response (first 3 items):', data.slice(0, 3));
            console.log('Total candles fetched:', data.length);

            // Transform Binance data to lightweight-charts format
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const klines: BinanceKline[] = data.map((k: any[]) => ({
                time: Math.floor(k[0] / 1000), // Convert to seconds
                open: parseFloat(k[1]),
                high: parseFloat(k[2]),
                low: parseFloat(k[3]),
                close: parseFloat(k[4]),
            }));

            console.log('Transformed klines (first 3):', klines.slice(0, 3));
            return klines;
        } catch (err) {
            console.error('Error fetching Binance data:', err);
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch chart data";
            setError(errorMessage);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            console.log('Dialog closed');
            return;
        }

        // Wait for dialog content to mount and ref to be available
        const initTimer = setTimeout(() => {
            if (!chartContainerRef.current) {
                console.log('Container still not ready after delay');
                return;
            }

            console.log('Creating chart...');

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
                height: 500,
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                },
            });

            chartRef.current = chart;
            console.log('Chart created successfully');

            // Create candlestick series (v4 API)
            const candlestickSeries = chart.addCandlestickSeries({
                upColor: "#22c55e",
                downColor: "#ef4444",
                wickUpColor: "#22c55e",
                wickDownColor: "#ef4444",
            });

            candlestickSeriesRef.current = candlestickSeries;
            console.log('Candlestick series created');

            // Fetch and set data
            fetchBinanceData().then((klines) => {
                console.log('Setting chart data, klines count:', klines.length);
                
                if (klines.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    candlestickSeries.setData(klines as any);
                    console.log('Chart data set successfully');

                    // Add flip price line
                    if (flipPrice) {
                        candlestickSeries.createPriceLine({
                            price: flipPrice,
                            color: "#fff",
                            lineWidth: 2,
                            lineStyle: 2, // Dashed
                            axisLabelVisible: true,
                            title: t("chart.flipPriceLabel"),
                        });
                        console.log('Flip price line added:', flipPrice);
                    }

                    // Add signal entry point marker (signalDate already represents entry time)
                    if (signalPrice && signalDate) {
                        const entryTimestamp = Math.floor(signalDate.getTime() / 1000);
                        
                        const markerText = signalType === 'buy' 
                            ? t("chart.buySignalEntry")
                            : signalType === 'sell' 
                            ? t("chart.sellSignalEntry")
                            : t("chart.signalEntry");
                        
                        candlestickSeries.setMarkers([{
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            time: entryTimestamp as any,
                            position: 'inBar',
                            color: '#fff',
                            shape: 'circle',
                            text: markerText,
                        }]);
                        console.log('Signal marker added at entry candle:', new Date(entryTimestamp * 1000));
                    }

                    // Fit content
                    chart.timeScale().fitContent();
                    console.log('Chart fit to content');
                } else {
                    console.warn('No klines data to display');
                }
            });

            // Handle resize
            const handleResize = () => {
                if (chartContainerRef.current && chartRef.current) {
                    chartRef.current.applyOptions({
                        width: chartContainerRef.current.clientWidth,
                    });
                }
            };

            window.addEventListener("resize", handleResize);

            // Store cleanup function
            return () => {
                console.log('Cleaning up chart');
                window.removeEventListener("resize", handleResize);
            };
        }, 100); // Wait 100ms for dialog to mount

        // Cleanup
        return () => {
            clearTimeout(initTimer);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [isOpen, instrument, interval, flipPrice, signalPrice, signalDate, signalType]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            console.log('Dialog state changing to:', open);
            setIsOpen(open);
        }}>
            <DialogTrigger asChild>
                <button 
                    onClick={() => console.log('Button clicked!')}
                    className="px-4 py-2 border border-zinc-600 hover:bg-neutral-900 text-sm text-secondary hover:text-primary transition-all duration-200 whitespace-nowrap rounded-lg cursor-pointer"
                >
                    {t("seeOnChart")}
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl px-3 pb-3">
                <DialogHeader className="px-2">
                    <DialogTitle>
                        {t("chart.title", { instrument, interval })}
                    </DialogTitle>
                    <DialogDescription className="text-tertiary">
                        {t("chart.description")}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="w-full">
                    {isLoading && (
                        <div className="flex items-center justify-center h-[500px]">
                            <MetaballsLoader />
                        </div>
                    )}
                    
                    {error && (
                        <div className="flex items-center justify-center h-[500px]">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}
                    
                    <div 
                        ref={chartContainerRef} 
                        className={isLoading || error ? "hidden" : "h-[500px]"}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
