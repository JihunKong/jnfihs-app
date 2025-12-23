# 핵심 코드 스니펫

## 1. package.json

```json
{
  "name": "jnfihs-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p ${PORT:-3000}"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@anthropic-ai/sdk": "^0.24.0",
    "next-intl": "^3.15.0",
    "lucide-react": "^0.395.0"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "@types/node": "^20.12.12",
    "@types/react": "^18.3.3",
    "tailwindcss": "^3.4.4",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19"
  }
}
```

---

## 2. Dockerfile

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 3. next.config.js

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
};
```

---

## 4. app/[locale]/layout.tsx

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <header className="bg-blue-800 text-white p-4">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <h1 className="text-xl font-bold">전남미래국제고</h1>
              <LanguageSelector currentLocale={locale} />
            </div>
          </header>
          <main className="max-w-4xl mx-auto p-4">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## 5. app/[locale]/page.tsx (메인 페이지)

```tsx
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { BookOpen, MessageCircle, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('home');

  const menuItems = [
    { href: '/regulations', icon: BookOpen, title: t('regulations'), desc: t('regulationsDesc') },
    { href: '/chat', icon: MessageCircle, title: t('chat'), desc: t('chatDesc') },
    { href: '/complaints', icon: AlertCircle, title: t('complaints'), desc: t('complaintsDesc') },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">{t('welcome')}</h2>
      <div className="grid gap-4">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition">
            <item.icon className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

---

## 6. app/api/chat/route.ts (Claude API 연동)

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 학생생활규정 요약 (실제로는 전체 규정 텍스트)
const REGULATIONS_CONTEXT = `
전남미래국제고등학교 학생생활규정 요약:

제9조(전자기기 사용)
- 수업 중 사용 금지 (교사 허가 시 예외)
- 쉬는 시간, 점심시간, 방과 후 사용 가능
- 기숙사 취침시간(22:30) 이후 사감에게 제출

제26조(기숙사 생활 원칙)
- 공동체 생활 질서 준수
- 다른 문화와 생활습관 존중

제27조(외출 및 외박)
- 주말/공휴일 외출 가능 (09:00~21:00)
- 외출 시 외국인등록증 소지

제30조(할랄 급식)
- 돼지고기 배제 식단 제공
- 라마단 기간 새벽/저녁 급식 지원
`;

export async function POST(req: NextRequest) {
  const { message, locale } = await req.json();

  const languageMap: Record<string, string> = {
    ko: '한국어',
    mn: '몽골어',
    ru: '러시아어',
    vi: '베트남어',
  };

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: `당신은 전남미래국제고등학교의 학생생활규정 안내 도우미입니다.
학생들의 질문에 친절하고 정확하게 답변하세요.
반드시 ${languageMap[locale] || '한국어'}로 답변하세요.

참고할 학생생활규정:
${REGULATIONS_CONTEXT}`,
    messages: [{ role: 'user', content: message }],
  });

  const text = response.content[0].type === 'text' 
    ? response.content[0].text 
    : '';

  return NextResponse.json({ reply: text });
}
```

---

## 7. app/[locale]/chat/page.tsx (채팅 UI)

```tsx
'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Send } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function ChatPage() {
  const { locale } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, locale }),
    });
    const data = await res.json();

    setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-500">답변 작성 중...</div>}
      </div>
      
      <div className="flex gap-2 p-4 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="질문을 입력하세요..."
          className="flex-1 p-3 border rounded-lg"
        />
        <button onClick={sendMessage} className="p-3 bg-blue-600 text-white rounded-lg">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

---

## 8. locales/ko.json

```json
{
  "home": {
    "welcome": "전남미래국제고에 오신 것을 환영합니다",
    "regulations": "학생생활규정",
    "regulationsDesc": "학교 규정을 확인하세요",
    "chat": "AI 상담",
    "chatDesc": "규정에 대해 질문하세요",
    "complaints": "불편사항 접수",
    "complaintsDesc": "건의사항을 남겨주세요"
  },
  "chat": {
    "placeholder": "질문을 입력하세요...",
    "loading": "답변 작성 중..."
  }
}
```

---

## 9. locales/mn.json (몽골어)

```json
{
  "home": {
    "welcome": "Чонам ирээдүйн олон улсын ахлах сургуульд тавтай морил",
    "regulations": "Оюутны амьдралын дүрэм",
    "regulationsDesc": "Сургуулийн дүрмийг шалгана уу",
    "chat": "AI зөвлөгөө",
    "chatDesc": "Дүрмийн талаар асуулт асуугаарай",
    "complaints": "Гомдол гаргах",
    "complaintsDesc": "Санал хүсэлтээ үлдээнэ үү"
  }
}
```

---

## 10. locales/ru.json (러시아어 - 카자흐/우즈벡)

```json
{
  "home": {
    "welcome": "Добро пожаловать в международную школу Чоннам",
    "regulations": "Правила школьной жизни",
    "regulationsDesc": "Ознакомьтесь с правилами школы",
    "chat": "AI консультация",
    "chatDesc": "Задайте вопрос о правилах",
    "complaints": "Подать жалобу",
    "complaintsDesc": "Оставьте свои предложения"
  }
}
```

---

## 11. locales/vi.json (베트남어)

```json
{
  "home": {
    "welcome": "Chào mừng đến trường THPT Quốc tế Jeonnam",
    "regulations": "Quy định sinh hoạt",
    "regulationsDesc": "Xem quy định của trường",
    "chat": "Tư vấn AI",
    "chatDesc": "Hỏi về quy định",
    "complaints": "Gửi khiếu nại",
    "complaintsDesc": "Để lại ý kiến đóng góp"
  }
}
```

---

## 12. middleware.ts (다국어 라우팅)

```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ko', 'mn', 'ru', 'vi'],
  defaultLocale: 'ko',
});

export const config = {
  matcher: ['/', '/(ko|mn|ru|vi)/:path*'],
};
```

---

## 13. i18n.ts

```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./locales/${locale}.json`)).default,
}));
```
