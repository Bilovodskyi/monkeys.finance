import { getTranslations } from "next-intl/server";

export default async function Privacy() {
    const t = await getTranslations("privacyPage");

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
                    <p>{t("contact")} <a href="mailto:monkeys.finance.ca@gmail.com" className="text-highlight hover:underline">monkeys.finance.ca@gmail.com</a></p>
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
                    <ul className="text-secondary space-y-2 ml-4">
                        <li><strong className="text-white">{t("section2.accountInfo")}</strong> {t("section2.accountInfoValue")}</li>
                        <li><strong className="text-white">{t("section2.usageData")}</strong> {t("section2.usageDataValue")}</li>
                        <li><strong className="text-white">{t("section2.tradingData")}</strong> {t("section2.tradingDataValue")}</li>
                        <li><strong className="text-white">{t("section2.apiCredentials")}</strong> {t("section2.apiCredentialsValue")}</li>
                        <li><strong className="text-white">{t("section2.notificationsData")}</strong> {t("section2.notificationsDataValue")}</li>
                        <li><strong className="text-white">{t("section2.paymentInfo")}</strong> {t("section2.paymentInfoValue")}</li>
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
                        <li>{t("section3.item5")}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section4.title")}</h2>
                    <p className="text-secondary leading-relaxed mb-3">{t("section4.intro")}</p>
                    <ul className="text-secondary space-y-2 ml-4">
                        <li><strong className="text-white">{t("section4.authentication")}</strong> {t("section4.authenticationValue")}</li>
                        <li><strong className="text-white">{t("section4.database")}</strong> {t("section4.databaseValue")}</li>
                        <li><strong className="text-white">{t("section4.payments")}</strong> {t("section4.paymentsValue")}</li>
                        <li><strong className="text-white">{t("section4.notifications")}</strong> {t("section4.notificationsValue")}</li>
                    </ul>
                    <p className="text-secondary leading-relaxed mt-3">{t("section4.outro")}</p>
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
                        <a href="mailto:monkeys.finance.ca@gmail.com" className="text-highlight hover:underline">
                            monkeys.finance.ca@gmail.com
                        </a>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section8.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section8.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section9.title")}</h2>
                    <p className="text-secondary leading-relaxed">{t("section9.content")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-title text-white mb-3">{t("section10.title")}</h2>
                    <p className="text-secondary leading-relaxed">
                        {t("section10.content")}{" "}
                        <a href="mailto:monkeys.finance.ca@gmail.com" className="text-highlight hover:underline">
                            monkeys.finance.ca@gmail.com
                        </a>
                    </p>
                </section>
            </article>
        </>
    );
}
