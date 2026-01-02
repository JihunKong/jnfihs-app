import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import {
  StoryScene,
  StorySet,
  generateSetId,
  saveSet,
  getSet,
  getRandomSet,
} from '@/lib/quest-storage';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Generate scene image using Gemini 2.0 Flash
async function generateSceneImage(storyText: string, sceneNumber: number): Promise<string | null> {
  try {
    const imagePrompt = `Create a fantasy scene illustration for a Korean language learning game.

Scene ${sceneNumber}: ${storyText}
Setting: Fantasy world with castles, dragons, forests, wizards, magical creatures
Style: Colorful, friendly, anime-inspired, suitable for language learners, vibrant colors
Mood: Adventurous, magical, inviting

IMPORTANT:
- Do NOT include any text, letters, numbers, or written language in the image
- Create a visually appealing scene that matches the story
- Keep it appropriate for educational use`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: imagePrompt,
      config: {
        responseModalities: ['Text', 'Image'],
      },
    });

    // Extract image from response
    const candidates = (response as any).candidates;
    if (candidates?.[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData;
          return `data:${imageData.mimeType};base64,${imageData.data}`;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Image generation error for scene ${sceneNumber}:`, error);
    return null;
  }
}

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
    const body = await req.json();
    const { level, locale, setId, generateNew = true, count = 10 } = body;

    const gameLevel = Math.min(Math.max(level || 1, 1), 3) as 1 | 2 | 3;

    // If setId is provided, try to load existing set
    if (setId) {
      const existingSet = await getSet(setId);
      if (existingSet) {
        return NextResponse.json({ storySet: existingSet });
      }
    }

    // If not generating new, try to get a random existing set
    if (!generateNew) {
      const randomSet = await getRandomSet(gameLevel);
      if (randomSet) {
        return NextResponse.json({ storySet: randomSet });
      }
    }

    // Generate new story set with 10 connected scenes
    const config = levelConfig[gameLevel];

    const prompt = `당신은 한국어 학습용 텍스트 어드벤처 게임 마스터입니다.
연결된 ${count}개의 장면으로 구성된 완전한 모험 스토리를 생성하세요.

## 학생 레벨: ${gameLevel} (${config.description})

## 레벨 ${gameLevel} 예시 표현:
${config.examples.map(e => `- ${e}`).join('\n')}

## 문장 패턴:
${config.sentencePattern}

## 규칙:
1. 판타지 세계 배경 (마법사, 용, 성, 숲, 던전 등)
2. ${count}개의 장면이 하나의 연결된 스토리를 형성
3. 각 장면은 이전 장면과 자연스럽게 연결
4. 학생 수준에 정확히 맞는 한국어 사용 (레벨 ${gameLevel})
5. 각 장면에서 빈칸 문장의 정답 1개 + 그럴듯한 오답 2개
6. 모험의 시작부터 클라이맥스, 결말까지 구성

## 출력 형식 (반드시 JSON 배열만 출력):
{
  "title": "모험의 제목",
  "scenes": [
    {
      "story": "장면 스토리 (2-3문장)",
      "npc_dialogue": "NPC 대사",
      "blank_sentence": "나는 (___) 으로 간다",
      "choices": [
        {"korean": "동쪽", "correct": true, "translation": {"mn": "зүүн", "ru": "восток", "vi": "phía đông"}},
        {"korean": "밥", "correct": false, "translation": {"mn": "хоол", "ru": "рис", "vi": "cơm"}},
        {"korean": "춤", "correct": false, "translation": {"mn": "бүжиг", "ru": "танец", "vi": "nhảy"}}
      ],
      "hint": "힌트 설명",
      "vocabulary": [
        {"word": "숲", "meaning": {"mn": "ой", "ru": "лес", "vi": "rừng"}}
      ],
      "xp_reward": 10
    }
  ]
}

JSON만 출력하고 다른 텍스트는 포함하지 마세요. ${count}개의 장면을 모두 생성하세요.`;

    console.log(`Generating ${count} story scenes for level ${gameLevel}...`);

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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

    const storyData = JSON.parse(jsonMatch[0]);

    if (!storyData.scenes || !Array.isArray(storyData.scenes)) {
      throw new Error('Invalid story structure');
    }

    // Validate and fix scenes
    const scenes: StoryScene[] = storyData.scenes.map((scene: any, index: number) => {
      // Ensure exactly one correct answer
      const correctCount = scene.choices?.filter((c: any) => c.correct).length || 0;
      if (correctCount !== 1 && scene.choices) {
        scene.choices = scene.choices.map((c: any, i: number) => ({
          ...c,
          correct: i === 0
        }));
      }

      return {
        story: scene.story || `장면 ${index + 1}`,
        npc_dialogue: scene.npc_dialogue || '',
        blank_sentence: scene.blank_sentence || '나는 (___) 을 한다',
        choices: scene.choices || [],
        hint: scene.hint || '',
        vocabulary: scene.vocabulary || [],
        xp_reward: scene.xp_reward || 10,
      };
    });

    console.log(`Generated ${scenes.length} scenes. Starting image generation...`);

    // Generate images for all scenes
    for (let i = 0; i < scenes.length; i++) {
      console.log(`Generating image for scene ${i + 1}/${scenes.length}...`);
      const imageUrl = await generateSceneImage(scenes[i].story, i + 1);
      if (imageUrl) {
        scenes[i].imageUrl = imageUrl;
        console.log(`Image ${i + 1} generated successfully`);
      } else {
        console.log(`Image ${i + 1} generation failed`);
      }
    }

    // Create story set
    const newSetId = generateSetId();
    const storySet: StorySet = {
      id: newSetId,
      level: gameLevel,
      title: storyData.title || `모험 ${newSetId}`,
      scenes,
      createdAt: new Date().toISOString(),
      playCount: 1,
      averageScore: 0,
    };

    // Save the story set
    await saveSet(storySet);

    console.log(`Story set ${newSetId} created with ${scenes.length} scenes`);

    return NextResponse.json({ storySet });

  } catch (error) {
    console.error('Quest story generation error:', error);

    // Return a fallback story set on error
    const fallbackScenes: StoryScene[] = Array.from({ length: 10 }, (_, i) => ({
      story: `당신은 어두운 숲에 있습니다. 앞에 세 갈래 길이 보입니다. (장면 ${i + 1})`,
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
    }));

    const fallbackSet: StorySet = {
      id: 'FALLBACK-001',
      level: 1,
      title: '기본 모험',
      scenes: fallbackScenes,
      createdAt: new Date().toISOString(),
      playCount: 0,
      averageScore: 0,
    };

    return NextResponse.json({ storySet: fallbackSet });
  }
}
