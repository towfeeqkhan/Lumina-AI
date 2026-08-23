"use client";

export default function SidebarFooter() {
  return (
    <div className="px-[24px] pt-4 pb-2 border-t border-black/5 mt-auto">
      <div className="flex flex-col gap-1">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 -mx-2 text-on-surface-variant hover:text-on-surface hover:bg-black/5 rounded-lg font-[600] text-[12px] leading-[14px] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            settings
          </span>
          Settings
        </a>
      </div>
    </div>
  );
}
