"use client"

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

export default function LedGridFlickerWrapper({
    className,
    style,
    rows = 60,
    cols = 80,
    activeTarget = 50,
    holdSec = 4,
    cell = { w: 0.24, h: 0.24, gap: 0.12 },
    baseColors = ["#000"],
    dimColor = "#121314", // single dim color
    brightColor = "#2e3033", // single bright color
    // dimColor = "#2e3033", // single dim color
    // brightColor = "#6e737a", // single bright color
}: {
    className?: string;
    style?: React.CSSProperties;
    rows?: number;
    cols?: number;
    activeTarget?: number; // ~how many cells lit at once
    holdSec?: number; // how long a cell stays bright
    cell?: { w: number; h: number; gap: number };
    baseColors?: string[];
    dimColor?: string;
    brightColor?: string;
}) {
    return (
        <div className={className} style={style}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <color attach="background" args={["#000"]} />
                <GridFlicker
                    rows={rows}
                    cols={cols}
                    activeTarget={activeTarget}
                    holdSec={holdSec}
                    cell={cell}
                    baseColors={baseColors}
                    dimColor={dimColor}
                    brightColor={brightColor}
                />
            </Canvas>
        </div>
    );
}

function GridFlicker({
    rows,
    cols,
    activeTarget,
    holdSec,
    cell,
    baseColors,
    dimColor,
    brightColor,
}: any) {
    const count = rows * cols;
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const { size, camera } = useThree();
    const didInit = useRef(false);

    // Compute a scale so the grid fits the viewport
    const computedCell = useMemo(() => {
        const cam: any = camera as any;
        const aspect = size.width / size.height;
        const visibleH = 2 * Math.tan((cam.fov * Math.PI) / 360) * Math.abs(cam.position.z);
        const visibleW = visibleH * aspect;

        const totalW = cols * cell.w + (cols - 1) * cell.gap;
        const totalH = rows * cell.h + (rows - 1) * cell.gap;

        const scale = Math.min(visibleW / totalW, visibleH / totalH) * 1.002; // slight overscan to avoid edge gaps

        return {
            w: cell.w * scale,
            h: cell.h * scale,
            gap: cell.gap * scale,
        };
    }, [rows, cols, cell, size.width, size.height, (camera as any).fov, (camera as any).position.z]);

    // Per-cell timers and state (JS arrays for simplicity & speed)
    const activeUntil = useMemo(() => new Float32Array(count).fill(-1), [count]);
    const isActive = useMemo(() => new Uint8Array(count), [count]);

    // Pre-pick colors to avoid GC in frame loop
    const basePalette = useMemo(() => baseColors.map((c: string) => new THREE.Color(c)), [baseColors]);
    const dimTone = useMemo(() => new THREE.Color(dimColor), [dimColor]);
    const brightTone = useMemo(() => new THREE.Color(brightColor), [brightColor]);

    // Geometry/matrix setup once
    useEffect(() => {
        if (!meshRef.current) return;

        const tmp = new THREE.Object3D();

        const totalW = cols * computedCell.w + (cols - 1) * computedCell.gap;
        const totalH = rows * computedCell.h + (rows - 1) * computedCell.gap;

        const x0 = -totalW / 2 + computedCell.w / 2;
        const y0 = -totalH / 2 + computedCell.h / 2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const i = r * cols + c;
                const x = x0 + c * (computedCell.w + computedCell.gap);
                const y = y0 + r * (computedCell.h + computedCell.gap);

                tmp.position.set(x, y, 0);
                tmp.rotation.set(0, 0, 0);
                tmp.scale.set(1, 1, 1);
                tmp.updateMatrix();
                meshRef.current.setMatrixAt(i, tmp.matrix);

                // Start all cells at a very dark base tone with slight variation
                const base = basePalette[Math.floor(Math.random() * basePalette.length)];
                meshRef.current.setColorAt(i, base);
            }
        }

        // Fill entire grid with dim color on start; no pre-bright cells
        if (!didInit.current) {
            didInit.current = true;
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
        if ((meshRef.current as any).instanceColor)
            (meshRef.current as any).instanceColor.needsUpdate = true;
    }, [rows, cols, computedCell, basePalette, brightTone, activeTarget, holdSec, activeUntil, isActive]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (!meshRef.current) return;

        // 1) Cool down any expired cells back to dim color
        let activeNow = 0;
        for (let i = 0; i < count; i++) {
            if (isActive[i]) {
                if (t >= activeUntil[i]) {
                    isActive[i] = 0;
                    // Always cool back to dim tone (background remains filled)
                    meshRef.current.setColorAt(i, dimTone);
                } else {
                    activeNow++;
                }
            }
        }

        // 2) If we have fewer than the target, light up new random cells (bright color), else keep dim
        const need = Math.max(0, activeTarget - activeNow);
        for (let n = 0; n < need; n++) {
            let i = Math.floor(Math.random() * count);
            // avoid flipping the same active cell; retry a few times
            let tries = 0;
            while (isActive[i] && tries++ < 10) i = Math.floor(Math.random() * count);
            if (isActive[i]) continue;

            isActive[i] = 1;
            // Small randomness on duration so they don't sync
            const dur = holdSec * (0.85 + Math.random() * 0.4);
            activeUntil[i] = t + dur;

            meshRef.current.setColorAt(i, brightTone);
        }

        // 3) Ensure dim background persists on non-active cells
        for (let i = 0; i < count; i++) {
            if (!isActive[i]) {
                meshRef.current.setColorAt(i, dimTone);
            }
        }

        // 4) Push color buffer updates
        if ((meshRef.current as any).instanceColor)
            (meshRef.current as any).instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]}
            frustumCulled={false}
        >
            {/* Thin box to resemble a rounded rectangle LED; use more segments if you want rounded corners via bevel shader later */}
            <boxGeometry args={[computedCell.w, computedCell.h, 0.01]} />
            <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
    );
}
