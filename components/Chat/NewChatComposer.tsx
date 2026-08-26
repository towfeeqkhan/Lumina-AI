"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createChat } from "@/app/actions";
import ChatInput from "@/components/Chat/ChatInput";

export function pendingMessageKey(chatId: string) {
  return `lumina:pending:${chatId}`;
}

export default function NewChatComposer() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (isCreating) {
      return;
    }

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
      setIsCreating(false);
    }
  };

  return <ChatInput onSendMessage={handleSendMessage} disabled={isCreating} />;
}
