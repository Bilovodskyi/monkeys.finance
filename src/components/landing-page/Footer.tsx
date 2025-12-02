import { CustomButton } from "../CustomButton";
import { SignUpButton } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
    const t = await getTranslations("footer");

    return (
        <footer className="flex flex-col px-6 lg:px-24 pt-32 gap-12">
            <div className="flex flex-col lg:w-1/3 h-full justify-center">
                <h1 className="text-2xl lg:text-4xl font-title mb-6">
                    {t("title")} <span className="text-highlight">{t("titleHighlight")}</span> {t("titleEnd")}
                </h1>
                <p className="text-secondary mb-8">
                    {t("description")}
                </p>
                <div className="flex gap-4 items-center">
                    <SignUpButton><CustomButton isBlue={true}>{t("startTradingButton")}</CustomButton></SignUpButton>
                    <CustomButton isBlue={false}>{t("documentationButton")}</CustomButton>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-between w-full border-t border-zinc-800 lg:py-2 py-6">
                <div className="flex flex-col items-center gap-8">
                    <img src="/main-logo.png" alt="Main Logo" className="w-24" />
                    <p className="text-secondary ">{t("tagline")}</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 items-start md:justify-items-end gap-12 lg:gap-24 py-12 w-full lg:w-1/2">

                    <ul className="col-span-1 flex flex-col items-start gap-4">
                        <li><a href="/" className="text-secondary ">{t("products.title")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("products.aiInvestor")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("products.aiJournal")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("products.competition")}</a></li>
                    </ul>
                    <ul className="col-span-1 flex flex-col items-start gap-4">
                        <li><a href="/" className="text-secondary ">{t("tools.title")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("tools.algorithms")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("tools.backtesting")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("tools.ml")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("tools.bot")}</a></li>
                    </ul>
                    <ul className="col-span-1 flex flex-col items-start gap-4">
                        <li><a href="/" className="text-secondary ">{t("socials.title")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("socials.telegram")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("socials.linkedin")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("socials.github")}</a></li>
                    </ul>
                    <ul className="col-span-1 flex flex-col items-start gap-4">
                        <li><a href="/" className="text-secondary ">{t("company.title")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("company.about")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("company.careers")}</a></li>
                        <li><a href="/" className=" hover:underline">{t("company.contact")}</a></li>

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