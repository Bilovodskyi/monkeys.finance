export default function HistoryPage() {
    const history: any[] = []; // Replace with actual data fetching logic

    return (
        <>
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full w-1/4 mx-auto gap-2">
                    <h1 className="text-lg font-bold">
                        You don't have any history
                    </h1>
                    <p className="text-xs text-tertiary text-center">
                        After bot completes a trade, it will appear here.
                    </p>
                </div>
            ) : (
                <div>Has instances</div>
            )}
        </>
    );
}
