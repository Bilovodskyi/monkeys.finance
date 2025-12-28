"use client";

import DitherPortrait from "./DitherBuffet";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Philosophy() {
    const t = useTranslations("philosophy");

    return (
        <section className="w-full relative overflow-hidden bg-[rgb(18,18,18)] py-16 md:py-4">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-12 lg:px-20">
                {/* Title */}
                <div className="flex md:justify-center gap-2 mb-8 md:mb-12">
                    <h1 className="text-2xl md:text-4xl font-title">
                        {t("titleStart")} <span className="text-highlight">{t("titleHighlight")}</span>
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
                    
                    {/* Left side: Quote and info */}
                    <div className="flex flex-col gap-8 max-w-lg lg:max-w-xl">
                        {/* Quote with attribution */}
                        <div>
                            <blockquote>
                                <p className="text-white !text-lg md:!text-xl lg:!text-2xl !leading-relaxed italic">
                                    &ldquo;{t("quote")}&rdquo;
                                </p>
                            </blockquote>
                            {/* Graham name - right aligned */}
                            <p className="text-tertiary text-sm mt-4 text-right">
                                — {t("author")}
                            </p>
                        </div>

                        {/* Description text */}
                        <p className="text-secondary !text-base md:!text-lg !leading-relaxed">
                            {t("description")}
                        </p>
                        
                        {/* Learn more + logo row */}
                        <div className="flex items-center justify-between gap-6">
                            <a href="#" className="text-white text-sm hover:text-highlight transition-colors">
                                {t("learnMore")} &gt;
                            </a>
                            <div className="flex items-center gap-3">
                                <Image 
                                    src="/monkeys-logo.png" 
                                    alt="Monkeys Finance" 
                                    width={100} 
                                    height={34}
                                    
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right side: Portrait */}
                    <div className="w-[380px] h-[280px] md:h-[320px] lg:h-[460px] flex-shrink-0">
                        <DitherPortrait 
                            backgroundColor="rgb(18, 18, 18)"
                            fit="contain"
                            horizontalFadePower={2}
                            verticalFadePower={2}
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}