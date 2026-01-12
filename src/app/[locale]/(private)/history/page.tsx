import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { PositionHistoryTable } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { FailedTradeErrorDialog } from "@/components/private/history/FailedTradeErrorDialog";
import { getTranslations } from "next-intl/server";

export default async function HistoryPage() {
    const { userId: clerkId } = await auth();
    const t = await getTranslations("history");
    
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
    const failedTrades = history.filter(p => p.status === 'failed').length;
    
    // Win/Loss/Break Even based on PnL (only for filled trades)
    const winTrades = history.filter(p => {
        if (p.status !== 'filled') return false;
        const pnl = p.realizedPnl ? parseFloat(p.realizedPnl) : 0;
        return pnl > 0;
    }).length;
    const lossTrades = history.filter(p => {
        if (p.status !== 'filled') return false;
        const pnl = p.realizedPnl ? parseFloat(p.realizedPnl) : 0;
        return pnl < 0;
    }).length;
    const breakEvenTrades = history.filter(p => {
        if (p.status !== 'filled') return false;
        const pnl = p.realizedPnl ? parseFloat(p.realizedPnl) : 0;
        return pnl === 0;
    }).length;
    
    const totalPnL = history.reduce((sum, p) => sum + (p.realizedPnl ? parseFloat(p.realizedPnl) : 0), 0);

    return (
        <div className="flex flex-col h-full">
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-2 px-6">
                    <h1 className="text-lg font-bold">
                        {t("emptyTitle")}
                    </h1>
                    <p className="text-xs text-tertiary text-center">
                        {t("emptyDescription")}
                    </p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="flex p-4 md:p-6 gap-4 md:gap-6">
                        <div className="h-[130px] flex-1 border border-zinc-800 p-3 2xl:p-6 hidden md:flex flex-col justify-between gap-4">
                            <h1 className="text-lg 2xl:text-xl font-title">
                                {totalTrades} / {successfulTrades} / {failedTrades}
                            </h1>
                            <h2 className="text-tertiary font-title">{t("stats.totalSuccessfulFailed")}</h2>
                        </div>
                        <div className="h-[130px] flex-1 border border-zinc-800 p-3 2xl:p-6 hidden md:flex flex-col justify-between gap-4">
                            <h1 className="text-lg 2xl:text-xl font-title">
                                {winTrades} / {lossTrades} / {breakEvenTrades}
                            </h1>
                            <h2 className="text-tertiary font-title">{t("stats.winLossBreakEven")}</h2>
                        </div>
                        <div className="h-[130px] flex-1 border border-zinc-800 p-3 2xl:p-6 flex flex-col justify-between gap-4">
                            <h1 className={`text-lg 2xl:text-xl font-title ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h1>
                            <h2 className="text-tertiary font-title">{t("stats.totalPnL")}</h2>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 p-4 md:p-6 flex flex-col overflow-hidden">
                        {/* Sticky Header */}
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 border border-zinc-800 backdrop-blur-md">
                            <div className="border-r border-zinc-800 px-2 lg:px-4 py-3 text-tertiary truncate">{t("tableHeaders.status")}</div>
                            <div className="hidden lg:block border-r border-zinc-800 px-2 lg:px-4 py-3 text-tertiary truncate">{t("tableHeaders.openDate")}</div>
                            <div className="border-r border-zinc-800 px-2 lg:px-4 py-3 text-tertiary truncate">{t("tableHeaders.closeDate")}</div>
                            <div className="hidden md:block border-r border-zinc-800 px-2 lg:px-4 py-3 text-tertiary truncate">{t("tableHeaders.exchange")}</div>
                            <div className="border-r border-zinc-800 px-2 lg:px-4 py-3 text-tertiary truncate">{t("tableHeaders.instrument")}</div>
                            <div className="hidden lg:block border-r border-zinc-800 px-2 lg:px-4 py-3 text-tertiary truncate">{t("tableHeaders.strategy")}</div>
                            <div className="hidden lg:block border-r border-zinc-800 px-2 lg:px-4 py-3 text-tertiary truncate">{t("tableHeaders.quantity")}</div>
                            <div className="hidden lg:block border-r border-zinc-800 px-2 lg:px-4 py-3 text-tertiary truncate">{t("tableHeaders.entryPrice")}</div>
                            <div className="hidden md:block border-r border-zinc-800 px-2 lg:px-4 py-3 text-tertiary truncate">{t("tableHeaders.exitPrice")}</div>
                            <div className="px-2 lg:px-4 py-3 text-tertiary truncate">{t("tableHeaders.pnl")}</div>
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
                                        className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 border border-zinc-800 border-t-0"
                                    >
                                        <div className="border-r border-zinc-800 px-2 lg:px-4 py-3 truncate">
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    position.status === 'filled' 
                                                        ? 'bg-green-500/10 text-green-500' 
                                                        : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                    {t(`status.${position.status}`)}
                                                </span>
                                                {position.status === 'failed' && (
                                                    <FailedTradeErrorDialog errorMessage={position.errorMessage} />
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden lg:block border-r border-zinc-800 px-2 lg:px-4 py-3 truncate">
                                            {position.orderPlacedAt 
                                                ? new Date(position.orderPlacedAt).toLocaleDateString('en-CA')
                                                : new Date(position.signalTime).toLocaleDateString('en-CA')
                                            }
                                        </div>
                                        <div className="border-r border-zinc-800 px-2 lg:px-4 py-3 truncate">
                                            {position.positionClosedAt 
                                                ? new Date(position.positionClosedAt).toLocaleDateString('en-CA')
                                                : '—'
                                            }
                                        </div>
                                        <div className="hidden md:block border-r border-zinc-800 px-2 lg:px-4 py-3 truncate">
                                            {position.exchange}
                                        </div>
                                        <div className="border-r border-zinc-800 px-2 lg:px-4 py-3 truncate">
                                            {position.instrument}
                                        </div>
                                        <div className="hidden lg:block border-r border-zinc-800 px-2 lg:px-4 py-3 truncate">
                                            {position.strategyName}
                                        </div>
                                        <div className="hidden lg:block border-r border-zinc-800 px-2 lg:px-4 py-3 truncate">
                                            {position.quantity 
                                                ? parseFloat(position.quantity).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 8 })
                                                : '—'
                                            }
                                        </div>
                                        <div className="hidden lg:block border-r border-zinc-800 px-2 lg:px-4 py-3 truncate">
                                            {position.entryPrice 
                                                ? `$${parseFloat(position.entryPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
                                                : '—'
                                            }
                                        </div>
                                        <div className="hidden md:block border-r border-zinc-800 px-2 lg:px-4 py-3 truncate">
                                            {position.exitPrice 
                                                ? `$${parseFloat(position.exitPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
                                                : '—'
                                            }
                                        </div>
                                        <div className={` px-2 lg:px-4 py-3 truncate ${isProfitable ? 'text-green-500' : isLoss ? 'text-red-500' : ''}`}>
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
