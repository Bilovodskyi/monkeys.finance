import HeroBoard from "@/components/hero-animation/HeroAnimation";
import { CustomButton } from "@/components/CustomButton";
import HeroSteps from "./HeroAnimatedSteps";
import { Github, Star } from "lucide-react";
import Image from "next/image";
import { SignUpButton } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { LanguageSelector } from "./LanguageSelector";
import Link from "next/link";

export async function HeroSection() {
    const t = await getTranslations("hero");

    return (
        <section className="flex relative overflow-hidden">
            {/* Header */}
            <section className="absolute top-0 left-0 py-6 px-24 flex items-center gap-4 justify-between w-full">
                <img src="/main-logo.png" alt="Main Logo" className="w-32" />
                <div className="flex items-center gap-8">
                    <LanguageSelector isPrivatePage={false} />
                    <div className="flex items-center gap-2 text-secondary">
                        <Github className="w-3 h-3 shrink-0" />
                        <div className="flex items-center gap-1 hover:underline cursor-pointer hover:text-white z-50">
                            <p className="whitespace-nowrap font-semibold">
                                github
                            </p>
                            /
                            <p className="whitespace-nowrap font-semibold">
                                ml-crypto-bot
                            </p>
                            <Star className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Hero Content */}
            <section className="flex flex-col w-1/3 px-24 pt-32">
                <div className="border border-zinc-800 rounded-full px-6 py-2 mb-6 text-[12px] font-semibold w-fit">
                    {t("badge")}
                </div>
                <h1 className="text-5xl font-title mb-6">
                    {t("title")}{" "}
                    <span className="text-highlight">
                        {t("titleHighlight")}
                    </span>{" "}
                    {t("titleEnd")}
                </h1>
                <p className="text-secondary mb-8">{t("description")}</p>
                <div className="flex gap-4 items-center">
                    <SignUpButton>
                        <CustomButton isBlue={true}>
                            {t("startTradingButton")}
                        </CustomButton>
                    </SignUpButton>
                    <Link href="/about">
                        <CustomButton isBlue={false}>
                            {t("aboutButton")}
                        </CustomButton>
                    </Link>
                </div>
                <HeroSteps />
            </section>

            {/* Animation Area */}
            <section className="relative w-2/3 overflow-hidden h-[100vh]">
                <HeroBoard />
            </section>

            {/* Background Grid */}
            <img
                className="absolute -right-48 top-4 object-none -z-10"
                alt="Grid"
                src="/hero-grid.svg"
                style={{ transform: "rotate(-30deg) skewX(30deg)" }}
            />

            {/* Supported Exchanges */}
            <section className="absolute right-0 bottom-12 bg-background w-full border-y border-zinc-800 flex [&>div:not(:first-child)]:border-l [&>div]:border-zinc-800">
                <div className="flex-1 px-4 py-3"></div>
                <div className="flex-1 px-4 py-3 flex flex-col justify-center">
                    {t("supportedExchanges")} <br />{" "}
                    <span className="text-secondary">
                        {t("supportedExchangesSubtext")}
                    </span>
                </div>
                <div className="flex items-center justify-center flex-1 px-4 py-3">
                    <Image
                        src="/exchange-logo/binance.png"
                        alt="Binance"
                        width={100}
                        height={100}
                        className="grayscale"
                    />
                </div>
                <div className="flex items-center justify-center flex-1 px-4 py-3">
                    <Image
                        src="/exchange-logo/kraken.webp"
                        alt="Kraken"
                        width={100}
                        height={100}
                        className="brightness-0 invert"
                    />
                </div>
                <div className="flex items-center justify-center flex-1 px-4 py-3">
                    <Image
                        src="/exchange-logo/okx.png"
                        alt="OKX"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="flex items-center justify-center flex-1 px-4 py-3">
                    <Image
                        src="/exchange-logo/coinbase.png"
                        alt="Coinbase"
                        width={100}
                        height={100}
                        className="brightness-0 invert"
                    />
                </div>
                <div className="flex-1 px-4 py-3"></div>
            </section>
        </section>
    );
}
