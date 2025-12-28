import { getTranslations } from "next-intl/server";

export default async function Disclosures() {
    const t = await getTranslations("disclosuresPage");

    return (
        <>
            {/* Title */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-title mb-4">
                    {t("title")} <span className="text-highlight">{t("titleHighlight")}</span>
                </h1>
                <p className="text-tertiary text-sm">{t("effectiveDate")}</p>
            </div>

            {/* Content */}
            <article className="space-y-10">
                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section1.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section1.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section2.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section2.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section3.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section3.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section4.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section4.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section5.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section5.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section6.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section6.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section7.title")}</h2>
                    <p className="text-secondary leading-relaxed">
                        {t("section7.content")}{" "}
                        <a href="mailto:monkeys.finance@gmail.com" className="text-highlight hover:underline">
                            monkeys.finance@gmail.com
                        </a>
                    </p>
                </section>
            </article>
        </>
    );
}
