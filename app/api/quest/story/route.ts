import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Level-specific vocabulary and sentence patterns
const levelConfig = {
  1: {
    description: '기본 단어 (방향, 기본 동작)',
    examples: [
      '동/서/남/북 (방향)',
      '가다/오다/보다/듣다 (기본 동작)',
      '검/방패/열쇠/문 (물건)'
    ],
    sentencePattern: '나는 (___) 으로 간다 / 나는 (___) 를 본다'
  },
  2: {
    description: '간단한 문장',
    examples: [
      '나는 용과 대화한다',
      '문을 열고 들어간다',
      '마법사에게 물어본다'
    ],
    sentencePattern: '주어 + 목적어 + 동사 형태의 간단한 문장'
  },
  3: {
    description: '고급 문장 (복잡한 표현)',
    examples: [
      '세상의 평화는 나의 실천에 달려있다',
      '고대의 비밀을 풀기 위해 수수께끼를 해결해야 한다',
      '지혜로운 자만이 이 시련을 통과할 수 있다'
    ],
    sentencePattern: '복합 문장, 관형절, 추상적 개념'
  }
};

export async function POST(req: NextRequest) {
  try {
    const { level, previousStory, playerChoice, locale } = await req.json();

    const gameLevel = Math.min(Math.max(level || 1, 1), 3) as 1 | 2 | 3;
    const config = levelConfig[gameLevel];

    const prompt = `당신은 한국어 학습용 텍스트 어드벤처 게임 마스터입니다.
판타지 세계를 배경으로 한국어 학습을 위한 인터랙티브 스토리를 생성하세요.

## 학생 레벨: ${gameLevel} (${config.description})

## 레벨 ${gameLevel} 예시 표현:
${config.examples.map(e => `- ${e}`).join('\n')}

## 문장 패턴:
${config.sentencePattern}

## 이전 이야기:
${previousStory || '게임 시작 - 용사가 모험을 시작합니다.'}

## 플레이어의 이전 선택:
${playerChoice || '없음 (첫 번째 장면)'}

## 규칙:
1. 판타지 세계 배경 (마법사, 용, 성, 숲, 던전 등)
2. 학생 수준에 정확히 맞는 한국어 사용 (레벨 ${gameLevel})
3. 빈칸 문장에서 정답 1개 + 그럴듯한 오답 2개 생성
4. 힌트는 문법이나 의미 설명
5. 어휘는 장면에 나온 중요 단어 2-3개

## 출력 형식 (반드시 JSON만 출력):
{
  "story": "짧은 판타지 스토리 텍스트 (2-3문장, 한국어)",
  "npc_dialogue": "NPC 대사 (한국어)",
  "blank_sentence": "나는 (___) 으로 간다",
  "choices": [
    {"korean": "동쪽", "correct": true, "translation": {"mn": "зүүн", "ru": "восток", "vi": "phía đông"}},
    {"korean": "밥", "correct": false, "translation": {"mn": "хоол", "ru": "рис", "vi": "cơm"}},
    {"korean": "춤", "correct": false, "translation": {"mn": "бүжиг", "ru": "танец", "vi": "nhảy"}}
  ],
  "hint": "힌트 설명 (학생 언어로)",
  "vocabulary": [
    {"word": "숲", "meaning": {"mn": "ой", "ru": "лес", "vi": "rừng"}},
    {"word": "용사", "meaning": {"mn": "баатар", "ru": "герой", "vi": "anh hùng"}}
  ],
  "xp_reward": 10
}

JSON만 출력하고 다른 텍스트는 포함하지 마세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Get response text
    let text: string | undefined = response.text;

    // Fallback: try candidates structure
    if (!text) {
      const candidates = (response as any).candidates;
      if (candidates?.[0]?.content?.parts?.[0]?.text) {
        text = candidates[0].content.parts[0].text;
      }
    }

    if (!text) {
      throw new Error('No text in response');
    }

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const scene = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!scene.story || !scene.blank_sentence || !scene.choices) {
      throw new Error('Invalid scene structure');
    }

    // Ensure exactly one correct answer
    const correctCount = scene.choices.filter((c: any) => c.correct).length;
    if (correctCount !== 1) {
      // Fix if needed
      scene.choices = scene.choices.map((c: any, i: number) => ({
        ...c,
        correct: i === 0
      }));
    }

    return NextResponse.json({ scene });

  } catch (error) {
    console.error('Quest story generation error:', error);

    // Return a fallback scene on error
    const fallbackScene = {
      story: '당신은 어두운 숲에 있습니다. 앞에 세 갈래 길이 보입니다.',
      npc_dialogue: '현자: "어디로 가시겠습니까?"',
      blank_sentence: '나는 (___) 으로 간다.',
      choices: [
        { korean: '동쪽', correct: true, translation: { mn: 'зүүн', ru: 'восток', vi: 'phía đông' } },
        { korean: '서쪽', correct: false, translation: { mn: 'баруун', ru: 'запад', vi: 'phía tây' } },
        { korean: '북쪽', correct: false, translation: { mn: 'хойд', ru: 'север', vi: 'phía bắc' } }
      ],
      hint: '동=East, 서=West, 북=North. 올바른 방향을 선택하세요!',
      vocabulary: [
        { word: '숲', meaning: { mn: 'ой', ru: 'лес', vi: 'rừng' } },
        { word: '길', meaning: { mn: 'зам', ru: 'дорога', vi: 'đường' } }
      ],
      xp_reward: 10
    };

    return NextResponse.json({ scene: fallbackScene });
  }
}
