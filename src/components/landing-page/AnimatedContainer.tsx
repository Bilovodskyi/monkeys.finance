"use client"

import React, { forwardRef } from "react";
import LedGridFlicker from "./LedGridAnimation";

interface AnimatedContainerProps {
    title: string;
    subtitle?: string;
    href?: string;
    className?: string;
    style?: React.CSSProperties;
    showLightSweeps?: boolean;
    showAnimatedClone?: boolean;
}

const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
    ({
        title,
        subtitle,
        href = "/",
        className = "",
        style = {},
        showLightSweeps = false,
        showAnimatedClone = false,
    }, ref) => {

        return (
            <div
                ref={ref}
                className={`z-10 flex h-[350px] w-[597px] border rounded-lg border-dashed border-zinc-700 shadow-[-10px_10px_0px_0px_#3f3f46] px-3 py-2 ${className}`}
                style={{
                    transform: "rotate(-30deg) skewX(30deg)",
                    opacity: 1,
                    backgroundColor: "rgba(7, 7, 7, 1)",
                    ...style
                }}
            >
                <LedGridFlicker rows={100} cols={180} activeTarget={200} className="absolute left-0 top-0 z-20 h-[350px] w-[597px]" />
                {/* Animated container clone */}
                {showAnimatedClone && (
                    <div
                        className="absolute rounded-lg left-0 top-0 z-20 h-[350px] w-[597px] border border-dashed border-zinc-200 pointer-events-none anim-rise-fade"
                        style={{
                            backgroundColor: "transparent",
                            opacity: 1,
                        }}
                    />
                )}

                {/* Light sweeps */}
                {showLightSweeps && (
                    <>
                        {/* Bottom light sweep */}
                        <div
                            className="pointer-events-none absolute left-0 bottom-0 h-40 w-full transition-opacity ease-out z-20"
                            style={{
                                transform: 'translateY(100%) skewX(-48deg) scaleY(-1)',
                                transformOrigin: 'center top',
                                transitionDuration: '1000ms',
                                background: 'linear-gradient(to bottom, rgb(255,255,255) 0%, rgba(255,255,255,0) 100%)',
                                opacity: 0.1,
                            }}
                        />

                        {/* Left light sweep */}
                        <div
                            className="pointer-events-none absolute left-0 top-0 h-full w-40 transition-opacity ease-out"
                            style={{
                                transform: 'translateX(-100%) skewY(-42deg) scaleX(-1)',
                                transformOrigin: 'right center',
                                transitionDuration: '1000ms',
                                background: 'linear-gradient(to left, rgb(255,255,255) 0%, rgba(255,255,255,0) 100%)',
                                opacity: 0.1,
                            }}
                        />

                        {/* Top light sweep */}
                        <div
                            className="pointer-events-none absolute left-0 top-0 h-40 w-full transition-opacity ease-out z-20"
                            style={{
                                transform: 'translateY(-100%) skewX(-48deg)',
                                transformOrigin: 'center bottom',
                                transitionDuration: '1000ms',
                                background: 'linear-gradient(to top, rgb(255,255,255) 0%, rgba(255,255,255,0) 100%)',
                                opacity: 0.1,
                            }}
                        />

                        {/* Right light sweep */}
                        <div
                            className="pointer-events-none absolute right-0 top-0 h-full w-40 transition-opacity ease-out z-20"
                            style={{
                                transform: 'translateX(100%) skewY(-42deg)',
                                transformOrigin: 'left center',
                                transitionDuration: '1000ms',
                                background: 'linear-gradient(to right, rgb(255,255,255) 0%, rgba(255,255,255,0) 100%)',
                                opacity: 0.1,
                            }}
                        />
                    </>
                )}

                {/* Content */}
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group h-fit self-start hover:text-cyan-500 hover:underline z-30"
                >
                    <span className="flex gap-1 font-mono text-xs uppercase tracking-widest" style={{ opacity: 1 }}>
                        {title}
                        {subtitle && (
                            <>
                                <br />
                                {subtitle}
                            </>
                        )}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation" className="h-4 w-4 group-hover:text-cyan-500">
                            <path d="M18.25 15.25V5.75H8.75M6 18L17.6002 6.39983" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                        </svg>
                    </span>
                </a>
            </div>
        );
    }
);

AnimatedContainer.displayName = "AnimatedContainer";
export default AnimatedContainer;
