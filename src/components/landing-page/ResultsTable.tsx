"use client";

import { useState } from 'react';
import SlidingStrategiesTabs from './SlidingStrategiesTabs';
import { CustomButton } from '../CustomButton';
import { BacktestPie } from './BacktestPie';
import { useBacktestStats } from '@/hooks/useBacktestStats';
import { X } from 'lucide-react';
import HoverEffectAroundCard from '../hero-animation/HoverEffectAroundCard';
import groupTradesIntoPairs from '@/utils/groupTradesIntoPairs';
import { useExcelTradeData } from '@/hooks/useExcelTradeData';
import type { Instrument } from '@/data/constants';
import { instruments } from '@/data/constants';

export function ResultsTable() {
    const [showAllOpen, setShowAllOpen] = useState(false);
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument>("Bitcoin");
    const [sideFilter, setSideFilter] = useState<"buy" | "sell" | "all">("buy");

    const { data, loading, error } = useExcelTradeData("/data/BTC-USD_1h_20250817-204937.xlsx");

    const hasData = data.length > 0;
    const firstDate = data.at(0)?.date ?? "—";
    const lastDate = data.at(-1)?.date ?? "—";
    const visibleTrades = hasData && data.length > 1 ? data.slice(1, 16) : [];
    const statsInput = hasData && data.length > 1 ? data.slice(1) : [];

    // Calculate stats before conditional return (hooks must be called unconditionally)
    const stats = useBacktestStats(statsInput);

    if (loading) {
        return (
            <section className="bg-black border border-zinc-800 rounded-lg p-6 mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-white">Backtest Results</h2>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1fd5f9]"></div>
                    <span className="ml-3 text-secondary">Loading trading data...</span>
                </div>
            </section>
        );
    }

    const pairs = groupTradesIntoPairs(visibleTrades);

    return (
        <section className="px-24 mt-8">

            {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-600 rounded text-red-400 ">
                    Warning: {error}. Showing sample data.
                </div>
            )}

            <div className="flex justify-center h-screen py-24">

                <div className="w-2/3 px-4">
                    <div className='w-full flex items-end justify-between'>
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-3xl text-white font-title'>Strategies <span className='text-highlight'>Backtest</span> Results</h2>
                            <h3 className=' text-secondary'>Without Machine Learning</h3>
                        </div>
                        <h2 className=' text-secondary'>
                            Backtest Period: {firstDate} - {lastDate}
                        </h2>
                    </div>

                    <div className="pr-2 mt-4">
                        {pairs.map((pair, index) => (
                            <div
                                key={index}
                                className={`relative border-b first:border-t border-zinc-800 py-4 px-6`}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                                    {/* Position Types */}
                                    <div className="flex gap-2 justify-center md:justify-start">
                                        {pair.firstTrade.positionType !== 'Unknown' && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium border border-zinc-700">
                                                {pair.firstTrade.positionType}
                                            </span>
                                        )}

                                    </div>

                                    {/* Dates */}
                                    <div className="text-center md:text-left">
                                        <div className=" text-secondary font-medium">{pair.firstTrade.date}</div>
                                        <div className=" text-secondary">{pair.secondTrade.date}</div>
                                    </div>

                                    {/* Capital Change */}
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400 mb-1">P&L</div>
                                        <span className={`font-semibold text-lg ${pair.totalChange >= 0
                                            ? 'text-green-400'
                                            : 'text-red-400'
                                            }`}>
                                            {pair.totalChange >= 0 ? '+' : ''}${pair.totalChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    {/* Total Equity */}
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400 mb-1">Total Equity</div>
                                        <div className="text-xs text-white">${pair.firstTrade.totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                        <div className=" text-white font-medium">→ ${pair.secondTrade.totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                    </div>

                                    {/* Entry Price */}
                                    <div className="text-center md:text-right">
                                        <div className="text-xs text-gray-400 mb-1">Entry Price</div>
                                        <div className=" text-white font-medium">${pair.firstTrade.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                    </div>
                                </div>

                            </div>
                        ))}
                        <div className='flex justify-center pt-8'>
                            <CustomButton isBlue={false} onClick={() => setShowAllOpen(true)}>
                                View all
                            </CustomButton>
                        </div>
                    </div>
                </div>
                <div className="w-1/3 h-full overflow-hidden flex flex-col">
                    <SlidingStrategiesTabs />
                    <div className='p-8'>
                        <div className='grid grid-cols-3 grid-rows-2 gap-4 w-full'>
                            {instruments.map((instrument) => (
                                <div key={instrument} className='group relative'>
                                    {selectedInstrument === instrument && (
                                        <HoverEffectAroundCard offset={4} />
                                    )}
                                    <div onClick={() => setSelectedInstrument(instrument)} className='hover:bg-zinc-900 cursor-pointer border border-zinc-700 py-2 px-3 text-white text-center '>{instrument}</div>
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className='p-8'>
                        <fieldset aria-label="Side filter" className='flex items-center justify-center gap-6'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type="radio"
                                    name="side-filter"
                                    value="buy"
                                    checked={sideFilter === 'buy'}
                                    onChange={() => setSideFilter('buy')}
                                    className='sr-only'
                                />
                                <span className={`flex items-center justify-center h-4 w-4 rounded-full border ${sideFilter === 'buy' ? 'border-white' : 'border-zinc-600'}`}>
                                    {sideFilter === 'buy' && <span className='h-2 w-2 rounded-full bg-white' />}
                                </span>
                                <span className=' text-white'>Only Buy</span>
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type="radio"
                                    name="side-filter"
                                    value="sell"
                                    checked={sideFilter === 'sell'}
                                    onChange={() => setSideFilter('sell')}
                                    className='sr-only'
                                />
                                <span className={`flex items-center justify-center h-4 w-4 rounded-full border ${sideFilter === 'sell' ? 'border-white' : 'border-zinc-600'}`}>
                                    {sideFilter === 'sell' && <span className='h-2 w-2 rounded-full bg-white' />}
                                </span>
                                <span className=' text-white'>Only Sell</span>
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type="radio"
                                    name="side-filter"
                                    value="all"
                                    checked={sideFilter === 'all'}
                                    onChange={() => setSideFilter('all')}
                                    className='sr-only'
                                />
                                <span className={`flex items-center justify-center h-4 w-4 rounded-full border ${sideFilter === 'all' ? 'border-white' : 'border-zinc-600'}`}>
                                    {sideFilter === 'all' && <span className='h-2 w-2 rounded-full bg-white' />}
                                </span>
                                <span className=' text-white'>All</span>
                            </label>
                        </fieldset>
                    </div>
                    <div className='flex justify-center gap-8 p-8 w-full'>
                        <div className='flex gap-4'>
                            <BacktestPie percentage={Math.round(stats.profitableTradesPct)} />
                            <div className='flex flex-col gap-1'>
                                <span>{Math.round(stats.profitableTradesPct)}%</span>
                                <span className='text-zinc-400 '>Profitable Trades</span>
                            </div>
                        </div>

                        <div className='flex gap-4'>
                            <BacktestPie percentage={Math.round(stats.capitalChangePct)} />
                            <div className='flex flex-col gap-1'>
                                <span>{Math.round(stats.capitalChangePct)}%</span>
                                <span className='text-zinc-400 '>Capital Change</span>
                            </div>
                        </div>
                    </div>
                    <div className='p-8'>
                        <div className='mb-2 flex items-center justify-between'>
                            <span className=' text-zinc-300'>Number of Trades</span>
                            <span className=' text-zinc-400'>{stats.numTrades}</span>
                        </div>
                        <div className='h-1 w-full rounded-full bg-zinc-800 overflow-hidden'>
                            <div className='h-full bg-white rounded-full' style={{ width: '100%' }} />
                        </div>
                    </div>
                    <div className='p-8'>
                        <div className='mb-2 flex items-center justify-between'>
                            <span className=' text-zinc-300'>Win Trades</span>
                            <span className=' text-zinc-400'>{stats.winTradesCount}</span>
                        </div>
                        <div className='h-1 w-full rounded-full bg-zinc-800 overflow-hidden'>
                            <div className='h-full bg-white rounded-full' style={{ width: `${Math.round(stats.winPct)}%` }} />
                        </div>
                    </div>
                    <div className='p-8'>
                        <div className='mb-2 flex items-center justify-between'>
                            <span className=' text-zinc-300'>Loss Trades</span>
                            <span className=' text-zinc-400'>{stats.lossTradesCount}</span>
                        </div>
                        <div className='h-1 w-full rounded-full bg-zinc-800 overflow-hidden'>
                            <div className='h-full bg-white rounded-full' style={{ width: `${Math.round(stats.lossPct)}%` }} />
                        </div>
                    </div>
                    <span className='text-xs text-secondary text-center p-4'>Disclaimer: This is a backtest of the algorithm. It is not an indication of future performance. Past performance is not indicative of future results.</span>
                </div>
            </div>
            {showAllOpen && (
                <div className="fixed inset-0 z-[100]">
                    <div className="absolute inset-0" onClick={() => setShowAllOpen(false)} />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[#0C0C0C] border border-zinc-800 rounded-lg px-4 py-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className='flex flex-col gap-2'>

                                <h3 className="text-lg font-title">Showing All becktested trades for <span className='text-highlight'>{selectedInstrument}</span></h3>
                                <h3 className=' font-title'>
                                    from {firstDate} to {lastDate}
                                </h3>
                            </div>
                            <button className="text-zinc-400 hover:text-white" onClick={() => setShowAllOpen(false)}><X /></button>
                        </div>
                        <div className="space-y-2 pr-2">
                            {stats.pairs.map((pair, index) => (
                                <div key={index} className={`relative bg-[#0C0C0C] border-b first:border-t border-zinc-800 py-4 px-6`}>
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                                        <div className="flex gap-2 justify-center md:justify-start">
                                            {pair.firstTrade.positionType !== 'Unknown' && (
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${pair.firstTrade.positionType.toLowerCase() === 'buy'
                                                    ? 'bg-green-900/20 text-green-400 border border-green-600'
                                                    : 'bg-red-900/20 text-red-400 border border-red-600'
                                                    }`}>
                                                    {pair.firstTrade.positionType}
                                                </span>
                                            )}

                                        </div>
                                        <div className="text-center md:text-left">
                                            <div className=" text-secondary font-medium">{pair.firstTrade.date}</div>
                                            <div className=" text-secondary">{pair.secondTrade.date}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-gray-400 mb-1">P&L</div>
                                            <span className={`text-lg ${pair.totalChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {pair.totalChange >= 0 ? '+' : ''}${pair.totalChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-gray-400 mb-1">Total Equity</div>
                                            <div className="text-xs text-white">${pair.firstTrade.totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                            <div className=" text-white font-medium">→ ${pair.secondTrade.totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <div className="text-xs text-gray-400 mb-1">Entry Price</div>
                                            <div className=" text-white font-medium">${(pair.firstTrade.entryPrice ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}