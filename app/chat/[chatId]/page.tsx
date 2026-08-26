import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import type { UIMessage } from "ai";
import { db } from "@/db";
import { withDbRetry } from "@/db/retry";
import { chats, messages as messagesTable } from "@/db/schema";
import ChatConversation from "@/components/Chat/ChatConversation";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const rows = await withDbRetry(() =>
    db
      .select({
        chatId: chats.id,
        title: chats.title,
        messageId: messagesTable.id,
        role: messagesTable.role,
        parts: messagesTable.parts,
        metadata: messagesTable.metadata,
      })
      .from(chats)
      .leftJoin(messagesTable, eq(messagesTable.chatId, chats.id))
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
      .orderBy(asc(messagesTable.createdAt)),
  );

  const chat = rows[0];
  if (!chat) {
    notFound();
  }

  const initialMessages: UIMessage[] = rows.flatMap((row) =>
    row.messageId && row.role && row.parts
      ? [
          {
            id: row.messageId,
            role: row.role as UIMessage["role"],
            parts: row.parts,
            ...(row.metadata ? { metadata: row.metadata } : {}),
          },
        ]
      : [],
  );

  return (
    <ChatConversation
      chatId={chat.chatId}
      title={chat.title}
      initialMessages={initialMessages}
    />
  );
}
