import Link from "next/link";
import Image from "next/image";
import SlidingTabs from "@/components/landing-page/SlidingLegalTabs";

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-zinc-800/50">
                <div className="px-4 xl:px-16 2xl:px-24 py-3 xl:py-6 flex items-center justify-between">
                    {/* Logo - left */}
                    <Link href="/" className="flex-shrink-0">
                        <Image
                            src="/monkeys-logo.svg"
                            alt="Monkeys Logo"
                            width={128}
                            height={32}
                            className="w-28 md:w-32"
                        />
                    </Link>
                    
                    {/* Tabs - center */}
                    <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
                        <SlidingTabs />
                    </div>
                    
                    {/* Spacer for balance */}
                    <div className="w-28 md:w-32 flex-shrink-0" />
                </div>
            </header>

            {/* Content */}
            <div className="py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
