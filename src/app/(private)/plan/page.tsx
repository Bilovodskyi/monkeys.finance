import { Check } from "lucide-react";
import { CustomButton } from "@/components/CustomButton";
import { formatEntitlementHeading } from "@/lib/entitlements";
import { auth } from "@clerk/nextjs/server";
import { EntitlementResponse, getEntitlementForUser } from "@/services/entitlements";
import { parseIsoToDateTime } from "@/lib/utils";

export default async function Plan() {
    const { userId } = await auth();
    if (!userId) return null;

    const data: EntitlementResponse | null = await getEntitlementForUser(userId);
    if (!data || !data.trialEndsAt) return null;
    return (
        <div className="flex flex-col items-center justify-center h-full w-1/4 mx-auto gap-2">
            <h1 className="text-lg font-bold">{formatEntitlementHeading(data)}</h1>
            <p className="text-center text-sm text-tertiary">Your trial will end on {parseIsoToDateTime(data.trialEndsAt).date} at {parseIsoToDateTime(data.trialEndsAt).time}. You can upgrade to pro plan to continue using the bot.</p>
            <div className="flex gap-4 mt-6">
                <div className="border border-zinc-800 p-6 space-y-3 h-full w-[250px]">
                    <h2 className="text-lg font-bold">Monthly</h2>
                    <span className="text-2xl">29$ / mo <span className="text-xs text-tertiary">exc. VAT</span></span>
                    <p className="text-secondary">Including</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />2 powerful algorithms</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />ML models</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />Trading bot</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />Unlimited instances</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />Unlimited backtests</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />Unlimited notifications</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />Support the project</li>
                    </ul>
                    <div className="h-[1px] bg-zinc-800 my-4" />
                    <div className="flex justify-center">

                        <CustomButton isBlue={false}>Select plan</CustomButton>
                    </div>
                </div>
                <div className="border border-zinc-800 p-6 space-y-3 h-full w-[250px]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">Yearly</h2>
                        <span className="text-secondary text-xs bg-zinc-900 px-2 py-1 rounded-full border border-zinc-800">save 20%</span>
                    </div>
                    <span className="text-2xl">279$ / y <span className="text-xs text-tertiary">exc. VAT</span></span>
                    <p className="text-secondary">Including</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />2 powerful algorithms</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />ML models</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />Trading bot</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />Unlimited instances</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />Unlimited backtests</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />Unlimited notifications</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4" />Support the project</li>
                    </ul>
                    <div className="h-[1px] bg-zinc-800 my-4" />
                    <div className="flex justify-center">

                        <CustomButton isBlue={false}>Select plan</CustomButton>
                    </div>
                </div>
            </div>
        </div>
    )
}