"use client";

import { useBacktestStats } from "@/hooks/useBacktestStats";
import { useExcelTradeData } from "@/hooks/useExcelTradeData";
import { formatNumberWithCommas } from "@/lib/utils";
import groupTradesIntoPairs from "@/utils/groupTradesIntoPairs";

export default function BacktestPage() {
    const { data, loading, error } = useExcelTradeData("/data/BTC-USD_1h_20250817-204937.xlsx");

    const hasData = data.length > 0;
    const visibleTrades = hasData && data.length > 1 ? data.slice(1) : [];
    const statsInput = hasData && data.length > 1 ? data.slice(1) : [];

    const pairs = groupTradesIntoPairs(visibleTrades);
    const stats = useBacktestStats(statsInput);

    return (
        <>
            <div className="flex">
                <div className="h-[100px] flex-1 bg-red-500"></div>
                <div className="h-[100px] flex-1 bg-blue-500"></div>
                <div className="h-[100px] flex-1 bg-green-500"></div>
            </div>
            <div className="p-6 bg-black h-full flex flex-col">
                {/* Sticky Header */}
                <div className="grid grid-cols-7 border border-zinc-800 backdrop-blur-md">
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">Position Type</div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">Open Date</div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">Close Date</div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">P&L</div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">Equity Before</div>
                    <div className="border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">Equity After</div>
                    <div className="px-4 py-3 text-tertiary text-sm">Entry Price</div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {pairs.map((trade, index) => (
                        <div key={index} className="grid grid-cols-7 border border-zinc-800 border-t-0">
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">{trade.firstTrade.positionType}</div>
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">{trade.firstTrade.date}</div>
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">{trade.secondTrade.date}</div>
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">{trade.totalChange}</div>
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">{formatNumberWithCommas(trade.firstTrade.totalEquity)}</div>
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">{formatNumberWithCommas(trade.secondTrade.totalEquity)}</div>
                            <div className="px-4 py-3 text-tertiary text-sm">{formatNumberWithCommas(trade.firstTrade.entryPrice)}</div>
                        </div>
                    ))}
                </div>


                {/* <div className="px-4 py-3 border border-zinc-800 flex justify-end">
                <span>Earnings: {formatNumberWithCommas(stats.totalGain)} USD</span>
                </div> */}
            </div>
        </>
    )
}