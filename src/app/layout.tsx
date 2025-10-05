import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReduxProvider from "@/components/providers/ReduxProvider";
export const metadata: Metadata = {
  title: "AlgoSquid",
  description: "Machine Learning Cryptocurrency Trading Bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClerkProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
