"use client";

import { CustomButton } from "@/components/CustomButton";
import { Copy } from "lucide-react";
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
import { checkTelegramLinked } from "@/actions/telegram/status";
import { useTranslations } from "next-intl";

interface AddNotificationSheetProps {
    children: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    notification?: any; // Dynamic notification object structure from API
}

export function AddNotificationSheet({
    children,
    notification,
}: AddNotificationSheetProps) {
    const t = useTranslations("addNotificationSheet");
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkingTelegram, setCheckingTelegram] = useState(false);
    const [isTelegramLinked, setIsTelegramLinked] = useState(false);

    const isEditMode = !!notification;

    const FormSchema = z.object({
        provider: z.string().min(1, t("requiredField")),
        strategy: z.string().min(1, t("requiredField")),
        instrument: z.string().min(1, t("requiredField")),
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
        if (isSubmitting) return;
        setIsSubmitting(true);
        
        try {
            toast.loading(t("toastCreating"));

            const { createNotification } = await import(
                "@/actions/notifications"
            );

            const result = await createNotification({
                provider: values.provider,
                instrument: values.instrument,
                strategy: values.strategy,
            });

            toast.dismiss();

            if (!result.ok) {
                console.log(
                    "[AddNotificationSheet] Failed to create notification:",
                    result.error
                );

                // Map error codes to translation keys
                const errorKey = {
                    unauthorized: "errors.unauthorized",
                    invalidInput: "errors.invalidInput",
                    userNotFound: "errors.userNotFound",
                    subscriptionEnded: "errors.subscriptionEnded",
                    telegramNotLinked: "errors.telegramNotLinked",
                    duplicatePreference: "errors.duplicatePreference",
                    failedToCreate: "errors.failedToCreate",
                    unexpected: "errors.unexpected",
                }[result.error];

                toast.error(t(errorKey));
                setOpen(false);
                return;
            }

            toast.success(t("toastSuccess"));
            setOpen(false);
            clearForm();
        } catch (error) {
            console.error("[AddNotificationSheet] Unexpected error:", error);
            toast.dismiss();
            toast.error(t("errors.unexpected"));
            setOpen(false);
        } finally {
            setIsSubmitting(false);
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
            <SheetContent className="flex flex-col overflow-scroll">
                <SheetHeader>
                    <SheetTitle className="text-xl font-title">
                        {isEditMode ? t("titleEdit") : t("titleAdd")}
                    </SheetTitle>
                    <SheetDescription className=" text-tertiary mt-4">
                        {t("description")}
                    </SheetDescription>
                </SheetHeader>

                <form
                    className="mt-6 space-y-8 relative flex-1 flex flex-col"
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    ref={formRef}>
                    {/* Provider Field */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className=" text-tertiary">
                                {t("provider")}
                            </label>
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
                                            placeholder={t("selectProvider")}
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
                                    {t("telegramStep1")}
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-tertiary">
                                        {t("telegramStep2", {
                                            botName: "",
                                        })}
                                    </p>
                                    <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                                        <code className="text-sm text-white font-mono">@monkeys_finance_bot</code>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText("@monkeys_finance_bot");
                                                toast.success(t("botNameCopied"));
                                            }}
                                            className="p-1 hover:bg-zinc-800 rounded transition-colors">
                                            <Copy className="w-3 h-3 text-tertiary" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-tertiary">
                                    {t("telegramStep3", { command: "/start" })}
                                </p>
                                <p className="text-sm text-tertiary">
                                    {t("telegramStep4")}
                                </p>
                            </div>
                        )}

                    {/* Show linked status */}
                    {selectedProvider === "Telegram" &&
                        isTelegramLinked &&
                        !checkingTelegram && (
                            <div className="px-2 py-3">
                                <p className="text-sm">{t("telegramLinked")}</p>
                            </div>
                        )}

                    {/* Loading state */}
                    {selectedProvider === "Telegram" && checkingTelegram && (
                        <div className="px-2 py-3">
                            <p className="text-sm text-tertiary">
                                {t("checkingTelegram")}
                            </p>
                        </div>
                    )}

                    {/* Strategy Field */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className=" text-tertiary">
                                {t("strategy")}
                            </label>
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
                                            placeholder={t("selectStrategy")}
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
                            <label className=" text-tertiary">
                                {t("instrument")}
                            </label>
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
                                            placeholder={t("selectInstrument")}
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
                    <div className="sticky lg:absolute bottom-0 right-0 left-0 mt-auto bg-background border-t border-zinc-800/50 px-6 py-4">
                        <div className="flex gap-2 justify-end">
                        <CustomButton
                            isBlue={true}
                            disabled={
                                isSubmitting ||
                                !selectedProvider ||
                                !selectedStrategy ||
                                !selectedInstrument
                            }
                            onClick={() => formRef.current?.requestSubmit()}
                            role="button"
                            tabIndex={0}>
                            {isSubmitting
                                ? t("buttonSubmitting")
                                : isEditMode
                                  ? t("buttonSave")
                                  : t("buttonCreate")}
                        </CustomButton>
                        <CustomButton
                            isBlue={false}
                            onClick={(e) => {
                                e.preventDefault();
                                clearForm();
                            }}>
                            {t("buttonClear")}
                        </CustomButton>
                        </div>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
