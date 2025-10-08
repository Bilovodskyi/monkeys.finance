"use client";

import * as React from "react";
import BoxWithHover from "./BoxWithHover";
import { Brain, Bot, CloudDownload, History, Bitcoin, Cpu, BrainCircuit, BookOpenText, ChartLine } from "lucide-react";
import { useTranslations } from "next-intl";

export interface HeroBoardProps {
    className?: string;
    /** Optional: extra wrapper styles */
    style?: React.CSSProperties;
}

export default function HeroBoard({ className, style }: HeroBoardProps) {
    const t = useTranslations("heroAnimation");

    return (
        <div
            className={[
                "absolute left-[-400px] top-[120px] h-[800px] w-[1280px]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{ transform: "translateY(0px) rotate(-30deg) skewX(30deg)", ...style }}
        >

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
            <BoxWithHover
                posClass="absolute left-[calc(50%-52px)] top-[284px]"
                label={t("data.label")}
                tooltip={
                    <div className="flex flex-col gap-2">
                        <CloudDownload />
                        <span className="text-main">{t("data.title")}</span>
                        <span>{t("data.description")}</span>
                    </div>
                }
                side="top"
                align="center"
                sideOffset={12}
            />

            {/* Top box 2*/}
            <BoxWithHover
                posClass="absolute left-[calc(50%+60px)] top-[284px]"
                label={t("algorithm.label")}
                tooltip={<div className="flex flex-col gap-2">
                    <Bot />
                    <span className="text-main">{t("algorithm.title")}</span>
                    <span>
                        {t("algorithm.description")}
                    </span>
                </div>}
                side="top"
                align="center"
                sideOffset={12}
            />

            {/* Top box 3*/}
            <BoxWithHover
                posClass="absolute left-[calc(50%+172px)] top-[284px]"
                label={t("backtest.label")}
                tooltip={<div className="flex flex-col gap-2">
                    <History />
                    <span className="text-main">{t("backtest.title")}</span>
                    <span>
                        {t("backtest.description")}
                    </span>
                </div>}
                side="top"
                align="center"
                sideOffset={12}
            />

            {/* Top box 4*/}
            <BoxWithHover
                posClass="absolute left-[calc(50%+284px)] top-[284px]"
                label={t("decision.label")}
                tooltip={<div className="flex flex-col gap-2">
                    <Brain />
                    <span className="text-main">{t("decision.title")}</span>
                    <span>
                        {t("decision.description")}
                    </span>
                </div>}
                side="top"
                align="center"
                sideOffset={12}
            />

            {/* Crypto Exchange */}
            <BoxWithHover
                posClass="absolute left-[calc(50%+394px)] top-[260px]"
                label={t("cryptoExchange.label")}
                tooltip={<div className="flex flex-col gap-2">
                    <Bitcoin />
                    <span className="text-main">{t("cryptoExchange.title")}</span>
                    <span>
                        {t("cryptoExchange.description")}
                    </span>
                </div>}
                side="top"
                align="center"
                sideOffset={12}
                className="h-[120px] w-[180px]"
            />

            {/* Train classifier */}
            <BoxWithHover
                posClass="absolute left-[calc(50%+215px)] top-[576px]"
                label={t("trainClassifier.label")}
                tooltip={<div className="flex flex-col gap-2">
                    <Cpu />
                    <span className="text-main">{t("trainClassifier.title")}</span>
                    <span>
                        {t("trainClassifier.description")}
                    </span>
                </div>}
                side="top"
                align="center"
                sideOffset={12}
                className="h-[120px] w-[180px]"
            />

            <BoxWithHover
                posClass="absolute left-[calc(50%+402px)] top-[440px]"
                label={t("mlModel.label")}
                tooltip={<div className="flex flex-col gap-2">
                    <BrainCircuit />
                    <span className="text-main">{t("mlModel.title")}</span>
                    <span>
                        {t("mlModel.description")}
                    </span>
                </div>}
                side="top"
                align="center"
                sideOffset={12}
            />

            <BoxWithHover
                posClass="absolute left-[calc(50%+562px)] top-[440px]"
                label={t("tradingJournal.label")}
                tooltip={<div className="flex flex-col gap-2">
                    <BookOpenText />
                    <span className="text-main">{t("tradingJournal.title")}</span>
                    <span>
                        {t("tradingJournal.description")}
                    </span>
                </div>}
                side="top"
                align="center"
                sideOffset={12}
            />

            <BoxWithHover
                posClass="absolute left-[calc(50%+265px)] top-[785px]"
                label={t("backtestModel.label")}
                tooltip={<div className="flex flex-col gap-2">
                    <History />
                    <span className="text-main">{t("backtestModel.title")}</span>
                    <span>
                        {t("backtestModel.description")}
                    </span>
                </div>}
                side="top"
                align="center"
                sideOffset={12}
            />

            {/* Stats badges */}
            <BoxWithHover
                posClass="absolute left-[calc(50%+150px)] top-[435px]"
                label={t("indicators.label")}
                tooltip={
                    <div className="flex flex-col gap-2">
                        <ChartLine />
                        <span className="text-main">{t("indicators.title")}</span>
                        <span>
                            {t("indicators.description")}
                        </span>
                    </div>
                }
                side="top"
                align="center"
                sideOffset={12}
                className="px-3 py-1.5 text-fg0 h-auto w-auto"

            />

            <BoxWithHover
                posClass="absolute left-[calc(50%+132px)] top-[485px]"
                label={t("financialData.label")}
                tooltip={
                    <div className="flex flex-col gap-2">
                        <ChartLine />
                        <span className="text-main">{t("financialData.title")}</span>
                        <span>
                            {t("financialData.description")}
                        </span>
                    </div>
                }
                side="top"
                align="center"
                sideOffset={12}
                className="px-3 py-1.5 text-fg0 text-xs h-auto w-auto"

            />

            {/* Panel with frame path */}
            <div className="absolute left-[calc(50%-95px)] top-[399px] z-[5] flex h-[350px] w-[597px] border border-dashed border-zinc-700 px-3 py-2" style={{ opacity: 1, backgroundColor: "rgba(18, 18, 18, 0.8)" }}>
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group h-fit self-start text-fg3 hover:text-cyan-500 hover:underline"
                >
                    <span className="flex gap-1 font-mono text-xs uppercase tracking-widest" style={{ opacity: 1 }}>
                        {t("mlStepLabel")}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation" className="h-4 w-4 text-fg3 group-hover:text-cyan-500">
                            <path d="M18.25 15.25V5.75H8.75M6 18L17.6002 6.39983" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                        </svg>
                    </span>
                </a>

            </div>
        </div >
    );
}
