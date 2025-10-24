import { CustomButton } from "@/components/CustomButton";
import { ArrowUpRight, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Bot() {
    const t = await getTranslations("header");

    return (
        <div className="flex flex-col gap-2 py-4 px-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-md">Don't see your crypto exchange?</h1>
                    <div className="text-highlight cursor-pointer hover:underline flex items-center gap-1">
                        <h1>Request it</h1>
                        <ArrowUpRight className="w-4 h-4 inline-block" />
                    </div>
                </div>
                <div className="flex items-center justify-between px-4 py-2 w-[300px] border border-zinc-800 cursor-pointer group/search">
                    <div className="flex items-center gap-2 text-tertiary group-hover/search:!text-white transition-all duration-150">
                        <Search className="w-4 h-4" />
                        Find Your Exchange
                    </div>
                    <div className="text-tertiary text-xs border border-zinc-800 px-1 bg-zinc-900 group-hover/search:!text-white transition-all duration-150">
                        ⌘ shift k
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-8">
                <div className="border border-zinc-800">
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold">
                                Binance API Key
                            </h1>
                            <p className="text-secondary">
                                You can find your API key in the{" "}
                                <a
                                    href="https://www.binance.com/en/my/settings/api-management"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-highlight hover:underline">
                                    Binance API Management
                                </a>{" "}
                                page.
                            </p>
                            <input
                                type="text"
                                className="border border-zinc-800 p-2 w-full outline-none mt-4"
                            />
                        </div>
                        <Image
                            src="/exchange-logo/binance.png"
                            width={140}
                            height={40}
                            alt="Binance API Key"
                            className="w-[140px] h-full brightness-0 invert"
                        />
                    </div>
                    <div className="h-[1px] w-full bg-zinc-800 mt-4" />
                    <div className="flex p-6 justify-end bg-[rgb(20,20,20)]">
                        <div>
                            <CustomButton isBlue={false}>Save</CustomButton>
                        </div>
                    </div>
                </div>
                <div className="border border-zinc-800">
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold">
                                Coinbase API Key
                            </h1>
                            <p className="text-secondary">
                                You can find your API key in the{" "}
                                <a
                                    href="https://www.coinbase.com/settings/api"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-highlight hover:underline">
                                    Coinbase API Management
                                </a>{" "}
                                page.
                            </p>
                            <input
                                type="text"
                                className="border border-zinc-800 p-2 w-full outline-none mt-4"
                            />
                        </div>
                        <Image
                            src="/exchange-logo/coinbase.png"
                            width={140}
                            height={40}
                            alt="Coinbase API Key"
                            className="w-[140px] h-full brightness-0 invert"
                        />
                    </div>
                    <div className="h-[1px] w-full bg-zinc-800 mt-4" />
                    <div className="flex p-6 justify-end bg-[rgb(20,20,20)]">
                        <div>
                            <CustomButton isBlue={false}>Save</CustomButton>
                        </div>
                    </div>
                </div>
                <div className="border border-zinc-800">
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold">
                                Kraken API Key
                            </h1>
                            <p className="text-secondary">
                                You can find your API key in the{" "}
                                <a
                                    href="https://www.kraken.com/en-us/account/api"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-highlight hover:underline">
                                    Kraken API Management
                                </a>{" "}
                                page.
                            </p>
                            <input
                                type="text"
                                className="border border-zinc-800 p-2 w-full outline-none mt-4"
                            />
                        </div>
                        <Image
                            src="/exchange-logo/kraken.webp"
                            width={140}
                            height={40}
                            alt="Kraken API Key"
                            className="w-[140px] h-full brightness-0 invert"
                        />
                    </div>
                    <div className="h-[1px] w-full bg-zinc-800 mt-4" />
                    <div className="flex p-6 justify-end bg-[rgb(20,20,20)]">
                        <div>
                            <CustomButton isBlue={false}>Save</CustomButton>
                        </div>
                    </div>
                </div>
                <div className="border border-zinc-800">
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold">OKX API Key</h1>
                            <p className="text-secondary">
                                You can find your API key in the{" "}
                                <a
                                    href="https://www.okx.com/account/settings/api"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-highlight hover:underline">
                                    OKX API Management
                                </a>{" "}
                                page.
                            </p>
                            <input
                                type="text"
                                className="border border-zinc-800 p-2 w-full outline-none mt-4"
                            />
                        </div>
                        <Image
                            src="/exchange-logo/okx.png"
                            width={140}
                            height={40}
                            alt="OKX API Key"
                            className="w-[140px] h-full"
                        />
                    </div>
                    <div className="h-[1px] w-full bg-zinc-800 mt-4" />
                    <div className="flex p-6 justify-end bg-[rgb(20,20,20)]">
                        <div>
                            <CustomButton isBlue={false}>Save</CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
