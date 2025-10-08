import { getTranslations } from "next-intl/server";

export const Reviews = async () => {
    const t = await getTranslations("reviews");

    return <section className="px-24 mt-8 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:8px_8px] h-1/2 flex flex-col justify-center items-center gap-12">
        <h1 className="text-3xl font-title mb-6">
            {t("title")} <span className="text-highlight">{t("titleHighlight")}</span> {t("titleEnd")}
        </h1>
        <div className="flex justify-center gap-4 items-center">
            <div className="flex flex-col gap-2 w-[300px] border border-zinc-800 p-8 bg-neutral-900 rotate-[5deg] translate-x-[25px] hover:translate-y-[-20px] hover:z-30 transition-all duration-300 ease-in-out">
                <h2 className="text-xl font-title">"{t("review1.quote")}"</h2>
                <p className="text-sm text-secondary">{t("review1.description")}</p>
                <p className="text-sm pt-2">{t("review1.name")}</p>
                <p className="text-sm text-secondary">{t("review1.location")}</p>
            </div>
            <div className="flex flex-col gap-2 w-[300px] border border-zinc-800 p-8 bg-neutral-900 rotate-[-3deg] translate-x-[10px] translate-y-[-50px] hover:translate-y-[-70px] hover:z-30 transition-all duration-300 ease-in-out">
                <h2 className="text-xl font-title">"{t("review2.quote")}"</h2>
                <p className="text-sm pt-2">{t("review2.name")}</p>
                <p className="text-sm text-secondary">{t("review2.location")}</p>
            </div>
            <div className="flex flex-col gap-2 w-[300px] border border-zinc-800 p-8 bg-neutral-900 rotate-[3deg] translate-x-[-10px] hover:translate-y-[-20px] hover:z-30 transition-all duration-300 ease-in-out">
                <h2 className="text-xl font-title">"{t("review3.quote")}"</h2>
                <p className="text-sm text-secondary">{t("review3.description")}</p>
                <p className="text-sm pt-2">{t("review3.name")}</p>
                <p className="text-sm text-secondary">{t("review3.location")}</p>
            </div>
            <div className="flex flex-col gap-2 w-[300px] border border-zinc-800 p-8 bg-neutral-900 rotate-[-5deg] translate-x-[-30px] translate-y-[-20px] hover:translate-y-[-40px] hover:z-30 transition-all duration-300 ease-in-out">
                <h2 className="text-xl font-title">"{t("review4.quote")}"</h2>
                <p className="text-sm text-secondary">{t("review4.description")}</p>
                <p className="text-sm pt-2">{t("review4.name")}</p>
                <p className="text-sm text-secondary">{t("review4.location")}</p>
            </div>

        </div>

    </section>;
};