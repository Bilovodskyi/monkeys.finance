"use client"


import * as React from "react";

type Props = {
    className?: string;
    style?: React.CSSProperties;
};

const HowItWorksSection: React.FC<Props> = ({ className = "", style }) => {
    return (
        <div style={{ height: "300vh", width: "100vw", ...style }} className={`relative overflow-hidden ${className}`}>
            <div style={{ transform: "rotate(-30deg) skewX(30deg)", perspective: "1000px", transformStyle: "preserve-3d" }}>
                <style jsx>{`
                     @keyframes riseFade {
                        /* Cancel parent's rotate(-30deg) and skewX(30deg), move up, then reapply */
                        0% { opacity: 1; transform: skewX(-30deg) rotate(30deg) translateY(0) rotate(-30deg) skewX(30deg); }
                        100% { opacity: 0; transform: skewX(-30deg) rotate(30deg) translateY(-50px) rotate(-30deg) skewX(30deg); }
                     }
                     .anim-rise-fade {
                         animation: riseFade 2.5s ease-out 0s 3 forwards;
                     }
                 `}</style>

                {/* Animated shadow clone */}
                <div
                    className="absolute left-[95px] top-[399px] z-20 h-[350px] w-[597px] border border-dashed border-zinc-200 pointer-events-none anim-rise-fade"
                    style={{
                        backgroundColor: "transparent",
                        opacity: 1,
                    }}
                />

                <div className="absolute left-[95px] top-[399px] z-10 flex h-[350px] w-[597px] border border-dashed border-zinc-700 px-3 py-2" style={{ opacity: 1, backgroundColor: "rgba(7, 7, 7, 0.8)" }}>
                    {/* Light sweeps underneath: bottom and left */}
                    <div
                        className="pointer-events-none absolute left-0 bottom-0 h-40 w-full transition-opacity ease-out z-20"
                        style={{
                            transform: 'translateY(100%) skewX(-47deg) scaleY(-1)',
                            transformOrigin: 'center top',
                            transitionDuration: '1000ms',
                            background: 'linear-gradient(to bottom, rgb(255,255,255) 0%, rgba(255,255,255,0) 100%)',
                            opacity: 0.1,
                        }}
                    />
                    <div
                        className="pointer-events-none absolute left-0 top-0 h-full w-40 transition-opacity ease-out"
                        style={{
                            transform: 'translateX(-100%) skewY(-43deg) scaleX(-1)',
                            transformOrigin: 'right center',
                            transitionDuration: '1000ms',
                            background: 'linear-gradient(to left, rgb(255,255,255) 0%, rgba(255,255,255,0) 100%)',
                            opacity: 0.1,
                        }}
                    />
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group h-fit self-start text-fg3 hover:text-cyan-500 hover:underline"
                    >
                        <span className="flex gap-1 font-mono text-xs uppercase tracking-widest" style={{ opacity: 1 }}>
                            Machine Learning step
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation" className="h-4 w-4 text-fg3 group-hover:text-cyan-500">
                                <path d="M18.25 15.25V5.75H8.75M6 18L17.6002 6.39983" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                            </svg>
                        </span>
                    </a>

                </div>

            </div>

        </div>
    );
};

export default HowItWorksSection;
