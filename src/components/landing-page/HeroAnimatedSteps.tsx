"use client";
import React from "react";
import { Bot, Cpu, History } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HeroSteps() {
    const t = useTranslations("hero.steps");

    const steps = [
        { Icon: Bot, text: t("algorithms") },
        { Icon: Cpu, text: t("ml") },
        { Icon: History, text: t("backtest") },
    ];

    const [activeIndex, setActiveIndex] = React.useState(0);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % steps.length);
        }, 4000);
        return () => clearInterval(intervalId);
    }, [steps.length]);

    return (
        <div className="pt-8 lg:pt-10 2xl:pt-32 flex flex-col gap-4 lg:gap-6">
            {steps.map(({ Icon, text }, index) => (
                <div
                    key={index}
                    className={[
                        "flex items-center gap-4",
                        "transition-colors duration-300",
                        index === activeIndex ? "text-white" : "text-neutral-500",
                    ].join(" ")}
                >
                    <Icon />
                    <h1>{text}</h1>
                </div>
            ))}
        </div>
    );
}