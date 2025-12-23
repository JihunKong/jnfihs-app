# 실시간 수업 번역 기능

## 🎯 기능 개요

| 항목 | 내용 |
|------|------|
| **목적** | 선생님의 한국어 수업을 학생 모국어로 실시간 번역 |
| **입력** | 선생님 음성 (한국어) |
| **출력** | 학생 화면에 모국어 자막 표시 |
| **지원 언어** | 몽골어, 러시아어, 베트남어 |

---

## 🛠️ 기술 스택

```
음성인식(STT):  Web Speech API (브라우저 내장, 무료)
               또는 Whisper API (OpenAI, 더 정확)
번역:          Claude API
실시간 전송:   Server-Sent Events (SSE) 또는 WebSocket
```

---

## 📐 아키텍처

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  선생님 PC   │     │   서버      │     │  학생 기기   │
│  (마이크)    │     │  (Railway)  │     │  (스마트폰)  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ 1. 음성 입력      │                   │
       ├──────────────────>│                   │
       │                   │                   │
       │ 2. STT 변환       │                   │
       │   (한국어 텍스트)  │                   │
       │                   │                   │
       │ 3. Claude 번역    │                   │
       │   (다국어)        │                   │
       │                   │                   │
       │                   │ 4. 실시간 전송    │
       │                   ├──────────────────>│
       │                   │   (SSE/WebSocket) │
       │                   │                   │
       │                   │         5. 자막 표시
       │                   │         (모국어)  │
```

---

## 💻 핵심 코드

### 1. 선생님용 음성 입력 페이지

`app/[locale]/broadcast/page.tsx`

```tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Radio } from 'lucide-react';

export default function BroadcastPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [sessionId, setSessionId] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // 세션 ID 생성 (수업별 고유 ID)
    setSessionId(`class-${Date.now()}`);
  }, []);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('이 브라우저는 음성인식을 지원하지 않습니다. Chrome을 사용해주세요.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;        // 연속 인식
    recognition.interimResults = true;    // 중간 결과도 표시
    recognition.lang = 'ko-KR';           // 한국어

    recognition.onresult = async (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(interimTranscript || finalTranscript);

      // 최종 결과만 서버로 전송 (번역용)
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
    };

    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Radio className="text-red-500" />
        실시간 수업 방송
      </h1>

      {/* 세션 코드 표시 */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-600">학생들에게 이 코드를 알려주세요:</p>
        <p className="text-3xl font-mono font-bold text-blue-600">{sessionId}</p>
      </div>

      {/* 음성 인식 버튼 */}
      <button
        onClick={isListening ? stopListening : startListening}
        className={`w-full p-6 rounded-xl flex items-center justify-center gap-3 text-xl font-semibold transition ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-8 h-8" />
            방송 중지
          </>
        ) : (
          <>
            <Mic className="w-8 h-8" />
            방송 시작
          </>
        )}
      </button>

      {/* 현재 인식된 텍스트 */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg min-h-[200px]">
        <p className="text-sm text-gray-500 mb-2">현재 인식 중:</p>
        <p className="text-lg">{transcript || '마이크에 대고 말씀하세요...'}</p>
      </div>
    </div>
  );
}
```

---

### 2. 서버 API - 번역 및 브로드캐스트

`app/api/broadcast/route.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 메모리 기반 세션 저장소 (실제로는 Redis 사용 권장)
const sessions = new Map<string, {
  original: string;
  translations: Record<string, string>;
  timestamp: number;
}[]>();

export async function POST(req: NextRequest) {
  const { sessionId, text } = await req.json();

  // 다국어 동시 번역
  const translations = await translateToMultipleLanguages(text);

  // 세션에 저장
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  sessions.get(sessionId)!.push({
    original: text,
    translations,
    timestamp: Date.now(),
  });

  return NextResponse.json({ success: true });
}

// 학생용 - 번역 결과 가져오기
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  const locale = req.nextUrl.searchParams.get('locale') || 'ko';
  const since = parseInt(req.nextUrl.searchParams.get('since') || '0');

  if (!sessionId || !sessions.has(sessionId)) {
    return NextResponse.json({ messages: [] });
  }

  const messages = sessions.get(sessionId)!
    .filter(m => m.timestamp > since)
    .map(m => ({
      original: m.original,
      translated: m.translations[locale] || m.original,
      timestamp: m.timestamp,
    }));

  return NextResponse.json({ messages });
}

async function translateToMultipleLanguages(text: string) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `다음 한국어 문장을 3개 언어로 번역해주세요. JSON 형식으로만 응답하세요.

문장: "${text}"

응답 형식:
{
  "mn": "몽골어 번역",
  "ru": "러시아어 번역", 
  "vi": "베트남어 번역"
}`
    }],
  });

  const content = response.content[0];
  if (content.type === 'text') {
    try {
      return JSON.parse(content.text);
    } catch {
      return { mn: text, ru: text, vi: text };
    }
  }
  return { mn: text, ru: text, vi: text };
}
```

---

### 3. 학생용 자막 페이지

`app/[locale]/listen/page.tsx`

```tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Headphones, Volume2 } from 'lucide-react';

type Message = {
  original: string;
  translated: string;
  timestamp: number;
};

export default function ListenPage() {
  const { locale } = useParams();
  const [sessionId, setSessionId] = useState('');
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const lastTimestampRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 폴링으로 새 메시지 가져오기
  useEffect(() => {
    if (!connected || !sessionId) return;

    const interval = setInterval(async () => {
      const res = await fetch(
        `/api/broadcast?sessionId=${sessionId}&locale=${locale}&since=${lastTimestampRef.current}`
      );
      const data = await res.json();
      
      if (data.messages.length > 0) {
        setMessages(prev => [...prev, ...data.messages]);
        lastTimestampRef.current = data.messages[data.messages.length - 1].timestamp;
      }
    }, 500); // 0.5초마다 체크

    return () => clearInterval(interval);
  }, [connected, sessionId, locale]);

  // 새 메시지 오면 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConnect = () => {
    if (sessionId.trim()) {
      setConnected(true);
      lastTimestampRef.current = Date.now();
    }
  };

  if (!connected) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Headphones className="text-blue-500" />
          수업 듣기
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              선생님이 알려준 수업 코드를 입력하세요:
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="class-1234567890"
              className="w-full p-3 border rounded-lg text-lg font-mono"
            />
          </div>

          <button
            onClick={handleConnect}
            className="w-full p-4 bg-blue-600 text-white rounded-lg font-semibold"
          >
            연결하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Volume2 className="text-green-500 animate-pulse" />
          실시간 자막
        </h1>
        <span className="text-sm text-gray-500">{sessionId}</span>
      </div>

      {/* 자막 영역 */}
      <div className="flex-1 overflow-y-auto bg-black rounded-lg p-4">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">선생님의 말씀을 기다리는 중...</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className="space-y-1">
                {/* 번역된 자막 (크게) */}
                <p className="text-white text-2xl font-medium">
                  {msg.translated}
                </p>
                {/* 원문 (작게) */}
                <p className="text-gray-400 text-sm">
                  {msg.original}
                </p>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 📱 사용 시나리오

### 선생님

1. `/ko/broadcast` 접속
2. "방송 시작" 버튼 클릭
3. 수업 코드(예: `class-1703234567`) 학생들에게 공유
4. 마이크에 대고 수업 진행

### 학생

1. `/mn/listen` (몽골어) 또는 `/ru/listen` (러시아어) 접속
2. 선생님이 알려준 수업 코드 입력
3. 화면에 실시간 자막 표시

---

## 🔧 개선 옵션

### 옵션 1: WebSocket 사용 (더 빠른 실시간)

```typescript
// 서버: Socket.io 또는 ws 라이브러리
// 클라이언트: useEffect에서 WebSocket 연결
```

### 옵션 2: Whisper API 사용 (더 정확한 STT)

```typescript
// 음성 파일을 OpenAI Whisper로 전송
const formData = new FormData();
formData.append('file', audioBlob, 'audio.webm');
formData.append('model', 'whisper-1');
formData.append('language', 'ko');

const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
  body: formData,
});
```

### 옵션 3: 자막 저장 기능

```typescript
// 수업 종료 후 자막 다운로드
// .srt 또는 .txt 형식으로 제공
```

---

## 💰 추가 비용 예상

| 항목 | 비용 | 비고 |
|------|------|------|
| Web Speech API | 무료 | 브라우저 내장 |
| Whisper API (선택) | ~$0.006/분 | 하루 6시간 = ~$1 |
| Claude 번역 | ~$0.01/문장 | 분당 10문장 = ~$3.6/시간 |

**예상 월 비용**: 하루 6시간 수업 × 20일 = 약 **$70~100/월** 추가

---

## 📁 추가 파일 구조

```
app/
├── [locale]/
│   ├── broadcast/
│   │   └── page.tsx     # 선생님용 (음성 입력)
│   └── listen/
│       └── page.tsx     # 학생용 (자막 보기)
├── api/
│   └── broadcast/
│       └── route.ts     # 번역 및 브로드캐스트 API
```

---

## 🎯 메인 메뉴 업데이트

`locales/ko.json`에 추가:

```json
{
  "home": {
    "broadcast": "수업 방송",
    "broadcastDesc": "실시간 수업 음성을 번역합니다",
    "listen": "수업 듣기",
    "listenDesc": "선생님 수업을 모국어 자막으로"
  }
}
```
