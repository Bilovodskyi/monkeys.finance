"use client";

import { Globe } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useRouter, usePathname } from "next/navigation";

export function LanguageSelector({
    isPrivatePage,
}: {
    isPrivatePage: boolean;
}) {
    const router = useRouter();
    const pathname = usePathname();

    // Extract current locale from pathname (e.g., "/en/about" -> "en")
    const currentLocale = pathname.split("/")[1] || "en";

    const handleLocaleChange = (newLocale: string) => {
        // Replace the locale in the current pathname
        const pathWithoutLocale = pathname.split("/").slice(2).join("/");
        const newPath = `/${newLocale}${
            pathWithoutLocale ? `/${pathWithoutLocale}` : ""
        }`;
        router.push(newPath);
    };

    return (
        <Select value={currentLocale} onValueChange={handleLocaleChange}>
            <SelectTrigger className="z-20 border-none">
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-tertiary" />
                    {!isPrivatePage && <SelectValue className="gap-2" />}
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="uk">Ukrainian</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
            </SelectContent>
        </Select>
    );
}
