import type { Metadata } from "next";
import { Background } from "@/components/background";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrimsonSeek | Debate the Countercase",
  description:
    "Pick an example debate, make a claim, and let CrimsonSeek argue back with Linkup live-web evidence and Gemini debate strategy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,0,0"
        />
      </head>
      <body className="relative min-h-screen antialiased">
        <Background />
        <SiteHeader />
        <div className="relative">{children}</div>
      </body>
    </html>
  );
}
