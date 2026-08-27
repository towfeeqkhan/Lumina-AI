"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import ChatInput from "@/components/Chat/ChatInput";

export default function ChatLoading() {
  const pendingText = useSearchParams().get("pending") || "";

  return (
    <main className="relative flex h-full min-h-0 flex-1 flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b border-black/5 bg-surface/80 pl-20 pr-4 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex w-full max-w-240 items-center">
          <div className="h-5 w-48 animate-pulse rounded-md bg-surface-container-high" />
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-chat-max flex-col gap-5 px-4 py-8 md:px-10 md:py-10">
          {pendingText ? (
            <>
              <div className="flex justify-end">
                <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-surface-container-high px-4 py-3 text-[14px] leading-6 text-on-surface md:max-w-[75%]">
                  {pendingText}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                  <Image
                    src="/lumina-ai-logo.png"
                    alt="Lumina AI"
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border-l-2 border-primary bg-surface-container-lowest px-4 py-4">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant/40 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant/40 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant/40" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-end">
                <div className="h-16 w-2/3 max-w-80 animate-pulse rounded-2xl bg-surface-container-high" />
              </div>
              <div className="flex justify-start">
                <div className="h-24 w-3/4 max-w-150 animate-pulse rounded-2xl bg-surface-container-high" />
              </div>
              <div className="flex justify-end">
                <div className="h-12 w-1/2 max-w-64 animate-pulse rounded-2xl bg-surface-container-high" />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-black/5 bg-background/90 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:px-10 md:py-5">
        <div className="mx-auto w-full max-w-chat-max">
          <ChatInput disabled />
        </div>
      </div>
    </main>
  );
}
