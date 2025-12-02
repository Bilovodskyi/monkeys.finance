import Header from "@/components/private/Header";
import SideMenu from "@/components/private/SideMenu";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen relative">
            <SideMenu />
            <div className="flex flex-col w-full ml-[71px]">
                <Header />
                <div className="overflow-y-scroll h-full">{children}</div>
            </div>
        </div>
    );
}
