'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Mic, MicOff, Radio, Copy, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';

export default function BroadcastPage() {
  const t = useTranslations('translation.broadcast');
  const [isListening, setIsListening] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [transcript, setTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef<any>(null);

  const createSession = async () => {
    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' }),
      });
      const data = await res.json();
      setSessionId(data.sessionId);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  useEffect(() => {
    createSession();
  }, []);

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('이 브라우저는 음성인식을 지원하지 않습니다. Chrome을 사용해주세요.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';

    recognition.onresult = async (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += result;
        } else {
          interimTranscript += result;
        }
      }

      setTranscript(interimTranscript || finalTranscript);

      // Send final transcript to server
      if (finalTranscript) {
        await fetch('/api/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            text: finalTranscript,
          }),
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('마이크 권한이 필요합니다.');
      }
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognition.start();
    setIsListening(true);
  };

  const stopListening = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div className="min-h-screen bg-oat-50">
      <Header showBack title={t('title')} />

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Session Code */}
        <GlassCard>
          <p className="text-sm text-oat-600 mb-2">{t('shareCode')}</p>
          <div className="flex items-center gap-3">
            <code className="text-2xl font-mono font-bold text-oat-900 flex-1">
              {sessionId || '...'}
            </code>
            <GlassButton onClick={copySessionId} size="sm">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </GlassButton>
          </div>
        </GlassCard>

        {/* Broadcast Button */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-full p-8 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
            isListening
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'glass-button-primary'
          }`}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isListening ? 'bg-white/20 animate-pulse' : 'bg-white/10'
          }`}>
            {isListening ? (
              <MicOff className="w-10 h-10" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </div>
          <span className="text-xl font-semibold">
            {isListening ? t('stopBroadcast') : t('startBroadcast')}
          </span>
          {isListening && (
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-sm">{t('broadcasting')}</span>
            </div>
          )}
        </button>

        {/* Current Transcript */}
        <GlassCard>
          <p className="text-sm text-oat-600 mb-3">{t('currentText')}</p>
          <p className="text-lg text-oat-900 min-h-[100px]">
            {transcript || '마이크에 대고 말씀하세요...'}
          </p>
        </GlassCard>
      </main>
    </div>
  );
}
