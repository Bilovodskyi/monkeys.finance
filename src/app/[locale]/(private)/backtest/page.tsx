"use client";

import { useBacktestStats } from "@/hooks/useBacktestStats";
import { useExcelTradeData } from "@/hooks/useExcelTradeData";
import { formatNumberWithCommas } from "@/lib/utils";
import groupTradesIntoPairs from "@/utils/groupTradesIntoPairs";
import { useState } from "react";
import HoverEffectAroundCard from "@/components/hero-animation/HoverEffectAroundCard";
import type { Instrument } from '@/data/constants';
import { instruments } from '@/data/constants';


export default function BacktestPage() {
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument>("Bitcoin");
    const { data, loading, error } = useExcelTradeData("/data/BTC-USD_1h_20250817-204937.xlsx");

    const hasData = data.length > 0;
    const firstDate = data.at(0)?.date ?? "—";
    const lastDate = data.at(-1)?.date ?? "—";
    const visibleTrades = hasData && data.length > 1 ? data.slice(1) : [];
    const statsInput = hasData && data.length > 1 ? data.slice(1) : [];

    const pairs = groupTradesIntoPairs(visibleTrades);
    const stats = useBacktestStats(statsInput);

    return (
        <div className="flex flex-col h-full">
            <div className='px-6 pt-6 w-1/2'>
                <div className='grid grid-cols-6 grid-rows-1 gap-4 w-full'>
                    {instruments.map((instrument) => (
                        <div key={instrument} className='group relative'>
                            {selectedInstrument === instrument && (
                                <HoverEffectAroundCard offset={4} />
                            )}
                            <div onClick={() => setSelectedInstrument(instrument)} className='hover:bg-zinc-900 cursor-pointer border border-zinc-700 py-2 px-3 text-white text-center text-sm'>{instrument}</div>
                        </div>
                    ))}

                </div>
            </div>
            <div className="flex p-6 gap-6">
                <div className="h-[130px] flex-1 border border-zinc-800 p-6 flex flex-col justify-between gap-4">
                    <h1 className="text-xl font-title">{formatNumberWithCommas(stats.totalGain)} USD</h1>
                    <h2 className=" text-tertiary font-title">Total Money Earned</h2>
                </div>
                <div className="h-[130px] flex-1 border border-zinc-800 p-6 flex flex-col justify-between gap-4">
                    <h1 className="text-xl font-title">{firstDate} - {lastDate}</h1>
                    <h2 className=" text-tertiary font-title">Backtest Period</h2>
                </div>
                <div className="h-[130px] flex-1 border border-zinc-800 p-6 flex flex-col justify-between gap-4">
                    <h1 className="text-xl font-title">{Math.round(stats.capitalChangePct)}%</h1>
                    <h2 className=" text-tertiary font-title">Capital Change</h2>
                </div>
                <div className="h-[130px] flex-1 border border-zinc-800 p-6 flex flex-col justify-between gap-4">
                    <h1 className="text-xl font-title">{stats.numTrades} / {stats.winTradesCount} / {stats.lossTradesCount}</h1>
                    <h2 className=" text-tertiary font-title">Total Trades / Wins / Losses</h2>
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col overflow-hidden">
                {/* Sticky Header */}
                <div className="grid grid-cols-7 border border-zinc-800 backdrop-blur-md">
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">Position Type</div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">Open Date</div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">Close Date</div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">P&L</div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">Equity Before</div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary ">Equity After</div>
                    <div className="px-4 py-3 text-tertiary ">Entry Price</div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {pairs.map((trade, index) => (
                        <div key={index} className="grid grid-cols-7 border border-zinc-800 border-t-0">
                            <div className="border-r border-zinc-800 px-4 py-3">{trade.firstTrade.positionType}</div>
                            <div className="border-r border-zinc-800 px-4 py-3">{trade.firstTrade.date}</div>
                            <div className="border-r border-zinc-800 px-4 py-3">{trade.secondTrade.date}</div>
                            <div className="border-r border-zinc-800 px-4 py-3">{trade.totalChange}</div>
                            <div className="border-r border-zinc-800 px-4 py-3">{formatNumberWithCommas(trade.firstTrade.totalEquity)}</div>
                            <div className="border-r border-zinc-800 px-4 py-3">{formatNumberWithCommas(trade.secondTrade.totalEquity)}</div>
                            <div className="px-4 py-3">{formatNumberWithCommas(trade.firstTrade.entryPrice)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}