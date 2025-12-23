import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { REGULATIONS_CONTEXT, languageNames } from '@/lib/regulations';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = `당신은 전남미래국제고등학교의 친절한 학생생활규정 안내 도우미입니다.
학생들의 질문에 친절하고 정확하게 답변하세요.
반드시 ${languageName}로 답변하세요.
답변은 간결하고 이해하기 쉽게 작성하세요.
답변 마지막에 관련 조항이 있다면 "(근거: 제N조)" 형식으로 표시하세요.

참고할 학생생활규정:
${REGULATIONS_CONTEXT}`;

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: '네, 전남미래국제고등학교 학생생활규정 안내 도우미로서 학생들의 질문에 친절하게 답변하겠습니다.' }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    );
  }
}
