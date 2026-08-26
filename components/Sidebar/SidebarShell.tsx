"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";

type SidebarShellProps = {
  children: React.ReactNode;
};

export default function SidebarShell({ children }: SidebarShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 768px)");

    setIsSidebarOpen(desktopMedia.matches);
    setHasMounted(true);

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

  const mainMarginClasses = hasMounted
    ? isSidebarOpen
      ? "md:ml-[280px]"
      : "md:ml-0"
    : "md:ml-[280px]";

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      {hasMounted && isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/10 md:hidden"
        />
      )}
      <Sidebar
        isOpen={isSidebarOpen}
        hasMounted={hasMounted}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        onNavigate={closeSidebarOnMobile}
      />
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ease-in-out ${mainMarginClasses}`}
      >
        {children}
      </div>
    </div>
  );
}
