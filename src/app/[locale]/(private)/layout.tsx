import Header from "@/components/private/Header";
import HeaderSkeleton from "@/components/private/HeaderSkeleton";
import SideMenu from "@/components/private/SideMenu";
import { Suspense } from "react";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen relative">
            <SideMenu />
            <div className="flex flex-col w-full ml-[71px]">
                <Suspense fallback={<HeaderSkeleton />}>
                    <Header />
                </Suspense>
                <div className="overflow-y-scroll h-full">{children}</div>
            </div>
        </div>
    );
}
