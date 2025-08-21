import * as React from "react";

/**
 * HeroBoard
 * ------------
 * Keeps the original styling, sizes, and animated line gradients.
 * Only moves/adds boxes and reconnects lines to match the attached diagram:
 * - Top row: Data Fetching → Algorithm → Backtesting → Decision Making Algorithm → Stocks Exchange
 * - Right side: Trading Journal (connected from Stocks Exchange)
 * - ML panel: Indicators, Financial Data → Train Classifier ↔ Trained Model
 * - Bottom: Backtest Trained Model (from Train Classifier)
 */

export interface HeroBoardProps {
    className?: string;
    /** Optional: extra wrapper styles */
    style?: React.CSSProperties;
}

export default function NewHeroBoard({ className, style }: HeroBoardProps) {
    return (
        <div
            className={[
                "absolute left-[calc(50%-600px)] top-[120px] h-[1095px] w-[1580px]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                transform: "translateY(0px) rotate(-30deg) skewX(30deg)",
                ...style,
            }}
        >
            {/* background grid stays the same */}
            <img
                className="absolute left-0 top-0 object-none"
                alt="Grid"
                src="/hero-grid.svg"
                style={{ opacity: 1 }}
            />

            {/* =========================
          BOXES (kept original styling)
         ========================= */}

            {/* Top row */}
            <div
                className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] absolute left-[120px] top-[150px] z-20 h-[70px] w-[160px] text-fg0"
                style={{ backgroundColor: "rgb(var(--lk-color-bg1))" }}
            >
                <span className="font-medium">Data Fetching</span>
            </div>

            <div
                className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] absolute left-[310px] top-[150px] z-20 h-[70px] w-[160px] text-fg0"
                style={{ backgroundColor: "rgb(var(--lk-color-bg1))" }}
            >
                <span className="font-medium">Algorithm</span>
            </div>

            <div
                className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] absolute left-[500px] top-[150px] z-20 h-[70px] w-[160px] text-fg0"
                style={{ backgroundColor: "rgb(var(--lk-color-bg1))" }}
            >
                <span className="font-medium">Backtesting</span>
            </div>

            <div
                className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] absolute left-[690px] top-[140px] z-20 h-[90px] w-[220px] text-fg0 px-3 text-center"
                style={{ backgroundColor: "rgb(var(--lk-color-bg1))" }}
            >
                <span className="font-medium leading-tight">
                    Decision
                    <br />
                    Making
                    <br />
                    Algorithm
                </span>
            </div>

            <div
                className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] absolute left-[1030px] top-[100px] z-20 h-[180px] w-[260px] text-fg0 px-3 text-center"
                style={{ backgroundColor: "rgb(var(--lk-color-bg1))" }}
            >
                <span className="font-medium">Stocks Exchange</span>
            </div>

            {/* Trading Journal on the far right */}
            <div
                className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] absolute left-[1420px] top-[400px] z-20 h-[120px] w-[150px] text-fg0 px-3 text-center"
                style={{ backgroundColor: "rgb(var(--lk-color-bg1))" }}
            >
                <span className="font-medium leading-tight">Trading Journal</span>
            </div>

            {/* Machine Learning Step frame */}
            <div
                className="absolute left-[340px] top-[320px] z-[5] h-[520px] w-[900px] px-3 py-2"
                style={{ opacity: 1, backgroundColor: "rgba(7, 7, 7, 0.8)" }}
            >
                <div className="h-fit self-start text-fg3">
                    <span className="flex gap-1 font-mono text-xs uppercase tracking-widest">
                        Machine Learning Step
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            role="presentation"
                            className="h-4 w-4 text-fg3"
                        >
                            <path
                                d="M18.25 15.25V5.75H8.75M6 18L17.6002 6.39983"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="square"
                            />
                        </svg>
                    </span>
                </div>

                {/* frame path (same thin dash look) */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        x="1"
                        y="1"
                        width="898"
                        height="518"
                        rx="10"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1"
                        fill="none"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>
            </div>

            {/* ML inner boxes */}
            <div
                className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] absolute left-[540px] top-[380px] z-20 h-[40px] w-[140px] text-fg0"
                style={{ backgroundColor: "rgb(var(--lk-color-bg1))" }}
            >
                <span className="text-sm">Indicators</span>
            </div>

            <div
                className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] absolute left-[540px] top-[430px] z-20 h-[40px] w-[160px] text-fg0"
                style={{ backgroundColor: "rgb(var(--lk-color-bg1))" }}
            >
                <span className="text-sm">Financial Data</span>
            </div>

            <div
                className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] absolute left-[520px] top-[500px] z-20 h-[200px] w-[260px] text-fg0 px-3 text-center"
                style={{ backgroundColor: "rgb(var(--lk-color-bg1))" }}
            >
                <span className="font-medium">Train Classifier</span>
            </div>

            <div
                className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] absolute left-[900px] top-[540px] z-20 h-[120px] w-[120px] text-fg0 px-3 text-center"
                style={{ backgroundColor: "rgb(var(--lk-color-bg1))" }}
            >
                <span className="font-medium">Trained Model</span>
            </div>

            <div
                className="flex items-center justify-center rounded-md border border-fg0 shadow-[-3px_3px_0px_0px_theme(colors.fg0)] absolute left-[600px] top-[880px] z-20 h-[100px] w-[190px] text-fg0 px-3 text-center"
                style={{ backgroundColor: "rgb(var(--lk-color-bg1))" }}
            >
                <span className="font-medium leading-tight">
                    Backtest
                    <br />
                    Trained Model
                </span>
            </div>

            {/* =========================
          LINES (same animated style/colors, re-wired)
         ========================= */}
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-full">
                {/* Helpers: a reusable gradient style (each with subtle phase offset for motion variety) */}

                {/* 1) Data → Algorithm */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient
                            id="grad_df_alg"
                            gradientUnits="objectBoundingBox"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                            gradientTransform="rotate(0, 0.5, 0.5)"
                        >
                            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="0s"
                                from="-3 0"
                                to="3 0"
                                dur="3s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M280,185 L310,185"
                        stroke="url(#grad_df_alg)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>

                {/* 2) Algorithm → Backtesting */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="grad_alg_bt" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="0.4s"
                                from="-3 0"
                                to="3 0"
                                dur="3s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M470,185 L500,185"
                        stroke="url(#grad_alg_bt)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>

                {/* 3) Backtesting → Decision Making Algorithm */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="grad_bt_dm" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="0.8s"
                                from="-3 0"
                                to="3 0"
                                dur="3s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M650,185 L690,185"
                        stroke="url(#grad_bt_dm)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>

                {/* 4) Decision Making Algorithm → Stocks Exchange */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="grad_dm_se" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="1.2s"
                                from="-3 0"
                                to="3 0"
                                dur="3s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M910,185 L1030,185"
                        stroke="url(#grad_dm_se)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>

                {/* 5) Stocks Exchange → Trading Journal (curved) */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="grad_se_tj" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="1.6s"
                                from="-3 0"
                                to="3 0"
                                dur="3s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M1290,190 C1520,190 1520,420 1420,460"
                        stroke="url(#grad_se_tj)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>

                {/* 6) Algorithm ↓ into ML panel → Train (elbow) */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="grad_alg_train" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="0.5s"
                                from="-3 0"
                                to="3 0"
                                dur="3s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M390,220 L390,500 L650,500"
                        stroke="url(#grad_alg_train)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>

                {/* 7) Decision Making Algorithm ↓ to Trained Model (down then right) */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="grad_dm_model" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="1s"
                                from="-3 0"
                                to="3 0"
                                dur="3s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M800,230 L800,540 L900,540"
                        stroke="url(#grad_dm_model)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>

                {/* 8) Indicators ↓ Train */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="grad_ind_train" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="0.2s"
                                from="-3 0"
                                to="3 0"
                                dur="3s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M610,420 L610,500"
                        stroke="url(#grad_ind_train)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>

                {/* 9) Financial Data ↓ Train */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="grad_fin_train" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="0.3s"
                                from="-3 0"
                                to="3 0"
                                dur="3s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M620,470 L620,500"
                        stroke="url(#grad_fin_train)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>

                {/* 10) Train → Trained Model (curved) */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="grad_train_model" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="0.6s"
                                from="-3 0"
                                to="3 0"
                                dur="3s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M780,620 C850,620 850,640 900,640"
                        stroke="url(#grad_train_model)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>

                {/* 11) Trained Model → Train (curved return) */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="grad_model_train" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="0.9s"
                                from="3 0"
                                to="-3 0"
                                dur="3s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M900,660 C820,720 760,720 650,700"
                        stroke="url(#grad_model_train)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>

                {/* 12) Train ↓ Backtest Trained Model */}
                <svg
                    className="pointer-events-none absolute left-0 top-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="grad_train_backtest" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="20%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="50%" stopColor="#1FD5F9" />
                            <stop offset="80%" stopColor="rgba(255,255,255,0.7)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            <animateTransform
                                attributeName="gradientTransform"
                                type="translate"
                                additive="sum"
                                begin="1.3s"
                                from="-3 0"
                                to="3 0"
                                dur="3s"
                                repeatCount="indefinite"
                                restart="whenNotActive"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d="M650,700 L650,880"
                        stroke="url(#grad_train_backtest)"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1px 1px"
                        strokeDashoffset="0px"
                    />
                </svg>
            </div>
        </div>
    );
}
