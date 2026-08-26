import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import {
  convertToModelMessages,
  consumeStream,
  createUIMessageStreamResponse,
  generateId,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { db } from "@/db";
import { isTransientDatabaseError, withDbRetry } from "@/db/retry";
import { chats, messages as messagesTable, type NewMessage } from "@/db/schema";
import { model } from "@/lib/ai";

export const maxDuration = 30;

const SYSTEM_PROMPT =
  "You are Lumina AI, a helpful, friendly, and concise assistant. Created by Towfeeq Khan " +
  "Answer clearly and use Markdown when it improves readability.";

type ChatRequestBody = {
  id?: string;
  messages?: UIMessage[];
};

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { id: chatId, messages } = body;

  if (!chatId || !Array.isArray(messages)) {
    return new Response("Missing chat id or messages", { status: 400 });
  }

  let ownedChat: { id: string } | undefined;
  try {
    [ownedChat] = await withDbRetry(() =>
      db
        .select({ id: chats.id })
        .from(chats)
        .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
        .limit(1),
    );
  } catch (error) {
    if (isTransientDatabaseError(error)) {
      return new Response("Database unavailable, please retry", {
        status: 503,
      });
    }
    return new Response("Chat not found", { status: 404 });
  }

  if (!ownedChat) {
    return new Response("Chat not found", { status: 404 });
  }

  const result = streamText({
    model,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  const stream = toUIMessageStream({
    stream: result.fullStream,
    originalMessages: messages,

    generateMessageId: generateId,
    onFinish: async ({ messages: finalMessages }) => {
      await persistMessages(chatId, finalMessages);
    },
  });

  return createUIMessageStreamResponse({
    stream,
    consumeSseStream: ({ stream: serverStream }) =>
      consumeStream({ stream: serverStream }),
  });
}

async function persistMessages(chatId: string, uiMessages: UIMessage[]) {
  if (uiMessages.length === 0) {
    return;
  }

  const rows: NewMessage[] = uiMessages.map((message) => ({
    id: message.id,
    chatId,
    role: message.role,
    parts: message.parts,
    metadata: message.metadata ?? null,
  }));

  try {
    await withDbRetry(() =>
      db.insert(messagesTable).values(rows).onConflictDoNothing(),
    );
    await withDbRetry(() =>
      db
        .update(chats)
        .set({ updatedAt: new Date() })
        .where(eq(chats.id, chatId)),
    );
  } catch (error) {
    console.error("Failed to persist chat messages:", error);
  }
}
