'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { MessageCircle, X, Send, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

const QUICK_ACTIONS = [
  { label: 'Our Services', message: 'What services does Appalachian Growth Solutions offer?' },
  { label: 'Pricing', message: 'What are your pricing plans?' },
  { label: 'Get a Quote', message: "I'd like to get a free consultation and quote for my project." },
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 px-4">
      <div className="w-7 h-7 rounded-full bg-[#B6FF00] flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold text-[#050505]">A</span>
      </div>
      <div className="bg-[#0A0A0A] border border-[rgba(182,255,0,0.08)] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#666] animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-[#666] animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-[#666] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

/* --- Memoized sub-components to prevent input remounting --- */

const ChatInput = memo(function ChatInput({
  isLoading,
  onSend,
}: {
  isLoading: boolean;
  onSend: (text: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');

  const canSend = input.trim().length > 0 && !isLoading;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || isLoading) return;
      onSend(text);
      setInput('');
    },
    [input, isLoading, onSend]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = input.trim();
        if (!text || isLoading) return;
        onSend(text);
        setInput('');
      }
    },
    [input, isLoading, onSend]
  );

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3 bg-[#0A0A0A] border-t border-[rgba(182,255,0,0.08)] shrink-0">
      <div className="flex items-center gap-2 bg-[#111] border border-[rgba(182,255,0,0.12)] rounded-xl px-3 py-1.5 min-h-[44px] focus-within:border-[rgba(182,255,0,0.3)] transition-colors">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="flex-1 bg-transparent text-[13px] text-[#E5E5E5] placeholder:text-[#666] outline-none disabled:opacity-50"
          aria-label="Type your message"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-[#B6FF00] hover:bg-[#a3e600] disabled:opacity-30 disabled:hover:bg-[#B6FF00] flex items-center justify-center transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send className="w-3.5 h-3.5 text-[#050505]" />
        </button>
      </div>
    </form>
  );
});

const MessageBubble = memo(function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div
      className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
    >
      {msg.role === 'bot' ? (
        <div className="w-7 h-7 rounded-full bg-[#B6FF00] flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-[#050505]">A</span>
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-[#111] border border-[rgba(182,255,0,0.15)] flex items-center justify-center shrink-0">
          <User className="w-3.5 h-3.5 text-[#999]" />
        </div>
      )}
      <div
        className={`max-w-[75%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
          msg.role === 'user'
            ? 'bg-[#B6FF00] text-[#050505] rounded-2xl rounded-br-md font-medium'
            : 'bg-[#0A0A0A] text-[#E5E5E5] border border-[rgba(182,255,0,0.08)] rounded-2xl rounded-bl-md'
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
});

/* --- Main ChatWidget --- */

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showUnread, setShowUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  // Keep ref in sync
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Show unread dot after 3 seconds if chat hasn't been opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !hasGreeted) {
        setShowUnread(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen, hasGreeted]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoadingRef.current) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      isLoadingRef.current = true;
      setShowUnread(false);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text.trim() }),
        });

        const data = await res.json();

        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          role: 'bot',
          content: data.reply || "I'm here to help! Could you rephrase that?",
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch {
        const errorMessage: Message = {
          id: `bot-error-${Date.now()}`,
          role: 'bot',
          content: "Sorry, I couldn't connect. Please try again or reach us at appalachaingrowth@gmail.com",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    [] // stable — uses ref instead of isLoading in closure
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setShowUnread(false);
    setHasGreeted((prev) => {
      if (!prev) {
        setMessages([
          {
            id: 'greeting',
            role: 'bot',
            content: "Hi! \u{1F44B} I'm Appalachian Growth Solutions' AI assistant. How can I help you today?",
          },
        ]);
      }
      return true;
    });
  }, []);

  const toggleChat = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      handleOpen();
    }
  }, [isOpen, handleOpen]);

  const showQuickActions = messages.length === 1 && messages[0].role === 'bot' && !isLoading;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[55] flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)]">
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="w-[calc(100vw-2rem)] sm:w-[380px] max-h-[70vh] sm:max-h-[500px] bg-[#050505] border border-[rgba(182,255,0,0.12)] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_80px_rgba(182,255,0,0.04)] flex flex-col overflow-hidden"
            role="dialog"
            aria-label="AI Chat Assistant"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#0A0A0A] border-b border-[rgba(182,255,0,0.12)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#B6FF00] flex items-center justify-center">
                  <span className="text-xs font-bold text-[#050505]">A</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#E5E5E5] leading-tight">Appalachian Growth</h3>
                  <p className="text-[11px] text-[#999]">AI Assistant</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-[#999]" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {isLoading && <TypingIndicator />}

              {/* Quick Actions (show only after greeting, before any user messages) */}
              {showQuickActions && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="flex flex-wrap gap-2 pl-9"
                >
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => sendMessage(action.message)}
                      className="text-[11px] font-medium px-3 py-1.5 min-h-[36px] rounded-full border border-[rgba(182,255,0,0.2)] text-[#B6FF00] hover:bg-[rgba(182,255,0,0.08)] transition-colors cursor-pointer"
                    >
                      {action.label}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area — isolated memoized component */}
            <ChatInput isLoading={isLoading} onSend={sendMessage} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="w-14 h-14 rounded-full bg-[#B6FF00] shadow-[0_4px_20px_rgba(182,255,0,0.3)] hover:shadow-[0_4px_30px_rgba(182,255,0,0.45)] flex items-center justify-center transition-shadow duration-300 relative cursor-pointer"
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
      >
        {/* Pulse ring */}
        {!isOpen && !hasGreeted && (
          <span className="absolute inset-0 rounded-full bg-[#B6FF00] animate-ping opacity-20" />
        )}

        {/* Unread dot */}
        {showUnread && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-[#050505]" />
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-[#050505]" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6 text-[#050505]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
