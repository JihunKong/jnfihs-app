import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { activeSessions, broadcastEmitter } from '@/lib/broadcast-store';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// POST: Teacher broadcasts text
export async function POST(req: NextRequest) {
  try {
    const { sessionId, text, action } = await req.json();

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

    // Translate to multiple languages
    const translations = await translateToMultipleLanguages(text);

    // Store in memory
    const session = activeSessions.get(sessionId);
    const message = {
      original: text,
      translations,
      timestamp: Date.now(),
    };

    if (session) {
      session.messages.push(message);

      // Keep only last 100 messages
      if (session.messages.length > 100) {
        session.messages = session.messages.slice(-100);
      }

      // Save to database
      try {
        await query(
          `INSERT INTO broadcast_captions (session_id, original_text, translations)
           SELECT id, $2, $3 FROM broadcast_sessions WHERE session_code = $1`,
          [sessionId, text, JSON.stringify(translations)]
        );
      } catch (e) {
        console.log('DB not available');
      }
    } else {
      // Create session if it doesn't exist
      activeSessions.set(sessionId, {
        messages: [message],
        createdAt: Date.now(),
      });
    }

    // SSE: 새 메시지 이벤트 발생 (실시간 푸시)
    broadcastEmitter.emit(`session:${sessionId}`, message);

    return NextResponse.json({ success: true, translations });
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

// 모든 언어로 병렬 번역
async function translateToMultipleLanguages(text: string): Promise<Record<string, string>> {
  console.log('=== Starting parallel translation for:', text);
  const startTime = Date.now();

  try {
    // 3개 언어를 병렬로 동시 번역
    const [mn, ru, vi] = await Promise.all([
      translateToLanguage(text, 'mn'),
      translateToLanguage(text, 'ru'),
      translateToLanguage(text, 'vi'),
    ]);

    const elapsed = Date.now() - startTime;
    console.log(`=== Parallel translation completed in ${elapsed}ms ===`);

    return { ko: text, mn, ru, vi };
  } catch (error) {
    console.error('Parallel translation error:', error);
    return { ko: text, mn: text, ru: text, vi: text };
  }
}
