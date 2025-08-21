import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                main: "#ffffff",
                secondary: "rgb(204, 204, 204)",
                highlight: "rgb(31, 213, 249)",
                background: "#000000",
            },
            fontFamily: {
                title: ["MainFont", "sans-serif"],
                main: ["Public Sans", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;