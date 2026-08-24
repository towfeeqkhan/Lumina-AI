import Image from "next/image";
import { Bell, CircleUserRound } from "lucide-react";

export default function MobileHeader() {
  return (
    <header className="md:hidden flex justify-between items-center px-[16px] h-16 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-black/5 shadow-sm fixed top-0 left-0">
      <div className="flex items-center gap-2">
        <Image
          src="/lumina-ai-logo.png"
          alt="Lumina AI Logo"
          width={32}
          height={32}
          className="h-8 w-8 rounded-lg object-contain"
        />
        <span className="text-[24px] font-semibold text-primary">
          Lumina AI
        </span>
      </div>
      <div className="flex gap-4 text-primary">
        <button className="hover:bg-black/5 transition-colors p-2 rounded-full cursor-pointer active:scale-95 active:transition-transform">
          <Bell size={22} strokeWidth={2} />
        </button>
        <button className="hover:bg-black/5 transition-colors p-2 rounded-full cursor-pointer active:scale-95 active:transition-transform">
          <CircleUserRound size={22} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
