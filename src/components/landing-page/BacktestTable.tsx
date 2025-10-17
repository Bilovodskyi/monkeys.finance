import LedGridFlickerWrapper from "./LedGridAnimation";
import { Activity, Fingerprint, GalleryVerticalEnd, History, Pyramid, Receipt, Search, Shield } from "lucide-react";
import BacktestContent from "@/components/private/backtest/BacktestContent";
import SlidingTabs from "../SlidingTabs";

export default function BacktestTable() {
    return (
        <>
            <div className="flex flex-col items-center justify-center gap-4 pt-32">
                <h1 className="text-4xl font-title"><span className="text-highlight">Backtests</span> results for our strategies</h1>
                <h2 className="text-secondary text-center text-xl text-balance max-w-xl">Machine learning improves algorithm performance. We train our model on thousands of trades to make better decisions.</h2>
            </div>
            <div className="w-full h-screen flex items-center justify-center relative">
                <div
                    className="
    pointer-events-none absolute -bottom-12 -top-48 right-3/4 -translate-x-2/3 w-px z-20
    text-zinc-700
    bg-[repeating-linear-gradient(to_bottom,currentColor_0_3px,transparent_3px_6px)]
    [mask-image:linear-gradient(to_bottom,transparent_0%_5%,#000_15%_85%,transparent_95%_100%)]
  "
                />
                <div
                    className="
    pointer-events-none absolute -bottom-12 -top-48 left-3/4 -translate-x-2/3 w-px z-20
    text-zinc-700
    bg-[repeating-linear-gradient(to_bottom,currentColor_0_3px,transparent_3px_6px)]
    [mask-image:linear-gradient(to_bottom,transparent_0%_5%,#000_15%_85%,transparent_95%_100%)]
  "
                />
                <div className="h-[600px] w-full relative">
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

                    <LedGridFlickerWrapper dimColor="rgb(18, 18, 18)" className="w-full h-full" fit="width" rows={120} cols={240} activeTarget={2600} cell={{ w: 1, h: 1, gap: 0.5 }} />
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-3/4 w-2/3 bg-background border border-zinc-700 flex">
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                        <SlidingTabs />
                    </div>
                    {/* Sidebar */}
                    <div className="w-[71px] border-r border-zinc-800 shrink-0">
                        <div className="flex items-center px-5 border-b border-zinc-800 h-[60px]">
                            <img src="/algo-logo.png" alt="Main Logo" className="max-w-8 max-h-8" />
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
                                    Search
                                </div>
                                <div className="text-tertiary text-xs border border-zinc-800 px-1 bg-zinc-900">
                                    ⌘k
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="text-secondary text-xs bg-neutral-900 px-2 py-1 rounded-full border border-zinc-800 shrink-0">
                                    Pro Plan
                                </div>
                            </div>
                        </header>

                        {/* Content area */}
                        <div className="flex-1 overflow-hidden">
                            <BacktestContent compact />
                        </div>
                    </div>
                    <div className="absolute -bottom-26 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <span className="text-tertiary text-md">Uses data for backtesting from:</span>

                        <img src="/exchange-logo/binance.png" alt="Binance" className="w-32" />

                    </div>
                </div>



            </div>
        </>
    );
}