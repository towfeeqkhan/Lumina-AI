import ChatHome from "@/components/Chat/ChatHome";
import MobileHeader from "@/components/Chat/MobileHeader";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function Home() {
  return (
    <div className="flex bg-background text-on-surface h-screen overflow-hidden">
      <MobileHeader />
      <Sidebar />
      <ChatHome />
    </div>
  );
}
