"use client";

import {
    Activity,
    BellRing,
    Fingerprint,
    GalleryVerticalEnd,
    History,
    Pyramid,
    Receipt,
    Shield,
    X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMobileMenu } from "@/context/MobileMenuContext";

type SideMenuTab =
    | "instances"
    | "history"
    | "backtest"
    | "bot"
    | "notifications"
    | "plan"
    | "how"
    | "safety";

function tabFromPath(pathname: string): SideMenuTab {
    // Remove locale prefix if present (e.g., "/en/history" -> "/history")
    const pathWithoutLocale = pathname.split("/").slice(2).join("/") || "/";
    const normalizedPath = `/${pathWithoutLocale}`;

    if (normalizedPath.startsWith("/history")) return "history";
    if (normalizedPath.startsWith("/backtest")) return "backtest";
    if (normalizedPath.startsWith("/bot")) return "bot";
    if (normalizedPath.startsWith("/notifications")) return "notifications";
    if (normalizedPath.startsWith("/plan")) return "plan";
    if (normalizedPath.startsWith("/how")) return "how";
    if (normalizedPath.startsWith("/safety")) return "safety";
    return "instances";
}

export default function SideMenu() {
    const pathname = usePathname();
    const router = useRouter();
    const activeTab = tabFromPath(pathname);
    const t = useTranslations("sideMenu");
    const { isOpen, closeMenu } = useMobileMenu();

    // Extract current locale from pathname (e.g., "/en/about" -> "en")
    const currentLocale = pathname.split("/")[1] || "en";

    const setActiveTab = (tab: SideMenuTab) => {
        router.push(`/${currentLocale}/${tab}`);
        closeMenu();
    };
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={closeMenu}
                />
            )}
            
            <div className={`group/side-menu absolute left-0 bg-background h-screen z-40 w-[320px] md:w-[71px] border-r border-zinc-800 shrink-0 md:hover:w-[270px] transition-all duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            } md:block`}>
                <div className="flex items-center justify-between px-5 border-b border-zinc-800 h-[50px] md:h-[70px]">
                    <img
                        src="/algo-logo.png"
                        alt="Main Logo"
                        className="max-w-8 max-h-8"
                    />
                    <button 
                        onClick={closeMenu}
                        className="md:hidden text-tertiary hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex flex-col px-5 gap-5 py-5 md:py-10">
                    <div
                        className={`flex min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${
                            activeTab === "instances"
                                ? "border border-zinc-800 bg-active-tab text-white"
                                : "text-secondary hover:!text-white"
                        }`}
                        onClick={() => {
                            setActiveTab("instances");
                        }}>
                        <div className="flex-none">
                            <Activity className="w-4 h-4" />
                        </div>
                        <div className="relative overflow-hidden">
                            <span className="invisible block whitespace-nowrap">
                                {" "}
                                {t("myInstances")}
                            </span>
                            <span className="absolute inset-0 block whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/side-menu:opacity-100 transition-opacity duration-150">
                                {t("myInstances")}
                            </span>
                        </div>
                    </div>
                    <div
                        className={`flex  min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${
                            activeTab === "history"
                                ? "border border-zinc-800 bg-active-tab text-white"
                                : "text-secondary hover:!text-white"
                        }`}
                        onClick={() => {
                            setActiveTab("history");
                        }}>
                        <div className="flex-none">
                            <History className="w-4 h-4" />
                        </div>
                        <div className="relative overflow-hidden">
                            <span className="invisible block whitespace-nowrap">
                                {" "}
                                {t("history")}
                            </span>
                            <span className="absolute inset-0 block whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/side-menu:opacity-100 transition-opacity duration-150">
                                {t("history")}
                            </span>
                        </div>
                    </div>
                    <div
                        className={`flex  min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${
                            activeTab === "backtest"
                                ? "border border-zinc-800 bg-active-tab text-white"
                                : "text-secondary hover:!text-white"
                        }`}
                        onClick={() => {
                            setActiveTab("backtest");
                        }}>
                        <div className="flex-none">
                            <GalleryVerticalEnd className="w-4 h-4" />
                        </div>
                        <div className="relative overflow-hidden">
                            <span className="invisible block whitespace-nowrap">
                                {" "}
                                {t("backtest")}
                            </span>
                            <span className="absolute inset-0 block whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/side-menu:opacity-100 transition-opacity duration-150">
                                {t("backtest")}
                            </span>
                        </div>
                    </div>
                    <div
                        className={`flex  min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${
                            activeTab === "bot"
                                ? "border border-zinc-800 bg-active-tab text-white"
                                : "text-secondary hover:!text-white"
                        }`}
                        onClick={() => {
                            setActiveTab("bot");
                        }}>
                        <div className="flex-none">
                            <Fingerprint className="w-4 h-4" />
                        </div>
                        <div className="relative overflow-hidden">
                            <span className="invisible block whitespace-nowrap">
                                {t("apiKeys")}
                            </span>
                            <span className="absolute inset-0 block whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/side-menu:opacity-100 transition-opacity duration-150">
                                {t("apiKeys")}
                            </span>
                        </div>
                    </div>
                    <div
                        className={`flex  min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${
                            activeTab === "notifications"
                                ? "border border-zinc-800 bg-active-tab text-white"
                                : "text-secondary hover:!text-white"
                        }`}
                        onClick={() => {
                            setActiveTab("notifications");
                        }}>
                        <div className="flex-none">
                            <BellRing className="w-4 h-4" />
                        </div>
                        <div className="relative overflow-hidden">
                            <span className="invisible block whitespace-nowrap">
                                {t("notifications")}
                            </span>
                            <span className="absolute inset-0 block whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/side-menu:opacity-100 transition-opacity duration-150">
                                {t("notifications")}
                            </span>
                        </div>
                    </div>

                    <div
                        className={`flex  min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${
                            activeTab === "plan"
                                ? "border border-zinc-800 bg-active-tab text-white"
                                : "text-secondary hover:!text-white"
                        }`}
                        onClick={() => {
                            setActiveTab("plan");
                        }}>
                        <div className="flex-none">
                            <Receipt className="w-4 h-4" />
                        </div>
                        <div className="relative overflow-hidden">
                            <span className="invisible block whitespace-nowrap">
                                {t("managePlan")}
                            </span>
                            <span className="absolute inset-0 block whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/side-menu:opacity-100 transition-opacity duration-150">
                                {t("plan")}
                            </span>
                        </div>
                    </div>
                    <div
                        className={`flex min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${
                            activeTab === "safety"
                                ? "border border-zinc-800 bg-active-tab text-white"
                                : "text-secondary hover:!text-white"
                        }`}
                        onClick={() => setActiveTab("safety")}>
                        <div className="flex-none">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div className="relative overflow-hidden">
                            <span className="invisible block whitespace-nowrap">
                                {t("safety")}
                            </span>
                            <span className=" absolute inset-0 block whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/side-menu:opacity-100 transition-opacity duration-150">
                                {t("safety")}
                            </span>
                        </div>
                    </div>

                    <div
                        className={`flex min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${
                            activeTab === "how"
                                ? "border border-zinc-800 bg-active-tab text-white"
                                : "text-secondary hover:!text-white"
                        }`}
                        >
                        <div className="flex-none">
                            <Pyramid className="w-4 h-4" />
                        </div>
                        <div className="relative overflow-hidden">
                            <span className="invisible block whitespace-nowrap">
                                {t("documentation")}
                            </span>
                            <span className=" absolute inset-0 block whitespace-nowrap opacity-100 md:opacity-0 md:group-hover/side-menu:opacity-100 transition-opacity duration-150">
                                {t("documentation")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
