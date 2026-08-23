import Image from "next/image";

export default function SidebarHeader() {
  return (
    <div className="px-[24px] py-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-surface-variant flex items-center justify-center border border-black/5 overflow-hidden">
        <Image
          src="/lumina-ai-logo.png"
          alt="Lumina AI Logo"
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h1 className="text-[24px] font-semibold leading-tight text-primary m-0">
          Lumina
        </h1>
      </div>
    </div>
  );
}
