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
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { mapExchangeEnumToLabel } from "@/utils/exchange";
import type { InstanceRecord } from "@/types/instance";

interface CreateInstanceSheetProps {
    apiKey: boolean;
    children: ReactNode;
    instance?: InstanceRecord;
}

const INSTRUMENT_SHORT_NAMES = {
    "Bitcoin": "BTC",
    "Ethereum": "ETH",
    "Solana": "SOL",
    "XRP": "XRP",
    "Dogecoin": "DOGE",
    "Binance Coin": "BNB",
}

export function CreateInstanceSheet({ apiKey, children, instance }: CreateInstanceSheetProps) {
    const translations = useTranslations("instances");
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const isEditMode = !!instance;

    const FormSchema = z.object({
        strategy: z.string().min(1, translations("errors.required")),
        instrument: z.string().min(1, translations("errors.required")),
        exchange: z.string().min(1, translations("errors.required")),
    });
    type FormValues = z.infer<typeof FormSchema>;
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            strategy: instance?.strategy || "",
            instrument: instance?.instrument || "",
            exchange: mapExchangeEnumToLabel(instance?.exchange),
        },
    });
    const selectedStrategy = form.watch("strategy");
    const selectedInstrument = form.watch("instrument");
    const selectedExchange = form.watch("exchange");

    // Reset form when instance changes
    useEffect(() => {
        if (instance) {
            form.reset({
                strategy: instance.strategy,
                instrument: instance.instrument,
                exchange: mapExchangeEnumToLabel(instance.exchange),
            });
        }
    }, [instance, form]);

    // Build instance name dynamically
    const instanceName = [
        INSTRUMENT_SHORT_NAMES[selectedInstrument as keyof typeof INSTRUMENT_SHORT_NAMES] || "-",
        selectedExchange || "-",
        selectedStrategy === "Squid Ribbon V2" ? "1H" : "4H",
        selectedStrategy || "-"
    ].join("-").toUpperCase();

    const clearForm = () => {
        form.reset({ strategy: "", instrument: "", exchange: "" });
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-xl font-title">
                        {isEditMode ? translations("editInstance") : translations("createNewInstance")}
                    </SheetTitle>
                    <SheetDescription className=" text-tertiary mt-4">
                        {translations("configureDescription")}
                    </SheetDescription>
                </SheetHeader>

                <form
                    className="mt-6 space-y-8 relative flex-1"
                    onSubmit={form.handleSubmit(async (values) => {
                        try {
                            const name = [
                                INSTRUMENT_SHORT_NAMES[values.instrument as keyof typeof INSTRUMENT_SHORT_NAMES] || "-",
                                values.exchange || "-",
                                values.strategy === "Squid Ribbon V2" ? "1H" : "4H",
                                values.strategy || "-"
                            ].join("-").toUpperCase();

                            if (isEditMode && instance) {
                                const result = await updateInstance({
                                    id: instance.id,
                                    strategy: values.strategy,
                                    instrument: values.instrument,
                                    exchangeLabel: values.exchange,
                                    name,
                                });
                                if (!result.ok) {
                                    throw new Error(result.error);
                                }
                                toast.success(translations("updatedSuccess"));
                            } else {
                                await createInstance({
                                    strategy: values.strategy,
                                    instrument: values.instrument,
                                    exchangeLabel: values.exchange,
                                    name,
                                });
                                toast.success(translations("createdSuccess"));
                            }
                            setOpen(false);
                            router.refresh();
                        } catch (error: any) {
                            const message = error?.message || (isEditMode ? "Failed to update instance" : "Failed to create instance");
                            console.error(message);
                            toast.error(isEditMode ? translations("updatedError") : translations("createdError"));
                        }
                    })}
                    ref={formRef}
                >
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className=" text-tertiary">{translations("strategy")}</label>
                            {form.formState.errors.strategy && (
                                <div className="text-xs text-red-500">{String(form.formState.errors.strategy.message)}</div>
                            )}
                        </div>
                        <Controller
                            control={form.control}
                            name="strategy"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={translations("selectPlaceholder")} className="text-tertiary" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {strategies.map((strategy) => (
                                            <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className=" text-tertiary">{translations("instrument")}</label>
                            {form.formState.errors.instrument && (
                                <div className="text-xs text-red-500">{String(form.formState.errors.instrument.message)}</div>
                            )}
                        </div>
                        <Controller
                            control={form.control}
                            name="instrument"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={translations("selectPlaceholder")} className="text-tertiary" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {instruments.map((instrument) => (
                                            <SelectItem key={instrument} value={instrument}>{instrument}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className=" text-tertiary">{translations("exchange")}</label>
                            {form.formState.errors.exchange && (
                                <div className="text-xs text-red-500">{String(form.formState.errors.exchange.message)}</div>
                            )}
                        </div>
                        <Controller
                            control={form.control}
                            name="exchange"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={translations("selectPlaceholder")} className="text-tertiary" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {exchanges.map((exchange) => (
                                            <SelectItem key={exchange} value={exchange}>{exchange}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className=" text-tertiary">{translations("apiKey")}</label>
                        {apiKey ? (
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="">{translations("apiKeyProvided")}</span>
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder={translations("enterApiKey")}
                                className="h-9 w-full items-center justify-between whitespace-nowrap border border-zinc-800 bg-black px-3 py-2  text-white outline-none"
                            />
                        )}
                    </div>

                    <div className="absolute bottom-0 right-0 left-0 pt-4 flex flex-col gap-8">
                        <div className="border border-zinc-800 p-4 space-y-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-tertiary mr-1 font-mein">{translations("yourInstance")}</span>
                                <h1 className="font-title">{instanceName}</h1>
                            </div>
                            <div className="grid grid-cols-2 grid-rows-2 gap-2">
                                <span className="text-tertiary mr-1 font-mein">
                                    {translations("strategyLabel")} <span className="text-white">{selectedStrategy || "-"}</span>
                                </span>
                                <span className="text-tertiary mr-1 font-mein">
                                    {translations("instrumentLabel")} <span className="text-white">{selectedInstrument || "-"}</span>
                                </span>
                                <span className="text-tertiary mr-1 font-mein">
                                    {translations("exchangeLabel")} <span className="text-white">{selectedExchange || "-"}</span>
                                </span>
                                <span className="text-tertiary mr-1 font-mein">
                                    {translations("signalLabel")} <span className="text-white">{selectedStrategy === "Squid Ribbon V2" ? "1H" : "4H"}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end ">
                            <CustomButton isBlue={true} onClick={() => formRef.current?.requestSubmit()} role="button" tabIndex={0}>
                                {isEditMode ? translations("save") : translations("create")}
                            </CustomButton>
                            <CustomButton isBlue={false} onClick={(e) => { e.preventDefault(); clearForm(); }}>
                                {translations("clear")}
                            </CustomButton>
                        </div>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}

