"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowLeft, MessageSquare } from "lucide-react";
import ChatInput from "@/components/Chat/ChatInput";
import type { Message } from "@/db/schema";

type ChatConversationProps = {
  chatId: string;
};

type ChatDetails = {
  id: string;
  title: string;
};

type ChatResponse = {
  success: boolean;
  chat?: ChatDetails;
  messages?: Message[];
  message?: string;
};

function MessageSkeleton({ align }: { align: "left" | "right" }) {
  return (
    <div
      className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`h-16 w-2/3 animate-pulse rounded-2xl bg-surface-container-high ${
          align === "right" ? "max-w-80" : "max-w-150"
        }`}
      />
    </div>
  );
}

export default function ChatConversation({ chatId }: ChatConversationProps) {
  const [chat, setChat] = useState<ChatDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTimer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/chats/${chatId}`, {
          signal: controller.signal,
        });
        const data: ChatResponse = await response.json();

        if (!response.ok || !data.success || !data.chat || !data.messages) {
          throw new Error(data.message || "Unable to load this conversation.");
        }

        setChat(data.chat);
        setMessages(data.messages);
        setError(null);
      } catch (fetchError) {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === "AbortError"
        ) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load this conversation.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 0);

    return () => {
      window.clearTimeout(fetchTimer);
      controller.abort();
    };
  }, [chatId]);

  return (
    <main className="relative flex h-full min-h-0 flex-1 flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b border-black/5 bg-surface/80 pl-20 pr-4 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex w-full max-w-240 items-center">
          <div className="min-w-0">
            {isLoading ? (
              <div className="h-5 w-48 animate-pulse rounded-md bg-surface-container-high" />
            ) : (
              <h1 className="truncate text-[15px] font-semibold text-on-surface">
                {chat?.title || "Untitled Chat"}
              </h1>
            )}
          </div>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-chat-max flex-col gap-5 px-4 py-8 md:px-10 md:py-10">
          {isLoading ? (
            <div className="flex flex-col gap-5">
              <MessageSkeleton align="right" />
              <MessageSkeleton align="left" />
              <MessageSkeleton align="right" />
            </div>
          ) : error ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center text-on-surface-variant">
              <AlertCircle size={28} className="text-error" />
              <p className="text-sm">{error}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                <ArrowLeft size={16} />
                Back to chats
              </Link>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center text-on-surface-variant/70">
              <MessageSquare size={28} strokeWidth={1.5} />
              <p className="text-sm">No messages in this chat yet.</p>
            </div>
          ) : (
            messages.map((message) => {
              const isUserMessage = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUserMessage ? "justify-end" : "items-start gap-3"}`}
                >
                  {!isUserMessage && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                      <Image
                        src="/lumina-ai-logo.png"
                        alt="Lumina AI"
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap px-4 py-3 text-[14px] leading-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)] md:max-w-[75%] ${
                      isUserMessage
                        ? "rounded-2xl rounded-br-md bg-surface-container-high text-on-surface"
                        : "rounded-2xl rounded-tl-md border-l-2 border-primary bg-surface-container-lowest text-on-surface"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-black/5 bg-background/90 px-4 py-4 backdrop-blur-xl md:px-10 md:py-5">
        <div className="mx-auto w-full max-w-chat-max">
          <ChatInput />
        </div>
      </div>
    </main>
  );
}
