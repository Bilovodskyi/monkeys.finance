import React from "react";

export default function HoverEffectAroundCard() {
    return (
        <>
            {/* Cyan border corners */}
            <div
                className="absolute left-0 top-0 h-full w-full text-cyan-500"
                style={{ filter: "drop-shadow(0px 0px 3px rgb(6, 182, 212)))" }}
            >
                {/* Top-left */}
                <div className="absolute -left-3 -top-3">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path
                            d="M1.31146 16.2281L1.31146 1.03357L15.9259 1.03357"
                            stroke="currentColor"
                            strokeWidth="1.11248"
                        />
                    </svg>
                </div>

                {/* Top-right */}
                <div className="absolute -right-3 -top-3 rotate-90">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path
                            d="M1.31146 16.2281L1.31146 1.03357L15.9259 1.03357"
                            stroke="currentColor"
                            strokeWidth="1.11248"
                        />
                    </svg>
                </div>

                {/* Bottom-right */}
                <div className="absolute -bottom-3 -right-3 rotate-180">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path
                            d="M1.31146 16.2281L1.31146 1.03357L15.9259 1.03357"
                            stroke="currentColor"
                            strokeWidth="1.11248"
                        />
                    </svg>
                </div>

                {/* Bottom-left */}
                <div className="absolute -bottom-3 -left-3 -rotate-90">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path
                            d="M1.31146 16.2281L1.31146 1.03357L15.9259 1.03357"
                            stroke="currentColor"
                            strokeWidth="1.11248"
                        />
                    </svg>
                </div>
            </div>
        </>

    );
}
