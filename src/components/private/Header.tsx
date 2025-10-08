import { EntitlementResponse, getEntitlementForUser } from "@/services/entitlements";
import { formatEntitlementHeading } from "@/lib/entitlements";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Search } from "lucide-react";
import { LanguageSelector } from "../landing-page/LanguageSelector";
import { getTranslations } from "next-intl/server";

export default async function Header() {
    const { userId } = await auth();
    if (!userId) return null;

    const data: EntitlementResponse | null = await getEntitlementForUser(userId);
    if (!data) return null;

    const t = await getTranslations("header");
    const heading = await formatEntitlementHeading(data);

    return (
        <header className="border-b border-zinc-800 flex justify-between items-center px-6 h-[70px] shrink-0">
            <div className="flex items-center justify-between w-[300px] cursor-pointer group/search">
                <div className="flex items-center gap-2 p-5 text-tertiary text-sm group-hover/search:!text-white transition-all duration-150">
                    <Search className="w-4 h-4" />
                    {t("searchPlaceholder")}
                </div>
                <div className="text-tertiary text-xs border border-zinc-800 px-1 bg-zinc-900 group-hover/search:!text-white transition-all duration-150">
                    ⌘
                    k
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <LanguageSelector isPrivatePage={true} />
                <div className="text-secondary text-xs bg-neutral-900 px-2 py-1 rounded-full border border-zinc-800 shrink-0">{heading}</div>
                <UserButton />
            </div>
        </header>
    )
}