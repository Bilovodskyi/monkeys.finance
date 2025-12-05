"use client";

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Activity, Ellipsis } from "lucide-react";
import { pauseActivate } from "@/actions/instances/pauseActivate";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CreateInstanceSheet } from "./CreateInstanceSheet";
import type { InstanceRecord } from "@/types/instance";
import type { CredentialsStatus } from "@/actions/credentials/check";
import { deleteInstance } from "@/actions/instances/delete";
import { useState } from "react";

export function ActionsDropdownMenu({
    instance,
    credentialsStatus,
}: {
    instance: InstanceRecord;
    credentialsStatus: CredentialsStatus;
}) {
    const router = useRouter();
    const t = useTranslations("instances.actionsMenu");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="rounded p-1 outline-none focus:ring-0 focus:outline-none focus-visible:outline-2 focus-visible:outline-white/30 w-full h-full flex items-center justify-center cursor-pointer"
                    onClick={(e) => e.stopPropagation()}>
                    <Ellipsis className="w-4 h-4 text-tertiary group-hover/actions:text-white" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={(e) => e.stopPropagation()}>
                    <CreateInstanceSheet credentialsStatus={credentialsStatus} instance={instance}>
                        <span onClick={(e) => e.stopPropagation()}>
                            {t("items.edit")}
                        </span>
                    </CreateInstanceSheet>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={(e) => e.stopPropagation()}
                    onClick={async (e) => {
                        e.stopPropagation();
                        const result = await pauseActivate(instance.id);
                        if (result.ok) {
                            const label =
                                result.newStatus === "paused"
                                    ? t("pauseActivate.paused")
                                    : t("pauseActivate.activated");
                            toast.success(label);
                            router.refresh();
                        } else {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const key = result.error as any; // Dynamic error key from server
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const message = t(`errors.${key}` as any); // Dynamic translation key
                            toast.error(message || t("pauseActivate.failed"));
                        }
                    }}>
                    <span>{t("items.pauseActivate")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    onClick={(e) => e.stopPropagation()}>
                    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <DialogTrigger asChild>
                            <span className="text-red-500 cursor-pointer">
                                {t("items.delete")}
                            </span>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {t("delete.dialogTitle")}
                                </DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col justify-center items-center py-4 gap-4">
                                <div className="flex-none border border-zinc-800 rounded-md p-2">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h1 className="text-xl">{instance.name}</h1>
                                <p className=" text-secondary text-center">
                                    {t("delete.warningLine1")} <br />{" "}
                                    {t("delete.warningLine2")}
                                </p>
                            </div>
                            <DialogFooter className="w-full flex justify-center">
                                <button
                                    className="w-full border border-zinc-800 p-2 text-white duration-200 hover:bg-neutral-900 transition-all cursor-pointer"
                                    onClick={async () => {
                                        try {
                                            const result = await deleteInstance(
                                                instance.id
                                            );
                                            if (result.ok) {
                                                toast.success(
                                                    t("delete.deleted")
                                                );
                                                setIsDeleteOpen(false);
                                                router.refresh();
                                            } else {
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                const key = result.error as any; // Dynamic error key from server
                                                toast.error(t("delete.failed"));
                                                console.error(
                                                    "Delete instance failed:",
                                                    key
                                                );
                                            }
                                        } catch (error) {
                                            console.error(
                                                "Delete instance threw:",
                                                error
                                            );
                                            toast.error(t("delete.failed"));
                                        }
                                    }}>
                                    {t("delete.confirmButton")}
                                </button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
