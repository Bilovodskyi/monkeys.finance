import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Search } from "lucide-react";
import { LanguageSelector } from "../landing-page/LanguageSelector";
import { getTranslations } from "next-intl/server";
import { dark } from "@clerk/themes";
import EntitlementBadge from "./EntitlementBadge";

export default async function Header() {
    const { userId } = await auth();
    if (!userId) return null;

    const t = await getTranslations("header");

    return (
        <header className="border-b border-zinc-800 flex justify-between items-center px-6 h-[70px] shrink-0">
            <div className="flex items-center justify-between w-[300px] cursor-pointer group/search">
                <div className="flex items-center gap-2 p-5 text-tertiary group-hover/search:!text-white transition-all duration-150">
                    <Search className="w-4 h-4" />
                    {t("searchPlaceholder")}
                </div>
                <div className="text-tertiary text-xs border border-zinc-800 px-1 bg-zinc-900 group-hover/search:!text-white transition-all duration-150">
                    ⌘ k
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <LanguageSelector isPrivatePage={true} />

                <EntitlementBadge />

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
    );
}
