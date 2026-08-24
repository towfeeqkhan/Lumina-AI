import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SidebarShell from "@/components/Sidebar/SidebarShell";
import { ClerkProvider } from "@clerk/nextjs";

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
        <ClerkProvider>
          <SidebarShell>{children}</SidebarShell>
        </ClerkProvider>
      </body>
    </html>
  );
}
