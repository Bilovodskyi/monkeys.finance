import { getAllXlsxFilesFromFolder } from "@/actions/backtest/get";
import BacktestTable from "@/components/private/backtest/BacktestTable";

export default async function BacktestPage() {
    const processedData = await getAllXlsxFilesFromFolder("ml/supertrend");

    return <BacktestTable data={processedData} />;
}
