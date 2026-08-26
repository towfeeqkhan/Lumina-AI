"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { pendingMessageKey } from "@/components/Chat/NewChatComposer";
import ChatInput from "@/components/Chat/ChatInput";
import MarkdownMessage from "@/components/Chat/MarkdownMessage";

type ChatConversationProps = {
  chatId: string;
  title: string;
  initialMessages: UIMessage[];
};

function messageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export default function ChatConversation({
  chatId,
  title,
  initialMessages,
}: ChatConversationProps) {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: chatId,
    messages: initialMessages,
    transport,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentPendingRef = useRef(false);
  const isPinnedRef = useRef(true);

  useEffect(() => {
    if (sentPendingRef.current || initialMessages.length > 0) {
      return;
    }

    const key = pendingMessageKey(chatId);
    const pending = sessionStorage.getItem(key);

    if (pending) {
      sentPendingRef.current = true;
      sessionStorage.removeItem(key);
      window.history.replaceState(null, "", `/chat/${chatId}`);
      sendMessage({ text: pending });
    }
  }, [chatId, initialMessages.length, sendMessage]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isPinnedRef.current = distanceFromBottom < 80;
  };

  useEffect(() => {
    if (messages[messages.length - 1]?.role === "user") {
      isPinnedRef.current = true;
    }
    if (!isPinnedRef.current) {
      return;
    }
    const el = scrollRef.current;
    el?.scrollTo({ top: el.scrollHeight });
  }, [messages]);

  const isStreaming = status === "submitted" || status === "streaming";

  return (
    <main className="relative flex h-full min-h-0 flex-1 flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b border-black/5 bg-surface/80 pl-20 pr-4 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex w-full max-w-240 items-center">
          <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-on-surface">
            {title.length > 35
              ? `${title.slice(0, 35)}…`
              : title || "Untitled Chat"}
          </h1>
        </div>
      </header>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative min-h-0 flex-1 overflow-y-auto"
      >
        <div className="mx-auto flex w-full max-w-chat-max flex-col gap-5 px-4 py-8 md:px-10 md:py-10">
          {messages.map((message) => {
            const isUserMessage = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isUserMessage ? "justify-end" : "items-start gap-3 min-w-0"}`}
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
                  className={`max-w-[85%] wrap-break-word px-4 py-3 text-[14px] leading-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)] md:max-w-[75%] ${
                    isUserMessage
                      ? "rounded-2xl rounded-br-md bg-surface-container-high whitespace-pre-wrap text-on-surface"
                      : "rounded-2xl rounded-tl-md border-l-2 border-primary bg-surface-container-lowest text-on-surface"
                  }`}
                >
                  {isUserMessage ? (
                    messageText(message)
                  ) : (
                    <MarkdownMessage content={messageText(message)} />
                  )}
                </div>
              </div>
            );
          })}

          {isStreaming && messages[messages.length - 1]?.role === "user" && (
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
          )}

          {error && (
            <p className="mx-auto text-center text-sm text-error">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-black/5 bg-background/90 px-4 py-4 backdrop-blur-xl md:px-10 md:py-5">
        <div className="mx-auto w-full max-w-chat-max">
          <ChatInput
            onSendMessage={(text) => sendMessage({ text })}
            busy={isStreaming}
          />
        </div>
      </div>
    </main>
  );
}
