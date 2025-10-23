"use client";

import { useEffect, useRef } from "react";

const StaticDitherBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawDitheredWaves();
        };

        const drawDitheredWaves = () => {
            // Clear canvas with black background
            ctx.fillStyle = "rgb(18, 18, 18)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const dotSpacing = 4; // Space between dots
            const dotSize = 1.5; // Size of each dot
            const baseY = canvas.height * 0.2; // Where the wave pattern starts (takes 60% of height)

            // Draw dots in a grid pattern (backwards loop)
            for (let y = canvas.height; y >= 0; y -= dotSpacing) {
                for (let x = 0; x < canvas.width; x += dotSpacing) {
                    // Only draw in bottom portion
                    if (y < baseY) continue;

                    // Create intensity based on vertical position (stronger at top of the pattern area)
                    let intensity =
                        (y - baseY) / ((canvas.height - baseY) * 1.75);

                    // Horizontal fade from center
                    const centerX = canvas.width / 2;
                    const distFromCenter =
                        Math.abs(x - centerX) / (canvas.width / 1.5);
                    const horizontalFade = 1 - Math.pow(distFromCenter, 1.75);
                    intensity *= horizontalFade;

                    // Random variation for more organic look
                    const random = Math.random() * 0.3 + 0.7;
                    intensity *= random;

                    // Clamp intensity
                    intensity = Math.max(0, Math.min(1, intensity));

                    // Determine if dot should be drawn based on intensity
                    if (intensity > 0.3) {
                        // Size variation based on intensity
                        const finalDotSize = dotSize * (0.5 + intensity * 0.5);

                        // Brightness based on intensity
                        const brightness = Math.floor(intensity * 255);
                        ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;

                        ctx.beginPath();
                        ctx.arc(x, y, finalDotSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        return () => {
            window.removeEventListener("resize", setCanvasSize);
        };
    }, []);

    return (
        <section className="h-[60vh] px-24 relative mb-12">
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-title">
                    Better returns -{" "}
                    <span className="text-highlight">same</span> risk
                </h1>
                <h2 className="text-secondary text-center text-xl text-balance max-w-xl">
                    Our algorithm with machine learning outperforms bitcoin on
                    the spot market. No futures trading, no extra risk
                </h2>
            </div>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-end justify-center gap-24">
                <div className="flex flex-col items-center justify-start">
                    <h1 className="text-[80px] font-title">17%</h1>
                    <h2 className="text-center text-md">
                        return on investment in Bitcoin (spot market)
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-[100px] font-title">43%</h1>
                    <h2 className="text-center text-xl">
                        return on investment with our algorithm and machine
                        learning
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-[80px] font-title">25%</h1>
                    <h2 className="text-center text-md">
                        return on investment in Bitcoin with our algorithm
                    </h2>
                </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-end justify-center gap-24">
                <p className="text-tertiary text-center text-sm">
                    * based on a backtest performed on the period of jan 1 2025
                    - oct 22 2025 on Binance.us BTC-USD spot market
                </p>
            </div>
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                }}
            />
        </section>
    );
};

export default StaticDitherBackground;
