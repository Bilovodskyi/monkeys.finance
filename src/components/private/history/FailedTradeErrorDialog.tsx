"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export function FailedTradeErrorDialog({ errorMessage }: { errorMessage: string | null }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!errorMessage) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    className="ml-2 cursor-pointer text-red-500 hover:text-red-400 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                >
                    <AlertTriangle className="w-4 h-4" />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Trade Failed</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center py-4 gap-4">
                    <div className="flex-none border border-zinc-800 rounded-md p-2">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <h1 className="text-xl">Error Details</h1>
                    <p className="text-secondary text-center break-words max-w-full">
                        {errorMessage}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
