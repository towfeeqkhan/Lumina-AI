"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";

type SidebarShellProps = {
  children: React.ReactNode;
};

export default function SidebarShell({ children }: SidebarShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.matchMedia("(min-width: 768px)").matches;
  });

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 768px)");

    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        setIsSidebarOpen(false);
      }
    };

    desktopMedia.addEventListener("change", handleViewportChange);

    return () => {
      desktopMedia.removeEventListener("change", handleViewportChange);
    };
  }, []);

  const closeSidebarOnMobile = () => {
    if (!window.matchMedia("(min-width: 768px)").matches) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/10 md:hidden"
        />
      )}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        onNavigate={closeSidebarOnMobile}
      />
      <div
        className={`flex-1 flex flex-col transition-[margin] duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-[280px]" : "md:ml-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
