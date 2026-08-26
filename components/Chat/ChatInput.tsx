"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Mic, Plus } from "lucide-react";

type ChatInputProps = {
  onSendMessage?: (text: string) => void;
  disabled?: boolean;
  busy?: boolean;
  placeholder?: string;
};

export default function ChatInput({
  onSendMessage,
  disabled = false,
  busy = false,
  placeholder = "Message Lumina...",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "";

      el.style.height = Math.min(el.scrollHeight, 80) + "px";
    }
  };

  const submit = () => {
    const text = value.trim();
    if (!text || disabled || busy || !onSendMessage) {
      return;
    }

    onSendMessage(text);
    setValue("");

    const el = textareaRef.current;
    if (el) {
      el.style.height = "";
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const canSend = value.trim().length > 0 && !disabled && !busy;

  return (
    <div className="w-full relative">
      <div className="bg-surface-container-highest/60 backdrop-blur-xl border border-black/5 rounded-[2rem] p-2 pr-3 flex items-end input-glow transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        {/* Left: Add Button */}
        <button
          type="button"
          className="p-3 text-on-surface-variant hover:text-primary hover:bg-black/5 rounded-full transition-colors shrink-0 mb-1 cursor-pointer"
        >
          <Plus size={22} strokeWidth={2} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="input-scroll flex-1 bg-transparent border-none resize-none py-4 px-2 text-on-surface text-[16px] font-normal leading-[24px] placeholder:text-on-surface-variant/70 max-h-[80px] min-h-[56px] overflow-y-auto focus:outline-none focus:ring-0 disabled:opacity-60"
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />

        {/* Right Actions */}
        <div className="flex items-center gap-1 mb-1 ml-2">
          {/* Mode Selector Pill */}
          <div className="hidden sm:flex items-center bg-surface-variant rounded-full p-1 mr-2 border border-black/5">
            <button
              type="button"
              className="px-3 py-1.5 rounded-full bg-white shadow-sm text-on-surface font-[600] text-[12px] leading-[14px] transition-colors cursor-pointer"
            >
              Chat
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface font-[600] text-[12px] leading-[14px] transition-colors cursor-pointer"
            >
              Cowork
            </button>
          </div>

          {/* Mic Button */}
          <button
            type="button"
            className="p-2 text-on-surface-variant hover:text-secondary hover:bg-black/5 rounded-full transition-colors shrink-0 cursor-pointer"
          >
            <Mic size={20} strokeWidth={2} />
          </button>

          {/* Send Button */}
          <button
            type="button"
            onClick={submit}
            disabled={!canSend}
            aria-label="Send message"
            className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:bg-primary-fixed-dim transition-colors shadow-inner shrink-0 ml-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
