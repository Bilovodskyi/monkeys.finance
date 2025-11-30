import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { PositionHistoryTable } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export default async function HistoryPage() {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
        throw new Error("Unauthorized");
    }

    const user = await db.query.UserTable.findFirst({
        where: (t, { eq }) => eq(t.clerkId, clerkId),
    });

    const history = user
        ? await db
            .select()
            .from(PositionHistoryTable)
            .where(eq(PositionHistoryTable.userId, user.id))
            .orderBy(desc(PositionHistoryTable.signalTime))
        : [];

    // Calculate stats
    const totalTrades = history.length;
    const successfulTrades = history.filter(p => p.status === 'filled').length;
    const totalPnL = history.reduce((sum, p) => sum + (p.realizedPnl ? parseFloat(p.realizedPnl) : 0), 0);

    return (
        <div className="flex flex-col h-full">
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-2 px-6">
                    <h1 className="text-lg font-bold">
                        You don't have any history
                    </h1>
                    <p className="text-xs text-tertiary text-center">
                        After bot completes a trade, it will appear here.
                    </p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="flex p-6 gap-6">
                        <div className="h-[130px] flex-1 border border-zinc-800 p-3 2xl:p-6 flex flex-col justify-between gap-4">
                            <h1 className="text-lg 2xl:text-xl font-title">{totalTrades}</h1>
                            <h2 className="text-tertiary font-title">Total Trades</h2>
                        </div>
                        <div className="h-[130px] flex-1 border border-zinc-800 p-3 2xl:p-6 flex flex-col justify-between gap-4">
                            <h1 className="text-lg 2xl:text-xl font-title text-green-500">{successfulTrades}</h1>
                            <h2 className="text-tertiary font-title">Successful Trades</h2>
                        </div>
                        <div className="h-[130px] flex-1 border border-zinc-800 p-3 2xl:p-6 flex flex-col justify-between gap-4">
                            <h1 className={`text-lg 2xl:text-xl font-title ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h1>
                            <h2 className="text-tertiary font-title">Total PnL</h2>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 p-6 flex flex-col overflow-hidden">
                        {/* Sticky Header */}
                        <div className="grid grid-cols-9 border border-zinc-800 backdrop-blur-md">
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary">Status</div>
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary">Open Date</div>
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary">Close Date</div>
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary">Exchange</div>
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary">Instrument</div>
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary">Strategy</div>
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary">Entry Price</div>
                            <div className="border-r border-zinc-800 px-4 py-3 text-tertiary">Exit Price</div>
                            <div className="px-4 py-3 text-tertiary">P&L</div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {history.map((position) => {
                                const pnl = position.realizedPnl ? parseFloat(position.realizedPnl) : null;
                                const isProfitable = pnl !== null && pnl > 0;
                                const isLoss = pnl !== null && pnl < 0;

                                return (
                                    <div
                                        key={position.id}
                                        className="grid grid-cols-9 border border-zinc-800 border-t-0"
                                    >
                                        <div className="border-r border-zinc-800 px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                position.status === 'filled' 
                                                    ? 'bg-green-500/10 text-green-500' 
                                                    : 'bg-red-500/10 text-red-500'
                                            }`}>
                                                {position.status}
                                            </span>
                                        </div>
                                        <div className="border-r border-zinc-800 px-4 py-3">
                                            {position.orderPlacedAt 
                                                ? new Date(position.orderPlacedAt).toLocaleDateString()
                                                : new Date(position.signalTime).toLocaleDateString()
                                            }
                                        </div>
                                        <div className="border-r border-zinc-800 px-4 py-3">
                                            {position.positionClosedAt 
                                                ? new Date(position.positionClosedAt).toLocaleDateString()
                                                : '—'
                                            }
                                        </div>
                                        <div className="border-r border-zinc-800 px-4 py-3">
                                            {position.exchange}
                                        </div>
                                        <div className="border-r border-zinc-800 px-4 py-3">
                                            {position.instrument}
                                        </div>
                                        <div className="border-r border-zinc-800 px-4 py-3">
                                            {position.strategyName}
                                        </div>
                                        <div className="border-r border-zinc-800 px-4 py-3">
                                            {position.entryPrice 
                                                ? `$${parseFloat(position.entryPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
                                                : '—'
                                            }
                                        </div>
                                        <div className="border-r border-zinc-800 px-4 py-3">
                                            {position.exitPrice 
                                                ? `$${parseFloat(position.exitPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
                                                : '—'
                                            }
                                        </div>
                                        <div className={`px-4 py-3 ${isProfitable ? 'text-green-500' : isLoss ? 'text-red-500' : ''}`}>
                                            {pnl !== null 
                                                ? `${pnl >= 0 ? '+' : ''}$${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                : '—'
                                            }
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
