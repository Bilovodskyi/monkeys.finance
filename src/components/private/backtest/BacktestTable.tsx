"use client";

import { useLeverageBacktest } from "@/hooks/useLeverageBacktest";
import { formatNumberWithCommas } from "@/lib/utils";
import { useState } from "react";
import HoverEffectAroundCard from "@/components/hero-animation/HoverEffectAroundCard";
import type { Instrument } from "@/data/constants";
import { instruments } from "@/data/constants";
import { LeverageTradeData } from "@/types/global";
import { useTranslations } from "next-intl";

// Nested data type: instrument -> leverage -> trades
type BacktestDataByLeverage = Record<string, Record<number, LeverageTradeData[]>>;

const LEVERAGE_LEVELS = [1, 2, 3, 4, 5, 6] as const;
type LeverageLevel = (typeof LEVERAGE_LEVELS)[number];

interface BacktestTableProps {
    data: BacktestDataByLeverage;
    compact?: boolean;
}

export default function BacktestTable({
    data,
    compact = false,
}: BacktestTableProps) {
    const t = useTranslations("backtest");
    const [selectedInstrument, setSelectedInstrument] =
        useState<Instrument>("Bitcoin");
    const [selectedLeverage, setSelectedLeverage] = useState<LeverageLevel>(6);

    // Get data for the selected instrument AND leverage
    const instrumentData = data[selectedInstrument]?.[selectedLeverage] || [];

    const hasData = instrumentData.length > 0;
    const firstDate = hasData
        ? new Date(instrumentData[0].entryDate).toLocaleDateString('en-CA')
        : "—";
    const lastDate = hasData
        ? new Date(instrumentData[instrumentData.length - 1].exitDate).toLocaleDateString('en-CA')
        : "—";

    const stats = useLeverageBacktest(instrumentData);
    const trades = stats.trades;

    return (
        <div className="flex flex-col h-full md:overflow-hidden">
            {/* Selectors Row */}
            <div className="flex flex-wrap gap-8 items-center px-4 md:px-6 pt-6">
                {/* Instrument Selector */}
                <div className="flex flex-wrap gap-2 md:gap-4">
                    {instruments.map((instrument) => (
                        <div key={instrument} className="group relative">
                            {selectedInstrument === instrument && (
                                <HoverEffectAroundCard offset={4} />
                            )}
                            <div
                                onClick={() =>
                                    setSelectedInstrument(instrument)
                                }
                                className={`hover:bg-zinc-900 cursor-pointer border border-zinc-700 py-2 px-3 lg:px-4 text-white text-center text-sm ${
                                    compact ? "min-w-[80px]" : "min-w-[100px]"
                                }`}>
                                {instrument}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="hidden md:block h-8 w-px bg-zinc-700" />

                {/* Leverage Selector */}
                <div className="flex flex-wrap gap-2 md:gap-4">
                    {LEVERAGE_LEVELS.map((level) => (
                        <div key={level} className="group relative">
                            {selectedLeverage === level && (
                                <HoverEffectAroundCard offset={4} />
                            )}
                            <div
                                onClick={() => setSelectedLeverage(level)}
                                className={`hover:bg-zinc-900 cursor-pointer border border-zinc-700 py-2 px-3 lg:px-4 text-white text-center text-sm min-w-[50px] ${
                                    selectedLeverage === level
                                        ? "text-white"
                                        : "text-tertiary"
                                }`}>
                                {level}x
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Stats Cards */}
            <div className="flex flex-col md:flex-row p-4 md:p-6 gap-6">
                <div className="h-[130px] flex-1 border border-zinc-800 p-4 2xl:p-6 flex flex-col justify-between gap-4">
                    <div>
                        <span className="text-xs text-tertiary">
                            {formatNumberWithCommas(stats.startEquity)} USD
                        </span>
                        <h1 className="text-lg 2xl:text-xl font-title">
                            {formatNumberWithCommas(stats.endEquity)} USD
                        </h1>
                    </div>
                    <h2 className="text-tertiary font-title">
                        {t("stats.startEndCapital")}
                    </h2>
                </div>
                <div className="h-[130px] flex-1 border border-zinc-800 p-4 2xl:p-6 flex flex-col justify-between gap-4">
                    <h1 className="text-lg 2xl:text-xl font-title">
                        {firstDate} - {lastDate}
                    </h1>
                    <h2 className=" text-tertiary font-title">
                        {t("stats.backtestPeriod")}
                    </h2>
                </div>
                <div className="h-[130px] flex-1 border border-zinc-800 p-4 2xl:p-6 flex flex-col justify-between gap-4">
                    <h1 className="text-lg 2xl:text-xl font-title">
                        {Math.round(stats.capitalChangePct)}%
                    </h1>
                    <h2 className=" text-tertiary font-title">
                        {t("stats.capitalChange")}
                    </h2>
                </div>
                <div className="h-[130px] flex-1 border border-zinc-800 p-4 2xl:p-6 flex flex-col justify-between gap-4">
                    <h1 className="text-lg 2xl:text-xl font-title">
                        {stats.numTrades} / {stats.winTradesCount} /{" "}
                        {stats.lossTradesCount}
                    </h1>
                    <h2 className=" text-tertiary font-title">
                        {t("stats.totalTradesWinsLosses")}
                    </h2>
                </div>
            </div>

            {/* Trades Table */}
            <div className="flex-1 p-4 md:p-6 hidden md:flex flex-col overflow-hidden">
                {/* Sticky Header */}
                <div className="grid grid-cols-9 border border-zinc-800 backdrop-blur-md">
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">
                        {t("tableHeaders.positionType")}
                    </div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">
                        {t("tableHeaders.openDate")}
                    </div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">
                        {t("tableHeaders.closeDate")}
                    </div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">
                        {t("tableHeaders.pnl")}
                    </div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">{t("tableHeaders.fees")}</div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">
                        {t("tableHeaders.equityBefore")}
                    </div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">
                        {t("tableHeaders.equityAfter")}
                    </div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">{t("tableHeaders.entryPrice")}</div>
                    <div className="px-4 py-3 text-tertiary ">{t("tableHeaders.exitPrice")}</div>
                    
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {trades.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-tertiary">
                            {t("noTrades", { instrument: selectedInstrument, leverage: selectedLeverage })}
                        </div>
                    ) : (
                        trades.map((trade, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-9 border border-zinc-800 border-t-0 ${trade.isFiltered ? 'text-yellow-500' : ''}`}>
                                <div className="border-r border-zinc-800 px-4 py-3">
                                    {trade.isFiltered ? t("positionTypes.filtered") : `${trade.leverage}x ${t("positionTypes.long")}`}
                                </div>
                                <div className="border-r border-zinc-800 px-4 py-3">
                                    {new Date(trade.entryDate).toLocaleDateString('en-CA')}
                                </div>
                                <div className="border-r border-zinc-800 px-4 py-3">
                                    {trade.isFiltered ? '—' : new Date(trade.exitDate).toLocaleDateString('en-CA')}
                                </div>
                                <div className={`border-r border-zinc-800 px-4 py-3 ${trade.isFiltered ? '' : (trade.pnlUsdt >= 0 ? 'text-green-500' : 'text-red-500')}`}>
                                    {trade.isFiltered ? '—' : `${trade.pnlUsdt >= 0 ? '+' : ''}${formatNumberWithCommas(Math.round(trade.pnlUsdt))}`}
                                </div>
                                <div className={`border-r border-zinc-800 px-4 py-3 ${trade.isFiltered ? '' : 'text-tertiary'}`}>
                                    {trade.isFiltered ? '—' : formatNumberWithCommas(Math.round(trade.totalFees))}
                                </div>
                                <div className="border-r border-zinc-800 px-4 py-3">
                                    {trade.isFiltered ? '—' : formatNumberWithCommas(Math.round(trade.equityBefore))}
                                </div>
                                <div className="border-r border-zinc-800 px-4 py-3">
                                    {trade.isFiltered ? '—' : formatNumberWithCommas(Math.round(trade.equityAfter))}
                                </div>
                                <div className="border-r border-zinc-800 px-4 py-3">
                                    {trade.isFiltered ? '—' : formatNumberWithCommas(Math.round(trade.entryPrice))}
                                </div>
                                <div className="px-4 py-3">
                                    {trade.isFiltered ? '—' : formatNumberWithCommas(Math.round(trade.exitPrice))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
