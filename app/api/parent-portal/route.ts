import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Demo school events/photos
const schoolEvents = [
  {
    id: 'event-1',
    title: {
      ko: '2024 체육대회',
      mn: '2024 оны Спортын наадам',
      ru: 'Спортивный день 2024',
      vi: 'Ngày hội thể thao 2024',
    },
    date: '2024-05-15',
    photos: ['/images/sports-day-1.jpg', '/images/sports-day-2.jpg'],
    description: {
      ko: '학생들이 다양한 스포츠 경기에 참가했습니다.',
      mn: 'Сурагчид янз бүрийн спортын тэмцээнд оролцсон.',
      ru: 'Студенты участвовали в различных спортивных соревнованиях.',
      vi: 'Các học sinh đã tham gia nhiều môn thể thao.',
    },
  },
  {
    id: 'event-2',
    title: {
      ko: '문화 체험의 날',
      mn: 'Соёлын туршлагын өдөр',
      ru: 'День культурного опыта',
      vi: 'Ngày trải nghiệm văn hóa',
    },
    date: '2024-04-20',
    photos: ['/images/culture-day-1.jpg'],
    description: {
      ko: '각 나라의 전통 문화를 소개하는 행사',
      mn: 'Улс орон бүрийн уламжлалт соёлыг танилцуулах арга хэмжээ',
      ru: 'Мероприятие по представлению традиционной культуры каждой страны',
      vi: 'Sự kiện giới thiệu văn hóa truyền thống của mỗi quốc gia',
    },
  },
  {
    id: 'event-3',
    title: {
      ko: '학부모 참관 수업',
      mn: 'Эцэг эхийн хичээл үзэх',
      ru: 'Открытый урок для родителей',
      vi: 'Buổi học dành cho phụ huynh',
    },
    date: '2024-06-10',
    photos: [],
    description: {
      ko: '학부모님들이 직접 수업을 참관할 수 있는 날입니다.',
      mn: 'Эцэг эхчүүд хичээлийг шууд ажиглах өдөр.',
      ru: 'День, когда родители могут посетить занятия.',
      vi: 'Ngày phụ huynh có thể tham quan lớp học.',
    },
  },
];

// Demo school newsletters
const newsletters = [
  {
    id: 'news-1',
    title: {
      ko: '6월 학교 소식',
      mn: '6-р сарын сургуулийн мэдээ',
      ru: 'Школьные новости за июнь',
      vi: 'Tin trường tháng 6',
    },
    date: '2024-06-01',
    content: {
      ko: '다가오는 기말고사 일정과 여름방학 안내입니다. 기말고사는 6월 25일부터 시작됩니다.',
      mn: 'Улирлын шалгалтын хуваарь болон зуны амралтын мэдээлэл. Улирлын шалгалт 6 сарын 25-наас эхэлнэ.',
      ru: 'Расписание финальных экзаменов и информация о летних каникулах. Экзамены начинаются 25 июня.',
      vi: 'Lịch thi cuối kỳ và thông tin về kỳ nghỉ hè. Kỳ thi bắt đầu từ ngày 25/6.',
    },
  },
  {
    id: 'news-2',
    title: {
      ko: '5월 학교 소식',
      mn: '5-р сарын сургуулийн мэдээ',
      ru: 'Школьные новости за май',
      vi: 'Tin trường tháng 5',
    },
    date: '2024-05-01',
    content: {
      ko: '체육대회와 중간고사 결과 안내입니다. 모든 학생들이 열심히 참여해주었습니다.',
      mn: 'Спортын наадам болон дунд шатны шалгалтын үр дүнгийн мэдээлэл. Бүх сурагчид идэвхтэй оролцсон.',
      ru: 'Результаты спортивного дня и промежуточных экзаменов. Все студенты активно участвовали.',
      vi: 'Kết quả ngày thể thao và kỳ thi giữa kỳ. Tất cả học sinh đã tham gia tích cực.',
    },
  },
];

// In-memory store for parent messages
const parentMessages: Array<{
  id: string;
  original: string;
  originalLocale: string;
  korean: string;
  createdAt: number;
}> = [];

// POST: Translate parent message to Korean
export async function POST(req: NextRequest) {
  try {
    const { message, sourceLocale } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Translate to Korean
    const koreanTranslation = await translateToKorean(message, sourceLocale);

    const savedMessage = {
      id: `msg-${Date.now()}`,
      original: message,
      originalLocale: sourceLocale || 'unknown',
      korean: koreanTranslation,
      createdAt: Date.now(),
    };

    parentMessages.unshift(savedMessage);

    // Keep only last 50 messages
    if (parentMessages.length > 50) {
      parentMessages.pop();
    }

    return NextResponse.json({
      success: true,
      korean: koreanTranslation,
      message: savedMessage,
    });
  } catch (error) {
    console.error('Parent portal POST error:', error);
    return NextResponse.json(
      { error: 'Failed to translate message' },
      { status: 500 }
    );
  }
}

// GET: Get school events, newsletters, etc.
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');

  switch (type) {
    case 'events':
      return NextResponse.json({ events: schoolEvents });
    case 'newsletters':
      return NextResponse.json({ newsletters });
    case 'messages':
      return NextResponse.json({ messages: parentMessages });
    default:
      return NextResponse.json({
        events: schoolEvents,
        newsletters,
        messages: parentMessages,
      });
  }
}

async function translateToKorean(text: string, sourceLocale: string): Promise<string> {
  try {
    const languageNames: Record<string, string> = {
      mn: '몽골어',
      ru: '러시아어',
      vi: '베트남어',
      en: '영어',
    };

    const sourceLang = languageNames[sourceLocale] || '외국어';

    const prompt = `다음 ${sourceLang} 문장을 자연스러운 한국어로 번역해주세요.
원문: "${text}"

한국어 번역만 출력하세요. 다른 설명 없이 번역문만 작성하세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    let responseText = response.text;

    if (!responseText) {
      const candidates = (response as any).candidates;
      if (candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = candidates[0].content.parts[0].text;
      }
    }

    if (responseText) {
      return responseText.trim();
    }
  } catch (error) {
    console.error('Translation error:', error);
  }

  return `[번역 실패] ${text}`;
}
