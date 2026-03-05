"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Minimize2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  time: string;
  isSelf?: boolean;
}

const mockMessages: ChatMessage[] = [
  { id: "1", user: "CryptoKing", avatar: "CK", message: "BTC looking bullish today 🚀", time: "23:41" },
  { id: "2", user: "TraderJoe", avatar: "TJ", message: "Broke 97k resistance, next target 100k", time: "23:42" },
  { id: "3", user: "SatoshiFan", avatar: "SF", message: "Volume is insane right now", time: "23:43" },
  { id: "4", user: "AlexQuantum", avatar: "AQ", message: "Just opened a long position", time: "23:44", isSelf: true },
  { id: "5", user: "WhaleAlert", avatar: "WA", message: "Big buy wall at 97,500", time: "23:45" },
  { id: "6", user: "DeFiDegen", avatar: "DD", message: "ETH following BTC, both pumping", time: "23:46" },
  { id: "7", user: "MoonBoy", avatar: "MB", message: "Who else is holding since 60k? 💎🙌", time: "23:47" },
  { id: "8", user: "TraderJoe", avatar: "TJ", message: "RSI showing overbought on 15m, be careful", time: "23:48" },
  { id: "9", user: "CryptoKing", avatar: "CK", message: "Support at 97,200 looking strong", time: "23:49" },
  { id: "10", user: "SatoshiFan", avatar: "SF", message: "Futures funding rate going up 📈", time: "23:50" },
];

interface TradeChatboxProps {
  symbol: string;
}

export default function TradeChatbox({ symbol }: TradeChatboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [input, setInput] = useState("");
  const [onlineCount] = useState(1247);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: "AlexQuantum",
      avatar: "AQ",
      message: input.trim(),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      isSelf: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-accent hover:bg-accent-hover text-background shadow-lg shadow-accent/20 flex items-center justify-center transition-all hover:scale-105"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    );
  }

  // Minimized bar
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-[340px] rounded-xl bg-card border border-border shadow-2xl overflow-hidden">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center justify-between w-full px-4 py-3 hover:bg-card-hover transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageCircle className="h-4 w-4 text-accent" />
            {symbol} Chat
            <span className="flex items-center gap-1 text-[10px] text-accent font-normal">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              {onlineCount.toLocaleString()}
            </span>
          </span>
          <X className="h-4 w-4 text-muted" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
        </button>
      </div>
    );
  }

  // Full chatbox
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[340px] h-[480px] rounded-xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">{symbol} Chat</span>
          <span className="flex items-center gap-1 text-[10px] text-muted">
            <Users className="h-3 w-3" />
            {onlineCount.toLocaleString()} online
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors"
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", msg.isSelf && "flex-row-reverse")}>
            <div
              className={cn(
                "h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold",
                msg.isSelf
                  ? "bg-gradient-to-br from-accent to-cyan text-background"
                  : "bg-background border border-border text-muted"
              )}
            >
              {msg.avatar}
            </div>
            <div className={cn("max-w-[220px]", msg.isSelf && "text-right")}>
              <div className={cn("flex items-center gap-1.5 mb-0.5", msg.isSelf && "flex-row-reverse")}>
                <span className={cn("text-[10px] font-semibold", msg.isSelf ? "text-accent" : "text-foreground")}>
                  {msg.user}
                </span>
                <span className="text-[9px] text-muted">{msg.time}</span>
              </div>
              <p
                className={cn(
                  "text-xs leading-relaxed px-3 py-1.5 rounded-xl inline-block",
                  msg.isSelf
                    ? "bg-accent/10 text-foreground rounded-tr-sm"
                    : "bg-background border border-border text-foreground rounded-tl-sm"
                )}
              >
                {msg.message}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-2.5 border-t border-border shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted/50 outline-none focus:border-accent/50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
              input.trim()
                ? "bg-accent hover:bg-accent-hover text-background"
                : "bg-background border border-border text-muted"
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-[9px] text-muted/50 mt-1.5 text-center">Be respectful. No financial advice.</p>
      </div>
    </div>
  );
}
