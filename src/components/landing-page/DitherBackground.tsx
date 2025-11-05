"use client";

import { useEffect, useRef } from "react";

interface DitherBackgroundProps {
    className?: string;
    horizontalFadePower?: number;
    effectHeight?: number;
    verticalFadePower?: number;
}

/**
 * Reusable dither background effect component.
 * Renders a canvas with an animated dithered wave pattern.
 */
const DitherBackground = ({
    className = "",
    horizontalFadePower = 1.75,
    effectHeight = 0.2,
    verticalFadePower = 1.75,
}: DitherBackgroundProps) => {
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
            const baseY = canvas.height * effectHeight; // Where the wave pattern starts (takes 60% of height)

            // Draw dots in a grid pattern (backwards loop)
            for (let y = canvas.height; y >= 0; y -= dotSpacing) {
                for (let x = 0; x < canvas.width; x += dotSpacing) {
                    // Only draw in bottom portion
                    if (y < baseY) continue;

                    // Create intensity based on vertical position (stronger at top of the pattern area)
                    let intensity =
                        (y - baseY) / ((canvas.height - baseY) * verticalFadePower);

                    // Horizontal fade from center
                    const centerX = canvas.width / 2;
                    const distFromCenter =
                        Math.abs(x - centerX) / (canvas.width / 1.5);
                    const horizontalFade =
                        1 - Math.pow(distFromCenter, horizontalFadePower);
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
    }, [effectHeight, horizontalFadePower, verticalFadePower]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                width: "100%",
                height: "100%",
            }}
        />
    );
};

export default DitherBackground;
