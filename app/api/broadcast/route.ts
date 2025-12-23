import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// In-memory store for active sessions (use Redis in production)
const activeSessions = new Map<string, {
  messages: Array<{
    original: string;
    translations: Record<string, string>;
    timestamp: number;
  }>;
  createdAt: number;
}>();

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
    if (session) {
      const message = {
        original: text,
        translations,
        timestamp: Date.now(),
      };
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
        messages: [{
          original: text,
          translations,
          timestamp: Date.now(),
        }],
        createdAt: Date.now(),
      });
    }

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

async function translateToMultipleLanguages(text: string): Promise<Record<string, string>> {
  console.log('=== Starting translation for:', text);

  try {
    const prompt = `다음 한국어 문장을 3개 언어로 번역해주세요. 반드시 JSON 형식으로만 응답하세요. 다른 텍스트 없이 오직 JSON만 출력하세요.

문장: "${text}"

응답 형식:
{"mn": "몽골어 번역", "ru": "러시아어 번역", "vi": "베트남어 번역"}`;

    console.log('Calling Gemini API...');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    console.log('Gemini API response received');
    console.log('Response keys:', Object.keys(response));
    console.log('Response.text type:', typeof response.text);
    console.log('Response.text value:', response.text);

    // Try multiple ways to get text from response
    let responseText: string | undefined = response.text;

    // Fallback: try candidates structure if text property is undefined
    if (!responseText) {
      console.log('response.text is empty, trying candidates...');
      const candidates = (response as any).candidates;
      console.log('Candidates:', JSON.stringify(candidates)?.substring(0, 500));
      if (candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = candidates[0].content.parts[0].text;
        console.log('Got text from candidates:', responseText);
      }
    }

    if (responseText) {
      try {
        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const translations = JSON.parse(jsonMatch[0]);
          // Always include Korean original
          translations['ko'] = text;
          console.log('Translation SUCCESS:', JSON.stringify(translations));
          return translations;
        } else {
          console.log('No JSON found in response:', responseText);
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Raw response was:', responseText);
      }
    } else {
      console.log('No response text available');
    }
  } catch (error: any) {
    console.error('=== Translation API ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
  }

  // Return original text for all languages if translation fails
  console.log('=== Translation FALLBACK - returning original text ===');
  return { ko: text, mn: text, ru: text, vi: text };
}
