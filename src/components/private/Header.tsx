"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { Menu, Search } from "lucide-react";
import { LanguageSelector } from "../landing-page/LanguageSelector";
import { useTranslations } from "next-intl";
import { dark } from "@clerk/themes";
import EntitlementBadge from "./EntitlementBadge";
import { useMobileMenu } from "@/context/MobileMenuContext";
import SearchModal from "./SearchModal";

export default function Header() {
    const { toggleMenu } = useMobileMenu();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const t = useTranslations("header");

    // Keyboard shortcut: Cmd/Ctrl + K to open search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <header className="border-b border-zinc-800 flex justify-between items-center px-4 md:px-6 h-[50px] md:h-[70px] shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleMenu}
                        className="md:hidden text-tertiary hover:text-white"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    
                    <div 
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden md:flex items-center justify-between w-[300px] cursor-pointer group/search"
                    >
                        <div className="flex items-center gap-2 p-5 text-tertiary group-hover/search:!text-white transition-all duration-150">
                            <Search className="w-4 h-4" />
                            {t("searchPlaceholder")}
                        </div>
                        <div className="text-tertiary text-xs border border-zinc-800 px-1 bg-zinc-900 group-hover/search:!text-white transition-all duration-150">
                            ⌘ k
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <LanguageSelector isPrivatePage={true} />

                    <div className="hidden md:flex shrink-0">
                        <EntitlementBadge />
                    </div>

                    <UserButton
                        appearance={{
                            baseTheme: dark,
                            variables: {
                                colorPrimary: "#1fd5f9",
                                colorBackground: "rgb(18, 18, 18)",
                                colorText: "#e5e5e5",
                                colorInputBackground: "rgb(24,24,27)",
                                borderRadius: "0rem",
                                fontSize: "14px",
                            },
                        }}
                        userProfileProps={{
                            appearance: {
                                baseTheme: dark,
                                variables: {
                                    colorPrimary: "white",
                                    colorBackground: "rgb(18, 18, 18)",
                                    colorText: "#e5e5e5",
                                    colorInputBackground: "rgb(24,24,27)",
                                    borderRadius: "0rem",
                                    fontSize: "14px",
                                },
                            },
                        }}
                    />
                </div>
            </header>

            <SearchModal 
                isOpen={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)} 
            />
        </>
    );
}
