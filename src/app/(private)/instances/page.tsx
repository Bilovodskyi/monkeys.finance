"use client";

import { CustomButton } from "@/components/CustomButton";
import { useState } from "react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { exchanges, instruments, strategies } from "@/data/constants";
import { Check } from "lucide-react";

export default function Instances() {
    const [instances, setInstances] = useState([]);
    const [open, setOpen] = useState(false);
    const [apiKey, setApiKey] = useState(true);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {instances.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full w-1/4 mx-auto gap-2">
                    <h1 className="text-lg font-bold">Add your first instance</h1>
                    <p className="text-center text-sm text-tertiary">
                        Instance is a function that will run on the cloud 24/7 constantly checking for new
                        signals. Once signal is detected, the instance will open a position on the exchange.
                        After instance automatically closes the position once opposite signal is detected.
                    </p>
                    <div className="flex gap-2 mt-6">
                        <SheetTrigger>
                            <CustomButton isBlue={false}>
                                Add instance
                            </CustomButton>
                        </SheetTrigger>
                    </div>
                    <p className="text-xs text-tertiary mt-6">Visit documentation page for more information</p>
                </div>
            ) : (
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-lg font-bold">Instances</h1>
                        <SheetTrigger asChild>
                            <CustomButton isBlue={false}>Add instance</CustomButton>
                        </SheetTrigger>
                    </div>
                    <div className="text-tertiary text-sm">You have {instances.length} instance(s).</div>
                </div>
            )}


            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-xl font-title">Create new instance</SheetTitle>
                    <SheetDescription className="text-sm text-tertiary mt-4">
                        Configure the strategy and exchange for this instance. It will run in the cloud.
                    </SheetDescription>
                </SheetHeader>


                <form
                    className="mt-6 space-y-8 relative flex-1"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setOpen(false);
                    }}
                >
                    <div className="grid gap-2">
                        <label className="text-sm">Strategy</label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select..." className="text-tertiary" />
                            </SelectTrigger>
                            <SelectContent>
                                {strategies.map((instrument) => (
                                    <SelectItem key={instrument} value={instrument}>{instrument}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm">Instrument</label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select..." className="text-tertiary" />
                            </SelectTrigger>
                            <SelectContent>
                                {instruments.map((instrument) => (
                                    <SelectItem key={instrument} value={instrument}>{instrument}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm">Exchange</label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select..." className="text-tertiary" />
                            </SelectTrigger>
                            <SelectContent>
                                {exchanges.map((instrument) => (
                                    <SelectItem key={instrument} value={instrument}>{instrument}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm">API Key</label>
                        {apiKey ? (
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-tertiary">You have provided API key</span>
                            </div>
                        ) : (
                            <input type="text" placeholder="Enter API key" className="h-9 w-full items-center justify-between whitespace-nowrap border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none" />
                        )}
                    </div>

                    <div className="absolute bottom-0 right-0 left-0 pt-4 flex flex-col gap-8">
                        <div className="border border-zinc-800 p-4 space-y-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-tertiary text-sm mr-1 font-mein">Your instance:</span>
                                <h1 className="font-title">BTC-BINANCE-4H-SQUID-RIBBON-V0.0.1</h1>
                            </div>
                            <div className="grid grid-cols-2 grid-rows-2 gap-2">
                                <span className="text-tertiary text-sm mr-1 font-mein">Strategy: <span className="text-white">Squid Ribbon V 0.0.1</span></span>
                                <span className="text-tertiary text-sm mr-1 font-mein">Instrument: <span className="text-white">BTC</span></span>
                                <span className="text-tertiary text-sm mr-1 font-mein">Exchange: <span className="text-white">Binance</span></span>
                                <span className="text-tertiary text-sm mr-1 font-mein">Signal: <span className="text-white">4H</span></span>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end ">
                            <CustomButton isBlue={true}>
                                Create
                            </CustomButton>
                            <CustomButton isBlue={false} onClick={(e) => { e.preventDefault(); setOpen(false); }}>
                                Cancel
                            </CustomButton>
                        </div>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}