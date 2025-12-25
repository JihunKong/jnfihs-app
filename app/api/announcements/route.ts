import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export type Announcement = {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'important' | 'urgent';
  translations: {
    ko: { title: string; content: string };
    mn: { title: string; content: string };
    ru: { title: string; content: string };
    vi: { title: string; content: string };
  };
  createdAt: number;
  author: string;
};

// In-memory store (use database in production)
const announcements: Announcement[] = [];

// POST: Create new announcement
export async function POST(req: NextRequest) {
  try {
    const { title, content, priority = 'normal', author = '관리자' } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Translate to multiple languages
    const translations = await translateAnnouncement(title, content);

    const announcement: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      priority,
      translations,
      createdAt: Date.now(),
      author,
    };

    // Add to in-memory store (prepend for newest first)
    announcements.unshift(announcement);

    // Keep only last 100 announcements
    if (announcements.length > 100) {
      announcements.pop();
    }

    // Try to save to database
    try {
      await query(
        `INSERT INTO announcements (title, content, priority, translations, author)
         VALUES ($1, $2, $3, $4, $5)`,
        [title, content, priority, JSON.stringify(translations), author]
      );
    } catch (e) {
      console.log('DB not available, using in-memory storage');
    }

    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    console.error('Announcement POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

// GET: List announcements
export async function GET(req: NextRequest) {
  try {
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');
    const priority = req.nextUrl.searchParams.get('priority');

    let filtered = announcements;
    if (priority) {
      filtered = announcements.filter((a) => a.priority === priority);
    }

    // Try to get from database first
    try {
      const rows = await query(
        `SELECT * FROM announcements ORDER BY created_at DESC LIMIT $1`,
        [limit]
      );
      if (rows.length > 0) {
        return NextResponse.json({
          announcements: rows.map((row: any) => ({
            id: row.id,
            title: row.title,
            content: row.content,
            priority: row.priority,
            translations: row.translations,
            createdAt: new Date(row.created_at).getTime(),
            author: row.author,
          })),
        });
      }
    } catch (e) {
      console.log('DB not available, using in-memory storage');
    }

    return NextResponse.json({
      announcements: filtered.slice(0, limit),
    });
  } catch (error) {
    console.error('Announcement GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get announcements' },
      { status: 500 }
    );
  }
}

async function translateAnnouncement(
  title: string,
  content: string
): Promise<Announcement['translations']> {
  const defaultTranslations: Announcement['translations'] = {
    ko: { title, content },
    mn: { title, content },
    ru: { title, content },
    vi: { title, content },
  };

  try {
    const prompt = `다음 한국어 공지사항을 3개 언어(몽골어, 러시아어, 베트남어)로 번역해주세요.
반드시 JSON 형식으로만 응답하세요.

제목: "${title}"
내용: "${content}"

응답 형식 (JSON만 출력):
{
  "mn": {"title": "몽골어 제목", "content": "몽골어 내용"},
  "ru": {"title": "러시아어 제목", "content": "러시아어 내용"},
  "vi": {"title": "베트남어 제목", "content": "베트남어 내용"}
}`;

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
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          ko: { title, content },
          mn: parsed.mn || { title, content },
          ru: parsed.ru || { title, content },
          vi: parsed.vi || { title, content },
        };
      }
    }
  } catch (error) {
    console.error('Translation error:', error);
  }

  return defaultTranslations;
}
