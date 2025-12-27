"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import NextImage from "next/image";

import {
    Activity,
    Fingerprint,
    GalleryVerticalEnd,
    History,
    Pyramid,
    Receipt,
    Search,
    Shield,
} from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useLeverageEquitySeries } from "@/hooks/useLeverageEquitySeries";
import { useBinanceSeries } from "@/hooks/useBinanceSeries";
import SlidingTabs from "../SlidingTabs";

// Build real chart data from leverage Excel files and Binance US BTC data
const LEVERAGE_5X_FILE = "/data/chart/BTC-USD_4h_binanceus_5x_2025dec.xlsx";
const LEVERAGE_1X_FILE = "/data/chart/BTC-USD_4h_binanceus_1x_2025dec.xlsx";

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    leverage5x: {
        label: "Algorithm (5x Leverage)",
        color: "var(--highlight-text)",
    },
    leverage1x: {
        label: "Algorithm (1x Leverage)",
        color: "var(--green-color-for-chart)",
    },
    bitcoin: {
        label: "Bitcoin",
        color: "rgba(255, 255, 255, 0.5)",
    },
} satisfies ChartConfig;

export default function ChartCompareToBitcoin() {
    const t = useTranslations("chartCompareToBitcoin");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    
    // Memoize dates to prevent re-fetching on every render
    const startDate = useMemo(() => new Date("2025-01-01T00:00:00Z"), []);
    const endDate = useMemo(() => new Date("2025-12-01T00:00:00Z"), []);

    const { series: leverage5xSeries } = useLeverageEquitySeries(LEVERAGE_5X_FILE, {
        initialCapital: 100000,
    });
    const { series: leverage1xSeries } = useLeverageEquitySeries(LEVERAGE_1X_FILE, {
        initialCapital: 100000,
    });
    const { series: btcSeries } = useBinanceSeries({
        symbol: "BTCUSDT",
        interval: "4h",
        startDate,
        endDate,
        baseUrl: "https://api.binance.com",
        outputMode: "investment",
        initialInvestmentUsd: 100000,
        sampleEveryDays: 7,
        straightLine: true,
    });

    const chartData = useMemo(() => {
        const dateToRow = new Map<
            string,
            {
                date: string;
                leverage5x: number | null;
                leverage1x: number | null;
                bitcoin: number | null;
            }
        >();

        // Find the latest date across all series
        let latestDate = "";
        for (const point of leverage5xSeries) {
            const key = point.date.includes("T")
                ? point.date.split("T")[0]
                : point.date;
            if (key > latestDate) latestDate = key;
        }
        for (const point of leverage1xSeries) {
            const key = point.date.includes("T")
                ? point.date.split("T")[0]
                : point.date;
            if (key > latestDate) latestDate = key;
        }
        for (const point of btcSeries) {
            const key = point.date.includes("T")
                ? point.date.split("T")[0]
                : point.date;
            if (key > latestDate) latestDate = key;
        }

        // Track last values for each series
        let lastLeverage5x: number | null = null;
        let lastLeverage1x: number | null = null;
        let lastBitcoin: number | null = null;
        let lastLeverage5xDate = "";
        let lastLeverage1xDate = "";
        let lastBitcoinDate = "";

        for (const point of leverage5xSeries) {
            const key = point.date.includes("T")
                ? point.date.split("T")[0]
                : point.date;
            const row = dateToRow.get(key) || {
                date: key,
                leverage5x: null,
                leverage1x: null,
                bitcoin: null,
            };
            row.leverage5x = Number.isFinite(point.value) ? point.value : null;
            dateToRow.set(key, row);
            if (Number.isFinite(point.value) && key > lastLeverage5xDate) {
                lastLeverage5x = point.value;
                lastLeverage5xDate = key;
            }
        }
        for (const point of leverage1xSeries) {
            const key = point.date.includes("T")
                ? point.date.split("T")[0]
                : point.date;
            const row = dateToRow.get(key) || {
                date: key,
                leverage5x: null,
                leverage1x: null,
                bitcoin: null,
            };
            row.leverage1x = Number.isFinite(point.value) ? point.value : null;
            dateToRow.set(key, row);
            if (Number.isFinite(point.value) && key > lastLeverage1xDate) {
                lastLeverage1x = point.value;
                lastLeverage1xDate = key;
            }
        }
        for (const point of btcSeries) {
            const key = point.date.includes("T")
                ? point.date.split("T")[0]
                : point.date;
            const row = dateToRow.get(key) || {
                date: key,
                leverage5x: null,
                leverage1x: null,
                bitcoin: null,
            };
            row.bitcoin = Number.isFinite(point.value) ? point.value : null;
            dateToRow.set(key, row);
            if (Number.isFinite(point.value) && key > lastBitcoinDate) {
                lastBitcoin = point.value;
                lastBitcoinDate = key;
            }
        }

        // Extend series to latest date with straight lines
        const sorted = Array.from(dateToRow.values()).sort((a, b) =>
            a.date.localeCompare(b.date)
        );

        for (const row of sorted) {
            if (row.date > lastLeverage5xDate && lastLeverage5x !== null) {
                row.leverage5x = lastLeverage5x;
            }
            if (row.date > lastLeverage1xDate && lastLeverage1x !== null) {
                row.leverage1x = lastLeverage1x;
            }
            if (row.date > lastBitcoinDate && lastBitcoin !== null) {
                row.bitcoin = lastBitcoin;
            }
        }

        return sorted;
    }, [leverage5xSeries, leverage1xSeries, btcSeries]);

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-4 pt-16 md:pt-32 px-4 md:px-0">
                <h1 className="flex flex-col text-2xl md:text-4xl font-title text-center">
                    <span className="text-highlight">{t("titleFirstLine")}</span>
                    <span>{t("titleSecondLine")}</span>
                </h1>
                <h2 className="text-secondary text-start lg:text-center text-lg md:text-xl text-balance max-w-xl">
                    {t("description")}
                </h2>
            </div>
            <div className="w-full h-[340px] md:h-screen flex items-center justify-center relative">
                <div
                    className="
    hidden md:block pointer-events-none absolute -bottom-12 -top-48 right-3/4 -translate-x-2/3 w-px z-20
    text-zinc-700
    bg-[repeating-linear-gradient(to_bottom,currentColor_0_3px,transparent_3px_6px)]
    [mask-image:linear-gradient(to_bottom,transparent_0%_5%,#000_15%_85%,transparent_95%_100%)]
  "
                />
                <div
                    className="
    hidden md:block pointer-events-none absolute -bottom-12 -top-48 left-3/4 -translate-x-2/3 w-px z-20
    text-zinc-700
    bg-[repeating-linear-gradient(to_bottom,currentColor_0_3px,transparent_3px_6px)]
    [mask-image:linear-gradient(to_bottom,transparent_0%_5%,#000_15%_85%,transparent_95%_100%)]
  "
                />
                <div className="hidden md:block h-[600px] w-full relative">
                    <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-px z-20 text-zinc-700"
                        style={{
                            background:
                                "linear-gradient(to right, transparent 0% 5%, currentColor 15% 85%, transparent 95% 100%)",
                        }}
                    />
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-px z-20 text-zinc-700"
                        style={{
                            background:
                                "linear-gradient(to right, transparent 0% 5%, currentColor 15% 85%, transparent 95% 100%)",
                        }}
                    />
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-[500px] lg:h-3/4 w-[800px] lg:w-[960px] 2xl:w-2/3 bg-background border border-zinc-700 flex origin-center scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-100">
                    <div className="hidden md:flex items-center gap-2 absolute -top-14 left-2/4 -translate-x-2/4">
                        <p className="text-tertiary text-center !text-sm">
                            {t("usesStrategy")}
                        </p>
                        <SlidingTabs />
                    </div>
                    
                    {/* Sidebar */}
                    <div className="w-[71px] border-r border-zinc-800 shrink-0">
                        <div className="flex items-center justify-center border-b border-zinc-800 h-[60px]">
                            <NextImage
                                src="/monkeys-small-logo.svg"
                                alt="Main Logo"
                                width={40}
                                height={40}
                                className="max-w-10 max-h-10"
                            />
                        </div>
                        <div className="flex flex-col px-5 gap-5 py-10">
                            <div className="flex min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 text-secondary">
                                <Activity className="w-4 h-4" />
                            </div>
                            <div className="flex min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 text-secondary">
                                <History className="w-4 h-4" />
                            </div>
                            <div className="flex min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 border border-zinc-800 bg-zinc-900 text-white">
                                <GalleryVerticalEnd className="w-4 h-4" />
                            </div>
                            <div className="flex min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 text-secondary">
                                <Fingerprint className="w-4 h-4" />
                            </div>
                            <div className="flex min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 text-secondary">
                                <Receipt className="w-4 h-4" />
                            </div>
                            <div className="flex min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 text-secondary">
                                <Shield className="w-4 h-4" />
                            </div>
                            <div className="flex min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 text-secondary">
                                <Pyramid className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="flex-1 flex flex-col">
                        {/* Header */}
                        <header className="border-b border-zinc-800 flex justify-between items-center px-6 h-[60px] shrink-0">
                            <div className="flex items-center justify-between w-[200px]">
                                <div className="flex items-center gap-2 p-5 text-tertiary text-xs">
                                    <Search className="w-3 h-3" />
                                    {t("search")}
                                </div>
                                <div className="text-tertiary text-xs border border-zinc-800 px-1 bg-zinc-900">
                                    ⌘k
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="text-secondary text-xs bg-neutral-900 px-2 py-1 rounded-full border border-zinc-800 shrink-0">
                                    {t("proPlan")}
                                </div>
                            </div>
                        </header>

                        {/* Content area */}
                        <div className="flex-1">
                            <Card className="pt-0 border-none h-full">
                                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 h-full">
                                    <ChartContainer
                                        config={chartConfig}
                                        className="aspect-auto h-full w-full overflow-visible
    [&_.recharts-wrapper]:overflow-visible
    [&_.recharts-surface]:overflow-visible">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient
                                                    id="fillLeverage5x"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1">
                                                    <stop
                                                        offset="5%"
                                                        stopColor="var(--color-leverage5x)"
                                                        stopOpacity={0.8}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="var(--color-leverage5x)"
                                                        stopOpacity={0.1}
                                                    />
                                                </linearGradient>
                                                <linearGradient
                                                    id="fillLeverage1x"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1">
                                                    <stop
                                                        offset="5%"
                                                        stopColor="var(--color-leverage1x)"
                                                        stopOpacity={0.8}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="var(--color-leverage1x)"
                                                        stopOpacity={0.1}
                                                    />
                                                </linearGradient>
                                                <linearGradient
                                                    id="fillBitcoin"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1">
                                                    <stop
                                                        offset="5%"
                                                        stopColor="var(--color-bitcoin)"
                                                        stopOpacity={0.2}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="var(--color-bitcoin)"
                                                        stopOpacity={0.1}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                vertical={false}
                                                stroke="rgb(35, 35, 35)"
                                            />
                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                minTickGap={32}
                                                tickFormatter={(value) => {
                                                    const d = new Date(value);
                                                    if (
                                                        Number.isNaN(
                                                            d.getTime()
                                                        )
                                                    ) {
                                                        // Expect YYYY-MM-DD; format manually
                                                        const s = String(
                                                            value ?? ""
                                                        );
                                                        const m = s.match(
                                                            /^(\d{4})-(\d{2})-(\d{2})/
                                                        );
                                                        if (m) {
                                                            const months = [
                                                                "Jan",
                                                                "Feb",
                                                                "Mar",
                                                                "Apr",
                                                                "May",
                                                                "Jun",
                                                                "Jul",
                                                                "Aug",
                                                                "Sep",
                                                                "Oct",
                                                                "Nov",
                                                                "Dec",
                                                            ];
                                                            return `${
                                                                months[
                                                                    Number(
                                                                        m[2]
                                                                    ) - 1
                                                                ]
                                                            } ${Number(m[3])}`;
                                                        }
                                                        return String(
                                                            value ?? ""
                                                        );
                                                    }
                                                    return d.toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    );
                                                }}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                width={60}
                                                domain={[100000, "auto"]}
                                                tickFormatter={(
                                                    val: number
                                                ) => {
                                                    if (
                                                        typeof val !==
                                                            "number" ||
                                                        !Number.isFinite(val)
                                                    )
                                                        return "";
                                                    return `$${val.toLocaleString(
                                                        "en-US",
                                                        {
                                                            maximumFractionDigits: 0,
                                                        }
                                                    )}`;
                                                }}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent
                                                        labelFormatter={(
                                                            value
                                                        ) => {
                                                            const d = new Date(
                                                                value as any // eslint-disable-line @typescript-eslint/no-explicit-any
                                                            );
                                                            if (
                                                                !Number.isNaN(
                                                                    d.getTime()
                                                                )
                                                            ) {
                                                                return d.toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    }
                                                                );
                                                            }
                                                            const s = String(
                                                                value ?? ""
                                                            );
                                                            const m = s.match(
                                                                /^(\d{4})-(\d{2})-(\d{2})/
                                                            );
                                                            if (m) {
                                                                const months = [
                                                                    "Jan",
                                                                    "Feb",
                                                                    "Mar",
                                                                    "Apr",
                                                                    "May",
                                                                    "Jun",
                                                                    "Jul",
                                                                    "Aug",
                                                                    "Sep",
                                                                    "Oct",
                                                                    "Nov",
                                                                    "Dec",
                                                                ];
                                                                return `${
                                                                    months[
                                                                        Number(
                                                                            m[2]
                                                                        ) - 1
                                                                    ]
                                                                } ${Number(
                                                                    m[3]
                                                                )}`;
                                                            }
                                                            return s;
                                                        }}
                                                        indicator="dot"
                                                    />
                                                }
                                            />
                                            <Area
                                                dataKey="leverage5x"
                                                type="monotone"
                                                connectNulls
                                                fill="url(#fillLeverage5x)"
                                                stroke="var(--color-leverage5x)">
                                                <LabelList
                                                    dataKey="leverage5x"
                                                    content={(props) => (
                                                        <EndPointLabel
                                                            {...props}
                                                            label={t("leverage5x")}
                                                            color="var(--color-leverage5x)"
                                                            chartData={
                                                                chartData
                                                            }
                                                            isMobile={isMobile}
                                                        />
                                                    )}
                                                />
                                            </Area>
                                            <Area
                                                dataKey="leverage1x"
                                                type="monotone"
                                                connectNulls
                                                fill="url(#fillLeverage1x)"
                                                stroke="var(--color-leverage1x)">
                                                <LabelList
                                                    dataKey="leverage1x"
                                                    content={(props) => (
                                                        <EndPointLabel
                                                            {...props}
                                                            label={t("leverage1x")}
                                                            color="var(--color-leverage1x)"
                                                            chartData={
                                                                chartData
                                                            }
                                                            isMobile={isMobile}
                                                        />
                                                    )}
                                                />
                                            </Area>
                                            <Area
                                                dataKey="bitcoin"
                                                type="monotone"
                                                connectNulls
                                                fill="url(#fillBitcoin)"
                                                stroke="var(--color-bitcoin)"
                                                strokeDasharray="4 4">
                                                <LabelList
                                                    dataKey="bitcoin"
                                                    content={(props) => (
                                                        <EndPointLabel
                                                            {...props}
                                                            label={t("bitcoin")}
                                                            color="var(--color-bitcoin)"
                                                            chartData={
                                                                chartData
                                                            }
                                                            isMobile={isMobile}
                                                        />
                                                    )}
                                                />
                                            </Area>
                                            <ChartLegend
                                                content={<ChartLegendContent />}
                                            />
                                        </AreaChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="hidden md:block absolute -bottom-12 left-2/4 -translate-x-2/4">
                        <p className="text-tertiary text-center !text-xs">
                            {t("chartDescription")}
                        </p>
                    </div>
                </div>
                {/* <div className="absolute -bottom-26 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-tertiary text-md">Uses data for backtesting from:</span>

                    <img src="/exchange-logo/binance.png" alt="Binance" className="w-32" />

                </div> */}
            </div>
        </>
    );
}

// Custom label component for end points
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EndPointLabel = (props: any) => { // Chart library props have dynamic structure
    const { x, y, value, index, label, color, chartData, isMobile } = props;

    // Only show label for the last data point
    if (index !== chartData.length - 1 || !value) return null;

    return (
        <g>
            <circle
                cx={x}
                cy={y}
                r={4}
                fill={color}
                stroke="white"
                strokeWidth={2}
            />
            <foreignObject x={isMobile ? x - 170 : x + 10} y={y - 20} width={160} height={50}>
                <div className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                    <div className="text-tertiary text-[10px]">{label}</div>
                    <div className="text-white font-semibold">
                        $
                        {value.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                        })}
                    </div>
                </div>
            </foreignObject>
        </g>
    );
};
