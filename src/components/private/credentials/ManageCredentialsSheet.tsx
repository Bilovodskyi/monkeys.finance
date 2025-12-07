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
import { exchanges } from "@/data/constants";
import { saveCredentials } from "@/actions/credentials/save";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRef, useState, useEffect, type ReactNode } from "react"

interface ManageCredentialsSheetProps {
    children: ReactNode;
    exchange?: string; // If provided, we're in edit mode
}

export function ManageCredentialsSheet({
    children,
    exchange,
}: ManageCredentialsSheetProps) {
    const translations = useTranslations("instances");
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!exchange;

    const FormSchema = z.object({
        exchange: z.string().min(1, translations("errors.required")),
        apiKey: z.string().min(1, translations("errors.required")),
        apiSecret: z.string().min(1, translations("errors.required")),
        passphrase: z.string().optional(),
    });

    type FormValues = z.infer<typeof FormSchema>;
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            exchange: exchange || "",
            apiKey: "",
            apiSecret: "",
            passphrase: "",
        },
    });

    // Reset form when exchange changes or when opening sheet
    useEffect(() => {
        if (exchange) {
            form.reset({
                exchange: exchange,
                apiKey: "",
                apiSecret: "",
                passphrase: "",
            });
        } else {
            form.reset({
                exchange: "",
                apiKey: "",
                apiSecret: "",
                passphrase: "",
            });
        }
    }, [exchange, form, open]);

    const clearForm = () => {
        form.reset({
            exchange: isEditMode ? exchange : "",
            apiKey: "",
            apiSecret: "",
            passphrase: "",
        });
    };

    const handleSubmit = async (values: FormValues) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        
        try {
            const result = await saveCredentials({
                exchange: values.exchange,
                apiKey: values.apiKey,
                apiSecret: values.apiSecret,
                passphrase: values.passphrase,
            });

            if (!result.ok) {
                console.log(
                    "[ManageCredentialsSheet] Failed to save credentials:",
                    result.error
                );

                const errorKey = {
                    unauthorized: "errors.unauthorized",
                    userNotFound: "errors.userNotFound",
                    invalidInput: "errors.invalidInput",
                    encryptionFailed: "errors.encryptionFailed",
                    saveFailed: "errors.saveFailed",
                    unexpected: "errors.unexpected",
                }[result.error];

                toast.error(translations(errorKey || "errors.unexpected"));
                setOpen(false);
                return;
            }

            toast.success(
                isEditMode
                    ? "Credentials updated successfully"
                    : "Credentials saved successfully"
            );
            setOpen(false);
        } catch (error: unknown) {
            console.error(
                "[ManageCredentialsSheet] Unexpected error:",
                error
            );
            toast.error(translations("errors.unexpected"));
            setOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-xl font-title">
                        {isEditMode
                            ? "Update Credentials"
                            : "Add Credentials"}
                    </SheetTitle>
                    <SheetDescription className="text-tertiary mt-2">
                        {isEditMode
                            ? "Update your API credentials for " + exchange
                            : "Add your exchange API credentials to start trading"}
                    </SheetDescription>
                </SheetHeader>

                <form
                    className="mt-2 space-y-6 relative flex-1"
                    onSubmit={form.handleSubmit(handleSubmit)}
                    ref={formRef}>
                    {/* Exchange Selection */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-tertiary">
                                {translations("exchange")}
                            </label>
                            {form.formState.errors.exchange && (
                                <div className="text-xs text-red-500">
                                    {String(
                                        form.formState.errors.exchange.message
                                    )}
                                </div>
                            )}
                        </div>
                        <Controller
                            control={form.control}
                            name="exchange"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isEditMode}>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={translations(
                                                "selectPlaceholder"
                                            )}
                                            className="text-tertiary"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {exchanges.map((ex) => (
                                            <SelectItem key={ex} value={ex}>
                                                {ex}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* API Key Field */}
                    <div className="grid gap-2">
                        <label className="text-tertiary">
                            {translations("apiKey")}
                        </label>
                        <Controller
                            control={form.control}
                            name="apiKey"
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <input
                                        {...field}
                                        value={field.value || ""}
                                        type="text"
                                        placeholder={translations("enterApiKey")}
                                        className="h-9 w-full items-center justify-between whitespace-nowrap border border-zinc-800 px-3 py-2 text-white outline-none"
                                    />
                                    {form.formState.errors.apiKey && (
                                        <p className="text-xs text-red-500">
                                            {form.formState.errors.apiKey.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    {/* API Secret Field */}
                    <div className="grid gap-2">
                        <label className="text-tertiary">
                            {translations("apiSecret")}
                        </label>
                        <Controller
                            control={form.control}
                            name="apiSecret"
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <input
                                        {...field}
                                        value={field.value || ""}
                                        type="text"
                                        placeholder={translations("enterApiSecret")}
                                        className="h-9 w-full items-center justify-between whitespace-nowrap border border-zinc-800 px-3 py-2 text-white outline-none"
                                    />
                                    {form.formState.errors.apiSecret && (
                                        <p className="text-xs text-red-500">
                                            {form.formState.errors.apiSecret.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    {/* Passphrase Field (Optional) */}
                    <div className="grid gap-2">
                        <label className="text-tertiary">
                            Passphrase <span className="text-xs">(optional)</span>
                        </label>
                        <Controller
                            control={form.control}
                            name="passphrase"
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <input
                                        {...field}
                                        value={field.value || ""}
                                        type="text"
                                        placeholder="Enter passphrase (if required)"
                                        className="h-9 w-full items-center justify-between whitespace-nowrap border border-zinc-800 px-3 py-2 text-white outline-none"
                                    />
                                    {form.formState.errors.passphrase && (
                                        <p className="text-xs text-red-500">
                                            {form.formState.errors.passphrase.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    <div className="absolute bottom-0 right-0 left-0 pt-4 flex gap-2 justify-end">
                        <CustomButton
                            disabled={!form.formState.isValid || isSubmitting}
                            isBlue={true}
                            onClick={() => formRef.current?.requestSubmit()}
                            role="button"
                            tabIndex={0}>
                            {isSubmitting
                                ? translations("submitting")
                                : isEditMode
                                  ? "Update"
                                  : "Save"}
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
                </form>
            </SheetContent>
        </Sheet>
    );
}
