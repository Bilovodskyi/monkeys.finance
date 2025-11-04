"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Metaballs loader — circular motion, **4× speed**, dark bg, and
 * water-like fusion growth:
 *  - When **2 drops** touch → both grow smoothly to **1.5×**, then ease back.
 *  - When **3 drops** touch → all grow smoothly to **2×**, then ease back.
 *
 * Implementation details:
 *  - JS-driven orbit via requestAnimationFrame for perfect continuity (no jumps).
 *  - Constant angular speeds keep 1:2:4 ratio; all are globally 4× faster.
 *  - We detect proximity per frame and ease radii toward target scales.
 *  - Still **no reflection**; only subtle ambient shadow.
 */

const SIZE = 420;                 // SVG viewport
const BASE_R = 30;                // base radius for the largest drop
const BASES = [BASE_R, BASE_R * 0.86, BASE_R * 0.80] as const; // A, B, C
const ORBIT_R = SIZE * 0.26;      // orbit radius
const BG = "rgb(18, 18, 18)";
const FILL = "rgb(31, 213, 249)";

// Goo filter strength
const BLUR = 18;
const GOO_K = 22;
const GOO_OFF = -10;

// Speeds (radians/second). 4× faster than a 360°/cycle baseline.
// Slow completes 4 turns in 30s, mid in 15s, fast in 7.5s.
const SLOW_DUR = 30; // seconds
const wSlow = (4 * 2 * Math.PI) / SLOW_DUR; // 4 rev per 30s
const wMid = wSlow * 2;                      // 2×
const wFast = wSlow * 4;                     // 4×

// Initial phase offsets (fractions of a turn → radians)
const PHASE = [0.00, 0.28, 0.16].map(f => f * 2 * Math.PI) as [number, number, number];

// Proximity tuning
const MERGE_EXPAND_2 = 1.5;  // scale when exactly two are connected
const MERGE_EXPAND_3 = 2.0;  // scale when all three connect
const APPROACH_K = 0.12;     // easing factor for radius changes (0..1)
const MERGE_PAD = 1.10;      // how early we consider them "touching" (blur buffer)

export default function MetaballsLoader() {
    const ids = useMemo(
        () => ({
            goo: `goo-${Math.random().toString(36).slice(2)}`,
            shadow: `shadow-${Math.random().toString(36).slice(2)}`,
        }),
        []
    );

    // Animated state - initialize at center to avoid flash at (0,0)
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const [pos, setPos] = useState([
        { x: cx + ORBIT_R * Math.cos(PHASE[0]), y: cy + ORBIT_R * Math.sin(PHASE[0]) },
        { x: cx + ORBIT_R * Math.cos(PHASE[1]), y: cy + ORBIT_R * Math.sin(PHASE[1]) },
        { x: cx + ORBIT_R * Math.cos(PHASE[2]), y: cy + ORBIT_R * Math.sin(PHASE[2]) },
    ]);
    const [scale, setScale] = useState<[number, number, number]>([1, 1, 1]);

    // Refs to avoid re-creating RAF on every state change
    const scaleRef = useRef<[number, number, number]>([1, 1, 1]);
    const startRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const tick = (now: number) => {
            if (startRef.current == null) startRef.current = now;
            const t = (now - startRef.current) / 1000; // seconds since start

            // Angles with constant angular velocities
            const angles: [number, number, number] = [
                PHASE[0] + wSlow * t,
                PHASE[1] + wMid * t,
                PHASE[2] + wFast * t,
            ];

            // Positions on orbit
            const cx = SIZE / 2, cy = SIZE / 2;
            const newPos = angles.map(theta => ({
                x: cx + ORBIT_R * Math.cos(theta),
                y: cy + ORBIT_R * Math.sin(theta),
            })) as typeof pos;

            // Determine overlaps (connected sets) using current *effective* radii
            const effR = scaleRef.current.map((s, i) => BASES[i] * s) as [number, number, number];
            const d = (i: number, j: number) => Math.hypot(newPos[i].x - newPos[j].x, newPos[i].y - newPos[j].y);
            const t12 = d(0, 1) <= (effR[0] + effR[1]) * MERGE_PAD;
            const t23 = d(1, 2) <= (effR[1] + effR[2]) * MERGE_PAD;
            const t13 = d(0, 2) <= (effR[0] + effR[2]) * MERGE_PAD;

            // Compute target scales per drop
            let target: [number, number, number] = [1, 1, 1];
            const connectedAll = t12 && t23 && t13; // all pairs touch
            if (connectedAll) {
                target = [MERGE_EXPAND_3, MERGE_EXPAND_3, MERGE_EXPAND_3];
            } else {
                // If exactly two touch, bump just those to 1.5×
                if (t12) { target[0] = MERGE_EXPAND_2; target[1] = MERGE_EXPAND_2; }
                if (t23) { target[1] = MERGE_EXPAND_2; target[2] = MERGE_EXPAND_2; }
                if (t13) { target[0] = MERGE_EXPAND_2; target[2] = MERGE_EXPAND_2; }
            }

            // Ease scales toward target for smooth water-like growth/shrink
            const eased: [number, number, number] = [
                scaleRef.current[0] + (target[0] - scaleRef.current[0]) * APPROACH_K,
                scaleRef.current[1] + (target[1] - scaleRef.current[1]) * APPROACH_K,
                scaleRef.current[2] + (target[2] - scaleRef.current[2]) * APPROACH_K,
            ];
            scaleRef.current = eased;

            // Commit visual state
            setPos(newPos);
            setScale(eased);

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, []);

    return (
        <div className="w-full h-full min-h-[420px] grid place-items-center" style={{ background: BG, borderRadius: 12 }}>
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                <defs>
                    <filter id={ids.goo}>
                        <feGaussianBlur in="SourceGraphic" stdDeviation={BLUR} result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values={`
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 ${GOO_K} ${GOO_OFF}
            `} result="goo" />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>

                    <filter id={ids.shadow} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="22" />
                    </filter>
                </defs>

                {/* Soft ambient shadow */}
                <g opacity="0.18">
                    <ellipse cx={SIZE / 2} cy={SIZE / 2 + SIZE * 0.19} rx={SIZE * 0.28} ry={SIZE * 0.09} fill="#000" filter={`url(#${ids.shadow})`} />
                </g>

                {/* Gooey drops */}
                <g filter={`url(#${ids.goo})`}>
                    {/* A (slow) */}
                    <circle cx={pos[0].x} cy={pos[0].y} r={BASES[0] * scale[0]} fill={FILL} />
                    {/* B (mid) */}
                    <circle cx={pos[1].x} cy={pos[1].y} r={BASES[1] * scale[1]} fill={FILL} />
                    {/* C (fast) */}
                    <circle cx={pos[2].x} cy={pos[2].y} r={BASES[2] * scale[2]} fill={FILL} />
                </g>
            </svg>
        </div>
    );
}
