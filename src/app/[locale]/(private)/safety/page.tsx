import {
    Binary,
    ChartColumn,
    Cloud,
    Cpu,
    Database,
    Fingerprint,
    Globe,
    KeyRound,
    Layers2,
    LockKeyhole,
    Server,
    ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function SafetyPage() {
    const t = useTranslations("safety");
    
    return (
        <div className="flex flex-col h-full overflow-y-auto 2xl:overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-center px-6 lg:px-24 pt-8 lg:pt-12 shrink-0 gap-8 lg:gap-0">
                <div className="flex flex-1 flex-col gap-4 justify-center">
                    <h1 className="text-3xl lg:text-4xl">
                        {t("header.title")} <span className="text-highlight">{t("header.titleHighlight")}</span> {t("header.titleEnd")}
                    </h1>
                    <h2 className="text-lg lg:text-xl text-secondary w-full lg:w-2/3 mx-auto lg:mx-0">
                        {t("header.description")}
                    </h2>
                    <div className="flex items-center gap-6 mt-4">
                        <h2 className="text-lg text-secondary">
                            {t("header.weAreUsing")}
                        </h2>
                        <Image
                            src="/security-logos/aws.svg"
                            alt="AWS Logo"
                            width={25}
                            height={25}
                            className="h-[25px]"
                        />
                        <Image
                            src="/security-logos/neon.svg"
                            alt="Neon Logo"
                            width={20}
                            height={20}
                            className="h-[20px]"
                        />
                        <Image
                            src="/security-logos/clerk.svg"
                            alt="Clerk Logo"
                            width={20}
                            height={20}
                            className="h-[20px]"
                        />
                    </div>
                </div>
                <Image
                    src="/illustrations/safetyPage.svg"
                    alt="Safety"
                    width={400}
                    height={400}
                    className="flex-1 h-[400px]"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-6 py-12 lg:px-18 lg:py-12 shrink-0">
                <div className="p-6 lg:p-8 h-full border border-zinc-800 bg-[rgb(20,20,20)] space-y-4">
                    <div className="bg-[rgba(59,189,122,0.3)] border border-[rgba(59,189,122,0.5)] rounded-md p-2 h-[40px] w-[40px] flex items-center justify-center">
                        <Cloud color="#919191" />
                    </div>
                    <h1 className="text-2xl">{t("features.cloud.title")}</h1>
                    <h2 className="text-secondary text-md">
                        {t("features.cloud.description")}
                    </h2>
                    <div className="flex gap-3 items-center pt-2">
                        <Server color="#919191" />
                        <p className="text-tertiary !text-md">
                            {t("features.cloud.point1")}
                        </p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-zinc-700 to-transparent ml-7" />
                    <div className="flex gap-3 items-center">
                        <Globe color="#919191" />
                        <p className="text-tertiary !text-md">
                            {t("features.cloud.point2")}
                        </p>
                    </div>
                </div>
                <div className="p-6 lg:p-8 h-full border border-zinc-800 bg-[rgb(20,20,20)] space-y-4">
                    <div className="bg-[rgba(59,189,122,0.3)] border border-[rgba(59,189,122,0.5)] rounded-md p-2 h-[40px] w-[40px] flex items-center justify-center">
                        <LockKeyhole color="#919191" />
                    </div>
                    <h1 className="text-2xl">{t("features.auth.title")}</h1>
                    <h2 className="text-secondary text-md">
                        {t("features.auth.description")}
                    </h2>
                    <div className="flex gap-3 items-center pt-2">
                        <Fingerprint color="#919191" />
                        <p className="text-tertiary !text-md">
                            {t("features.auth.point1")}
                        </p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-zinc-700 to-transparent ml-7" />
                    <div className="flex gap-3 items-center">
                        <KeyRound color="#919191" />
                        <p className="text-tertiary !text-md">
                            {t("features.auth.point2")}
                        </p>
                    </div>
                </div>
                <div className="p-6 lg:p-8 h-full border border-zinc-800 bg-[rgb(20,20,20)] space-y-4">
                    <div className="bg-[rgba(59,189,122,0.3)] border border-[rgba(59,189,122,0.5)] rounded-md p-2 h-[40px] w-[40px] flex items-center justify-center">
                        <Database color="#919191" />
                    </div>
                    <h1 className="text-2xl">{t("features.database.title")}</h1>
                    <h2 className="text-secondary text-md">
                        {t("features.database.description")}
                    </h2>
                    <div className="flex gap-3 items-center pt-2">
                        <ChartColumn color="#919191" />
                        <p className="text-tertiary !text-md">
                            {t("features.database.point1")}
                        </p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-zinc-700 to-transparent ml-7" />
                    <div className="flex gap-3 items-center">
                        <Cpu color="#919191" />
                        <p className="text-tertiary !text-md">
                            {t("features.database.point2")}
                        </p>
                    </div>
                </div>
                <div className="p-6 lg:p-8 h-full border border-zinc-800 bg-[rgb(20,20,20)] space-y-4">
                    <div className="bg-[rgba(59,189,122,0.3)] border border-[rgba(59,189,122,0.5)] rounded-md p-2 h-[40px] w-[40px] flex items-center justify-center">
                        <ShieldCheck color="#919191" />
                    </div>
                    <h1 className="text-2xl">{t("features.encryption.title")}</h1>
                    <h2 className="text-secondary text-md">
                        {t("features.encryption.description")}
                    </h2>
                    <div className="flex gap-3 items-center pt-2">
                        <Binary color="#919191" />
                        <p className="text-tertiary !text-md">
                            {t("features.encryption.point1")}
                        </p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-zinc-700 to-transparent ml-7" />
                    <div className="flex gap-3 items-center">
                        <Layers2 color="#919191" />
                        <p className="text-tertiary !text-md">
                            {t("features.encryption.point2")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
