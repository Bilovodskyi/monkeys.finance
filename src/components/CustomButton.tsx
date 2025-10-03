import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

type CustomButtonType = {
    isBlue: boolean;
    children: ReactNode;
    disabled?: boolean;
} & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

export function CustomButton({
    isBlue,
    children,
    disabled,
}: CustomButtonType) {
    return (
        <div

            aria-disabled={disabled}
            className={`flex items-center justify-center shrink-0 px-4 md:px-12 py-2 rounded-md cursor-pointer h-9 ${isBlue
                ? "relative group gap-2 overflow-hidden border text-sm font-semibold border-transparent bg-[#1fd5f9] shadow-[0_0_8px_rgba(31,213,249,0.25)] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-transparent hover:border-[#a5eefd] hover:shadow-[0_0_16px_rgba(31,213,249,0.25)]"
                : "bg-black border border-zinc-600 md:hover:bg-zinc-900"
                } rounded-lg ${disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}>
            {isBlue ? (
                <span className="relative overflow-hidden">
                    <span className="block invisible">{children}</span>
                    <span
                        className="
        absolute left-0 top-0 flex w-full flex-col transition-transform duration-300 ease-in-out
        group-hover:-translate-y-1/2"
                    >
                        <span className="h-full w-full text-black font-normal">{children}</span>
                        <span className="h-full w-full text-white font-normal">{children}</span>
                    </span>
                </span>
            ) : (
                <span className="text-white text-sm font-normal text-center">{children}</span>
            )}
        </div>
    );
}
