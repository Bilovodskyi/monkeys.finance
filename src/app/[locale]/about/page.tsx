import DitherBackground from "@/components/landing-page/DitherBackground";
import Link from "next/link";
import Image from "next/image";
import { SignUpButton } from "@clerk/nextjs";
import { CustomButton } from "@/components/CustomButton";
import { getTranslations } from "next-intl/server";

export default async function About() {
    const t = await getTranslations("about");

    return (
        <div>
            <div className="w-full overflow-hidden bg-[rgb(18,18,18)] flex flex-col">
                {/* <LedGridFlicker rows={80} cols={380} activeTarget={4000} className="absolute left-0 top-0 z-20 w-full h-full scale-130" /> */}
                <div className="absolute top-0 left-0 right-0 bottom-0 h-screen">
                    <Link className="absolute top-6 left-6 md:left-24 z-30" href="/">
                        <Image
                            src="/monkeys-logo.svg"
                            alt="Monkeys Logo"
                            width={128}
                            height={32}
                            className="w-32"
                        />
                    </Link>
                    <DitherBackground
                        className="absolute inset-0 rotate-180"
                        horizontalFadePower={3}
                        effectHeight={0.1}
                        verticalFadePower={1.3}
                    />
                </div>

                <div className="h-[500px] z-20 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-title text-center">{t("title")}</h1>
                </div>
                <div className="z-20 flex flex-col gap-3 items-center pt-8 md:pt-32 pb-20">
                    <h2 className="!text-2xl px-6 md:px-0 md:w-1/2">
                        {t("subtitle")}{" "}
                        <span className="text-highlight">
                            {t("subtitleHighlight")}
                        </span>
                    </h2>
                    <p className="px-6 md:px-0 md:w-1/2 !text-xl text-secondary">
                        {t("intro")}
                    </p>
                    <p className="px-6 md:px-0 md:w-1/2 !text-xl text-secondary">
                        <span className="text-main">{t("howItWorksTitle")}</span> {t("howItWorksDescription")}
                    </p>
                    <p className="px-6 md:px-0 md:w-1/2 !text-xl text-secondary">
                        <span className="text-main">
                            {t("differenceTitle")}
                        </span>{" "}
                        {t("differenceDescription")}
                    </p>
                    <p className="px-6 md:px-0 md:w-1/2 !text-xl text-secondary">
                        <span className="text-main">{t("whatsNextTitle")}</span> {t("whatsNextDescription")}
                    </p>
                    
                    <h2 className="!text-2xl px-6 md:px-0 md:w-1/2 pt-6 font-title pb-4">
                        {t("ctaText")}{" "}
                    </h2>
                    <div className="flex gap-4 px-6 md:px-0 md:w-1/2 justify-start">
                        <SignUpButton>
                            <CustomButton isBlue={true}>
                                {t("startTradingButton")}
                            </CustomButton>
                        </SignUpButton>
                        <Link href="/about">
                            <CustomButton isBlue={false}>
                                {t("documentationButton")}
                            </CustomButton>
                        </Link>
                    </div>
                 
                </div>
            </div>
        </div>
    );
}
