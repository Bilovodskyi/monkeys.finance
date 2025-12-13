"use client";

import { useLivePrice } from "@/hooks/useLivePrice";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface LivePriceProps {
    instrument: string;
    initialPrice: number | null;
    signalPrice: number | null;
    signalType: "buy" | "sell" | "none";
    label: string;
}

export function LivePrice({
    instrument,
    initialPrice,
    signalPrice,
    signalType,
    label,
}: LivePriceProps) {
    const { currentPrice, priceDirection, priceDelta } = useLivePrice({
        instrument,
        signalPrice,
        signalType,
        initialPrice,
    });

    const priceRef = useRef<HTMLParagraphElement>(null);
    const deltaRef = useRef<HTMLDivElement>(null);

    // Flash animation when price changes
    useEffect(() => {
        if (!priceRef.current || priceDirection === "neutral") return;

        const bgColor =
            priceDirection === "up"
                ? "rgba(34, 197, 94, 0.2)"
                : "rgba(239, 68, 68, 0.2)";

        gsap.fromTo(
            priceRef.current,
            { backgroundColor: bgColor },
            {
                backgroundColor: "transparent",
                duration: 0.3,
                ease: "power2.out",
            }
        );
    }, [priceDirection, currentPrice]);

    // Price delta animation
    useEffect(() => {
        if (!deltaRef.current || priceDelta === null) return;

        const tl = gsap.timeline();
        tl.fromTo(
            deltaRef.current,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
        ).to(deltaRef.current, {
            opacity: 0,
            y: 10,
            duration: 0.2,
            ease: "power2.in",
            delay: 0.6,
        });
    }, [priceDelta]);

    if (!currentPrice) return null;

    return (
        <div className="flex flex-col gap-1.5 relative">
            <p className="text-xs text-zinc-500 font-medium">{label}</p>
            <div className="relative w-fit">
                <p
                    ref={priceRef}
                    className="text-base font-semibold text-zinc-300 w-fit"
                >
                    ${currentPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </p>
                
                {/* Price Delta Indicator */}
                {priceDelta !== null && (
                    <div
                        ref={deltaRef}
                        className={`absolute top-0.5 -right-10 text-xs font-semibold ${
                            priceDelta > 0 ? "text-green-500" : "text-red-500"
                        }`}
                        style={{ opacity: 0 }}
                    >
                        {priceDelta > 0 ? "+" : ""}
                        ${Math.abs(priceDelta).toFixed(2)}
                    </div>
                )}
            </div>
        </div>
    );
}
