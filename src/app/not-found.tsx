import Image from "next/image";
import "./globals.css";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="antialiased h-screen w-full bg-background">
        <div className="h-full w-full flex flex-col items-center justify-center">
          <Image src="/error-page.svg" alt="404" width={200} height={200} />
          <h1 className="text-2xl font-bold">Page Not Found</h1>
        </div>
      </body>
    </html>
  );
}
