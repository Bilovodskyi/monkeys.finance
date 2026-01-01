import { CustomButton } from "../CustomButton";
import { SignUpButton } from "@clerk/nextjs";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export default async function Footer() {
    const locale = await getLocale();
    const t = await getTranslations("footer");

    return (
        <footer className="flex flex-col px-4 lg:px-24 pt-32 gap-12">
            <div className="flex flex-col lg:w-1/3 h-full justify-center">
                <h1 className="text-2xl lg:text-4xl font-title mb-6">
                    {t("title")} <span className="text-highlight">{t("titleHighlight")}</span> {t("titleEnd")}
                </h1>
                <p className="text-secondary mb-8">
                    {t("description")}
                </p>
                <div className="flex gap-4 items-center">
                    <SignUpButton><CustomButton isBlue={true}>{t("startTradingButton")}</CustomButton></SignUpButton>
                    <Link href={`https://docs.monkeys.finance/${locale}/`} target="_blank"><CustomButton isBlue={false}>{t("documentationButton")}</CustomButton></Link>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-between w-full border-t border-zinc-800 lg:py-2 py-6">
                <div className="flex flex-col items-center gap-8">
                    <Image src="/monkeys-logo.svg" alt="Monkeys Logo" width={96} height={24} className="w-24" />
                    <p className="text-secondary ">{t("tagline")}</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 items-start md:justify-items-end gap-12 lg:gap-24 py-12 w-full lg:w-1/2">

                    <ul className="col-span-1 flex flex-col items-start gap-4">
                        <li className="text-secondary ">{t("products.title")}</li>
                        <li><Link href="https://ai-investor-bice.vercel.app" target="_blank" className=" hover:underline">{t("products.aiInvestor")}</Link></li>
                        <li><Link href="https://trade-journal-v2.vercel.app" target="_blank" className=" hover:underline">{t("products.aiJournal")}</Link></li>
                        <li className="flex items-center gap-2">
                            <span className=" hover:underline">{t("products.competition")}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-highlight/20 text-highlight rounded-full font-medium">Soon</span>
                        </li>
                    </ul>
                    <ul className="col-span-1 flex flex-col items-start gap-4">
                        <li className="text-secondary ">{t("tools.title")}</li>
                        <li><Link href={`https://docs.monkeys.finance/${locale}/algorithms`} target="_blank" className=" hover:underline">{t("tools.algorithms")}</Link></li>
                        <li><Link href={`https://docs.monkeys.finance/${locale}/backtest`} target="_blank" className=" hover:underline">{t("tools.backtesting")}</Link></li>
                        <li><Link href={`https://docs.monkeys.finance/${locale}/ml`} target="_blank" className=" hover:underline">{t("tools.ml")}</Link></li>
                        <li><Link href={`https://docs.monkeys.finance/${locale}/instances`} target="_blank" className=" hover:underline">{t("tools.bot")}</Link></li>
                    </ul>
                    <ul className="col-span-1 flex flex-col items-start gap-4">
                        <li className="text-secondary ">{t("legal.title")}</li>
                        <li><Link href="/tos" className=" hover:underline">{t("legal.tos")}</Link></li>
                        <li><Link href="/privacy" className=" hover:underline">{t("legal.privacy")}</Link></li>
                        <li><Link href="/disclosures" className=" hover:underline">{t("legal.disclosures")}</Link></li>
                    </ul>
                    <ul className="col-span-1 flex flex-col items-start gap-4">
                        <li className="text-secondary ">{t("company.title")}</li>
                        <li><Link href="/about" className=" hover:underline">{t("company.about")}</Link></li>
                        {/* <li><Link href="/" className=" hover:underline">{t("company.careers")}</Link></li> */}
                        <li><Link href="https://github.com/Bilovodskyi" target="_blank" className=" hover:underline">{t("company.contact")}</Link></li>

                    </ul>

                </div>
            </div>
            <div className="flex items-center justify-between w-full border-t border-zinc-800 pt-2 pb-12">
                <p className="text-secondary ">{t("copyright")}</p>
                <p className="flex items-center gap-2 text-green-500  "><span className="h-2 w-2 bg-green-500 animate-pulse"></span> {t("systemStatus")}</p>
            </div>

        </footer>
    );
}