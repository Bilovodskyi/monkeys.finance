"use client";

import { CustomButton } from "@/components/CustomButton";
import { ManageCredentialsSheet } from "@/components/private/credentials/ManageCredentialsSheet";
import { deleteCredentials } from "@/actions/credentials/delete";
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
import { useState } from "react";
import type { ExchangeCredentialStatus } from "@/actions/credentials/check";

interface CredentialCardProps {
    exchangeKey: string;
    credentials: ExchangeCredentialStatus;
}

export function CredentialCard({ exchangeKey, credentials }: CredentialCardProps) {
    const router = useRouter();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleDelete = async () => {
        try {
            const result = await deleteCredentials({ exchange: exchangeKey });

            if (!result.ok) {
                const errorMessages = {
                    unauthorized: "Unauthorized",
                    userNotFound: "User not found",
                    invalidInput: "Invalid input",
                    notFound: "Credentials not found",
                    deleteFailed: "Failed to delete credentials",
                    unexpected: "Unexpected error",
                };

                toast.error(errorMessages[result.error] || "Failed to delete credentials");
                return;
            }

            toast.success("Credentials deleted successfully");
            setIsDeleteOpen(false);
            router.refresh();
        } catch (error) {
            console.error("[CredentialCard] Delete error:", error);
            toast.error("Failed to delete credentials");
        }
    };

    return (
        <div key={exchangeKey} className="border border-zinc-800">
            <div className="p-6 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-bold text-primary">
                        {exchangeKey.charAt(0).toUpperCase() + exchangeKey.slice(1)}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-xs text-tertiary mb-3">
                        <p>
                            Created: <span className="text-secondary">{credentials.createdAt.toLocaleString()}</span>
                        </p>
                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                        <p>
                            Updated: <span className="text-secondary">{credentials.updatedAt.getTime() === credentials.createdAt.getTime() ? "Never" : credentials.updatedAt.toLocaleString()}</span>
                        </p>
                    </div>

                    <div className="text-secondary space-y-2">
                        <p>
                            For security, your API credentials are encrypted and hidden. <br /> You can only update or delete them.
                        </p>
                        <p>
                            <a className="text-highlight hover:text-highlight/80 transition-colors flex items-center gap-1 w-fit" href="https://algosquid.com/" target="_blank" rel="noopener noreferrer">
                                Learn about our security
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
                    className="w-[140px] h-full brightness-0 invert"
                />
            </div>
            <div className="h-[1px] w-full bg-zinc-800 mt-4" />
            <div className="flex p-6 justify-end bg-[rgb(20,20,20)] gap-4">
                <ManageCredentialsSheet exchange={exchangeKey}>
                    <CustomButton isBlue={false}>Update</CustomButton>
                </ManageCredentialsSheet>
                
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogTrigger asChild>
                        <CustomButton isBlue={false}>Delete</CustomButton>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Credentials</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col justify-center items-center py-4 gap-4">
                            <div className="flex-none border border-zinc-800 rounded-md p-2">
                                <Key className="w-6 h-6" />
                            </div>
                            <h1 className="text-xl">{exchangeKey.toUpperCase()}</h1>
                            <p className="text-secondary text-center">
                                Are you sure you want to delete these credentials? <br /> This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="w-full flex justify-center">
                            <button
                                className="w-full border border-zinc-800 p-2 text-white duration-200 hover:bg-neutral-900 transition-all cursor-pointer"
                                onClick={handleDelete}>
                                Delete Credentials
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
