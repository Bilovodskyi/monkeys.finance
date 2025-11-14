"use client";

import { CustomButton } from "@/components/CustomButton";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { instruments, providers, strategies } from "@/data/constants";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { checkTelegramLinked } from "@/actions/telegram/status";

interface AddNotificationSheetProps {
    children: ReactNode;
    notification?: any;
}

export function AddNotificationSheet({
    children,
    notification,
}: AddNotificationSheetProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [checkingTelegram, setCheckingTelegram] = useState(false);
    const [isTelegramLinked, setIsTelegramLinked] = useState(false);

    const isEditMode = !!notification;

    const FormSchema = z.object({
        provider: z.string().min(1, "This field is required"),
        strategy: z.string().min(1, "This field is required"),
        instrument: z.string().min(1, "This field is required"),
    });

    type FormValues = z.infer<typeof FormSchema>;
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            provider: notification?.provider || "",
            strategy: notification?.strategy || "",
            instrument: notification?.instrument || "",
        },
    });

    const selectedProvider = form.watch("provider");
    const selectedStrategy = form.watch("strategy");
    const selectedInstrument = form.watch("instrument");

    // Reset form when notification changes
    useEffect(() => {
        if (notification) {
            form.reset({
                provider: notification.provider,
                strategy: notification.strategy,
                instrument: notification.instrument,
            });
        }
    }, [notification, form]);

    const clearForm = () => {
        form.reset({ provider: "", strategy: "", instrument: "" });
    };

    async function handleFormSubmit(values: FormValues) {
        try {
            toast.loading("Creating notification...");

            const { createNotification } = await import(
                "@/actions/notifications"
            );

            await createNotification({
                provider: values.provider,
                instrument: values.instrument,
                strategy: values.strategy,
            });

            toast.dismiss();
            toast.success("Notification created successfully!");
            setOpen(false);
            clearForm();
            router.refresh();
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || "Failed to create notification");
        }
    }

    const handleProviderChange = (value: string) => {
        form.setValue("provider", value);
    };

    // Check Telegram status when provider changes to Telegram
    useEffect(() => {
        if (selectedProvider === "Telegram" && open) {
            setCheckingTelegram(true);
            checkTelegramLinked()
                .then(setIsTelegramLinked)
                .finally(() => setCheckingTelegram(false));
        }
    }, [selectedProvider, open]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-xl font-title">
                        {isEditMode ? "Edit Notification" : "Add Notification"}
                    </SheetTitle>
                    <SheetDescription className=" text-tertiary mt-4">
                        Configure your notification settings to receive trading
                        signals.
                    </SheetDescription>
                </SheetHeader>

                <form
                    className="mt-6 space-y-8 relative flex-1"
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    ref={formRef}>
                    {/* Provider Field */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className=" text-tertiary">Provider</label>
                            {form.formState.errors.provider && (
                                <div className="text-xs text-red-500">
                                    {String(
                                        form.formState.errors.provider.message
                                    )}
                                </div>
                            )}
                        </div>
                        <Controller
                            control={form.control}
                            name="provider"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={handleProviderChange}>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder="Select provider"
                                            className="text-tertiary"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {providers.map((provider) => (
                                            <SelectItem
                                                key={provider}
                                                value={provider}>
                                                {provider}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Show Telegram Instructions OR Preferences Form */}
                    {selectedProvider === "Telegram" &&
                        !isTelegramLinked &&
                        !checkingTelegram && (
                            <div className="px-2 py-3 space-y-2">
                                <p className="text-sm text-tertiary">
                                    Step 1. Open your Telegram app
                                </p>
                                <p className="text-sm text-tertiary">
                                    Step 2. Search for{" "}
                                    <span className="text-white font-mono">
                                        @algo_squid_bot
                                    </span>{" "}
                                </p>
                                <p className="text-sm text-tertiary">
                                    Step 3. Send{" "}
                                    <span className="text-white font-mono">
                                        /start
                                    </span>{" "}
                                </p>
                                <p className="text-sm text-tertiary">
                                    Step 4. You will receive unique link that
                                    connects your telegram account to our
                                    notification system.
                                </p>
                            </div>
                        )}

                    {/* Show linked status */}
                    {selectedProvider === "Telegram" &&
                        isTelegramLinked &&
                        !checkingTelegram && (
                            <div className="px-2 py-3">
                                <p className="text-sm">
                                    ✅ Telegram account linked
                                </p>
                            </div>
                        )}

                    {/* Loading state */}
                    {selectedProvider === "Telegram" && checkingTelegram && (
                        <div className="px-2 py-3">
                            <p className="text-sm text-tertiary">
                                Checking Telegram status...
                            </p>
                        </div>
                    )}

                    {/* Strategy Field */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className=" text-tertiary">Strategy</label>
                            {form.formState.errors.strategy && (
                                <div className="text-xs text-red-500">
                                    {String(
                                        form.formState.errors.strategy.message
                                    )}
                                </div>
                            )}
                        </div>
                        <Controller
                            control={form.control}
                            name="strategy"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder="Select strategy"
                                            className="text-tertiary"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {strategies.map((strategy) => (
                                            <SelectItem
                                                key={strategy}
                                                value={strategy}>
                                                {strategy}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Instrument Field */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className=" text-tertiary">Instrument</label>
                            {form.formState.errors.instrument && (
                                <div className="text-xs text-red-500">
                                    {String(
                                        form.formState.errors.instrument.message
                                    )}
                                </div>
                            )}
                        </div>
                        <Controller
                            control={form.control}
                            name="instrument"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder="Select instrument"
                                            className="text-tertiary"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {instruments.map((instrument) => (
                                            <SelectItem
                                                key={instrument}
                                                value={instrument}>
                                                {instrument}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute bottom-0 right-0 left-0 pt-4 flex gap-2 justify-end">
                        <CustomButton
                            isBlue={true}
                            disabled={
                                !selectedProvider ||
                                !selectedStrategy ||
                                !selectedInstrument
                            }
                            onClick={() => formRef.current?.requestSubmit()}
                            role="button"
                            tabIndex={0}>
                            {isEditMode ? "Save" : "Create"}
                        </CustomButton>
                        <CustomButton
                            isBlue={false}
                            onClick={(e) => {
                                e.preventDefault();
                                clearForm();
                            }}>
                            Clear
                        </CustomButton>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
