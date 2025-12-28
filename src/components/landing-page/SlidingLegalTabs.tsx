"use client";
import React, { useRef, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const SlidingTabs: React.FC = () => {
    const t = useTranslations("legalTabs");
    const pathname = usePathname();
    const router = useRouter();
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
    
    const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    const TABS = [
        { id: "tos", label: t("tos"), href: "/tos" },
        { id: "privacy", label: t("privacy"), href: "/privacy" },
        { id: "disclosures", label: t("disclosures"), href: "/disclosures" },
    ];

    // Determine active tab from URL
    const getActiveTab = () => {
        for (const tab of TABS) {
            if (pathname.includes(tab.href)) {
                return tab.id;
            }
        }
        return "tos"; // Default
    };

    const activeTab = getActiveTab();

    useEffect(() => {
        const updateUnderline = () => {
            const activeRef = tabRefs.current[activeTab];
            if (activeRef) {
                const rect = activeRef.getBoundingClientRect();
                const parentRect = activeRef.parentElement?.getBoundingClientRect();
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

    const handleTabClick = (href: string) => {
        // Extract locale from current pathname (e.g., /en/tos -> en)
        const localeMatch = pathname.match(/^\/([a-z]{2})\//);
        const locale = localeMatch ? localeMatch[1] : "en";
        router.push(`/${locale}${href}`);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative flex gap-4 md:gap-8">
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
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        ref={(el) => { tabRefs.current[tab.id] = el; }}
                        onClick={() => handleTabClick(tab.href)}
                        className={`py-3 text-sm md:text-base flex gap-2 transition-colors duration-300 ${
                            activeTab === tab.id
                                ? "text-white"
                                : "text-tertiary hover:text-white"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SlidingTabs;