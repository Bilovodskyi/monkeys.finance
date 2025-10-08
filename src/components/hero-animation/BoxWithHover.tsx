import * as React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import HoverEffectAroundCard from "./HoverEffectAroundCard";

type HoverSide = "top" | "right" | "bottom" | "left";
type HoverAlign = "start" | "center" | "end";

export interface BoxWithHoverProps {
    posClass: string; // absolute left/top for placement in hero board
    label: React.ReactNode;
    tooltip: React.ReactNode;
    side?: HoverSide;
    align?: HoverAlign;
    sideOffset?: number;
    className?: string; // extra classes for the card face
    showCorners?: boolean; // show cyan corner frame overlay
}

export default function BoxWithHover({
    posClass,
    label,
    tooltip,
    side = "top",
    align = "center",
    sideOffset = 12,
    className = "",
    showCorners = true,
}: BoxWithHoverProps) {
    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger asChild>
                <div className={`${posClass} z-20`}>
                    <div className="group relative cursor-pointer">
                        <div
                            className={[
                                "flex h-16 w-16 items-center justify-center rounded-md",
                                "border border-zinc-700 bg-background",
                                "shadow-[-3px_3px_0px_0px_#3f3f46]",
                                "px-3 py-3 text-xs text-center",
                                "transition-transform duration-300 ease-out",
                                "motion-safe:group-hover:scale-105",
                                "will-change-transform",
                                className,
                            ].join(" ")}
                        >
                            {label}
                        </div>

                        {/* Hover glow/corners (stays pinned) */}
                        {showCorners && (
                            <div
                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out motion-safe:group-hover:opacity-100 will-change-opacity"
                            >
                                <HoverEffectAroundCard />
                            </div>
                        )}
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent
                side={side}
                align={align}
                sideOffset={sideOffset}
                collisionPadding={0}
                className="w-72 text-sm"
            >
                {tooltip}
            </HoverCardContent>
        </HoverCard>
    );
}


