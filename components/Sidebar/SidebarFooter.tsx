"use client";

import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function SidebarFooter() {
  const { user } = useUser();

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const displayIdentity =
    fullName || user?.primaryEmailAddress?.emailAddress || "User";

  return (
    <div className="px-[24px] pt-4 pb-2 border-t border-black/5 mt-auto">
      <div className="flex flex-col gap-2">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-primary-container/85 text-on-primary-container hover:bg-primary-container transition-colors font-[700] text-[12px] leading-[14px] tracking-[0.04em] cursor-pointer">
              Login
            </button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-surface-container-high border border-black/5">
            <div className="min-w-0">
              <span className="truncate text-[12px] leading-[14px] font-[700] text-on-surface">
                {displayIdentity}
              </span>
            </div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </div>
        </Show>
      </div>
    </div>
  );
}
