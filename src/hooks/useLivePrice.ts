"use client";

import { useState, useEffect, useRef } from "react";

interface UseLivePriceProps {
    instrument: string;
    signalPrice: number | null;
    signalType: "buy" | "sell" | "none";
    initialPrice: number | null;
}

interface UseLivePriceReturn {
    currentPrice: number | null;
    percentageChange: number | null;
    priceDirection: "up" | "down" | "neutral";
    priceDelta: number | null;
    isLoading: boolean;
    error: boolean;
}

export function useLivePrice({
    instrument,
    signalPrice,
    signalType,
    initialPrice,
}: UseLivePriceProps): UseLivePriceReturn {
    const [currentPrice, setCurrentPrice] = useState<number | null>(initialPrice);
    const [priceDirection, setPriceDirection] = useState<"up" | "down" | "neutral">("neutral");
    const [priceDelta, setPriceDelta] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const previousPriceRef = useRef<number | null>(initialPrice);

    // Calculate percentage change
    const percentageChange =
        signalPrice && currentPrice
            ? signalType === "sell"
                ? -(((currentPrice - signalPrice) / signalPrice) * 100)
                : ((currentPrice - signalPrice) / signalPrice) * 100
            : null;

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                setIsLoading(true);
                setError(false);

                const response = await fetch("/api/prices", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch prices");
                }

                const prices: Record<string, number> = await response.json();
                const newPrice = prices[instrument];

                if (newPrice !== undefined) {
                    // Determine price direction and delta
                    if (previousPriceRef.current !== null) {
                        const delta = newPrice - previousPriceRef.current;
                        
                        if (delta > 0) {
                            setPriceDirection("up");
                            setPriceDelta(delta);
                        } else if (delta < 0) {
                            setPriceDirection("down");
                            setPriceDelta(delta);
                        } else {
                            setPriceDirection("neutral");
                            setPriceDelta(null);
                        }

                        // Reset delta indicator after 1 second
                        if (delta !== 0) {
                            setTimeout(() => {
                                setPriceDelta(null);
                                setPriceDirection("neutral");
                            }, 1000);
                        }
                    }

                    previousPriceRef.current = newPrice;
                    setCurrentPrice(newPrice);
                } else {
                    // Fallback to initial price if instrument not found
                    console.warn(`Price not found for ${instrument}, using fallback`);
                }
            } catch (err) {
                console.error("Error fetching prices:", err);
                setError(true);
                // Keep using previous price or initial price as fallback
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch immediately
        fetchPrice();

        // Then fetch every 15 seconds
        const interval = setInterval(fetchPrice, 15000);

        return () => clearInterval(interval);
    }, [instrument]);

    return {
        currentPrice,
        percentageChange,
        priceDirection,
        priceDelta,
        isLoading,
        error,
    };
}
