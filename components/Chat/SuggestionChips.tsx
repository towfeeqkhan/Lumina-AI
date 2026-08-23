"use client";

const suggestions = [
  { label: "Draft an API spec", showMobile: true },
  { label: "Review project timeline", showMobile: true },
  { label: "Debug Next.js routing", showMobile: false },
];

export default function SuggestionChips() {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      {suggestions.map((chip) => (
        <button
          key={chip.label}
          className={`px-4 py-2 rounded-lg bg-surface-variant border border-black/5 text-on-surface-variant hover:text-primary hover:border-primary/50 font-[600] text-[12px] leading-[14px] transition-all duration-300 cursor-pointer ${
            !chip.showMobile ? "hidden sm:inline-block" : ""
          }`}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
