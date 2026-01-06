'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Send, ArrowLeft, User, MessageCircle, LogIn, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';

type Teacher = {
  id: string;
  name: string;
  email?: string;
  role: string;
};

type Message = {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

export default function MessengerPage() {
  const t = useTranslations('messenger');
  const tAuth = useTranslations('auth');
  const { data: session, status } = useSession();
  const { locale } = useParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use session user ID instead of hardcoded value
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      fetchTeachers();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedTeacher && userId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedTeacher, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/messages?action=teachers');
      const data = await res.json();
      setTeachers(data.teachers || []);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedTeacher || !userId) return;
    try {
      const res = await fetch(
        `/api/messages?senderId=${userId}&receiverId=${selectedTeacher.id}`
      );
      const data = await res.json();
      setMessages(data.messages || []);

      // Mark as read
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: selectedTeacher.id,
          receiverId: userId,
        }),
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedTeacher || loading || !userId) return;

    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          receiverId: selectedTeacher.id,
          content: input.trim(),
        }),
      });

      if (res.ok) {
        setInput('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Send error:', error);
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

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-oat-50 pb-24">
        <Header showBack title={t('title')} />
        <main className="max-w-2xl mx-auto p-4 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-oat-500 animate-spin" />
        </main>
        <MobileNav />
      </div>
    );
  }

  // Unauthenticated state
  if (status === 'unauthenticated' || !userId) {
    return (
      <div className="min-h-screen bg-oat-50 pb-24">
        <Header showBack title={t('title')} />
        <main className="max-w-2xl mx-auto p-4">
          <GlassCard className="text-center py-8">
            <LogIn className="w-12 h-12 text-oat-400 mx-auto mb-4" />
            <p className="text-oat-600 mb-4">{t('selectTeacher')}</p>
            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-oat-600 text-white rounded-lg text-sm font-medium hover:bg-oat-700 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              {tAuth('signInWithGoogle')}
            </Link>
          </GlassCard>
        </main>
        <MobileNav />
      </div>
    );
  }

  // Teacher list view
  if (!selectedTeacher) {
    return (
      <div className="min-h-screen bg-oat-50 pb-24">
        <Header showBack title={t('title')} />

        <main className="max-w-2xl mx-auto p-4">
          <h2 className="text-lg font-bold text-oat-900 mb-4">{t('selectTeacher')}</h2>

          <div className="space-y-3">
            {teachers.map((teacher) => (
              <button
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className="w-full glass-card flex items-center gap-4 hover:bg-oat-200/50 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-full bg-oat-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-oat-600" />
                </div>
                <div>
                  <p className="font-medium text-oat-900">{teacher.name}</p>
                  <p className="text-sm text-oat-500">{teacher.role}</p>
                </div>
              </button>
            ))}

            {teachers.length === 0 && (
              <GlassCard className="text-center text-oat-500 py-8">
                {t('noTeachers')}
              </GlassCard>
            )}
          </div>
        </main>

        <MobileNav />
      </div>
    );
  }

  // Chat view
  return (
    <div className="min-h-screen bg-oat-50 flex flex-col">
      {/* Chat Header */}
      <div className="glass sticky top-0 z-10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setSelectedTeacher(null)}
          className="p-2 rounded-full hover:bg-oat-200/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-oat-700" />
        </button>
        <div className="w-10 h-10 rounded-full bg-oat-200 flex items-center justify-center">
          <User className="w-5 h-5 text-oat-600" />
        </div>
        <div>
          <p className="font-medium text-oat-900">{selectedTeacher.name}</p>
          <p className="text-xs text-oat-500">{selectedTeacher.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-oat-300 mx-auto mb-3" />
            <p className="text-oat-500">{t('startConversation')}</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-2xl ${
                msg.sender_id === userId
                  ? 'bg-oat-700 text-white rounded-br-sm'
                  : 'glass-card rounded-bl-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender_id === userId ? 'text-oat-200' : 'text-oat-400'
                }`}
              >
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 p-4 glass">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('placeholder')}
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

      <MobileNav />
    </div>
  );
}
