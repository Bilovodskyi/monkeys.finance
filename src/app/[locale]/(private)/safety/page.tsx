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

export default function SafetyPage() {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-center px-24 pt-12 shrink-0">
                <div className="flex flex-1 flex-col gap-4 justify-center">
                    <h1 className="text-4xl">
                        Your <span className="text-highlight">Security</span> is
                        Our Priority
                    </h1>
                    <h2 className="text-xl text-secondary w-2/3">
                        We use industry standards to protect you and your data.
                        Our main priority is to ensure a safe trading
                        experience.
                    </h2>
                    <div className="flex items-center gap-6 mt-4">
                        <h2 className="text-lg text-secondary">
                            We are using:
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
                    width={300}
                    height={300}
                    className="flex-1 h-[400px]"
                />
            </div>
            <div className="flex flex-1 gap-6 items-center justify-center px-24 py-12 shrink-0">
                <div className="flex-1 p-10 h-full border border-zinc-800 bg-[rgb(20,20,20)] space-y-4">
                    <div className="bg-[rgba(59,189,122,0.3)] border border-[rgba(59,189,122,0.5)] rounded-md p-2 h-[40px] w-[40px] flex items-center justify-center">
                        <Cloud color="#919191" />
                    </div>
                    <h1 className="text-2xl">Cloud</h1>
                    <h2 className="text-secondary text-md">
                        Your data is processed on AWS infrastructure. Nothing is
                        stored or processed in your browser, eliminating
                        client-side vulnerabilities
                    </h2>
                    <div className="flex gap-3 items-center pt-2">
                        <Server color="#919191" />
                        <p className="text-tertiary !text-md">
                            Enterprise-grade AWS security
                        </p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-zinc-700 to-transparent ml-7" />
                    <div className="flex gap-3 items-center">
                        <Globe color="#919191" />
                        <p className="text-tertiary !text-md">
                            Zero browser data exposure
                        </p>
                    </div>
                </div>
                <div className="flex-1 p-10 h-full border border-zinc-800 bg-[rgb(20,20,20)] space-y-4">
                    <div className="bg-[rgba(59,189,122,0.3)] border border-[rgba(59,189,122,0.5)] rounded-md p-2 h-[40px] w-[40px] flex items-center justify-center">
                        <LockKeyhole color="#919191" />
                    </div>
                    <h1 className="text-2xl">Auth</h1>
                    <h2 className="text-secondary text-md">
                        Multi-factor authentication powered by Clerk. Your
                        credentials are managed by security experts, not stored
                        in our database.
                    </h2>
                    <div className="flex gap-3 items-center pt-2">
                        <Fingerprint color="#919191" />
                        <p className="text-tertiary !text-md">
                            Multi-factor authentication (MFA)
                        </p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-zinc-700 to-transparent ml-7" />
                    <div className="flex gap-3 items-center">
                        <KeyRound color="#919191" />
                        <p className="text-tertiary !text-md">
                            No password storage liability
                        </p>
                    </div>
                </div>
                <div className="flex-1 p-10 h-full border border-zinc-800 bg-[rgb(20,20,20)] space-y-4">
                    <div className="bg-[rgba(59,189,122,0.3)] border border-[rgba(59,189,122,0.5)] rounded-md p-2 h-[40px] w-[40px] flex items-center justify-center">
                        <Database color="#919191" />
                    </div>
                    <h1 className="text-2xl">Database</h1>
                    <h2 className="text-secondary text-md">
                        Your account data is protected by the same database
                        infrastructure used by Fortune 500 companies. Automatic
                        backups ensure you'll never lose data
                    </h2>
                    <div className="flex gap-3 items-center pt-2">
                        <ChartColumn color="#919191" />
                        <p className="text-tertiary !text-md">
                            Enterprise-level data protection
                        </p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-zinc-700 to-transparent ml-7" />
                    <div className="flex gap-3 items-center">
                        <Cpu color="#919191" />
                        <p className="text-tertiary !text-md">
                            Continuous automatic backups
                        </p>
                    </div>
                </div>
                <div className="flex-1 p-10 h-full border border-zinc-800 bg-[rgb(20,20,20)] space-y-4">
                    <div className="bg-[rgba(59,189,122,0.3)] border border-[rgba(59,189,122,0.5)] rounded-md p-2 h-[40px] w-[40px] flex items-center justify-center">
                        <ShieldCheck color="#919191" />
                    </div>
                    <h1 className="text-2xl">Encryption</h1>
                    <h2 className="text-secondary text-md">
                        We encrypt your API keys with military-grade encryption
                        before storing them—adding an extra security layer on
                        top of database encryption.
                    </h2>
                    <div className="flex gap-3 items-center pt-2">
                        <Binary color="#919191" />
                        <p className="text-tertiary !text-md">
                            Keys unreadable even to us
                        </p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-zinc-700 to-transparent ml-7" />
                    <div className="flex gap-3 items-center">
                        <Layers2 color="#919191" />
                        <p className="text-tertiary !text-md">
                            Double-layer encryption protection
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
