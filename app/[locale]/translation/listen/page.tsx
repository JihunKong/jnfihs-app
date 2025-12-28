'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Headphones, Volume2, Save, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput, GlassTextarea } from '@/components/ui/GlassInput';
import { useDevice } from '@/hooks/useDevice';

type Caption = {
  original: string;
  translated: string;
  timestamp: number;
  provisional?: boolean; // 초벌 번역 여부
};

type InterimCaption = {
  original: string;
  translated: string;
};

export default function ListenPage() {
  const { locale } = useParams();
  const t = useTranslations('translation');
  const { isChromebook, isMobile } = useDevice();

  const [sessionCode, setSessionCode] = useState('');
  const [connected, setConnected] = useState(false);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [currentInterim, setCurrentInterim] = useState<InterimCaption | null>(null); // 현재 중간 전사
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const lastTimestampRef = useRef(0);
  const captionsEndRef = useRef<HTMLDivElement>(null);

  // Load saved notes
  useEffect(() => {
    if (sessionCode && connected) {
      const savedNotes = localStorage.getItem(`notes-${sessionCode}`);
      if (savedNotes) {
        setNotes(savedNotes);
      }
    }
  }, [sessionCode, connected]);

  // Auto-save notes
  useEffect(() => {
    if (sessionCode && connected && notes) {
      const timer = setTimeout(() => {
        localStorage.setItem(`notes-${sessionCode}`, notes);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [notes, sessionCode, connected]);

  // SSE: 실시간 자막 수신 (폴링 대신 EventSource 사용)
  useEffect(() => {
    if (!connected || !sessionCode) return;

    const eventSource = new EventSource(
      `/api/broadcast/stream?sessionId=${sessionCode}&locale=${locale}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'message') {
          // 중간 전사 처리 (interim)
          if (data.interim) {
            setCurrentInterim({
              original: data.original,
              translated: data.translated,
            });
            return;
          }

          // 최종 결과: 중간 전사 클리어
          setCurrentInterim(null);

          const caption: Caption = {
            original: data.original,
            translated: data.translated,
            timestamp: data.timestamp,
            provisional: data.provisional,
          };

          setCaptions((prev) => {
            // 동일 타임스탬프의 메시지가 있으면 업데이트 (provisional → final)
            const existingIndex = prev.findIndex(c => c.timestamp === data.timestamp);
            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = caption;
              return updated;
            }
            // 새 메시지 추가
            return [...prev, caption];
          });

          lastTimestampRef.current = data.timestamp;
        } else if (data.type === 'connected') {
          console.log('SSE connected to session:', sessionCode);
        }
      } catch (error) {
        console.error('SSE message parse error:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      // 연결 끊김 시 자동 재연결 시도 (브라우저 기본 동작)
    };

    return () => {
      eventSource.close();
    };
  }, [connected, sessionCode, locale]);

  // Scroll to latest caption
  useEffect(() => {
    captionsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [captions]);

  const handleConnect = () => {
    if (sessionCode.trim()) {
      setConnected(true);
      lastTimestampRef.current = Date.now();
    }
  };

  const saveAllCaptions = () => {
    const captionText = captions
      .map((c) => `[${new Date(c.timestamp).toLocaleTimeString()}]\n${c.original}\n${c.translated}\n`)
      .join('\n');

    const combinedContent = `# 수업 기록\n\n## 자막\n${captionText}\n\n## 내 노트\n${notes}`;

    const blob = new Blob([combinedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `수업노트-${sessionCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Join session screen
  if (!connected) {
    return (
      <div className="min-h-screen bg-oat-50">
        <Header showBack title={t('title')} />

        <main className="max-w-md mx-auto p-4 pt-12">
          <GlassCard className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-oat-200/50 flex items-center justify-center">
              <Headphones className="w-8 h-8 text-oat-700" />
            </div>
            <h2 className="text-xl font-bold text-oat-900 mb-6">{t('joinSession')}</h2>

            <div className="space-y-4">
              <GlassInput
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                placeholder={t('sessionCodePlaceholder')}
                label={t('sessionCode')}
              />

              <GlassButton
                variant="primary"
                className="w-full"
                onClick={handleConnect}
                disabled={!sessionCode.trim()}
              >
                {t('connect')}
              </GlassButton>
            </div>
          </GlassCard>
        </main>
      </div>
    );
  }

  // Connected - Chromebook layout (split view)
  if (isChromebook) {
    return (
      <div className="min-h-screen bg-oat-50">
        <Header showBack title={t('title')} />

        <main className="max-w-7xl mx-auto p-4">
          <div className="flex gap-4 h-[calc(100vh-100px)]">
            {/* Captions Panel - 60% */}
            <div className="w-3/5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-green-500 animate-pulse" />
                  <span className="text-oat-700 font-medium">{t('listening')}</span>
                </div>
                <span className="text-sm text-oat-500">{sessionCode}</span>
              </div>

              <div className="flex-1 glass-card overflow-y-auto scrollbar-hide">
                {captions.length === 0 && !currentInterim ? (
                  <p className="text-center text-oat-400 py-8">{t('waitingTeacher')}</p>
                ) : (
                  <div className="space-y-4">
                    {captions.map((caption, i) => (
                      <div
                        key={caption.timestamp}
                        className={`caption-enter transition-opacity duration-300 ${
                          caption.provisional ? 'opacity-60' : 'opacity-100'
                        }`}
                      >
                        <p className="text-xl text-oat-900 font-medium mb-1">
                          {caption.original}
                        </p>
                        <p className="text-sm text-oat-500">
                          {caption.translated}
                          {caption.provisional && (
                            <span className="ml-2 text-xs text-oat-400 animate-pulse">
                              (번역 중...)
                            </span>
                          )}
                        </p>
                      </div>
                    ))}
                    {/* 중간 전사 표시 (타이핑 효과) */}
                    {currentInterim && (
                      <div className="caption-typing opacity-60 border-l-2 border-oat-400 pl-3">
                        <p className="text-xl text-oat-700 font-medium mb-1 italic">
                          {currentInterim.original}
                          <span className="inline-block w-0.5 h-5 bg-oat-500 ml-1 animate-pulse" />
                        </p>
                        {currentInterim.translated ? (
                          <p className="text-sm text-oat-400 italic">
                            {currentInterim.translated}
                          </p>
                        ) : (
                          <p className="text-xs text-oat-400 animate-pulse">
                            {t('translating')}
                          </p>
                        )}
                      </div>
                    )}
                    <div ref={captionsEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Notes Panel - 40% */}
            <div className="w-2/5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-oat-700 font-medium">{t('notes')}</span>
                <div className="flex items-center gap-2">
                  {saved && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      {t('autoSaved')}
                    </span>
                  )}
                  <GlassButton size="sm" onClick={saveAllCaptions}>
                    <Save className="w-4 h-4" />
                  </GlassButton>
                </div>
              </div>

              <GlassTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('notesPlaceholder')}
                className="flex-1 resize-none"
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Mobile layout (stacked)
  return (
    <div className="min-h-screen bg-oat-50 pb-24">
      <Header showBack title={t('title')} />

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-green-500 animate-pulse" />
            <span className="text-oat-700 font-medium">{t('listening')}</span>
          </div>
          <span className="text-sm text-oat-500">{sessionCode}</span>
        </div>

        {/* Captions */}
        <GlassCard className="min-h-[200px] max-h-[300px] overflow-y-auto scrollbar-hide">
          {captions.length === 0 && !currentInterim ? (
            <p className="text-center text-oat-400 py-8">{t('waitingTeacher')}</p>
          ) : (
            <div className="space-y-4">
              {captions.slice(-5).map((caption, i) => (
                <div
                  key={caption.timestamp}
                  className={`caption-enter transition-opacity duration-300 ${
                    caption.provisional ? 'opacity-60' : 'opacity-100'
                  }`}
                >
                  <p className="text-lg text-oat-900 font-medium mb-1">
                    {caption.original}
                  </p>
                  <p className="text-sm text-oat-500">
                    {caption.translated}
                    {caption.provisional && (
                      <span className="ml-2 text-xs text-oat-400 animate-pulse">
                        (번역 중...)
                      </span>
                    )}
                  </p>
                </div>
              ))}
              {/* 중간 전사 표시 (타이핑 효과) */}
              {currentInterim && (
                <div className="caption-typing opacity-60 border-l-2 border-oat-400 pl-3">
                  <p className="text-lg text-oat-700 font-medium mb-1 italic">
                    {currentInterim.original}
                    <span className="inline-block w-0.5 h-4 bg-oat-500 ml-1 animate-pulse" />
                  </p>
                  {currentInterim.translated ? (
                    <p className="text-sm text-oat-400 italic">
                      {currentInterim.translated}
                    </p>
                  ) : (
                    <p className="text-xs text-oat-400 animate-pulse">
                      {t('translating')}
                    </p>
                  )}
                </div>
              )}
              <div ref={captionsEndRef} />
            </div>
          )}
        </GlassCard>

        {/* Notes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-oat-700 font-medium">{t('notes')}</span>
            {saved && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                {t('autoSaved')}
              </span>
            )}
          </div>
          <GlassTextarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('notesPlaceholder')}
            rows={4}
          />
        </div>

        {/* Save Button */}
        <GlassButton variant="primary" className="w-full" onClick={saveAllCaptions}>
          <Save className="w-4 h-4 mr-2" />
          {t('saveNotes')}
        </GlassButton>
      </main>
    </div>
  );
}
