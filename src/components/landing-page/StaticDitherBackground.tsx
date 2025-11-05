import DitherBackground from "./DitherBackground";
import { useTranslations } from "next-intl";

const StaticDitherBackground = () => {
    const t = useTranslations("staticDitherBackground");
    
    return (
        <section className="h-[60vh] px-24 relative mb-12">
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col gap-4 items-center justify-center">
                <h1 className="text-4xl font-title">
                    <span className="text-highlight">{t("titleHighlight")}</span>{" "}
                    {t("titleEnd")}
                </h1>
                <h2 className="text-secondary text-center text-xl text-balance max-w-xl">
                    {t("description")}
                </h2>
            </div>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-end justify-center gap-24">
                <div className="flex flex-col items-center justify-start">
                    <h1 className="text-[80px] font-title">17%</h1>
                    <h2 className="text-center text-md">
                        {t("stat1")}
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-[100px] font-title">43%</h1>
                    <h2 className="text-center text-xl">
                        {t("stat2")}
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-[80px] font-title">25%</h1>
                    <h2 className="text-center text-md">
                        {t("stat3")}
                    </h2>
                </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-end justify-center gap-24">
                <p className="text-tertiary text-center text-sm">
                    {t("disclaimer")}
                </p>
            </div>
            <DitherBackground className="absolute inset-0 -z-10" />
        </section>
    );
};

export default StaticDitherBackground;
