import React from "react";

export default function HoverEffectAroundCard({ offset = 10 }: { offset?: number }) {
    return (
        <>
            {/* Cyan border corners */}
            <div
                className="absolute inset-0 pointer-events-none text-cyan-500 hover-effect-pulse"
                style={{ filter: "drop-shadow(0px 0px 3px rgb(6 182 212))" }}
            >
                {/* Top-left */}
                <div className="absolute" style={{ top: -offset, left: -offset }}>
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path
                            d="M1.31146 16.2281L1.31146 1.03357L15.9259 1.03357"
                            stroke="currentColor"
                            strokeWidth="1.11248"
                        />
                    </svg>
                </div>

                {/* Top-right */}
                <div className="absolute" style={{ top: -offset, right: -offset, transform: "rotate(90deg)" }}>
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path
                            d="M1.31146 16.2281L1.31146 1.03357L15.9259 1.03357"
                            stroke="currentColor"
                            strokeWidth="1.11248"
                        />
                    </svg>
                </div>

                {/* Bottom-right */}
                <div className="absolute" style={{ bottom: -offset, right: -offset, transform: "rotate(180deg)" }}>
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path
                            d="M1.31146 16.2281L1.31146 1.03357L15.9259 1.03357"
                            stroke="currentColor"
                            strokeWidth="1.11248"
                        />
                    </svg>
                </div>

                {/* Bottom-left */}
                <div className="absolute" style={{ bottom: -offset, left: -offset, transform: "rotate(-90deg)" }}>
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
