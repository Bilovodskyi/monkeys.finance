"use client";

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import SlidingStrategiesTabs from './SlidingStrategiesTabs';

interface TradeData {
    date: string;
    cashBalance: number;
    totalEquity: number;
    entryPrice: number;
    positionType: string;
}

export function ResultsTable() {
    const [data, setData] = useState<TradeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadExcelData = async () => {
            try {
                setLoading(true);
                // Fetch the Excel file from the public directory
                const response = await fetch('/data/BTC-USD_1h_20250817-204937.xlsx');

                if (!response.ok) {
                    throw new Error('Failed to fetch Excel file');
                }

                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });

                // Get the first worksheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                console.log(jsonData);

                // Transform the data to match our interface
                const transformedData: TradeData[] = jsonData.map((row: any, index: number) => {
                    // Convert Excel date serial number to JavaScript Date
                    let dateString = '';
                    if (row.Date) {
                        if (typeof row.Date === 'number') {
                            // Excel date serial number (days since 1900-01-01)
                            const excelDate = new Date((row.Date - 25569) * 86400 * 1000);
                            dateString = excelDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                        } else {
                            dateString = row.Date.toString();
                        }
                    }

                    return {
                        date: dateString,
                        cashBalance: parseFloat(row['cash_balance']) || 0,
                        totalEquity: parseFloat(row['total_equity']) || 0,
                        entryPrice: parseFloat(row['entry_price']) || 0,
                        positionType: row['position_type'] || 'Unknown'
                    };
                });

                setData(transformedData);
            } catch (err) {
                console.error('Error loading Excel data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load data');

                // Fallback to sample data
                const sampleData: TradeData[] = [
                    {
                        date: '2024-08-17',
                        cashBalance: 10000,
                        totalEquity: 45230.50,
                        entryPrice: 63500.25,
                        positionType: 'Long'
                    },
                    {
                        date: '2024-08-17',
                        cashBalance: 9750,
                        totalEquity: 47850.75,
                        entryPrice: 64200.00,
                        positionType: 'Short'
                    },
                    {
                        date: '2024-08-18',
                        cashBalance: 10250,
                        totalEquity: 52100.25,
                        entryPrice: 65800.50,
                        positionType: 'Long'
                    }
                ];
                setData(sampleData);
            } finally {
                setLoading(false);
            }
        };

        loadExcelData();
    }, []);

    if (loading) {
        return (
            <section className="bg-black border border-zinc-800 rounded-lg p-6 mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-white">Trading Results</h2>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1fd5f9]"></div>
                    <span className="ml-3 text-secondary">Loading trading data...</span>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-black p-24 mt-8">
            <SlidingStrategiesTabs />

            {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-600 rounded text-red-400 text-sm">
                    Warning: {error}. Showing sample data.
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-700">
                            <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                            <th className="text-right py-3 px-4 font-semibold text-white">Cash Balance</th>
                            <th className="text-right py-3 px-4 font-semibold text-white">Total Equity</th>
                            <th className="text-right py-3 px-4 font-semibold text-white">Entry Price</th>
                            <th className="text-center py-3 px-4 font-semibold text-white">Position Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index} className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                                <td className="py-3 px-4 text-secondary">{row.date}</td>
                                <td className="py-3 px-4 text-right text-white">${row.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-3 px-4 text-right text-white">${row.totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-3 px-4 text-right text-white">${row.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.positionType.toLowerCase() === 'long'
                                        ? 'bg-green-900/20 text-green-400 border border-green-600'
                                        : 'bg-red-900/20 text-red-400 border border-red-600'
                                        }`}>
                                        {row.positionType}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-xs text-secondary">
                Showing {data.length} trading records
            </div>
        </section>
    );
}