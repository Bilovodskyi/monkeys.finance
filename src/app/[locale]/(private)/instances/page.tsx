"use client";

import { useInstancesData } from "@/hooks/useInstancesData";
import { useLocale, useTranslations } from "next-intl";
import { CreateInstanceSheet } from "@/components/private/instances/CreateInstanceSheet";
import { ActionsDropdownMenu } from "@/components/private/instances/ActionsDropdownMenu";
import { CustomButton } from "@/components/CustomButton";
import Link from "next/link";
import MetaballsLoader from "@/components/Loader";

export default function Instances() {
    const t = useTranslations("instances");
    const locale = useLocale();
    
    // Custom hook handles all data fetching logic
    const { 
        user, 
        instances, 
        credentialsStatus, 
        hasActiveSubscription, 
        isLoading, 
        error,
        refetch 
    } = useInstancesData();

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full md:w-1/4 mx-auto gap-2">
                <MetaballsLoader className="min-h-[200px]" />
                <h1 className="text-lg font-bold">
                    {t("loadingTitle")}
                </h1>
                <p className="text-center text-tertiary">
                    {t("loadingDescription")}
                </p>
            </div>
        );
    }

    // Error state
    if (error || !user || !credentialsStatus) {
        return (
            <div className="flex flex-col items-center justify-center h-full md:w-1/4 mx-auto gap-2">
                <h1 className="text-lg font-bold text-red-500">
                    {t("errorTitle")}
                </h1>
                <p className="text-center text-tertiary">
                    {t("errorDescription")}
                </p>
                <CustomButton isBlue={false} onClick={() => window.location.reload()}>
                    {t("retry")}
                </CustomButton>
            </div>
        );
    }

    // Main content
    return (
        <>
            {instances.length === 0 ? (
                hasActiveSubscription ? (
                    <div className="flex flex-col items-center justify-center h-full md:w-1/4 mx-auto gap-2 px-6 md:px-0">
                        <h1 className="text-lg font-bold">
                            {t("addFirstInstance")}
                        </h1>
                        <p className="text-center text-tertiary">
                            {t("instanceDescription")}
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                             <Link 
                                href={`https://docs.monkeys.finance/${locale}/instances`} 
                                target="_blank" 
                                className="text-sm text-secondary hover:text-highlight hover:underline transition-colors"
                            >
                                {t("whatIsInstance")}
                            </Link>
                            <CreateInstanceSheet credentialsStatus={credentialsStatus} onSuccess={refetch}>
                                <CustomButton isBlue={false}>
                                    {t("addInstance")}
                                </CustomButton>
                            </CreateInstanceSheet>
                           
                        </div>
                        <p className="text-xs text-tertiary text-center mt-6">
                            {t("visitDocumentation")}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full md:w-1/4 mx-auto gap-2 px-6 md:px-0">
                        <h1 className="text-lg font-bold">
                            {t("subscriptionExpired")}
                        </h1>
                        <p className="text-center text-tertiary">
                            {t("subscriptionExpiredDescription")}
                        </p>
                        <div className="flex gap-2 mt-6">
                            <Link href="/plan">
                                <CustomButton isBlue={false}>
                                    {t("manageSubscription")}
                                </CustomButton>
                            </Link>
                        </div>
                    </div>
                )
            ) : (
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between px-4 md:px-6 pt-4">
                        <h1 className="text-lg font-bold">
                            {t("instances")} {instances.length}/3
                        </h1>
                        {instances.length < 3 ? (
                            hasActiveSubscription ? (
                                <div className="flex items-center gap-4">
                                    <Link 
                                        href={`https://docs.monkeys.finance/${locale}/instances`} 
                                        target="_blank" 
                                        className="text-sm text-secondary hover:text-highlight hover:underline transition-colors"
                                    >
                                        {t("whatIsInstance")}
                                    </Link>
                                    <CreateInstanceSheet credentialsStatus={credentialsStatus} onSuccess={refetch}>
                                        <CustomButton isBlue={false}>
                                            {t("addInstance")}
                                        </CustomButton>
                                    </CreateInstanceSheet>
                                    
                                </div>
                            ) : (
                                <div>
                                    <h1>{t("subscriptionExpired")}</h1>
                                    <Link
                                        href="/plan"
                                        className="text-highlight underline">
                                        {t("manageSubscription")}
                                    </Link>
                                </div>
                            )
                        ) : (
                            <h2 className=" text-tertiary text-center">
                                {t("limitBanner.line1")} <br />{" "}
                                {t("limitBanner.line2")}
                            </h2>
                        )}
                    </div>
                    <div className="flex-1 p-4 md:p-6 flex flex-col overflow-hidden">
                        {/* Sticky Header */}
                        <div className="grid grid-cols-4 md:grid-cols-8 xl:grid-cols-11 border border-zinc-800 backdrop-blur-md">
                            <div className="col-span-1 border-r border-zinc-800 px-1 lg:px-4 py-3 text-tertiary text-center md:text-left">
                                {t("tableHeaders.status")}
                            </div>
                            <div className="col-span-3 border-r border-zinc-800 px-4 py-3 hidden xl:block text-tertiary">
                                {t("tableHeaders.name")}
                            </div>
                            <div className="col-span-1 border-r border-zinc-800 px-4 py-3 hidden md:block text-tertiary">
                                {t("tableHeaders.strategy")}
                            </div>
                            <div className="col-span-1 border-r border-zinc-800 px-4 py-3 hidden md:block text-tertiary">
                                {t("tableHeaders.account")}
                            </div>
                            <div className="col-span-1 border-r border-zinc-800 px-1 lg:px-4 py-3 text-tertiary text-center md:text-left">
                                {t("tableHeaders.instrument")}
                            </div>
                            <div className="col-span-1 border-r border-zinc-800 px-4 py-3 hidden md:block text-tertiary">
                                {t("tableHeaders.positionSizeUSDT")}
                            </div>
                            <div className="col-span-1 border-r border-zinc-800 px-1 lg:px-4 py-3 text-tertiary text-center md:text-left">
                                {t("tableHeaders.exchange")}
                            </div>
                            <div className="col-span-1 border-r border-zinc-800 px-4 py-3 hidden md:block text-tertiary">
                                {t("tableHeaders.createdAt")}
                            </div>
                            <div className="col-span-1 border-r border-zinc-800 px-1 lg:px-4 py-3 text-tertiary text-center md:text-left">
                                {t("tableHeaders.actions")}
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {instances.map((instance, index) => (
                                <CreateInstanceSheet
                                    key={index}
                                    credentialsStatus={credentialsStatus}
                                    instance={instance}
                                    onSuccess={refetch}>
                                    <div className="grid grid-cols-4 md:grid-cols-8 xl:grid-cols-11 border border-zinc-800 border-t-0 hover:bg-neutral-900 transition-all duration-150 ease-in-out cursor-pointer">
                                        <div className="col-span-1 border-r border-zinc-800 px-1 lg:px-4 py-3 flex items-center justify-center md:justify-start text-xs">
                                            {instance.status === "active" ? (
                                                <span className="bg-green-500/10 text-green-500 px-2.5 py-0.5 rounded-full">
                                                    {t("statusActive")}
                                                </span>
                                            ) : (
                                                <span className="bg-yellow-500/10 text-yellow-500 px-2.5 py-0.5 rounded-full">
                                                    {t("statusPaused")}
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-span-3 border-r border-zinc-800 px-4 py-3 hidden xl:flex items-center">
                                            {instance.name}
                                        </div>
                                        <div className="col-span-1 border-r border-zinc-800 px-4 py-3 hidden md:flex items-center">
                                            {instance.strategy}
                                        </div>
                                        <div className="col-span-1 border-r border-zinc-800 px-4 py-3 hidden md:flex items-center">
                                            {instance.isTestnet ? t("accountTypeDemo") : t("accountTypeReal")}
                                        </div>
                                        <div className="col-span-1 border-r border-zinc-800 px-1 lg:px-4 py-3 flex items-center justify-center md:justify-start">
                                            {instance.instrument === "Binance Coin" ? "BNB" : instance.instrument}
                                        </div>
                                        <div className="col-span-1 border-r border-zinc-800 px-4 py-3 hidden md:flex items-center">
                                            {instance.positionSizeUSDT} <span className="text-xs ml-1 pt-0.5">USDC</span>
                                        </div>
                                        <div className="col-span-1 border-r border-zinc-800 px-1 lg:px-4 py-3 flex items-center justify-center md:justify-start capitalize">
                                            {instance.exchange}
                                        </div>
                                        <div className="col-span-1 border-r border-zinc-800 px-4 py-3 hidden md:flex items-center">
                                            {instance.createdAt.toLocaleDateString('en-CA')}
                                        </div>
                                        <div className="group/actions col-span-1 border-r border-zinc-800 px-2 py-1 flex items-center justify-center">
                                            <ActionsDropdownMenu
                                                instance={instance}
                                                credentialsStatus={credentialsStatus}
                                                onSuccess={refetch}
                                            />
                                        </div>
                                    </div>
                                </CreateInstanceSheet>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
