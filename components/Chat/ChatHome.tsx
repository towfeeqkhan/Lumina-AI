import ChatHeader from "@/components/Chat/ChatHeader";
import ChatInput from "@/components/Chat/ChatInput";
import SuggestionChips from "@/components/Chat/SuggestionChips";

export default function ChatHome() {
  return (
    <main className="flex-1 flex flex-col h-full relative">
      <div className="flex-1 flex flex-col items-center justify-center max-w-[800px] w-full mx-auto px-[16px] md:px-[40px] relative">
        <ChatHeader />
        <ChatInput />
        <SuggestionChips />
      </div>

      <div className="ambient-primary" />
      <div className="ambient-secondary" />
    </main>
  );
}
