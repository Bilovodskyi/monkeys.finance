import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { NotificationPreferencesTable, UserTelegramNotificationSettingsTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { CustomButton } from "@/components/CustomButton";
import { AddNotificationSheet } from "@/components/private/notifications/AddNotificationSheet";
import { DeleteNotification } from "@/components/private/notifications/DeleteNotification";
import { UnlinkTelegramAccount } from "@/components/private/notifications/UnlinkTelegramAccount";
import { getActiveSubscriptionStatusForUI } from "@/lib/entitlements";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { SYMBOL_TO_INSTRUMENT } from "@/data/constants";

const MAX_NOTIFICATIONS = 4;

export default async function notifications() {
    const locale = await getLocale();
    const t = await getTranslations("notificationsPage");
    
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const user = await db.query.UserTable.findFirst({
        where: (t, { eq }) => eq(t.clerkId, clerkId),
    });

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-1/4 mx-auto gap-2">
                <h1 className="text-lg font-bold">{t("errorTitle")}</h1>
                <p className="text-center text-tertiary">
                    {t("errorDescription")}
                </p>
            </div>
        );
    }

    const preferences = await db
        .select()
        .from(NotificationPreferencesTable)
        .where(eq(NotificationPreferencesTable.userId, user.id));

    const telegramAccount =
        await db.query.UserTelegramNotificationSettingsTable.findFirst({
            where: eq(
                UserTelegramNotificationSettingsTable.userId,
                user.id
            ),
        });

    const data = preferences.map((pref) => ({
        ...pref,
        telegramUsername: telegramAccount?.telegramUsername || null,
    }));

    const { hasActiveSubscription } = await getActiveSubscriptionStatusForUI();

    return (
        <>
            {data.length === 0 && !telegramAccount ? (
                hasActiveSubscription ? (
                    <div className="flex flex-col items-center justify-center h-full md:w-1/4 mx-auto gap-2 px-6 md:px-0">
                        <h1 className="text-lg font-bold">{t("emptyTitle")}</h1>
                        <p className="text-center text-tertiary">
                            {t("emptyDescription")}
                        </p>
                        <div className="flex gap-2 mt-6">
                            <AddNotificationSheet>
                                <CustomButton isBlue={false}>
                                    {t("emptyButton")}
                                </CustomButton>
                            </AddNotificationSheet>
                        </div>
                        <Link 
                            href={`https://docs.monkeys.finance/${locale}/notifications`} 
                            target="_blank" 
                            className="flex text-sm text-secondary hover:text-highlight hover:underline transition-colors mt-6"
                        >
                            {t("howToSetUpNotifications")}
                            <ExternalLink className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full md:w-1/4 mx-auto gap-2 px-6 md:px-0">
                        <h1 className="text-lg font-bold">
                            {t("subscriptionExpiredTitle")}
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
                        {/* TODO Account number hardcoded, with only Telegram provider, add functionality after adding more providers */}
                        <h1 className="text-lg font-bold">
                            {t("accountsTitle")}
                        </h1>
                        {data.length < MAX_NOTIFICATIONS ? (
                            hasActiveSubscription ? (
                                 <div className="flex items-center gap-4">
                                    <Link 
                                        href={`https://docs.monkeys.finance/${locale}/notifications`} 
                                        target="_blank" 
                                        className="hidden md:flex text-sm text-secondary hover:text-highlight hover:underline transition-colors"
                                    >
                                        {t("learnMoreNotifications")}
                                        <ExternalLink className="w-4 h-4 ml-1" />
                                    </Link>
                                <AddNotificationSheet>
                                    <CustomButton isBlue={false}>
                                        {t("emptyButton")}
                                    </CustomButton>
                                </AddNotificationSheet>
                                </div>
                            ) : (
                                <div>
                                    <h1>{t("subscriptionExpiredTitle")}</h1>
                                    <Link
                                        href="/plan"
                                        className="text-highlight underline">
                                        {t("manageSubscription")}
                                    </Link>
                                </div>
                            )
                        ) : (
                            <h2 className=" text-tertiary text-center">
                                {t("limitReached")}
                            </h2>
                        )}
                    </div>
                    {telegramAccount && (
                        <div className="p-4 md:p-6 flex flex-col overflow-hidden">
                            {/* Sticky Header */}
                            <div className="grid grid-cols-3 lg:grid-cols-6 border border-zinc-800 backdrop-blur-md">
                                <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary truncate">
                                    {t("tableHeaders.provider")}
                                </div>
                                <div className="col-span-1 lg:col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary truncate">
                                    {t("tableHeaders.username")}
                                </div>
                                <div className="hidden lg:block col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary truncate">
                                    {t("tableHeaders.createdAt")}
                                </div>
                                <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary truncate">
                                    {t("tableHeaders.actions")}
                                </div>
                            </div>  

                            {/* Telegram Account Row */}
                            <div className="grid grid-cols-3 lg:grid-cols-6 border border-zinc-800 border-t-0">
                                <div className="col-span-1 border-r border-zinc-800 px-4 py-3 flex items-center">
                                    <div className="bg-blue-400 py-1 px-3 rounded-full">
                                        Telegram
                                    </div>
                                </div>
                                <div className="col-span-1 lg:col-span-2 border-r border-zinc-800 px-2 lg:px-4 py-3 flex items-center">
                                    @{telegramAccount.telegramUsername}
                                </div>
                                <div className="hidden lg:block col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center">
                                    {telegramAccount.createdAt.toLocaleDateString('en-CA')}
                                </div>
                                <UnlinkTelegramAccount
                                    username={
                                        telegramAccount.telegramUsername ||
                                        "User"
                                    }
                                />
                            </div>
                        </div>
                    )}
                    {data.length > 0 && (
                        <>
                            <div className="flex items-center justify-between px-4 md:px-6 pt-4">
                                <h1 className="text-lg font-bold">
                                    {t("notificationsCount", {
                                        count: data.length,
                                        max: MAX_NOTIFICATIONS,
                                    })}
                                </h1>
                            </div>
                            <div className="p-4 md:p-6 flex flex-col overflow-hidden">
                                {/* Sticky Header */}
                                <div className="grid grid-cols-3 lg:grid-cols-10 border border-zinc-800 backdrop-blur-md">
                                    <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary truncate">
                                        {t("tableHeaders.provider")}
                                    </div>
                                    <div className="hidden lg:block col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary truncate">
                                        {t("tableHeaders.username")}
                                    </div>
                                    <div className="hidden lg:block col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary truncate">
                                        {t("tableHeaders.strategy")}
                                    </div>
                                    <div className="col-span-1 lg:col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary truncate">
                                        {t("tableHeaders.instrument")}
                                    </div>
                                    <div className="hidden lg:block col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary truncate">
                                        {t("tableHeaders.createdAt")}
                                    </div>
                                    <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary truncate">
                                        {t("tableHeaders.actions")}
                                    </div>
                                </div>

                                {/* Scrollable Content */}
                                {data.map((notification, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-3 lg:grid-cols-10 border border-zinc-800 border-t-0">
                                        <div className="col-span-1 border-r border-zinc-800 px-4 py-3 flex items-center truncate">
                                            <div className="bg-blue-400 py-1 px-3 rounded-full">
                                                {notification.provider}
                                            </div>
                                        </div>
                                        <div className="hidden lg:block col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center truncate">
                                            {notification.telegramUsername}
                                        </div>
                                        <div className="hidden lg:block col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center truncate">
                                            {notification.strategy}
                                        </div>
                                        <div className="col-span-1 lg:col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center truncate">
                                            {SYMBOL_TO_INSTRUMENT[notification.instrument] || notification.instrument}
                                        </div>
                                        <div className="hidden lg:block col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center truncate">
                                            {notification.createdAt.toLocaleDateString('en-CA')}
                                        </div>
                                        <DeleteNotification
                                            notificationId={notification.id}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
