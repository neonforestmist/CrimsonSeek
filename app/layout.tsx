import type { Metadata } from "next";
import { Background } from "@/components/background";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrimsonSeek | web intelligence for evolving narratives",
  description:
    "Track narratives and public perception of any topic across modular time periods. Cut through SEO spam and fragmented discourse. Powered by Linkup.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen antialiased">
        <Background />
        <SiteHeader />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
