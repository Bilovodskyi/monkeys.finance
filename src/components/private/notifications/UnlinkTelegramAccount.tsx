"use client";

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
import { Unlink } from "lucide-react";
import { unlinkTelegramAccount } from "@/actions/telegram/unlink";

export function UnlinkTelegramAccount({ username }: { username: string }) {
    const [isUnlinkOpen, setIsUnlinkOpen] = useState(false);
    const [unlinking, setUnlinking] = useState(false);

    const handleUnlink = async () => {
        try {
            setUnlinking(true);
            await unlinkTelegramAccount();
            toast.success("Telegram account unlinked successfully");
            setIsUnlinkOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to unlink account");
            console.error("Unlink Telegram account failed:", error);
        } finally {
            setUnlinking(false);
        }
    };

    return (
        <Dialog open={isUnlinkOpen} onOpenChange={setIsUnlinkOpen}>
            <DialogTrigger asChild>
                <button
                    className="col-span-1 border-r border-zinc-800 text-red-500 hover:text-red-400 duration-150 transition-colors ease-in-out cursor-pointer px-2 py-1 flex items-center justify-center"
                    aria-label="Unlink Telegram account">
                    Unlink
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Unlink Telegram account?</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center py-4 gap-4">
                    <div className="flex-none border border-zinc-800 rounded-md p-2">
                        <Unlink className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl">@{username}</h1>
                    <p className="text-secondary text-center">
                        This action cannot be undone. <br />
                        Unlinking your Telegram account will permanently delete
                        all notification preferences associated with this
                        account.
                    </p>
                </div>
                <DialogFooter className="w-full flex justify-center">
                    <button
                        className="w-full border border-zinc-800 p-2 text-white duration-200 hover:bg-neutral-900 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleUnlink}
                        disabled={unlinking}
                        aria-label="Confirm unlink">
                        {unlinking
                            ? "Unlinking..."
                            : "I want to unlink this account"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
