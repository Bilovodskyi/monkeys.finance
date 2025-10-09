import LedGridFlickerWrapper from "@/components/landing-page/LedGridAnimation";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-main-background relative">

            <SignUp
                appearance={{
                    baseTheme: dark,
                    variables: {
                        colorPrimary: "#1fd5f9",
                        colorBackground: "rgb(18, 18, 18)",
                        colorText: "#e5e5e5",
                        colorInputBackground: "rgb(24,24,27)",
                        borderRadius: "0rem",
                        fontSize: "14px",
                    },
                }}
            />
        </div>
    )
}