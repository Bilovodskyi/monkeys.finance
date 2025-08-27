"use client";
import React from "react";
import { Bot, Cpu, History } from "lucide-react";

export default function HeroSteps() {
    const steps = [
        { Icon: Bot, text: "Multiple custom algorithms" },
        { Icon: Cpu, text: "Polished with machine learning" },
        { Icon: History, text: "Backtest and pick the best one" },
    ];

    const [activeIndex, setActiveIndex] = React.useState(0);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % steps.length);
        }, 4000);
        return () => clearInterval(intervalId);
    }, [steps.length]);

    return (
        <div className="pt-32 flex flex-col gap-6">
            {steps.map(({ Icon, text }, index) => (
                <div
                    key={text}
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