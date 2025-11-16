"use client";

import { deleteNotification } from "@/actions/notifications";
import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";

export function DeleteNotification({
    notificationId,
}: {
    notificationId: string;
}) {
    const t = useTranslations("deleteNotification");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteNotification(notificationId);
            toast.success(t("successToast"));
            setIsDeleteOpen(false);
        } catch (error: any) {
            toast.error(t("errorToast"));
            console.error("Delete notification failed:", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
                <button
                    className="col-span-1 border-r border-zinc-800 text-red-500 hover:text-red-400 duration-150 transition-colors ease-in-out cursor-pointer px-2 py-1 flex items-center justify-center"
                    aria-label="Delete notification">
                    {t("buttonLabel")}
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("dialogTitle")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center py-4 gap-4">
                    <div className="flex-none border border-zinc-800 rounded-md p-2">
                        <Bell className="w-6 h-6" />
                    </div>
                    <p className="text-secondary text-center">
                        {t("warningLine1")} <br /> {t("warningLine2")}
                    </p>
                </div>
                <DialogFooter className="w-full flex justify-center">
                    <button
                        className="w-full border border-zinc-800 p-2 text-white duration-200 hover:bg-neutral-900 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDelete}
                        disabled={deleting}
                        aria-label="Confirm deletion">
                        {deleting ? t("deletingButton") : t("confirmButton")}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
