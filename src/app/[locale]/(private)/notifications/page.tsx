import { CustomButton } from "@/components/CustomButton";
import { AddNotificationSheet } from "@/components/private/notifications/AddNotificationSheet";
import { getNotifications } from "@/actions/notifications";
import { DeleteNotification } from "@/components/private/notifications/DeleteNotification";
import { UnlinkTelegramAccount } from "@/components/private/notifications/UnlinkTelegramAccount";
import { getTelegramAccount } from "@/actions/telegram/status";

export default async function notifications() {
    const data = await getNotifications();
    const telegramAccount = await getTelegramAccount();

    console.log(data);

    return (
        <>
            {data.length === 0 && !telegramAccount ? (
                <div className="flex flex-col items-center justify-center h-full w-1/4 mx-auto gap-2">
                    <h1 className="text-lg font-bold">Add Notification</h1>
                    <p className="text-center text-tertiary">
                        Connect your Notification provider to receive real-time
                        notifications about your trading bot's activities,
                        including trade executions, performance updates, and
                        important alerts.
                    </p>
                    <div className="flex gap-2 mt-6">
                        <AddNotificationSheet>
                            <CustomButton isBlue={false}>
                                Add Notification
                            </CustomButton>
                        </AddNotificationSheet>
                    </div>
                    <p className="text-xs text-tertiary text-center mt-6">
                        Visit Documentation
                    </p>
                </div>
            ) : (
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between px-6 pt-4">
                        {/* TODO Account number hardcoded, with only Telegram provider, add functionality after adding more providers */}
                        <h1 className="text-lg font-bold">Accounts 1/2</h1>
                        {data.length < 3 ? (
                            <AddNotificationSheet>
                                <CustomButton isBlue={false}>
                                    Add Notificaton
                                </CustomButton>
                            </AddNotificationSheet>
                        ) : (
                            <h2 className=" text-tertiary text-center">
                                Limit reached
                            </h2>
                        )}
                    </div>
                    {telegramAccount && (
                        <div className="p-6 flex flex-col overflow-hidden">
                            {/* Sticky Header */}
                            <div className="grid grid-cols-6 border border-zinc-800 backdrop-blur-md">
                                <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary">
                                    Provider
                                </div>
                                <div className="col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary">
                                    Username
                                </div>
                                <div className="col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary">
                                    Created At
                                </div>
                                <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary">
                                    Actions
                                </div>
                            </div>

                            {/* Telegram Account Row */}
                            <div className="grid grid-cols-6 border border-zinc-800 border-t-0">
                                <div className="col-span-1 border-r border-zinc-800 px-4 py-3 flex items-center">
                                    <div className="bg-blue-400 py-1 px-3 rounded-full">
                                        Telegram
                                    </div>
                                </div>
                                <div className="col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center">
                                    @{telegramAccount.telegramUsername}
                                </div>
                                <div className="col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center">
                                    {telegramAccount.createdAt.toLocaleDateString()}
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
                            <div className="flex items-center justify-between px-6 pt-4">
                                <h1 className="text-lg font-bold">
                                    Notifications {data.length}/3
                                </h1>
                            </div>
                            <div className="p-6 flex flex-col overflow-hidden">
                                {/* Sticky Header */}
                                <div className="grid grid-cols-10 border border-zinc-800 backdrop-blur-md">
                                    <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary">
                                        Provider
                                    </div>
                                    <div className="col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary">
                                        Username
                                    </div>
                                    <div className="col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary">
                                        Strategy
                                    </div>
                                    <div className="col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary">
                                        Instrument
                                    </div>
                                    <div className="col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary">
                                        Created At
                                    </div>
                                    <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary">
                                        Actions
                                    </div>
                                </div>

                                {/* Scrollable Content */}
                                {data.map((notification, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-10 border border-zinc-800 border-t-0">
                                        <div className="col-span-1 border-r border-zinc-800 px-4 py-3 flex items-center">
                                            <div className="bg-blue-400 py-1 px-3 rounded-full">
                                                Telegram
                                            </div>
                                        </div>
                                        <div className="col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center">
                                            {notification.telegramUsername}
                                        </div>
                                        <div className="col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center">
                                            {notification.strategy}
                                        </div>
                                        <div className="col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center">
                                            {notification.instrument}
                                        </div>
                                        <div className="col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center">
                                            {notification.createdAt.toLocaleDateString()}
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
