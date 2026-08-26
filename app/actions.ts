"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { withDbRetry } from "@/db/retry";
import { chats } from "@/db/schema";

const MAX_TITLE_LENGTH = 80;

export async function createChat(firstMessage: string): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const trimmed = firstMessage.trim();
  const title = trimmed ? trimmed.slice(0, MAX_TITLE_LENGTH) : "New Chat";

  const [chat] = await withDbRetry(() =>
    db.insert(chats).values({ userId, title }).returning({ id: chats.id }),
  );

  return chat.id;
}
