import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { REGULATIONS_CONTEXT, languageNames } from '@/lib/regulations';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, locale } = await req.json();

    if (!message || !locale) {
      return NextResponse.json(
        { error: 'Message and locale are required' },
        { status: 400 }
      );
    }

    const languageName = languageNames[locale] || '한국어';

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `당신은 전남미래국제고등학교의 친절한 학생생활규정 안내 도우미입니다.
학생들의 질문에 친절하고 정확하게 답변하세요.
반드시 ${languageName}로 답변하세요.
답변은 간결하고 이해하기 쉽게 작성하세요.
답변 마지막에 관련 조항이 있다면 "(근거: 제N조)" 형식으로 표시하세요.

참고할 학생생활규정:
${REGULATIONS_CONTEXT}`,
      messages: [{ role: 'user', content: message }],
    });

    const text = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    );
  }
}
