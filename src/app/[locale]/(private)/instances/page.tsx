import { getInstances } from "@/actions/instances/get";
import { getTranslations } from "next-intl/server";
import { CreateInstanceSheet } from "@/components/private/instances/CreateInstanceSheet";
import { ActionsDropdownMenu } from "@/components/private/instances/ActionsDropdownMenu";
import { CustomButton } from "@/components/CustomButton";

export default async function Instances() {
    const t = await getTranslations("instances");
    const instances = await getInstances();
    const apiKey = true; // TODO: replace with real check when available

    return (
        <>
            {instances.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full w-1/4 mx-auto gap-2">
                    <h1 className="text-lg font-bold">{t("addFirstInstance")}</h1>
                    <p className="text-center text-sm text-tertiary">
                        {t("instanceDescription")}
                    </p>
                    <div className="flex gap-2 mt-6">
                        <CreateInstanceSheet apiKey={apiKey}>
                            <CustomButton isBlue={false}>{t("addInstance")}</CustomButton>
                        </CreateInstanceSheet>
                    </div>
                    <p className="text-xs text-tertiary text-center mt-6">{t("visitDocumentation")}</p>
                </div>
            ) : (
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h1 className="text-lg font-bold">{t("instances")} {instances.length}/3</h1>
                        <CreateInstanceSheet apiKey={apiKey}>
                            <CustomButton isBlue={false}>{t("addInstance")}</CustomButton>
                        </CreateInstanceSheet>
                    </div>
                    <div className="flex-1 p-6 flex flex-col overflow-hidden">
                        {/* Sticky Header */}
                        <div className="grid grid-cols-11 border border-zinc-800 backdrop-blur-md">
                            <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">Status</div>
                            <div className="col-span-3 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">Name</div>
                            <div className="col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">Strategy</div>
                            <div className="col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">Instrument</div>
                            <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">Exchange</div>
                            <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">Created At</div>
                            <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm">Actions</div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {instances.map((instance, index) => (
                                <CreateInstanceSheet key={index} apiKey={apiKey} instance={instance}>
                                    <div className="grid grid-cols-11 border border-zinc-800 border-t-0 hover:bg-neutral-900 transition-all duration-150 ease-in-out cursor-pointer">
                                        <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm flex items-center">
                                            {instance.status === "active" ? (
                                                <span className="bg-green-500/30 px-2 py-1 rounded-full">Active</span>
                                            ) : (
                                                <span className="bg-yellow-500/30 px-2 py-1 rounded-full">Paused</span>
                                            )}
                                        </div>
                                        <div className="col-span-3 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm flex items-center">{instance.name}</div>
                                        <div className="col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm flex items-center">{instance.strategy}</div>
                                        <div className="col-span-2 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm flex items-center">{instance.instrument}</div>
                                        <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm flex items-center capitalize">{instance.exchange}</div>
                                        <div className="col-span-1 border-r border-zinc-800 px-4 py-3 text-tertiary text-sm flex items-center">{instance?.createdAt?.toLocaleDateString()}</div>
                                        <div className="group/actions col-span-1 border-r border-zinc-800 px-2 py-1 text-tertiary text-sm flex items-center justify-center">
                                            <ActionsDropdownMenu instance={instance} apiKey={apiKey} />
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