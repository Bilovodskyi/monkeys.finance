import * as React from "react";

/**
 * HeroBoard
 * ------------
 * TSX conversion of the snippet you provided.
 * Notes:
 * - All `class` → `className`.
 * - Inline styles converted to JS objects.
 * - SVG attribute names adapted for React (e.g., stopColor, strokeWidth, strokeLinecap, strokeDasharray, pathLength).
 * - `currentcolor` → `currentColor`.
 * - Gradient `id`s cleaned (no special characters) and references updated.
 * - Image paths (e.g. /images/home/hero-grid.svg) are left as-is; make sure they exist in your public/ folder.
 */

export interface HeroBoardProps {
    className?: string;
    /** Optional: extra wrapper styles */
    style?: React.CSSProperties;
}

export default function HeroBoard({ className, style }: HeroBoardProps) {
    return (
        <div
            className={[
                "absolute left-[calc(50%-600px)] top-[120px] h-[1095px] w-[1580px]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{ transform: "translateY(0px) rotate(-30deg) skewX(30deg)", ...style }}
        >
            <img
                className="absolute left-0 top-0 object-none"
                alt="Grid"
                src="/hero-grid.svg"
                style={{ opacity: 1 }}
            />

            {/* Lines & shimmers canvas */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-full w-full max-w-7xl -translate-x-1/2 -translate-y-1/2">
                {/* Top line */}
                <svg className="pointer-events-none absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradRmq" gradientUnits="objectBoundingBox" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(0.19488285223860277, 0.5, 0.5)">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="20%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="0s"
                                from="-3 0"
                                to="3 0"
                                dur="10s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M600,323 L940,324"
                        stroke="url(#gradRmq)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDashoffset="0px"
                        strokeDasharray="1px 1px"
                    />
                </svg>

                {/* Short line Box 4 to Crypto Exchange */}
                <svg className="pointer-events-none absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradRmq" gradientUnits="objectBoundingBox" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(0.19488285223860277, 0.5, 0.5)">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="20%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="9s"
                                from="-3 0"
                                to="3 0"
                                dur="10s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M950,323 L1040,324"
                        stroke="url(#gradRmq)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDashoffset="0px"
                        strokeDasharray="1px 1px"
                    />
                </svg>

                {/* Curve line Crypto Exchange to Trading Journal */}
                <svg className="pointer-events-none absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradRmq" gradientUnits="objectBoundingBox" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(0.19488285223860277, 0.5, 0.5)">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="20%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="10s"
                                from="-3 0"
                                to="3 0"
                                dur="10s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M1210,323 L1235,324 Q1240,324 1240,329 L1240,494"
                        stroke="url(#gradRmq)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDashoffset="0px"
                        strokeDasharray="1px 1px"
                    />
                </svg>

                {/* box 4 to indicators */}
                <svg className="pointer-events-none absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradRms" gradientUnits="objectBoundingBox" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(139.22599817795847, 0.5, 0.5)">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="20%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="1.5s"
                                from="-3 0"
                                to="3 0"
                                dur="10s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M935,346 L935.8919017616238,412.0007303601604 Q936,420 928,420 L834,420 Q826,420 826,428 L826,440"
                        stroke="url(#gradRms)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDashoffset="0px"
                        strokeDasharray="1px 1px"
                    />
                </svg>

                {/* indicators to train classifier */}
                <svg className="pointer-events-none absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradRmt" gradientUnits="objectBoundingBox" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(90, 0.5, 0.5)">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="20%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="3s"
                                from="-3 0"
                                to="3 0"
                                dur="10s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M822,495 L823,635 Q823,640 828,640 L853,640"
                        stroke="url(#gradRmt)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDashoffset="0px"
                        strokeDasharray="1px 1px"
                    />
                </svg>

                {/* Line Train to Backtest #1 */}
                <svg className="pointer-events-none absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradTrainBacktest1" gradientUnits="objectBoundingBox" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(90, 0.5, 0.5)">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="20%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="4s"
                                from="-3 0"
                                to="3 0"
                                dur="10s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M943,636 L935,797"
                        stroke="url(#gradTrainBacktest1)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDashoffset="0px"
                        strokeDasharray="1px 1px"
                    />
                </svg>

                {/* Train to Backtest #2 */}
                <svg className="pointer-events-none absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradRmu" gradientUnits="objectBoundingBox" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(0.6510603802294862, 0.5, 0.5)">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="20%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="5s"
                                from="-3 0"
                                to="3 0"
                                dur="10s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M953,636 L945,797"
                        stroke="url(#gradRmu)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDashoffset="0px"
                        strokeDasharray="1px 1px"
                    />
                </svg>


                {/* train classifier to trained model */}
                <svg className="pointer-events-none absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradRn0" gradientUnits="objectBoundingBox" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(-56.309932474020215, 0.5, 0.5)">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="20%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="6s"
                                from="-3 0"
                                to="3 0"
                                dur="10s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M1020,575 L1020.5,570 Q1021,565 1026.0249378105605,565 L1062,565 Q1070,565 1070,557 L1070,500"
                        stroke="url(#gradRn0)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDashoffset="0px"
                        strokeDasharray="1px 1px"
                    />
                </svg>



                {/* trained model to box 4 */}
                <svg className="pointer-events-none absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="gradRn1" gradientUnits="objectBoundingBox" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(-144.24611274556327, 0.5, 0.5)">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="20%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="8s"
                                from="-3 0"
                                to="3 0"
                                dur="10s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M1070,440 L1070,428 Q1070,420 1062,420 L953,420 Q945,420 945,412 L945,330"
                        stroke="url(#gradRn1)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDashoffset="0px"
                        strokeDasharray="1px 1px"
                    />
                </svg>
            </div>

            {/* Top box 1*/}

            <div className="relative absolute left-[calc(50%-52px)] top-[289px] z-20 text-fg0">
                {/* Ghost / depth icons (trimmed to most visible three for brevity) */}
                <div className="absolute" style={{ zIndex: 10, backgroundColor: "black", transform: "translateY(7.4782px) translateX(-7.4782px)" }}>
                    <div className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] h-16 w-16 px-3 py-3" style={{ backgroundColor: "rgb(var(--lk-color-bg1))", transform: "none" }}>
                        <div className="relative flex items-center justify-center" style={{ opacity: 1 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
                                <path fillRule="evenodd" clipRule="evenodd" d="M2 4H5V5H3V7H2V4ZM7 4H11V5H7V4ZM13 4H17V5H13V4ZM18.8889 4H22V7H21V5H18.8889V4ZM3 10V14H2V10H3ZM18.5 11C16.0147 11 14 13.0147 14 15.5C14 17.9853 16.0147 20 18.5 20C20.9853 20 23 17.9853 23 15.5C23 13.0147 20.9853 11 18.5 11ZM13 15.5C13 12.4624 15.4624 10 18.5 10C21.5376 10 24 12.4624 24 15.5C24 18.5376 21.5376 21 18.5 21C15.4624 21 13 18.5376 13 15.5ZM15.5 15.5C15.5 13.8431 16.8431 12.5 18.5 12.5C20.1569 12.5 21.5 13.8431 21.5 15.5C21.5 17.1569 20.1569 18.5 18.5 18.5C16.8431 18.5 15.5 17.1569 15.5 15.5ZM3 16.8571V19H5V20H2V16.8571H3ZM7 19H11V20H7V19Z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top box 2*/}
            <div className="relative absolute left-[calc(50%+60px)] top-[289px] z-20 text-fg0" style={{ transformStyle: "preserve-3d" }}>
                {/* Ghost / depth icons (trimmed to most visible three for brevity) */}
                <div className="absolute" style={{ zIndex: 10, backgroundColor: "black", transform: "translateY(7.4782px) translateX(-7.4782px)" }}>
                    <div className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] h-12 w-12 px-3 py-3" style={{ backgroundColor: "rgb(var(--lk-color-bg1))", transform: "none" }}>
                        <div className="relative flex items-center justify-center" style={{ opacity: 1 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
                                <path fillRule="evenodd" clipRule="evenodd" d="M2 4H5V5H3V7H2V4ZM7 4H11V5H7V4ZM13 4H17V5H13V4ZM18.8889 4H22V7H21V5H18.8889V4ZM3 10V14H2V10H3ZM18.5 11C16.0147 11 14 13.0147 14 15.5C14 17.9853 16.0147 20 18.5 20C20.9853 20 23 17.9853 23 15.5C23 13.0147 20.9853 11 18.5 11ZM13 15.5C13 12.4624 15.4624 10 18.5 10C21.5376 10 24 12.4624 24 15.5C24 18.5376 21.5376 21 18.5 21C15.4624 21 13 18.5376 13 15.5ZM15.5 15.5C15.5 13.8431 16.8431 12.5 18.5 12.5C20.1569 12.5 21.5 13.8431 21.5 15.5C21.5 17.1569 20.1569 18.5 18.5 18.5C16.8431 18.5 15.5 17.1569 15.5 15.5ZM3 16.8571V19H5V20H2V16.8571H3ZM7 19H11V20H7V19Z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top box 3*/}
            <div className="relative absolute left-[calc(50%+172px)] top-[289px] z-20 text-fg0" style={{ transformStyle: "preserve-3d" }}>
                {/* Ghost / depth icons (trimmed to most visible three for brevity) */}
                <div className="absolute" style={{ zIndex: 10, backgroundColor: "black", transform: "translateY(7.4782px) translateX(-7.4782px)" }}>
                    <div className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] h-12 w-12 px-3 py-3" style={{ backgroundColor: "rgb(var(--lk-color-bg1))", transform: "none" }}>
                        <div className="relative flex items-center justify-center" style={{ opacity: 1 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
                                <path fillRule="evenodd" clipRule="evenodd" d="M2 4H5V5H3V7H2V4ZM7 4H11V5H7V4ZM13 4H17V5H13V4ZM18.8889 4H22V7H21V5H18.8889V4ZM3 10V14H2V10H3ZM18.5 11C16.0147 11 14 13.0147 14 15.5C14 17.9853 16.0147 20 18.5 20C20.9853 20 23 17.9853 23 15.5C23 13.0147 20.9853 11 18.5 11ZM13 15.5C13 12.4624 15.4624 10 18.5 10C21.5376 10 24 12.4624 24 15.5C24 18.5376 21.5376 21 18.5 21C15.4624 21 13 18.5376 13 15.5ZM15.5 15.5C15.5 13.8431 16.8431 12.5 18.5 12.5C20.1569 12.5 21.5 13.8431 21.5 15.5C21.5 17.1569 20.1569 18.5 18.5 18.5C16.8431 18.5 15.5 17.1569 15.5 15.5ZM3 16.8571V19H5V20H2V16.8571H3ZM7 19H11V20H7V19Z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top box 4*/}

            <div className="relative absolute left-[calc(50%+284px)] top-[289px] z-20 text-fg0" style={{ transformStyle: "preserve-3d" }}>
                {/* Ghost / depth icons (trimmed to most visible three for brevity) */}
                <div className="absolute" style={{ zIndex: 10, backgroundColor: "black", transform: "translateY(7.4782px) translateX(-7.4782px)" }}>
                    <div className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] h-12 w-12 px-3 py-3" style={{ backgroundColor: "rgb(var(--lk-color-bg1))", transform: "none" }}>
                        <div className="relative flex items-center justify-center" style={{ opacity: 1 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
                                <path fillRule="evenodd" clipRule="evenodd" d="M2 4H5V5H3V7H2V4ZM7 4H11V5H7V4ZM13 4H17V5H13V4ZM18.8889 4H22V7H21V5H18.8889V4ZM3 10V14H2V10H3ZM18.5 11C16.0147 11 14 13.0147 14 15.5C14 17.9853 16.0147 20 18.5 20C20.9853 20 23 17.9853 23 15.5C23 13.0147 20.9853 11 18.5 11ZM13 15.5C13 12.4624 15.4624 10 18.5 10C21.5376 10 24 12.4624 24 15.5C24 18.5376 21.5376 21 18.5 21C15.4624 21 13 18.5376 13 15.5ZM15.5 15.5C15.5 13.8431 16.8431 12.5 18.5 12.5C20.1569 12.5 21.5 13.8431 21.5 15.5C21.5 17.1569 20.1569 18.5 18.5 18.5C16.8431 18.5 15.5 17.1569 15.5 15.5ZM3 16.8571V19H5V20H2V16.8571H3ZM7 19H11V20H7V19Z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Crypto Exchange */}
            <div className="flex items-center justify-center rounded-md border absolute left-[calc(50%+394px)] top-[260px] z-20" style={{ backgroundColor: "black", transform: "none", width: "180px", height: "120px" }}>
                <div className="relative flex items-center justify-center" style={{ opacity: 1 }}>
                    Crypto Exchange
                </div>
            </div>

            {/* Train classifier */}
            <div className="flex items-center justify-center rounded-md border absolute left-[calc(50%+215px)] top-[576px] z-20" style={{ backgroundColor: "black", transform: "none", width: "180px", height: "120px" }}>
                <div className="relative flex items-center justify-center opacity-25" style={{ opacity: 1 }}>
                    Train classifier
                </div>
            </div>


            {/* Trained model */}
            <div className="relative absolute left-[calc(50%+402px)] top-[440px] z-20" style={{ transformStyle: "preserve-3d" }}>

                <div className="absolute" style={{ opacity: 1, zIndex: 10, backgroundColor: "black", transform: "translateY(0px) translateX(0px)" }}>
                    <div className="flex items-center justify-center rounded-md border h-16 w-16 p-3" style={{ backgroundColor: "black", transform: "none" }}>
                        <div className="relative flex items-center justify-center text-xs" style={{ opacity: 1 }}>
                            Trained model
                        </div>
                    </div>
                </div>
            </div>

            {/* Trading Journal */}
            <div className="relative absolute left-[calc(50%+562px)] top-[440px] z-20" style={{ transformStyle: "preserve-3d" }}>

                <div className="absolute" style={{ opacity: 1, zIndex: 10, backgroundColor: "black", transform: "translateY(0px) translateX(0px)" }}>
                    <div className="flex items-center justify-center rounded-md border h-16 w-16 p-3" style={{ backgroundColor: "black", transform: "none" }}>
                        <div className="relative flex items-center justify-center text-xs" style={{ opacity: 1 }}>
                            Trading Journal
                        </div>
                    </div>
                </div>
            </div>

            {/* Backtest model outside ML box*/}
            <div className="relative absolute left-[calc(50%+265px)] top-[785px] z-20">

                <div className="absolute" style={{ opacity: 1, zIndex: 10, backgroundColor: "black", transform: "translateY(0px) translateX(0px)" }}>
                    <div className="flex items-center justify-center rounded-md border h-16 w-16 p-3" style={{
                        backgroundColor: "black", transform: "none"
                    }}>
                        <div className="relative flex items-center justify-center text-xs" style={{ opacity: 1 }
                        } >
                            Backtest model
                        </div>
                    </div>
                </div>
            </div >







            {/* Stats badges */}
            < div className="flex items-center justify-center rounded-md border px-3 py-1.5 text-xs text-fg0 absolute left-[calc(50%+150px)] top-[440px] z-20" style={{ backgroundColor: "black", transform: "none" }
            }>
                <div className="relative flex items-center justify-center" style={{ opacity: 1 }}>
                    <div className="flex items-center justify-center" style={{ opacity: 1 }}>
                        Indicators
                    </div>
                </div>
            </div >

            <div className="flex items-center justify-center rounded-md border px-3 py-1.5 text-xs text-fg0 absolute left-[calc(50%+132px)] top-[480px] z-20" style={{ backgroundColor: "black", transform: "none" }}>
                <div className="relative flex items-center justify-center" style={{ opacity: 1 }}>
                    <div className="flex items-center justify-center" style={{ opacity: 1 }}>
                        Financial Data
                    </div>
                </div>
            </div>

            {/* Panel with frame path */}
            <div className="absolute left-[calc(50%-95px)] top-[399px] z-[5] flex h-[350px] w-[597px] border border-dashed border-zinc-700 px-3 py-2" style={{ opacity: 1, backgroundColor: "rgba(7, 7, 7, 0.8)" }}>
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
        </div >
    );
}
