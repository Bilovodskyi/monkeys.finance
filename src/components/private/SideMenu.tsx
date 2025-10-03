"use client"

import { Activity, Fingerprint, GalleryVerticalEnd, History, Pyramid, Receipt, Shield } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type SideMenuTab = "instances" | "history" | "backtest" | "bot" | "plan" | "how" | "safety";

export default function SideMenu() {
    const [activeTab, setActiveTab] = useState<SideMenuTab>("instances");
    const router = useRouter();
    return (
        <div className="group/side-menu absolute left-0 bg-black h-screen z-20 w-[71px] border-r border-zinc-800 shrink-0 hover:w-[270px] transition-all duration-300 ease-in-out">
            <div className="flex items-center px-5 border-b border-zinc-800 h-[70px]">
                <img src="/algo-logo.png" alt="Main Logo" className="max-w-8 max-h-8" />
            </div>
            <div className="flex flex-col px-5 gap-5 py-10">
                <div className={`flex  min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${activeTab === "instances" ? "border border-zinc-800 bg-zinc-900 text-white" : "text-secondary hover:!text-white"}`} onClick={() => { setActiveTab("instances"); router.push("/instances") }}>
                    <div className="flex-none">
                        <Activity className="w-4 h-4" />
                    </div>
                    <div className="relative overflow-hidden">

                        <span className="invisible block text-sm whitespace-nowrap"> My Instances</span>
                        <span className="absolute inset-0 block text-sm whitespace-nowrap opacity-0 group-hover/side-menu:opacity-100 transition-opacity duration-150">
                            My Instances
                        </span>
                    </div>
                </div>
                <div className={`flex  min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${activeTab === "history" ? "border border-zinc-800 bg-zinc-900 text-white" : "text-secondary hover:!text-white"}`} onClick={() => setActiveTab("history")}>
                    <div className="flex-none">
                        <History className="w-4 h-4" />
                    </div>
                    <div className="relative overflow-hidden">
                        <span className="invisible block text-sm whitespace-nowrap"> History</span>
                        <span className="absolute inset-0 block text-sm whitespace-nowrap opacity-0 group-hover/side-menu:opacity-100 transition-opacity duration-150">
                            History
                        </span>
                    </div>
                </div>
                <div className={`flex  min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${activeTab === "backtest" ? "border border-zinc-800 bg-zinc-900 text-white" : "text-secondary hover:!text-white"}`} onClick={() => { setActiveTab("backtest"); router.push("/backtest") }}>
                    <div className="flex-none">
                        <GalleryVerticalEnd className="w-4 h-4" />
                    </div>
                    <div className="relative overflow-hidden">
                        <span className="invisible block text-sm whitespace-nowrap"> Backtest</span>
                        <span className="absolute inset-0 block text-sm whitespace-nowrap opacity-0 group-hover/side-menu:opacity-100 transition-opacity duration-150">
                            Backtest
                        </span>
                    </div>
                </div>
                <div className={`flex  min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${activeTab === "bot" ? "border border-zinc-800 bg-zinc-900 text-white" : "text-secondary hover:!text-white"}`} onClick={() => { setActiveTab("bot"); router.push("/bot") }}>
                    <div className="flex-none">
                        <Fingerprint className="w-4 h-4" />
                    </div>
                    <div className="relative overflow-hidden">
                        <span className="invisible block text-sm whitespace-nowrap">Bot and Notifications</span>
                        <span className="absolute inset-0 block text-sm whitespace-nowrap opacity-0 group-hover/side-menu:opacity-100 transition-opacity duration-150">
                            Bot and Notifications
                        </span>
                    </div>
                </div>
                <div className={`flex  min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${activeTab === "plan" ? "border border-zinc-800 bg-zinc-900 text-white" : "text-secondary hover:!text-white"}`} onClick={() => { setActiveTab("plan"); router.push("/plan") }}>
                    <div className="flex-none">
                        <Receipt className="w-4 h-4" />
                    </div>
                    <div className="relative overflow-hidden">
                        <span className="invisible block text-sm whitespace-nowrap">Manage My Plan</span>
                        <span className="absolute inset-0 block text-sm whitespace-nowrap opacity-0 group-hover/side-menu:opacity-100 transition-opacity duration-150">
                            Plan
                        </span>
                    </div>
                </div>
                <div className={`flex min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${activeTab === "safety" ? "border border-zinc-800 bg-zinc-900 text-white" : "text-secondary hover:!text-white"}`} onClick={() => setActiveTab("safety")}>
                    <div className="flex-none">
                        <Shield className="w-4 h-4" />
                    </div>
                    <div className="relative overflow-hidden">
                        <span className="invisible block text-sm whitespace-nowrap">Safety</span>
                        <span className=" absolute inset-0 block text-sm whitespace-nowrap opacity-0 group-hover/side-menu:opacity-100 transition-opacity duration-150" >
                            Safety
                        </span>
                    </div>
                </div>

                <div className={`flex min-w-[36px] min-h-[36px] items-center justify-start px-2 gap-2 shrink-0 cursor-pointer ${activeTab === "how" ? "border border-zinc-800 bg-zinc-900 text-white" : "text-secondary hover:!text-white"}`} onClick={() => setActiveTab("how")}>
                    <div className="flex-none">
                        <Pyramid className="w-4 h-4" />
                    </div>
                    <div className="relative overflow-hidden">
                        <span className="invisible block text-sm whitespace-nowrap" >How it works?</span>
                        <span className=" absolute inset-0 block text-sm whitespace-nowrap opacity-0 group-hover/side-menu:opacity-100 transition-opacity duration-150" >
                            How it works?
                        </span>
                    </div>
                </div>

            </div>

        </div>
    )
}