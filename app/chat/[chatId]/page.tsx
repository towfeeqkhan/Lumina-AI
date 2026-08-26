import ChatConversation from "@/components/Chat/ChatConversation";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  return <ChatConversation chatId={chatId} />;
}
