import Header from "@/components/private/Header";
import SideMenu from "@/components/private/SideMenu";
import { MobileMenuProvider } from "@/context/MobileMenuContext";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MobileMenuProvider>
            <div className="flex h-[100dvh] lg:h-screen relative overflow-hidden">
                <SideMenu />
                <div className="flex flex-col w-full md:ml-[71px] h-full">
                    <Header />
                    <div className="overflow-y-scroll h-full">{children}</div>
                </div>
            </div>
        </MobileMenuProvider>
    );
}
