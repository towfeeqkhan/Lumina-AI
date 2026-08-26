"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { MessageSquare, SquarePen, MessageSquareDashed } from "lucide-react";
import type { Chat } from "@/db/schema";

type SidebarNavProps = {
  onNavigate: () => void;
};

export default function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded, userId } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchChats = useCallback(async () => {
    if (!isSignedIn) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch (error) {
      console.error("Failed to load recent chats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    const fetchTimer = window.setTimeout(() => {
      fetchChats();
    }, 0);

    return () => window.clearTimeout(fetchTimer);
  }, [isLoaded, isSignedIn, userId, fetchChats]);

  useEffect(() => {
    const handleChatCreated = (event: Event) => {
      const { id, title } = (
        event as CustomEvent<{ id: string; title: string }>
      ).detail;
      setChats((currentChats) => [
        {
          id,
          userId: userId || "",
          title,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...currentChats.filter((chat) => chat.id !== id),
      ]);
    };

    window.addEventListener("lumina:chat-created", handleChatCreated);
    return () =>
      window.removeEventListener("lumina:chat-created", handleChatCreated);
  }, [userId]);

  const isNewChatActive = pathname === "/";

  return (
    <nav className="flex-1 flex flex-col min-h-0 overflow-hidden mt-2">
      {/* New Chat Button */}
      <div className="px-2">
        <Link
          href="/"
          onClick={onNavigate}
          className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-[14px] leading-snug tracking-[0.02em] transition-all duration-200 ${
            isNewChatActive
              ? "bg-primary/10 text-primary shadow-xs"
              : "text-on-surface-variant hover:bg-black/5 hover:text-on-surface"
          }`}
        >
          <SquarePen
            size={18}
            strokeWidth={2}
            className={
              isNewChatActive
                ? "text-primary"
                : "text-on-surface-variant group-hover:text-primary transition-colors"
            }
          />
          <span>New Chat</span>
        </Link>
      </div>

      {/* Recent Chats Section Header */}
      <div className="px-4 pt-5 pb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
          Recent Chats
        </span>
      </div>

      {/* Recent Chats List */}
      <div className="flex-1 overflow-y-auto sidebar-scroll px-2 space-y-0.5">
        {!isLoaded || (isSignedIn && isLoading) ? (
          <div className="flex flex-col gap-2 p-2 pt-1">
            <div className="space-y-1.5 px-2">
              <div className="h-7 bg-black/5 rounded-lg animate-pulse w-full" />
              <div className="h-7 bg-black/5 rounded-lg animate-pulse w-4/5" />
              <div className="h-7 bg-black/5 rounded-lg animate-pulse w-2/3" />
            </div>
          </div>
        ) : !isSignedIn ? (
          <div className="px-4 py-4 text-center">
            <p className="text-[12px] text-on-surface-variant/70 leading-relaxed">
              Sign in to view and save your recent chat history.
            </p>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 px-3 text-center text-on-surface-variant/60">
            <MessageSquareDashed
              size={24}
              className="mb-2 stroke-1 text-on-surface-variant/40"
            />
            <p className="text-[12px] font-medium">No recent chats yet</p>
            <p className="text-[11px] text-on-surface-variant/50 mt-0.5">
              Start a new conversation to begin
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {chats.map((chat) => {
              const isActive = pathname === `/chat/${chat.id}`;
              return (
                <li key={chat.id}>
                  <Link
                    href={`/chat/${chat.id}`}
                    onClick={onNavigate}
                    title={chat.title}
                    className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium leading-tight transition-all duration-150 ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-black/5"
                    }`}
                  >
                    <MessageSquare
                      size={15}
                      strokeWidth={1.8}
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-on-surface-variant/70 group-hover:text-primary"
                      }`}
                    />
                    <span className="truncate flex-1">
                      {chat.title || "Untitled Chat"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}
