"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Fuse, { FuseResult } from "fuse.js";
import { Search, X, FileText, ArrowRight, ExternalLink } from "lucide-react";
import type { SearchItem } from "@/lib/searchData.en";
import DialogDitherBackground from "../ui/DialogDitherBackground";

// Configure Fuse.js options
const fuseOptions = {
    keys: [
        { name: "title", weight: 0.4 },
        { name: "content", weight: 0.3 },
        { name: "keywords", weight: 0.2 },
        { name: "section", weight: 0.1 },
    ],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
};

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<FuseResult<SearchItem>[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("search");

    // Dynamically load search data based on locale
    const fuse = useMemo(() => {
        let data: SearchItem[] = [];
        
        // Import the correct search data based on locale
        try {
            switch (locale) {
                case "es":
                    data = require("@/lib/searchData.es").searchData;
                    break;
                case "ru":
                    data = require("@/lib/searchData.ru").searchData;
                    break;
                case "uk":
                    data = require("@/lib/searchData.uk").searchData;
                    break;
                default:
                    data = require("@/lib/searchData.en").searchData;
            }
        } catch (error) {
            console.error(`Failed to load search data for locale ${locale}:`, error);
            // Fallback to English
            data = require("@/lib/searchData.en").searchData;
        }

        // Initialize Fuse instance with locale-specific data
        return new Fuse(data, fuseOptions);
    }, [locale]);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setQuery("");
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Handle search
    useEffect(() => {
        if (query.length >= 2) {
            const searchResults = fuse.search(query).slice(0, 8);
            setResults(searchResults);
            setSelectedIndex(0);
        } else {
            setResults([]);
        }
    }, [query, fuse]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < results.length - 1 ? prev + 1 : prev
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        navigateToResult(results[selectedIndex].item);
                    }
                    break;
                case "Escape":
                    onClose();
                    break;
            }
        },
        [results, selectedIndex, onClose]
    );

    const navigateToResult = (item: SearchItem) => {
        if (item.isExternal) {
            // Open external docs links in a new tab
            window.open(item.path, "_blank");
        } else {
            // Navigate to internal app pages
            router.push(item.path);
        }
        onClose();
    };

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <DialogDitherBackground className="absolute inset-0 pointer-events-none -z-10" opacity={0.8} />
            <div className="w-full max-w-xl bg-background border border-zinc-700 shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-700">
                    <Search className="w-5 h-5 text-zinc-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t("placeholder")}
                        className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-lg"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="p-1 hover:bg-zinc-700 rounded"
                        >
                            <X className="w-4 h-4 text-zinc-400" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="text-xs text-zinc-500 border border-zinc-700 px-2 py-1 rounded hover:bg-zinc-800"
                    >
                        ESC
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto">
                    {query.length >= 2 && results.length === 0 && (
                        <div className="px-4 py-8 text-center text-zinc-500">
                            {t("noResults")} "{query}"
                        </div>
                    )}

                    {results.length > 0 && (
                        <ul className="py-2">
                            {results.map((result, index) => (
                                <li key={result.item.path}>
                                    <button
                                        onClick={() =>
                                            navigateToResult(result.item)
                                        }
                                        onMouseEnter={() =>
                                            setSelectedIndex(index)
                                        }
                                        className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors ${
                                            index === selectedIndex
                                                ? "bg-highlight/20"
                                                : "hover:bg-zinc-800"
                                        }`}
                                    >
                                        <FileText className="w-5 h-5 text-zinc-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-medium truncate">
                                                    {result.item.title}
                                                </span>
                                                {result.item.isExternal && (
                                                    <ExternalLink className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                                                )}
                                                {result.item.section && (
                                                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                                                        {result.item.section}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-zinc-400 truncate mt-1">
                                                {result.item.content.slice(
                                                    0,
                                                    100
                                                )}
                                                ...
                                            </p>
                                        </div>
                                        {index === selectedIndex && (
                                            <ArrowRight className="w-4 h-4 text-highlight mt-1 flex-shrink-0" />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {query.length < 2 && (
                        <div className="px-4 py-6 text-center text-zinc-500">
                            <p>{t("typeToSearch")}</p>
                            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                                <span className="bg-zinc-800 px-2 py-1 rounded">
                                    {t("exampleBitcoin")}
                                </span>
                                <span className="bg-zinc-800 px-2 py-1 rounded">
                                    {t("exampleInstance")}
                                </span>
                                <span className="bg-zinc-800 px-2 py-1 rounded">
                                    {t("exampleBacktest")}
                                </span>
                                <span className="bg-zinc-800 px-2 py-1 rounded">
                                    {t("exampleMl")}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-zinc-700 flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                        <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded">
                            ↑
                        </kbd>
                        <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded">
                            ↓
                        </kbd>
                        <span>{t("navigate")}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded">
                            ↵
                        </kbd>
                        <span>{t("open")}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded">
                            esc
                        </kbd>
                        <span>{t("close")}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
