"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type StepProgressDotProps = {
    label?: React.ReactNode;
    triggerRef: React.RefObject<HTMLElement | null>;
    size?: number; // inner dot size in px
    strokeWidth?: number; // ring stroke width in px
    className?: string;
    endOffset?: number;
};

const StepProgressDot: React.FC<StepProgressDotProps> = ({
    label,
    triggerRef,
    size = 24,
    strokeWidth = 2,
    className = "",
    endOffset = 100,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const circleARef = useRef<SVGCircleElement>(null);
    const circleBRef = useRef<SVGCircleElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const triggerEl = triggerRef.current as unknown as Element | null;
        const circleA = circleARef.current;
        const circleB = circleBRef.current;

        if (!triggerEl || !circleA || !circleB) return;

        const gap = 1; // 1px gap between inner dot and outer ring
        const svgSize = size + 2 * gap + strokeWidth; // total rendered box size
        const radius = (svgSize - strokeWidth) / 2; // ring radius
        const circumference = 2 * Math.PI * radius;

        // Initialize stroke dashes to 0 length
        circleA.setAttribute("stroke-dasharray", `0 ${circumference}`);
        circleA.setAttribute("stroke-dashoffset", "0");
        circleB.setAttribute("stroke-dasharray", `0 ${circumference}`);
        circleB.setAttribute("stroke-dashoffset", "0");

        const st = ScrollTrigger.create({
            trigger: triggerEl,
            start: "top+=150px top",
            end: `bottom-=${endOffset || 100}px top`,
            scrub: 1,
            onUpdate: (self) => {
                const progress = gsap.utils.clamp(0, 1, self.progress);
                // Arc grows from 12:00 toward 18:00
                const halfLen = (progress * circumference) / 2; // arc length

                // Visible dash pattern
                const dashVisible = `${halfLen} ${circumference}`;

                // Clockwise arc starting at 12:00
                circleA.setAttribute("stroke-dasharray", dashVisible);
                circleA.setAttribute("stroke-dashoffset", "0");

                // Counter-clockwise arc starting at 12:00 (vertically flipped)
                circleB.setAttribute("stroke-dasharray", dashVisible);
                circleB.setAttribute("stroke-dashoffset", "0");
            },
        });

        return () => {
            st.kill();
        };
    }, [triggerRef, size, strokeWidth, endOffset]);

    const gap = 1;
    const svgSize = size + 2 * gap + strokeWidth;
    const r = (svgSize - strokeWidth) / 2;

    return (
        <div
            ref={wrapperRef}
            className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
            style={{ width: svgSize, height: svgSize }}>
            {/* Inner dot */}
            <div
                className="flex items-center justify-center rounded-full border border-white bg-black z-20"
                style={{ width: size, height: size }}>
                {label !== undefined ? (
                    <span className="leading-none select-none">{label}</span>
                ) : null}
            </div>
            {/* Surrounding progress ring built from two opposing arcs */}
            <svg
                className="absolute left-0 top-0"
                width={svgSize}
                height={svgSize}
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                style={{ transform: "rotate(-90deg)" }}
                aria-hidden="true">
                <circle
                    ref={circleARef}
                    cx={svgSize / 2}
                    cy={svgSize / 2}
                    r={r}
                    fill="none"
                    stroke="var(--highlight-text)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                <circle
                    ref={circleBRef}
                    cx={svgSize / 2}
                    cy={svgSize / 2}
                    r={r}
                    fill="none"
                    stroke="var(--highlight-text)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    transform={`scale(1 -1)`}
                    style={{
                        transformOrigin: `${svgSize / 2}px ${svgSize / 2}px`,
                    }}
                />
            </svg>
        </div>
    );
};

export default StepProgressDot;
