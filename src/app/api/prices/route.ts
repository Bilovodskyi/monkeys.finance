import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { SignalStateTable } from "@/drizzle/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Cache to avoid hitting Binance too frequently
let priceCache: { data: Record<string, number>; timestamp: number } | null = null;
const CACHE_DURATION_MS = 5000; // 5 seconds cache

/**
 * Convert instrument from DB format to Binance format
 * Examples:
 * - "BTC-USD" -> "BTCUSDT"
 * - "BTCUSDT" -> "BTCUSDT" (already in correct format)
 * - "XRP-USD" -> "XRPUSDT"
 */
function convertToBinanceSymbol(instrument: string): string {
    // If already in correct format (no dash), return as-is
    if (!instrument.includes("-")) {
        return instrument;
    }
    
    // Replace -USD with USDC for Binance
    return instrument.replace("-USD", "USDT").replace("-", "");
}

export async function GET() {
    try {
        // Check cache first
        if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION_MS) {
            return NextResponse.json(priceCache.data);
        }

        // Fetch all unique instruments from database
        const dbInstruments = await db
            .selectDistinct({ instrument: SignalStateTable.instrument })
            .from(SignalStateTable);
        
        const instruments = dbInstruments.map(row => row.instrument);
        
        // Convert to Binance format
        const binanceSymbols = instruments.map(convertToBinanceSymbol);

        // Fetch prices from Binance
        const prices: Record<string, number> = {};
        
        await Promise.all(
            binanceSymbols.map(async (symbol, index) => {
                const originalInstrument = instruments[index];
                
                try {
                    const response = await fetch(
                        `https://api.binance.us/api/v3/ticker/price?symbol=${symbol}`,
                        { 
                            next: { revalidate: 0 },
                            cache: "no-store" 
                        }
                    );
                    
                    if (response.ok) {
                        const data = await response.json();
                        // Store with original instrument name as key
                        prices[originalInstrument] = parseFloat(data.price);
                    } else {
                        console.error(`Failed to fetch price for ${symbol} (${originalInstrument}):`, response.statusText);
                    }
                } catch (error) {
                    console.error(`Error fetching price for ${symbol} (${originalInstrument}):`, error);
                }
            })
        );

        // Update cache
        priceCache = {
            data: prices,
            timestamp: Date.now(),
        };

        return NextResponse.json(prices);
    } catch (error) {
        console.error("Error fetching prices:", error);
        return NextResponse.json(
            { error: "Failed to fetch prices" },
            { status: 500 }
        );
    }
}
