import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `다음 한국어 문장을 3개 언어로 번역해주세요. 반드시 JSON 형식으로만 응답하세요. 다른 텍스트 없이 오직 JSON만 출력하세요.

문장: "${text}"

응답 형식:
{"mn": "몽골어 번역", "ru": "러시아어 번역", "vi": "베트남어 번역"}`
      }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        // Extract JSON from response
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch {
        console.error('Failed to parse translation response');
      }
    }
  } catch (error) {
    console.error('Translation error:', error);
  }

  // Return original text if translation fails
  return { mn: text, ru: text, vi: text };
}
