import DitherBackground from "./DitherBackground";
import { useTranslations } from "next-intl";

const StaticDitherBackground = () => {
    const t = useTranslations("staticDitherBackground");
    
    return (
        <section className="h-screen md:h-[60vh] px-6 md:px-24 relative mb-12 pt-8 md:pt-0">
            <div className="md:absolute md:top-8 md:left-1/2 md:-translate-x-1/2 flex flex-col gap-4 items-center justify-center">
                <h1 className="text-2xl md:text-4xl font-title text-center md:text-left">
                    <span className="text-highlight">{t("titleHighlight")}</span>{" "}
                    {t("titleEnd")}
                </h1>
                <h2 className="text-secondary text-center text-lg md:text-xl md:text-balance md:max-w-xl">
                    {t("description")}
                </h2>
            </div>
            <div className="md:absolute md:bottom-24 md:left-1/2 md:-translate-x-1/2 flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-24 mt-8 md:mt-0">
                <div className="flex flex-col items-center justify-center md:justify-start">
                    <h1 className="text-[60px] md:text-[80px] font-title">17%</h1>
                    <h2 className="text-center text-md">
                        {t("stat1")}
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-[80px] md:text-[100px] font-title">43%</h1>
                    <h2 className="text-center text-xl">
                        {t("stat2")}
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-[60px] md:text-[80px] font-title">25%</h1>
                    <h2 className="text-center text-md">
                        {t("stat3")}
                    </h2>
                </div>
            </div>
            <div className="md:absolute md:-bottom-6 md:left-1/2 md:-translate-x-1/2 flex items-end justify-center gap-24 mt-8 md:mt-0">
                <p className="text-tertiary text-center !text-xs md:text-sm">
                    {t("disclaimer")}
                </p>
            </div>
            <DitherBackground className="absolute inset-0 -z-10 hidden md:block" />
        </section>
    );
};

export default StaticDitherBackground;
