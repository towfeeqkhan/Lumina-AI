import SidebarHeader from "@/components/Sidebar/SidebarHeader";
import SidebarNav from "@/components/Sidebar/SidebarNav";
import SidebarFooter from "@/components/Sidebar/SidebarFooter";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col bg-surface-container backdrop-blur-md fixed left-0 top-0 h-full w-70 border-r border-black/5 shadow-xl py-[8px] transition-all duration-200 ease-in-out z-40">
      <SidebarHeader />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  );
}
