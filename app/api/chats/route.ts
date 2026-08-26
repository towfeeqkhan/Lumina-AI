import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { chats } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", chats: [] },
        { status: 401 }
      );
    }

    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt));

    return NextResponse.json({ chats: userChats });
  } catch (error) {
    console.error("Error fetching chats from Neon DB:", error);
    return NextResponse.json(
      { message: "Internal server error", chats: [] },
      { status: 500 }
    );
  }
}
