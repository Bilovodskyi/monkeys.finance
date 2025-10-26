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

interface AddNotificationSheetProps {
    children: ReactNode;
    notification?: any; // TODO: Add proper notification type
}

export function AddNotificationSheet({
    children,
    notification,
}: AddNotificationSheetProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
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
                    onSubmit={form.handleSubmit(async (values) => {
                        try {
                            // TODO: Implement create/update notification logic
                            console.log("Notification values:", values);
                            toast.success(
                                isEditMode
                                    ? "Notification updated successfully!"
                                    : "Notification created successfully!"
                            );
                            setOpen(false);
                            router.refresh();
                        } catch (error: any) {
                            const message =
                                error?.message ||
                                (isEditMode
                                    ? "Failed to update notification"
                                    : "Failed to create notification");
                            console.error(message);
                            toast.error(
                                isEditMode
                                    ? "Failed to update notification"
                                    : "Failed to create notification"
                            );
                        }
                    })}
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
                                    onValueChange={field.onChange}>
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

                    {/* Telegram Instruction */}
                    <div className="border border-zinc-800 px-4 py-2 bg-zinc-950">
                        <p className="text-sm text-tertiary">
                            Send{" "}
                            <span className="text-white font-mono">/start</span>{" "}
                            to{" "}
                            <span className="text-white font-mono">
                                @algo_squid_bot
                            </span>{" "}
                            on Telegram
                        </p>
                    </div>

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
