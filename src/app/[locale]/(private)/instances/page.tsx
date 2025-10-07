"use client";

import { CustomButton } from "@/components/CustomButton";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { CreateInstanceSheet } from "@/components/private/instances/CreateInstanceSheet";

export default function Instances() {
    const [instances, setInstances] = useState([]);
    const [open, setOpen] = useState(false);
    const [apiKey, setApiKey] = useState(true);
    const t = useTranslations("instances");

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {instances.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full w-1/4 mx-auto gap-2">
                    <h1 className="text-lg font-bold">{t("addFirstInstance")}</h1>
                    <p className="text-center text-sm text-tertiary">
                        {t("instanceDescription")}
                    </p>
                    <div className="flex gap-2 mt-6">
                        <SheetTrigger>
                            <CustomButton isBlue={false}>
                                {t("addInstance")}
                            </CustomButton>
                        </SheetTrigger>
                    </div>
                    <p className="text-xs text-tertiary text-center mt-6">{t("visitDocumentation")}</p>
                </div>
            ) : (
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-lg font-bold">{t("instances")}</h1>
                        <SheetTrigger asChild>
                            <CustomButton isBlue={false}>{t("addInstance")}</CustomButton>
                        </SheetTrigger>
                    </div>
                    <div className="text-tertiary text-sm">{t("instanceCount", { count: instances.length })}</div>
                </div>
            )}

            <CreateInstanceSheet onClose={() => setOpen(false)} apiKey={apiKey} />
        </Sheet>
    );
}