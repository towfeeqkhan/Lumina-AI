"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { createChat } from "@/app/actions";
import ChatInput from "@/components/Chat/ChatInput";

export function pendingMessageKey(chatId: string) {
  return `lumina:pending:${chatId}`;
}

const PENDING_AUTH_KEY = "lumina:pending-auth-message";

export default function NewChatComposer() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();
  const [isCreating, setIsCreating] = useState(false);
  const startingRef = useRef(false);

  const startChat = useCallback(
    async (text: string) => {
      if (startingRef.current) {
        return;
      }

      startingRef.current = true;
      setIsCreating(true);

      try {
        const chatId = await createChat(text);

        sessionStorage.setItem(pendingMessageKey(chatId), text);
        window.dispatchEvent(
          new CustomEvent("lumina:chat-created", {
            detail: { id: chatId, title: text.slice(0, 80) || "New Chat" },
          }),
        );
        router.push(`/chat/${chatId}?pending=${encodeURIComponent(text)}`);
      } catch (error) {
        console.error("Failed to start a new chat:", error);
        startingRef.current = false;
        setIsCreating(false);
      }
    },
    [router],
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    const pending = sessionStorage.getItem(PENDING_AUTH_KEY);
    if (pending) {
      sessionStorage.removeItem(PENDING_AUTH_KEY);
      startChat(pending);
    }
  }, [isLoaded, isSignedIn, startChat]);

  const handleSendMessage = (text: string) => {
    if (isCreating) {
      return;
    }

    if (!isSignedIn) {
      sessionStorage.setItem(PENDING_AUTH_KEY, text);
      clerk.openSignIn();
      return;
    }

    startChat(text);
  };

  return <ChatInput onSendMessage={handleSendMessage} disabled={isCreating} />;
}
