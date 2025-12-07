import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default async function Page({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <SignIn
                fallbackRedirectUrl={`/${locale}/instances`}
                signUpUrl={`/${locale}/sign-up`}
                appearance={{
                    baseTheme: dark,
                    variables: {
                        colorPrimary: "rgb(23, 252, 141)",
                        colorBackground: "rgb(18, 18, 18)",
                        colorText: "#e5e5e5",
                        colorInputBackground: "rgb(24,24,27)",
                        borderRadius: "0rem",
                        fontSize: "14px",
                    },
                }}
            />
        </div>
    );
}
