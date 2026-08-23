import Image from "next/image";

export default function ChatHeader() {
  return (
    <div className="text-center mb-12 flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center border border-black/5 mb-6 shadow-lg shadow-primary/5 relative">
        <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full -z-10" />
        <Image
          src="/lumina-ai-logo.png"
          alt="Lumina AI Logo"
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
        />
      </div>

      <h2 className="text-[48px] font-bold leading-[56px] tracking-[-0.02em] text-on-surface mb-4 drop-shadow-sm">
        <span className="text-primary font-bold">Lumina AI</span>
      </h2>

      <p className="text-[18px] font-normal leading-[28px] text-on-surface-variant max-w-lg">
        How can I assist you with your projects today?
      </p>
    </div>
  );
}
