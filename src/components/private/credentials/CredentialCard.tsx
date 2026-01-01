"use client";

import { CustomButton } from "@/components/CustomButton";
import { ManageCredentialsSheet } from "@/components/private/credentials/ManageCredentialsSheet";
import { deleteCredentials } from "@/actions/credentials/delete";
import { getInstanceCountByExchange } from "@/actions/credentials/count-instances";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpRight, Key } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { ExchangeCredentialStatus } from "@/actions/credentials/check";
import { useTranslations } from "next-intl";

interface CredentialCardProps {
    exchangeKey: string;
    credentials: ExchangeCredentialStatus;
}

export function CredentialCard({ exchangeKey, credentials }: CredentialCardProps) {
    const t = useTranslations("credentialCard");
    const router = useRouter();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [instanceCount, setInstanceCount] = useState<number>(0);
    const [isLoadingCount, setIsLoadingCount] = useState(false);

    // Fetch instance count when dialog opens
    useEffect(() => {
        if (isDeleteOpen) {
            setIsLoadingCount(true);
            getInstanceCountByExchange(exchangeKey)
                .then(setInstanceCount)
                .finally(() => setIsLoadingCount(false));
        } else {
            // Reset states when dialog closes
            setInstanceCount(0);
            setIsLoadingCount(false);
        }
    }, [isDeleteOpen, exchangeKey]);

    const handleDelete = async () => {
        try {
            const result = await deleteCredentials({ exchange: exchangeKey });

            if (!result.ok) {
                // Map error codes to translation keys if possible, or use a generic error
                const errorKey = result.error as string;
                const errorMessage = t.has(`errors.${errorKey}`) 
                    ? t(`errors.${errorKey}`) 
                    : t("toastFailed");

                toast.error(errorMessage);
                return;
            }

            const message = result.deletedInstancesCount > 0
                ? t("toastDeletedWithInstances", { count: result.deletedInstancesCount, s: result.deletedInstancesCount > 1 ? 's' : '' })
                : t("toastDeleted");
            
            toast.success(message);
            setIsDeleteOpen(false);
            router.refresh();
        } catch (error) {
            console.error("[CredentialCard] Delete error:", error);
            toast.error(t("toastFailed"));
        }
    };

    return (
        <div key={exchangeKey} className="border border-zinc-800">
            <div className="p-6 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-bold text-primary">
                        {exchangeKey.charAt(0).toUpperCase() + exchangeKey.slice(1)}
                    </h1>
                    
                    <div className="flex md:flex-row flex-col md:items-center gap-4 text-xs text-tertiary mb-3 mt-3 md:mt-0">
                        <p>
                            {t("created")} <span className="text-secondary">{credentials.createdAt.toLocaleString('en-CA')}</span>
                        </p>
                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                        <p>
                            {t("updated")} <span className="text-secondary">{credentials.updatedAt.getTime() === credentials.createdAt.getTime() ? t("never") : credentials.updatedAt.toLocaleString('en-CA')}</span>
                        </p>
                    </div>

                    <div className="text-secondary space-y-2">
                        <p>
                            {t("securityNoteLine1")}
                        </p>
                        <p>
                            {t("securityNoteLine2")}
                        </p>
                        <p>
                            <a className="text-highlight hover:text-highlight/80 transition-colors flex items-center gap-1 w-fit" href="https://algosquid.com/" target="_blank" rel="noopener noreferrer">
                                {t("learnSecurity")}
                                <ArrowUpRight className="w-3 h-3" />
                            </a>
                        </p>
                    </div>
                </div>
                <Image
                    src={`/exchange-logo/${exchangeKey.toLowerCase()}.png`}
                    width={140}
                    height={40}
                    alt="Crypto Exchange API Key"
                    className="w-[140px] h-full brightness-0 invert hidden md:block"
                />
            </div>
            <div className="h-[1px] w-full bg-zinc-800 mt-4" />
            <div className="flex p-6 justify-end bg-[rgb(20,20,20)] gap-4">
                <ManageCredentialsSheet exchange={exchangeKey}>
                    <CustomButton isBlue={false}>{t("update")}</CustomButton>
                </ManageCredentialsSheet>
                
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogTrigger asChild>
                        <CustomButton isBlue={false}>{t("delete")}</CustomButton>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t("deleteTitle")}</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col justify-center items-center py-4 gap-4">
                            <div className="flex-none border border-zinc-800 rounded-md p-2">
                                <Key className="w-6 h-6" />
                            </div>
                            <h1 className="text-xl">{exchangeKey.toUpperCase()}</h1>
                            <p className="text-secondary text-center">
                                {t("deleteConfirm")}
                            </p>
                            {isLoadingCount ? (
                                <p className="text-tertiary text-sm">{t("loadingInstances")}</p>
                            ) : instanceCount > 0 ? (
                                <p className="text-secondary text-center">
                                    {t.rich("deleteWarning", {
                                        count: instanceCount,
                                        s: instanceCount > 1 ? 's' : '',
                                        strong: (chunks) => <strong>{chunks}</strong>
                                    })}
                                </p>
                            ) : null}
                            <p className="text-tertiary text-sm text-center">
                                {t("cannotUndo")}
                            </p>
                        </div>
                        <DialogFooter className="w-full flex justify-center">
                            <button
                                className="w-full border border-zinc-800 p-2 text-white duration-200 hover:bg-neutral-900 transition-all cursor-pointer"
                                onClick={handleDelete}>
                                {instanceCount > 0 ? t("deleteButtonWithInstances", { count: instanceCount, s: instanceCount > 1 ? 's' : '' }) : t("deleteButton")}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
