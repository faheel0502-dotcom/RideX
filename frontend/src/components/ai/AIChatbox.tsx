'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Send, X, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatboxProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatbox: React.FC<AIChatboxProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your RideX Gear Expert. Ask me anything about motorcycle helmets, jackets, sizing, or safety gear. How can I help you ride safer today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const chatHistory = [...messages, { role: 'user', content: userMsg }];
      const res = await apiFetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: chatHistory })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'I encountered an error. Please try again in a moment.' }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Unable to connect to the RideX AI service. Please check your connection.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Parses markdown-style links [Label](/url) into JSX
  const renderMessageContent = (text: string) => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={lastIndex}>{text.substring(lastIndex, match.index)}</span>);
      }
      parts.push(
        <Link
          key={match.index}
          href={match[2]}
          onClick={onClose}
          className="inline-block px-3 py-1 my-1 mx-0.5 text-xs font-semibold text-white bg-orange-accent hover:bg-orange-hover rounded-full transition-colors"
        >
          {match[1]}
        </Link>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-border bg-surface-raised shadow-2xl flex flex-col h-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4 bg-surface-card">
            <div className="flex items-center gap-2 text-orange-accent">
              <Sparkles className="h-5 w-5" />
              <span className="font-display font-bold tracking-wide text-text-primary">RideX Gear Expert</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-text-secondary hover:text-orange-accent transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border ${
                  msg.role === 'user' ? 'border-orange-accent bg-orange-accent/10' : 'border-border bg-surface-card'
                }`}>
                  {msg.role === 'user' ? <User className="h-4 w-4 text-orange-accent" /> : <Bot className="h-4 w-4 text-text-primary" />}
                </div>

                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-orange-accent text-white rounded-tr-none'
                    : 'bg-surface-card text-text-secondary border border-border/40 rounded-tl-none'
                }`}>
                  {msg.role === 'assistant' ? renderMessageContent(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-card">
                  <Bot className="h-4 w-4 text-text-primary" />
                </div>
                <div className="rounded-2xl bg-surface-card border border-border/40 px-4 py-2.5 text-sm rounded-tl-none flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-4 border-t border-border bg-surface-card flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about helmets, jackets, sizes..."
              className="flex-1 bg-canvas border border-border rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
              disabled={loading}
            />
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-accent text-white hover:bg-orange-hover transition-colors cursor-pointer"
              disabled={loading}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
