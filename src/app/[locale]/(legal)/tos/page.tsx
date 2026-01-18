import { getTranslations } from "next-intl/server";

export default async function Tos() {
    const t = await getTranslations("tosPage");

    return (
        <>
            {/* Title */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-title mb-4">
                    {t("title")} <span className="text-highlight">{t("titleHighlight")}</span>
                </h1>
                <div className="text-secondary text-sm space-y-1">
                    <p>{t("companyName")}</p>
                    <p>{t("address")}</p>
                    <p>{t("support")} <a href="mailto:monkeys.finance.ca@gmail.com" className="text-highlight hover:underline">monkeys.finance.ca@gmail.com</a></p>
                    <p className="text-tertiary">{t("effectiveDate")}</p>
                </div>
            </div>

            {/* Content */}
            <article className="space-y-10">
                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section1.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section1.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section2.title")}</h2>
                    <p className="text-secondary leading-relaxed mb-3">{t("section2.intro")}</p>
                    <ul className="list-disc list-inside text-secondary space-y-1 ml-4">
                        <li>{t("section2.item1")}</li>
                        <li>{t("section2.item2")}</li>
                        <li>{t("section2.item3")}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section3.title")}</h2>
                    <p className="text-secondary leading-relaxed mb-3">{t("section3.intro")}</p>
                    <ul className="list-disc list-inside text-secondary space-y-1 ml-4">
                        <li>{t("section3.item1")}</li>
                        <li>{t("section3.item2")}</li>
                        <li>{t("section3.item3")}</li>
                        <li>{t("section3.item4")}</li>
                    </ul>
                    <p className="text-secondary leading-relaxed mt-3">{t("section3.outro")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section4.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section4.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section5.title")}</h2>
                    <p className="text-secondary leading-relaxed mb-3">{t("section5.content1")}</p>
                    <p className="text-secondary leading-relaxed">{t("section5.content2")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section6.title")}</h2>
                    <p className="text-secondary leading-relaxed mb-3">{t("section6.content")}</p>
                    <p className="text-secondary leading-relaxed mb-3">{t("section6.intro")}</p>
                    <ul className="list-disc list-inside text-secondary space-y-1 ml-4">
                        <li>{t("section6.item1")}</li>
                        <li>{t("section6.item2")}</li>
                        <li>{t("section6.item3")}</li>
                        <li>{t("section6.item4")}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section7.title")}</h2>
                    <p className="text-secondary leading-relaxed mb-3">{t("section7.content")}</p>
                    <p className="text-secondary leading-relaxed mb-3">{t("section7.intro")}</p>
                    <ul className="list-disc list-inside text-secondary space-y-1 ml-4">
                        <li>{t("section7.item1")}</li>
                        <li>{t("section7.item2")}</li>
                        <li>{t("section7.item3")}</li>
                    </ul>
                    <p className="text-secondary leading-relaxed mt-3">{t("section7.outro")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section8.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section8.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section9.title")}</h2>
                    <ul className="text-secondary space-y-2">
                        <li><strong className="text-white">{t("section9.freeTrial")}</strong> {t("section9.freeTrialValue")}</li>
                        <li><strong className="text-white">{t("section9.paidPlans")}</strong> {t("section9.paidPlansValue")}</li>
                        <li><strong className="text-white">{t("section9.autoRenewal")}</strong> {t("section9.autoRenewalValue")}</li>
                        <li><strong className="text-white">{t("section9.cancelAnytime")}</strong> {t("section9.cancelAnytimeValue")}</li>
                        <li><strong className="text-white">{t("section9.priceChanges")}</strong> {t("section9.priceChangesValue")}</li>
                        <li><strong className="text-white">{t("section9.taxes")}</strong> {t("section9.taxesValue")}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section10.title")}</h2>
                    <p className="text-secondary leading-relaxed mb-3">{t("section10.intro")}</p>
                    <ul className="list-disc list-inside text-secondary space-y-1 ml-4">
                        <li>{t("section10.item1")}</li>
                        <li>{t("section10.item2")}</li>
                        <li>{t("section10.item3")}</li>
                        <li>{t("section10.item4")}</li>
                        <li>{t("section10.item5")}</li>
                    </ul>
                    <p className="text-secondary leading-relaxed mt-3">{t("section10.outro")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section11.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section11.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section12.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section12.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section13.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section13.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section14.title")}</h2>
                    <p className="text-secondary leading-relaxed mb-3">{t("section14.intro")}</p>
                    <ul className="list-disc list-inside text-secondary space-y-1 ml-4">
                        <li>{t("section14.item1")}</li>
                        <li>{t("section14.item2")}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section15.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section15.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section16.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section16.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section17.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section17.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section18.title")}</h2>
                    <p className="text-secondary leading-relaxed">
                        {t("section18.content")}{" "}
                        <a href="mailto:monkeys.finance.ca@gmail.com" className="text-highlight hover:underline">
                            monkeys.finance.ca@gmail.com
                        </a>
                    </p>
                </section>
            </article>

            {/* Footer note */}
            <div className="mt-16 pt-8 border-t border-zinc-800">
                <p className="text-tertiary text-sm text-center">{t("footerNote")}</p>
            </div>
        </>
    );
}
