"use client";

import { useEffect, useRef } from "react";

interface DialogDitherBackgroundProps {
    className?: string;
    opacity?: number;
}

/**
 * Dither background effect for dialog overlays.
 * Renders a canvas with a dithered dot pattern covering the full screen.
 */
const DialogDitherBackground = ({
    className = "",
    opacity = 0.6,
}: DialogDitherBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawDitheredPattern();
        };

        const drawDitheredPattern = () => {
            // Clear canvas with dark background
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const dotSpacing = 4;
            const dotSize = 1.5;

            // Draw dots across the entire canvas with uniform distribution
            for (let y = 0; y < canvas.height; y += dotSpacing) {
                for (let x = 0; x < canvas.width; x += dotSpacing) {
                    // Random variation for organic look
                    const random = Math.random() * 0.4 + 0.6;
                    let intensity = 0.5 * random;

                    // Clamp intensity
                    intensity = Math.max(0, Math.min(1, intensity));

                    // Draw dots with varying intensity
                    if (intensity > 0.15) {
                        const finalDotSize = dotSize * (0.6 + intensity * 0.4);
                        
                        // Dark gray dots
                        const brightness = Math.floor(intensity * 80);
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
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                width: "100vw",
                height: "100vh",
                opacity: opacity,
            }}
        />
    );
};

export default DialogDitherBackground;
