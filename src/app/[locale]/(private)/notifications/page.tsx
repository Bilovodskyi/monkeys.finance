import { CustomButton } from "@/components/CustomButton";
import { Dot } from "lucide-react";
import { AddNotificationSheet } from "@/components/private/instances/AddNotificationSheet";

export default async function notifications() {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-full w-1/4 mx-auto gap-2">
                <h1 className="text-lg font-bold">Add Notification</h1>
                <p className="text-center text-tertiary">
                    Connect your Notification provider to receive real-time
                    notifications about your trading bot's activities, including
                    trade executions, performance updates, and important alerts.
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
            <div className="h-full flex flex-col">
                {/* <div className="flex items-center justify-between px-6 pt-4">
                        <h1 className="text-lg font-bold">{t("instances")} {instances.length}/3</h1>
                        {instances.length < 3 ? <CreateInstanceSheet apiKey={apiKey}>
                            <CustomButton isBlue={false}>{t("addInstance")}</CustomButton>
                        </CreateInstanceSheet> : (
                            <h2 className=" text-tertiary text-center">{t("limitBanner.line1")} <br /> {t("limitBanner.line2")}</h2>
                        )}
                    </div> */}
                <div className="flex-1 p-6 flex flex-col overflow-hidden">
                    {/* Sticky Header */}
                    <div className="grid grid-cols-11 border border-zinc-800 backdrop-blur-md">
                        <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary">
                            Provider
                        </div>
                        <div className="col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary">
                            Strategy
                        </div>
                        <div className="col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary">
                            Instrument
                        </div>
                        <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary">
                            Created At
                        </div>
                        <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary">
                            Actions
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                        <div className="grid grid-cols-11 border border-zinc-800 border-t-0 hover:bg-neutral-900 transition-all duration-150 ease-in-out cursor-pointer">
                            <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary flex items-center">
                                Telegram
                            </div>
                            <div className="col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center">
                                Supertrend
                            </div>
                            <div className="col-span-2 border-r border-zinc-800 px-4 py-3 flex items-center">
                                Bitcoin
                            </div>
                            <div className="col-span-1 border-r border-zinc-800 px-4 py-3 flex items-center">
                                2025-10-24
                            </div>
                            <div className="group/actions col-span-1 border-r border-zinc-800 px-2 py-1 flex items-center justify-center">
                                <Dot />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
