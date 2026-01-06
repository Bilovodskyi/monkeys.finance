"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CircleHelp } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

type ErrorCode =
    | "INVALID_API_KEY"
    | "INVALID_SIGNATURE"
    | "INVALID_KEY_FORMAT"
    | "INSUFFICIENT_PERMISSIONS"
    | "IP_NOT_WHITELISTED"
    | "NETWORK_ERROR"
    | "RATE_LIMITED"
    | "EXCHANGE_ERROR";

interface HealthErrorDialogProps {
    errorCode: string | null;
    status: "NEEDS_ACTION" | "ERROR";
}

export function HealthErrorDialog({ errorCode, status }: HealthErrorDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("instances");

    if (!errorCode) return null;

    // Use the error code to get translated message, fallback to EXCHANGE_ERROR
    const validErrorCode = (
        ["INVALID_API_KEY", "INVALID_SIGNATURE", "INVALID_KEY_FORMAT", 
         "INSUFFICIENT_PERMISSIONS", "IP_NOT_WHITELISTED", "NETWORK_ERROR", 
         "RATE_LIMITED", "EXCHANGE_ERROR"] as const
    ).includes(errorCode as ErrorCode) ? errorCode : "EXCHANGE_ERROR";

    const colorClass = status === "ERROR" 
        ? "text-red-500 hover:text-red-400" 
        : "text-yellow-500 hover:text-yellow-400";

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    className={`ml-1 cursor-pointer transition-colors ${colorClass}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <CircleHelp className="w-4 h-4" />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("healthErrorDialog.title")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center py-4 gap-4">
                    <div className={`flex-none border border-zinc-800 rounded-md p-2 ${status === "ERROR" ? "text-red-500" : "text-yellow-500"}`}>
                        <CircleHelp className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl">{t("healthErrorDialog.errorDetails")}</h1>
                    <p className="text-secondary text-center break-words max-w-full">
                        {t(`healthErrorDialog.errorCodes.${validErrorCode}`)}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
