import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const symbol = searchParams.get('symbol');
        const interval = searchParams.get('interval') || '4h';
        const limit = searchParams.get('limit') || '540';
        const startTime = searchParams.get('startTime');

        if (!symbol) {
            return NextResponse.json(
                { error: 'Symbol parameter is required' },
                { status: 400 }
            );
        }

        // Fetch from Binance.us API server-side
        let binanceUrl = `https://api.binance.us/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
        if (startTime) {
            binanceUrl += `&startTime=${startTime}`;
        }
        
        const response = await fetch(binanceUrl);

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Binance API error: ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching Binance data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data from Binance' },
            { status: 500 }
        );
    }
}
