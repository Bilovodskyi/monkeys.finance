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
import { exchanges, instruments, strategies } from "@/data/constants";
import { createInstance } from "@/actions/instances/create";
import { updateInstance } from "@/actions/instances/update";
import { saveCredentials } from "@/actions/credentials/save";
import { Check, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { mapExchangeEnumToLabel } from "@/utils/exchange";
import type { InstanceRecord } from "@/types/instance";
import type { CredentialsStatus } from "@/actions/credentials/check";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateInstanceSheetProps {
    credentialsStatus: CredentialsStatus;
    children: ReactNode;
    instance?: InstanceRecord;
    onSuccess?: () => void;
}

export function CreateInstanceSheet({
    credentialsStatus,
    children,
    instance,
    onSuccess,
}: CreateInstanceSheetProps) {
    const translations = useTranslations("instances");
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!instance;

    const FormSchema = z
        .object({
            strategy: z.string().min(1, translations("errors.required")),
            instrument: z.string().min(1, translations("errors.required")),
            exchange: z.string().min(1, translations("errors.required")),
            positionSizeUSDT: z
                .string()
                .min(1, translations("errors.required"))
                .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
                    message: translations("errors.validPositiveNumber"),
                })
                .refine((val) => Number(val) >= 20, {
                    message: translations("errors.minimumPositionSize"),
                }),
            apiKey: z.string().optional(),
            apiSecret: z.string().optional(),
            isTestnet: z.boolean().optional(),
        })
        .refine(
            (data) => {
                // Only validate credentials if they're missing for selected exchange
                const exchangeKey = data.exchange.toLowerCase();
                const hasApiKey = credentialsStatus[exchangeKey]?.apiKey;
                const hasApiSecret = credentialsStatus[exchangeKey]?.apiSecret;

                // If both credentials exist, no validation needed
                if (hasApiKey && hasApiSecret) {
                    return true;
                }

                // If either credential is missing, BOTH must be provided
                if (!hasApiKey || !hasApiSecret) {
                    // User must provide both
                    if (!data.apiKey || !data.apiSecret) {
                        return false;
                    }
                }

                return true;
            },
            {
                message: translations("errors.credentialsRequired"),
                path: ["apiKey"], // Show error on apiKey field
            }
        );
    type FormValues = z.infer<typeof FormSchema>;
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            strategy: instance?.strategy || "",
            instrument: instance?.instrument || "",
            exchange: mapExchangeEnumToLabel(instance?.exchange),
            positionSizeUSDT: instance?.positionSizeUSDT || "",
            apiKey: "",
            apiSecret: "",
            isTestnet: instance?.isTestnet || false,
        },
    });
    const selectedStrategy = form.watch("strategy");
    const selectedInstrument = form.watch("instrument");
    const selectedExchange = form.watch("exchange");
    const selectedPositionSizeUSDT = form.watch("positionSizeUSDT");

    const selectedApiKey = form.watch("apiKey");
    const selectedApiSecret = form.watch("apiSecret");

    const validateCredentials = () => {
        if (!selectedExchange) return false;
        
        const exchangeKey = selectedExchange.toLowerCase();
        const hasApiKey = credentialsStatus[exchangeKey]?.apiKey;
        const hasApiSecret = credentialsStatus[exchangeKey]?.apiSecret;

        // If we have both in DB, we're good
        if (hasApiKey && hasApiSecret) {
            return true;
        }

        // If missing in DB, user must provide them
        if (!hasApiKey || !hasApiSecret) {
            if (!selectedApiKey || !selectedApiSecret) {
                return false;
            }
        }

        return true;
    };

    // Reset form when instance changes or when opening sheet
    useEffect(() => {
        if (instance) {
            form.reset({
                strategy: instance.strategy,
                instrument: instance.instrument,
                exchange: mapExchangeEnumToLabel(instance.exchange),
                positionSizeUSDT: instance.positionSizeUSDT,
                apiKey: "",
                apiSecret: "",
                isTestnet: instance.isTestnet || false,
            });
        } else {
            // Clear form when opening for new instance
            form.reset({
                strategy: "",
                instrument: "",
                exchange: "",
                positionSizeUSDT: "",
                apiKey: "",
                apiSecret: "",
                isTestnet: false,
            });
        }
    }, [instance,form, open]);

    const clearForm = () => {
        form.reset({ strategy: "", instrument: "", exchange: "" });
    };

    const handleSubmit = async (values: FormValues) => {
        // Prevent duplicate submissions
        if (isSubmitting) return;
        setIsSubmitting(true);
        
        try {
            // 1. Save credentials if provided
            if (values.apiKey || values.apiSecret) {
                const credResult = await saveCredentials({
                    exchange: values.exchange,
                    apiKey: values.apiKey,
                    apiSecret: values.apiSecret,
                });

                if (!credResult.ok) {
                    console.log(
                        "[CreateInstanceSheet] Failed to save credentials:",
                        credResult.error
                    );

                    const credErrorKey = {
                        unauthorized: "errors.unauthorized",
                        userNotFound: "errors.userNotFound",
                        invalidInput: "errors.invalidInput",
                        encryptionFailed: "errors.encryptionFailed",
                        saveFailed: "errors.saveFailed",
                        unexpected: "errors.unexpected",
                    }[credResult.error];

                    toast.error(translations(credErrorKey || "errors.unexpected"));
                    setOpen(false);
                    return;
                }
            }

            // 2. Create/update instance
            const name = [
                values.instrument || "-",
                values.exchange || "-",
                values.strategy === "ribbon" ? "1H" : "4H",
                values.strategy || "-",
            ]
                .join("-")
                .toUpperCase();

            if (isEditMode && instance) {
                const result = await updateInstance({
                    id: instance.id,
                    strategy: values.strategy,
                    instrument: values.instrument,
                    exchangeLabel: values.exchange,
                    name,
                    positionSizeUSDT: values.positionSizeUSDT,
                    isTestnet: values.isTestnet || false,
                });
                if (!result.ok) {
                    console.log(
                        "[CreateInstanceSheet] Failed to update instance:",
                        result.error
                    );

                    // Map error codes to translation keys
                    const errorKey = {
                        unauthorized: "errors.unauthorized",
                        invalidInput: "errors.invalidInput",
                        notFound: "errors.notFound",
                        unsupportedExchange: "errors.unsupportedExchange",
                        subscriptionEnded: "subscriptionEnded",
                    }[result.error];

                    toast.error(translations(errorKey));
                    setOpen(false);
                    return;
                }
                toast.success(translations("updatedSuccess"));
            } else {
                const result = await createInstance({
                    strategy: values.strategy,
                    instrument: values.instrument,
                    exchangeLabel: values.exchange,
                    name,
                    positionSizeUSDT: values.positionSizeUSDT,
                    isTestnet: values.isTestnet || false,
                });
                if (!result.ok) {
                    console.log(
                        "[CreateInstanceSheet] Failed to create instance:",
                        result.error
                    );

                    // Map error codes to translation keys
                    const errorKey = {
                        unauthorized: "errors.unauthorized",
                        invalidInput: "errors.invalidInput",
                        userNotFound: "errors.userNotFound",
                        subscriptionEnded: "subscriptionEnded",
                        duplicateInstance: "errors.duplicateInstance",
                        failedToCreate: "createdError",
                        unexpected: "errors.unexpected",
                    }[result.error];

                    toast.error(translations(errorKey ?? "errors.unexpected"));
                    setOpen(false);
                    return;
                }
                toast.success(translations("createdSuccess"));
            }
            setOpen(false);
            onSuccess?.();
        } catch (error: unknown) {
            // This should never happen since createInstance catches all errors,
            // but keep as a safety net for unexpected issues
            console.error("[CreateInstanceSheet] Unexpected error:", error);
            toast.error(translations("createdError"));
            setOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="flex flex-col overflow-scroll">
                <SheetHeader>
                    <SheetTitle className="text-xl font-title">
                        {isEditMode
                            ? translations("editInstance")
                            : translations("createNewInstance")}
                    </SheetTitle>
                    <SheetDescription className=" text-tertiary mt-2">
                        {translations("configureDescription")}
                    </SheetDescription>
                </SheetHeader>

                <form
                    className="mt-6 space-y-6 relative flex-1"
                    onSubmit={form.handleSubmit(handleSubmit)}
                    ref={formRef}>
                    
                    <div className="flex items-start gap-3 p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">
                            {translations("errors.leverageWarning")}
                        </span>
                    </div>

                    {/* Strategy - Full Width */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-tertiary font-medium">
                                {translations("strategy")}
                            </label>
                            {form.formState.errors.strategy && (
                                <div className="text-xs text-red-500">
                                    {String(form.formState.errors.strategy.message)}
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
                                    <SelectTrigger className="h-11 bg-zinc-900/50 border-zinc-800 focus:ring-zinc-700">
                                        <SelectValue
                                            placeholder={translations("selectPlaceholder")}
                                            className="text-tertiary"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {strategies.map((strategy) => (
                                            <SelectItem key={strategy} value={strategy}>
                                                {strategy}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Instrument & Exchange - Two Columns */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-tertiary font-medium">
                                    {translations("instrument")}
                                </label>
                                {form.formState.errors.instrument && (
                                    <div className="text-xs text-red-500">
                                        {String(form.formState.errors.instrument.message)}
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
                                        <SelectTrigger className="h-11 bg-zinc-900/50 border-zinc-800 focus:ring-zinc-700">
                                            <SelectValue
                                                placeholder={translations("selectPlaceholder")}
                                                className="text-tertiary"
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {instruments.map((instrument) => (
                                                <SelectItem key={instrument} value={instrument}>
                                                    {instrument}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-tertiary font-medium">
                                    {translations("exchange")}
                                </label>
                                {form.formState.errors.exchange && (
                                    <div className="text-xs text-red-500">
                                        {String(form.formState.errors.exchange.message)}
                                    </div>
                                )}
                            </div>
                            <Controller
                                control={form.control}
                                name="exchange"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}>
                                        <SelectTrigger className="h-11 bg-zinc-900/50 border-zinc-800 focus:ring-zinc-700">
                                            <SelectValue
                                                placeholder={translations("selectPlaceholder")}
                                                className="text-tertiary"
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {exchanges.map((exchange) => (
                                                <SelectItem key={exchange} value={exchange}>
                                                    {exchange}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    
                    {/* Position Size & Testnet - Two Columns */}
                    <div className="grid grid-cols-2 gap-4 items-start">
                        <div className="grid gap-2">
                            <label className="text-tertiary font-medium">
                                {translations("positionSize")}
                            </label>
                            <Controller
                                control={form.control}
                                name="positionSizeUSDT"
                                render={({ field }) => (
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <input
                                                {...field}
                                                value={field.value || ""}
                                                type="text"
                                                placeholder="0.00"
                                                className="h-11 w-full bg-zinc-900/50 border border-zinc-800 px-3 py-2 text-white outline-none focus:border-zinc-600 transition-colors rounded-md"
                                            />
                                            <span className="absolute right-3 top-3 text-tertiary text-sm">USDC</span>
                                        </div>
                                        {form.formState.errors.positionSizeUSDT && (
                                            <p className="text-xs text-red-500">
                                                {form.formState.errors.positionSizeUSDT.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        {/* Use Demo Account Checkbox - Aligned with input */}
                        <div className="flex items-center gap-3 h-11 mt-7 px-1">
                            <Controller
                                control={form.control}
                                name="isTestnet"
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value || false}
                                        onCheckedChange={field.onChange}
                                        className="w-5 h-5"
                                    />
                                )}
                            />
                            <label className="text-sm text-tertiary cursor-pointer select-none font-medium">
                                {translations("useDemoAccount")}
                            </label>
                        </div>
                    </div>
                    
                    {/* API Credentials Section */}
                    <div className="pt-4 border-t border-zinc-800/50 space-y-4">
                        <h3 className="text-sm font-medium text-white mb-2">{translations("exchangeCredentials")}</h3>
                        
                        {/* API Key Field */}
                        <div className="grid gap-2">
                            <label className="text-tertiary text-xs uppercase tracking-wider">
                                {translations("apiKey")}
                            </label>
                            {selectedExchange && credentialsStatus[selectedExchange.toLowerCase()]?.apiKey ? (
                                <div className="flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/20 rounded-md">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-green-500">
                                        {translations("apiKeyProvided")}
                                    </span>
                                </div>
                            ) : (
                                <Controller
                                    control={form.control}
                                    name="apiKey"
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            value={field.value || ""}
                                            type="text"
                                            placeholder={translations("enterApiKey")}
                                            className="h-10 w-full bg-zinc-900/30 border border-zinc-800 px-3 py-2 text-white outline-none focus:border-zinc-600 transition-colors rounded-md font-mono text-sm"
                                        />
                                    )}
                                />
                            )}
                        </div>

                        {/* API Secret Field */}
                        <div className="grid gap-2">
                            <label className="text-tertiary text-xs uppercase tracking-wider">
                                {translations("apiSecret")}
                            </label>
                            {selectedExchange && credentialsStatus[selectedExchange.toLowerCase()]?.apiSecret ? (
                                <div className="flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/20 rounded-md">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-green-500">
                                        {translations("apiSecretProvided")}
                                    </span>
                                </div>
                            ) : (
                                <Controller
                                    control={form.control}
                                    name="apiSecret"
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            value={field.value || ""}
                                            type="text"
                                            placeholder={translations("enterApiSecret")}
                                            className="h-10 w-full bg-zinc-900/30 border border-zinc-800 px-3 py-2 text-white outline-none focus:border-zinc-600 transition-colors rounded-md font-mono text-sm"
                                        />
                                    )}
                                />
                            )}
                        </div>
                    </div>

                    <div className="sticky lg:absolute bottom-0 right-0 left-0 bg-background border-t border-zinc-800/50 px-6 py-4">
                        <div className="flex gap-2 justify-end">
                            <CustomButton
                                disabled={
                                    isSubmitting ||
                                    !selectedStrategy ||
                                    !selectedInstrument ||
                                    !selectedExchange ||
                                    !selectedPositionSizeUSDT ||
                                    !validateCredentials()
                                }
                                isBlue={true}
                                onClick={() => formRef.current?.requestSubmit()}
                                role="button"
                                tabIndex={0}>
                                {isSubmitting
                                    ? translations("submitting")
                                    : isEditMode
                                        ? translations("save")
                                        : translations("create")}
                            </CustomButton>
                            <CustomButton
                                isBlue={false}
                                onClick={(e) => {
                                    e.preventDefault();
                                    clearForm();
                                }}>
                                {translations("clear")}
                            </CustomButton>
                        </div>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
