"use client";

import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { pauseActivate } from "@/actions/instances/pauseActivate";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CreateInstanceSheet } from "./CreateInstanceSheet";
import type { InstanceRecord } from "@/types/instance";

export function ActionsDropdownMenu({ instance, apiKey }: { instance: InstanceRecord; apiKey: boolean }) {

    const router = useRouter();
    const t = useTranslations("instances.actionsMenu");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="rounded p-1 outline-none focus:ring-0 focus:outline-none focus-visible:outline-2 focus-visible:outline-white/30 w-full h-full flex items-center justify-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <Ellipsis className="w-4 h-4 text-tertiary group-hover/actions:text-white" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={(e) => e.stopPropagation()}>
                    <CreateInstanceSheet apiKey={apiKey} instance={instance}>
                        <span onClick={(e) => e.stopPropagation()}>Edit</span>
                    </CreateInstanceSheet>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={(e) => e.stopPropagation()}
                    onClick={async (e) => {
                        e.stopPropagation();
                        const result = await pauseActivate(instance.id);
                        if (result.ok) {
                            const label = result.newStatus === "paused" ? t("pauseActivate.paused") : t("pauseActivate.activated");
                            toast.success(label);
                            router.refresh();
                        } else {
                            const key = result.error as any;
                            const message = t(`errors.${key}` as any);
                            toast.error(message || t("pauseActivate.failed"));
                        }
                    }}
                >
                    <span>Pause/Activate</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}