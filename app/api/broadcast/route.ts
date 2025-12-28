import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { activeSessions, broadcastEmitter, translationCache } from '@/lib/broadcast-store';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Google Translation API 키 (REST API용)
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';

// 언어 코드 매핑
const langCodeMap: Record<string, string> = {
  mn: 'mn', // 몽골어
  ru: 'ru', // 러시아어
  vi: 'vi', // 베트남어
};

// POST: Teacher broadcasts text
export async function POST(req: NextRequest) {
  try {
    const { sessionId, text, action, interim = false } = await req.json();

    // Create new session
    if (action === 'create') {
      const newSessionId = `class-${Date.now()}`;
      activeSessions.set(newSessionId, {
        messages: [],
        createdAt: Date.now(),
      });

      // Save to database
      try {
        await query(
          `INSERT INTO broadcast_sessions (session_code, is_active) VALUES ($1, true)`,
          [newSessionId]
        );
      } catch (e) {
        // DB might not be available, continue with in-memory
        console.log('DB not available, using in-memory storage');
      }

      return NextResponse.json({ sessionId: newSessionId });
    }

    // End session
    if (action === 'end') {
      activeSessions.delete(sessionId);
      try {
        await query(
          `UPDATE broadcast_sessions SET is_active = false, ended_at = NOW() WHERE session_code = $1`,
          [sessionId]
        );
      } catch (e) {
        console.log('DB not available');
      }
      return NextResponse.json({ success: true });
    }

    // Broadcast text
    if (!sessionId || !text) {
      return NextResponse.json(
        { error: 'Session ID and text are required' },
        { status: 400 }
      );
    }

    // 중간 전사 처리 (interim) - 빠른 Google 번역 후 즉시 전송
    if (interim) {
      translateInterim(text, sessionId).catch(console.error);
      return NextResponse.json({ success: true });
    }

    // 최종 전사: 다단계 번역 실행 (비동기로 백그라운드 처리)
    translateWithTwoPhases(text, sessionId).catch(console.error);

    // 즉시 응답 반환 (번역은 백그라운드에서 진행)
    return NextResponse.json({ success: true, pending: true });
  } catch (error) {
    console.error('Broadcast API error:', error);
    return NextResponse.json(
      { error: 'Failed to broadcast' },
      { status: 500 }
    );
  }
}

// GET: Students poll for messages
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  const locale = req.nextUrl.searchParams.get('locale') || 'ko';
  const since = parseInt(req.nextUrl.searchParams.get('since') || '0');

  if (!sessionId) {
    return NextResponse.json({ messages: [] });
  }

  const session = activeSessions.get(sessionId);
  if (!session) {
    return NextResponse.json({ messages: [], active: false });
  }

  const messages = session.messages
    .filter((m) => m.timestamp > since)
    .map((m) => ({
      original: m.original,
      translated: m.translations[locale] || m.original,
      timestamp: m.timestamp,
    }));

  return NextResponse.json({ messages, active: true });
}

// 단일 언어 번역 함수 (병렬 호출용)
async function translateToLanguage(text: string, targetLang: string): Promise<string> {
  const langNames: Record<string, string> = {
    mn: '몽골어',
    ru: '러시아어',
    vi: '베트남어'
  };

  try {
    const prompt = `다음 한국어를 ${langNames[targetLang]}로 번역하세요. 번역문만 출력하세요. 다른 설명 없이 번역 결과만:\n"${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    let responseText: string | undefined = response.text;

    // Fallback: try candidates structure
    if (!responseText) {
      const candidates = (response as any).candidates;
      if (candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = candidates[0].content.parts[0].text;
      }
    }

    if (responseText) {
      // 따옴표 제거 및 정리
      return responseText.trim().replace(/^["']|["']$/g, '');
    }
  } catch (error) {
    console.error(`Translation to ${targetLang} failed:`, error);
  }

  return text; // 실패 시 원문 반환
}

// Google Translation REST API로 빠른 번역 (캐시 확인 포함)
async function translateFast(text: string, targetLang: string): Promise<string> {
  // 1. 캐시 확인
  const cacheKey = `${text}:${targetLang}`;
  const cached = translationCache.get(cacheKey);
  if (cached) {
    console.log(`Cache hit for ${targetLang}`);
    return cached;
  }

  // 2. Google Translation REST API 호출
  try {
    if (!GOOGLE_API_KEY) {
      console.log('Google API Key not set, using original text');
      return text;
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'ko',
          target: langCodeMap[targetLang],
          format: 'text',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const translated = data.data?.translations?.[0]?.translatedText || text;
    console.log(`Google translated to ${targetLang}: ${translated.substring(0, 30)}...`);
    return translated;
  } catch (error) {
    console.error(`Google Translation failed for ${targetLang}:`, error);
    return text; // 실패 시 원문 반환
  }
}

// 다단계 번역: Phase 1 (빠른 Google) → Phase 2 (고품질 Gemini)
async function translateWithTwoPhases(text: string, sessionId: string): Promise<void> {
  const languages = ['mn', 'ru', 'vi'];
  const messageId = Date.now();

  console.log('=== Starting two-phase translation for:', text);

  // Phase 1: 빠른 초벌 번역 (Google Cloud Translation)
  const phase1Start = Date.now();
  try {
    const fastResults = await Promise.all(
      languages.map(lang => translateFast(text, lang))
    );

    const provisionalMessage = {
      original: text,
      translations: { ko: text, mn: fastResults[0], ru: fastResults[1], vi: fastResults[2] },
      timestamp: messageId,
      provisional: true,
    };

    // 세션에 저장
    const session = activeSessions.get(sessionId);
    if (session) {
      session.messages.push(provisionalMessage);
      if (session.messages.length > 100) {
        session.messages = session.messages.slice(-100);
      }
    } else {
      activeSessions.set(sessionId, {
        messages: [provisionalMessage],
        createdAt: Date.now(),
      });
    }

    // SSE로 초벌 번역 즉시 전송
    broadcastEmitter.emit(`session:${sessionId}`, provisionalMessage);
    console.log(`Phase 1 (Google) completed in ${Date.now() - phase1Start}ms`);
  } catch (error) {
    console.error('Phase 1 translation failed:', error);
  }

  // Phase 2: 고품질 번역 (Gemini) - 백그라운드
  const phase2Start = Date.now();
  try {
    const qualityResults = await Promise.all(
      languages.map(lang => translateToLanguage(text, lang))
    );

    const finalMessage = {
      original: text,
      translations: { ko: text, mn: qualityResults[0], ru: qualityResults[1], vi: qualityResults[2] },
      timestamp: messageId, // 동일한 타임스탬프로 업데이트
      provisional: false,
    };

    // 세션 메시지 업데이트 (기존 provisional 교체)
    const session = activeSessions.get(sessionId);
    if (session) {
      const msgIndex = session.messages.findIndex(m => m.timestamp === messageId);
      if (msgIndex !== -1) {
        session.messages[msgIndex] = finalMessage;
      }
    }

    // 캐시에 고품질 결과 저장
    languages.forEach((lang, i) => {
      translationCache.set(`${text}:${lang}`, qualityResults[i]);
    });

    // SSE로 최종 번역 전송
    broadcastEmitter.emit(`session:${sessionId}`, finalMessage);
    console.log(`Phase 2 (Gemini) completed in ${Date.now() - phase2Start}ms`);

    // DB 저장
    try {
      await query(
        `INSERT INTO broadcast_captions (session_id, original_text, translations)
         SELECT id, $2, $3 FROM broadcast_sessions WHERE session_code = $1`,
        [sessionId, text, JSON.stringify(finalMessage.translations)]
      );
    } catch (e) {
      console.log('DB not available');
    }
  } catch (error) {
    console.error('Phase 2 translation failed:', error);
  }
}

// 중간 전사 처리: 빠른 Google 번역 후 SSE 즉시 전송
async function translateInterim(text: string, sessionId: string): Promise<void> {
  const languages = ['mn', 'ru', 'vi'];

  try {
    // 빠른 Google 번역 (병렬)
    const fastResults = await Promise.all(
      languages.map(lang => translateFast(text, lang))
    );

    const interimMessage = {
      original: text,
      translations: { ko: text, mn: fastResults[0], ru: fastResults[1], vi: fastResults[2] },
      timestamp: Date.now(),
      interim: true, // 중간 전사 플래그
      provisional: false,
    };

    // SSE로 즉시 전송 (세션에 저장하지 않음 - 임시 데이터)
    broadcastEmitter.emit(`session:${sessionId}`, interimMessage);
  } catch (error) {
    console.error('Interim translation failed:', error);
  }
}

// Gemini로 단일 언어 고품질 번역
