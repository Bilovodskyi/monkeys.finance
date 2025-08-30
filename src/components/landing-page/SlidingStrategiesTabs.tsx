"use client";
import React, { useRef, useState, useEffect } from "react";
import { GalleryVerticalEnd, ListTodo } from "lucide-react";

const SlidingTabs: React.FC = () => {
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
    const historyRef = useRef<HTMLButtonElement>(null);
    const rulesRef = useRef<HTMLButtonElement>(null);
    const [activeTab, setActiveTab] = useState("Ribbon");

    useEffect(() => {
        const updateUnderline = () => {
            const activeRef = activeTab === "ATR" ? historyRef : rulesRef;
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
                <button
                    ref={rulesRef}
                    onClick={() => setActiveTab("Ribbon")}
                    className={`cursor-pointer py-3 flex gap-2 transition-colors duration-300 ${activeTab === "Ribbon"
                        ? "text-white"
                        : "text-neutral-500 hover:text-white"
                        }`}>
                    <ListTodo />
                    Backtesting Ribbon
                </button>
                <button
                    ref={historyRef}
                    onClick={() => setActiveTab("ATR")}
                    className={`cursor-pointer py-3 flex gap-2 transition-colors duration-300 ${activeTab === "ATR"
                        ? "text-white"
                        : "text-neutral-500 hover:text-white"
                        }`}>
                    <GalleryVerticalEnd />
                    Backtesting ATR
                </button>

                <div
                    className="absolute bottom-0 h-0.5 bg-highlight transition-all duration-300 ease-in-out"
                    style={{
                        left: `${underlineStyle.left}px`,
                        width: `${underlineStyle.width}px`,
                    }}
                />
            </div>
        </div>
    );
};

export default SlidingTabs;