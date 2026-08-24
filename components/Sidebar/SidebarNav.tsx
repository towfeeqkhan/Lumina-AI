"use client";

import { History, SquarePen } from "lucide-react";

const navItems = [
  { icon: SquarePen, label: "New Chat", active: true },
  { icon: History, label: "History", active: false },
];

export default function SidebarNav() {
  return (
    <nav className="flex-1 overflow-y-auto sidebar-scroll mt-4">
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => (
          <li key={item.label}>
            <a
              href="#"
              className="group flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg text-on-surface-variant font-[600] text-[14px] leading-[16px] tracking-[0.05em] hover:bg-black/5 transition-colors"
            >
              <item.icon
                size={20}
                strokeWidth={2}
                className={
                  item.active
                    ? "text-primary"
                    : "group-hover:text-primary transition-colors"
                }
              />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
