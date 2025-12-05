"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MetaballsLoader from "@/components/Loader";
import { CustomButton } from "@/components/CustomButton";
import { CheckCircle2 } from "lucide-react";

export default function TelegramSetupPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [username, setUsername] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setErrorMessage("Invalid link. Please try again.");
            return;
        }

        linkTelegramAccount(token);
    }, [searchParams]);

    async function linkTelegramAccount(token: string) {
        try {
            const response = await fetch("/api/telegram/link", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setUsername(data.username || "your account");

                // Attempt to close window automatically
                setTimeout(() => {
                    window.close();
                }, 1000);
            } else {
                setStatus("error");
                setErrorMessage(
                    data.error || "Failed to link account. Please try again."
                );
            }
        } catch {
            setStatus("error");
            setErrorMessage(
                "Network error. Please check your connection and try again."
            );
        }
    }

    const handleContinue = () => {
        window.close();

        // If window.close() fails (browser security), redirect to notifications
        setTimeout(() => {
            router.push("/notifications");
        }, 500);
    };

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full px-4">
                <div className="w-full max-w-md">
                    <MetaballsLoader />
                </div>
                <p className="mt-8 text-lg text-tertiary">
                    Linking your Telegram account...
                </p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <div className="max-w-md w-full rounded-lg p-6 text-center">
                    <h1 className="text-2xl font-title mb-4">Error</h1>
                    <p className="text-tertiary mb-6">{errorMessage}</p>
                    <CustomButton
                        isBlue={true}
                        onClick={() => router.push("/notifications")}>
                        Back to Notifications
                    </CustomButton>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="max-w-md w-full rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircle2 className="w-16 h-16" />
                </div>
                <h1 className="text-2xl font-title mb-4">
                    Account Linked Successfully!
                </h1>
                <p className="text-tertiary mb-2">
                    Your Telegram account{" "}
                    <span className="text-white font-mono">@{username}</span>{" "}
                    has been connected.
                </p>
                <p className="text-tertiary mb-8">
                    This window will close automatically. If it doesn&apos;t, you can
                    close it manually.
                </p>
                <CustomButton isBlue={true} onClick={handleContinue}>
                    Close Now
                </CustomButton>
            </div>
        </div>
    );
}
