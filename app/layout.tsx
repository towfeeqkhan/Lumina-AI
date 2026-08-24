import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileHeader from "@/components/Chat/MobileHeader";
import Sidebar from "@/components/Sidebar/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lumina AI - Chat",
  description: "Lumina AI — Pro Intelligence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden font-[var(--font-inter)]">
        <div className="flex h-screen overflow-hidden bg-background text-on-surface">
          <MobileHeader />
          <Sidebar />
          <div className="flex-1 flex flex-col md:ml-[280px] pt-16 md:pt-0">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
