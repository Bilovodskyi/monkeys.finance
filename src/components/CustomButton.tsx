import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

type CustomButtonType = {
    isBlue: boolean;
    children: ReactNode;
} & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

export function CustomButton({
    isBlue,
    children,
    ...props
}: CustomButtonType) {
    return (
        <button
            {...props}
            aria-disabled={props.disabled}
            className={`flex items-center shrink-0 px-4 md:px-12 py-2 rounded-md cursor-pointer h-9 ${isBlue
                ? "bg-highlight md:hover:bg-highlight/90"
                : "bg-transparent border border-zinc-200 md:hover:bg-zinc-800/50"
                } rounded-lg ${props.disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}>
            <div
                className={`text-sm ${isBlue ? "text-black" : "text-white"
                    }`}>
                {children}
            </div>
        </button>
    );
}
