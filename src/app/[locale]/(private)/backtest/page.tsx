import { getAllLeverageBacktestFiles } from "@/actions/backtest/getLeverageBacktest";
import BacktestTable from "@/components/private/backtest/BacktestTable";

export default async function BacktestPage() {
    const processedData = await getAllLeverageBacktestFiles();

    return <BacktestTable data={processedData} />;
}

