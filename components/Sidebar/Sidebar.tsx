"use client";

import SidebarHeader from "@/components/Sidebar/SidebarHeader";
import SidebarNav from "@/components/Sidebar/SidebarNav";
import SidebarFooter from "@/components/Sidebar/SidebarFooter";
import { PanelLeft } from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
};

export default function Sidebar({
  isOpen,
  onToggle,
  onNavigate,
}: SidebarProps) {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        aria-label="Open sidebar"
        className="fixed top-3 left-6 z-50 h-10 w-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-black/5 transition-colors cursor-pointer"
      >
        <PanelLeft size={20} />
      </button>
    );
  }

  return (
    <aside className="fixed left-0 top-0 flex h-full w-[280px] z-40 bg-surface-container backdrop-blur-md border-r border-black/5 shadow-xl overflow-hidden">
      <div className="flex flex-col h-full w-full py-[8px]">
        <SidebarHeader onToggle={onToggle} />
        <SidebarNav onNavigate={onNavigate} />
        <SidebarFooter />
      </div>
    </aside>
  );
}
