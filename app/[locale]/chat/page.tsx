'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Send, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useDevice } from '@/hooks/useDevice';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatPage() {
  const { locale } = useParams();
  const t = useTranslations();
  const { isMobile } = useDevice();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, locale }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t('common.error') },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    t('chat.suggestions.q1'),
    t('chat.suggestions.q2'),
    t('chat.suggestions.q3'),
  ];

  return (
    <div className="min-h-screen bg-oat-50 flex flex-col">
      <Header showBack title={t('chat.title')} />

      <main className={`flex-1 flex flex-col max-w-4xl mx-auto w-full ${isMobile ? 'pb-32' : 'pb-8'}`}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-oat-600 mb-6">{t('chat.suggestions.title')}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(q);
                    }}
                    className="glass-card-sm text-sm text-oat-700 hover:bg-oat-200/50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-oat-700 text-white rounded-br-sm'
                    : 'glass-card rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="glass-card-sm flex items-center gap-2 text-oat-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('chat.thinking')}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-oat-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder')}
              className="glass-input flex-1"
              disabled={loading}
            />
            <GlassButton
              variant="primary"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              <Send className="w-5 h-5" />
            </GlassButton>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
