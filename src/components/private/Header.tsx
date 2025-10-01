import { UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";

export default function Header() {
    return (
        <header className="bg-black border-b border-zinc-800 flex justify-between items-center px-6 h-[70px] shrink-0">
            <div className="flex items-center justify-between w-[300px] cursor-pointer group/search">
                <div className="flex items-center gap-2 p-5 text-tertiary text-sm group-hover/search:!text-white transition-all duration-150">
                    <Search className="w-4 h-4" />
                    Find anything...
                </div>
                <div className="text-tertiary text-xs border border-zinc-800 px-1 bg-zinc-900 group-hover/search:!text-white transition-all duration-150">
                    ⌘
                    k
                </div>
            </div>
            <div className="flex items-center justify-between gap-4">
                <div className="text-secondary text-xs bg-zinc-900 px-2 py-1 rounded-full border border-zinc-800">Pro plan - 14 days left</div>
                <UserButton />
            </div>
        </header>
    )
}