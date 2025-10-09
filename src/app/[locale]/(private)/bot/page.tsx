"use client";

import { CustomButton } from "@/components/CustomButton";
import { useState } from "react";

export default function Bot() {
    const [activeTab, setActiveTab] = useState<"General" | "Bot" | "Notifications">("Bot");
    return (
        <div className="flex flex-col gap-2 py-4 px-6">
            <ul className="flex gap-8">
                <li className={`cursor-pointer ${activeTab === "General" ? "text-white" : "text-tertiary hover:text-white"}`} onClick={() => setActiveTab("General")}>General</li>
                <li className={`cursor-pointer ${activeTab === "Bot" ? "text-white" : "text-tertiary hover:text-white"}`} onClick={() => setActiveTab("Bot")}>Bot</li>
                <li className={`cursor-pointer ${activeTab === "Notifications" ? "text-white" : "text-tertiary hover:text-white"}`} onClick={() => setActiveTab("Notifications")}>Notifications</li>
            </ul>
            {activeTab === "General" && <div>General</div>}
            {activeTab === "Bot" && <div className="flex flex-col gap-8 mt-8">
                <div className="border border-zinc-800">
                    <div className="p-6">

                        <h1 className="text-lg font-bold">Binance API Key</h1>
                        <p className="text-secondary">You can find your API key in the <a href="https://www.binance.com/en/my/settings/api-management" target="_blank" rel="noopener noreferrer" className="text-highlight hover:underline">Binance API Management</a> page.</p>
                        <input type="text" className="border border-zinc-800 p-2 w-1/3 outline-none mt-4" />
                    </div>
                    <div className="h-[1px] w-full bg-zinc-800 mt-4" />
                    <div className="flex p-6 justify-end">
                        <div>

                            <CustomButton isBlue={false}>Save</CustomButton>
                        </div>
                    </div>
                </div>
                <div className="border border-zinc-800">
                    <div className="p-6">

                        <h1 className="text-lg font-bold">Coinbase API Key</h1>
                        <p className="text-secondary">You can find your API key in the <a href="https://www.coinbase.com/settings/api" target="_blank" rel="noopener noreferrer" className="text-highlight hover:underline">Coinbase API Management</a> page.</p>
                        <input type="text" className="border border-zinc-800 p-2 w-1/3 outline-none mt-4" />
                    </div>
                    <div className="h-[1px] w-full bg-zinc-800 mt-4" />
                    <div className="flex p-6 justify-end">
                        <div>

                            <CustomButton isBlue={false}>Save</CustomButton>
                        </div>
                    </div>
                </div>
                <div className="border border-zinc-800">
                    <div className="p-6">

                        <h1 className="text-lg font-bold">Kraken API Key</h1>
                        <p className="text-secondary">You can find your API key in the <a href="https://www.kraken.com/en-us/account/api" target="_blank" rel="noopener noreferrer" className="text-highlight hover:underline">Kraken API Management</a> page.</p>
                        <input type="text" className="border border-zinc-800 p-2 w-1/3 outline-none mt-4" />
                    </div>
                    <div className="h-[1px] w-full bg-zinc-800 mt-4" />
                    <div className="flex p-6 justify-end">
                        <div>

                            <CustomButton isBlue={false}>Save</CustomButton>
                        </div>
                    </div>
                </div>
                <div className="border border-zinc-800">
                    <div className="p-6">

                        <h1 className="text-lg font-bold">OKX API Key</h1>
                        <p className="text-secondary">You can find your API key in the <a href="https://www.okx.com/account/settings/api" target="_blank" rel="noopener noreferrer" className="text-highlight hover:underline">OKX API Management</a> page.</p>
                        <input type="text" className="border border-zinc-800 p-2 w-1/3 outline-none mt-4" />
                    </div>
                    <div className="h-[1px] w-full bg-zinc-800 mt-4" />
                    <div className="flex p-6 justify-end">
                        <div>

                            <CustomButton isBlue={false}>Save</CustomButton>
                        </div>
                    </div>
                </div>
            </div>}
            {activeTab === "Notifications" && <div>Notifications</div>}
        </div>
    )
}