"use client";
import React, { useRef, useState, useEffect } from "react";
import { strategies } from "@/data/constants";

const SlidingTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState("firstStrategy");
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
    const firstStrategyRef = useRef<HTMLButtonElement>(null);
    const secondStrategyRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const updateUnderline = () => {
            const activeRef = activeTab === "firstStrategy" ? firstStrategyRef : secondStrategyRef;
            if (activeRef.current) {
                const rect = activeRef.current.getBoundingClientRect();
                const parentRect =
                    activeRef.current.parentElement?.getBoundingClientRect();
                if (parentRect) {
                    setUnderlineStyle({
                        left: rect.left - parentRect.left,
                        width: rect.width,
                    });
                }
            }
        };

        updateUnderline();
        window.addEventListener("resize", updateUnderline);
        return () => window.removeEventListener("resize", updateUnderline);
    }, [activeTab]);

    return (
        <div className="flex flex-col items-center">
            <div className="relative flex gap-8">
                <div
                    className="
                    pointer-events-none absolute top-0 h-0.5 bg-white
                    transition-all duration-300 ease-in-out
                    [clip-path:inset(0_-100vmax_-9999px_-100vmax)]
                    shadow-[0_8px_18px_3px_rgba(255,255,255,0.26)]
                    after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2
                    after:top-full after:h-5 after:w-[130%]
                    after:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.38)_0%,rgba(255,255,255,0.2)_40%,transparent_70%)]
                    after:blur-[7px] after:opacity-85 after:pointer-events-none
                  "
                    style={{
                        left: `${underlineStyle.left}px`,
                        width: `${underlineStyle.width}px`,
                    }}
                />
                <button
                    ref={secondStrategyRef}
                    onClick={() => setActiveTab("secondStrategy")}
                    className={`py-3 flex gap-2 transition-colors duration-300 ${activeTab === "secondStrategy"
                        ? "text-white"
                        : "text-tertiary hover:text-white"
                        }`}>

                    {strategies[0]}
                </button>
                <button
                    ref={firstStrategyRef}
                    onClick={() => setActiveTab("firstStrategy")}
                    className={`py-3 flex gap-2 transition-colors duration-300 ${activeTab === "firstStrategy"
                        ? "text-white"
                        : "text-tertiary hover:text-white"
                        }`}>

                    {strategies[1]}
                </button>


            </div>
        </div>
    );
};
export default SlidingTabs;