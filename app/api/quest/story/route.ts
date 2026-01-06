import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import {
  StoryScene,
  StorySet,
  generateSetId,
  saveSet,
  getSet,
  getRandomSetByThemeTopic,
} from '@/lib/quest-storage';
import {
  THEMES,
  TOPICS,
  ThemeConfig,
  TopicConfig,
  getTheme,
  getTopic,
} from '@/lib/quest-config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Generate scene image using Gemini 2.0 Flash with theme-specific style
async function generateSceneImage(
  storyText: string,
  sceneNumber: number,
  theme: ThemeConfig
): Promise<string | null> {
  try {
    const imagePrompt = `CRITICAL REQUIREMENT: NO TEXT IN THIS IMAGE.
Do NOT include any text, words, letters, numbers, signs, labels, captions, watermarks, or any form of written language. This is absolutely essential.

Create a ${theme.id} scene illustration for a language learning game.

Scene ${sceneNumber}: ${storyText}
Setting: ${theme.settings.atmosphere}
Style: ${theme.imageStyle}, cartoon/anime style, vibrant colors, child-friendly

STRICTLY FORBIDDEN (will cause rejection):
- ANY text, letters, numbers, or symbols
- Signs, labels, banners, or placards with writing
- Books, scrolls, or papers with visible text
- Store signs, road signs, or any signage
- Written language in ANY form (Korean, English, Chinese, etc.)
- Watermarks or captions

FOCUS ONLY ON:
- Characters with expressive faces and body language
- Beautiful environment and scenery
- Objects and props (without any text or labels)
- Rich colors and atmospheric lighting
- The ${theme.name.ko} theme aesthetic`;

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

// Get level-specific configuration based on theme and topic
function getLevelConfig(
  theme: ThemeConfig,
  topic: TopicConfig,
  level: 1 | 2 | 3
) {
  // Get vocabulary examples from topic
  const vocabExamples = topic.vocabulary.slice(0, 4)
    .map(v => v.korean)
    .join(', ');

  const vocab0 = topic.vocabulary[0]?.korean || '친구';
  const vocab1 = topic.vocabulary[1]?.korean || '학교';
  const location0 = theme.settings.locations[0] || '여기';
  const character0 = theme.settings.characters[0] || '사람';

  const configs = {
    1: {
      description: `기본 단어와 짧은 문장 (${topic.name.ko} 관련)`,
      examples: [
        `"저기 (___) 가 있어요!" (${vocabExamples})`,
        `"(___) 를 봐요" / "(___) 이 있어요"`,
        `"${location0}에 가요"`
      ],
      sentencePattern: `단순 해요체 문장: "(___) 가/이 있어요", "(___) 를/을 봐요", "(___) 에 가요"`
    },
    2: {
      description: `간단한 대화 문장 (${topic.name.ko} 주제)`,
      examples: [
        `"${vocab0}하고 같이 가요"`,
        `"${character0}한테 물어봐요"`,
        `"${location0}에서 뭐 해요?"`
      ],
      sentencePattern: `연결 해요체: "(___) 하고 싶어요", "(___) 에서 만나요", "(___) 한테 줘요"`
    },
    3: {
      description: `자연스러운 대화 (${topic.name.ko} 심화)`,
      examples: [
        `"${vocab0} 덕분에 정말 좋았어요"`,
        `"${location0}에 가면 (___) 가 있대요"`,
        `"(___) 를 해 봐요, 재미있어요!"`
      ],
      sentencePattern: `복합 해요체: "(___) 라서 좋아요", "(___) 하면 어때요?", "(___) 가 제일 좋아요"`
    }
  };

  return configs[level];
}

// Generate theme-specific story prompt
function generateStoryPrompt(
  theme: ThemeConfig,
  topic: TopicConfig,
  level: 1 | 2 | 3,
  count: number
): string {
  const config = getLevelConfig(theme, topic, level);

  // Get vocabulary list from topic
  const vocabList = topic.vocabulary
    .map(v => `${v.korean} (${v.translation.mn}/${v.translation.ru}/${v.translation.vi})`)
    .join('\n- ');

  return `당신은 외국인을 위한 한국어 학습 게임의 스토리 작가입니다.
${count}개의 장면으로 구성된 재미있는 모험 스토리를 만들어주세요.

## 테마: ${theme.name.ko} (${theme.id})
## 배경: ${theme.settings.atmosphere}
## 장소: ${theme.settings.locations.join(', ')}
## 등장인물: ${theme.settings.characters.join(', ')}
## 소품: ${theme.settings.objects.join(', ')}

## 학습 주제: ${topic.name.ko}
## 사용할 어휘 (빈칸 정답으로 사용):
- ${vocabList}

## 학생 레벨: ${level} (${config.description})
## 문장 패턴: ${config.sentencePattern}

---
## 중요: 자연스러운 한국어 작성 규칙

### 1. 해요체 사용 (필수)
- 모든 문장은 "~해요", "~이에요/예요", "~있어요" 등 해요체로 작성
- "~합니다", "~입니다" 같은 격식체 사용 금지
- "~한다", "~본다" 같은 반말 사용 금지

### 2. 조사 정확히 사용
- 받침 있는 말 뒤: 을, 은, 이, 과 (책을, 친구는, 선생님이)
- 받침 없는 말 뒤: 를, 는, 가, 와 (학교를, 엄마는, 아이가)
- 장소: 에 (방향/위치), 에서 (동작)

### 3. 빈칸 문장 패턴 (자연스러운 표현만)
좋은 예시:
- "저기 (___) 가 있어요!"
- "(___) 를 봐요, 예뻐요!"
- "(___) 가 정말 맛있어요"
- "(___) 하러 같이 가요"
- "오늘 (___) 를 배웠어요"
- "(___) 가 좋아요? 저도요!"

나쁜 예시 (절대 사용 금지):
- "나는 (___) 을/를 본다" → 번역투, 구어체 아님
- "(___) 을/를 합니다" → 너무 격식적
- "나는 (___) 이/가 필요하다" → 부자연스러움

### 4. 스토리 문장도 자연스럽게
- 대화하듯 친근하게 작성
- 짧고 명확한 문장 사용
- 감정 표현 포함 (와, 정말, 너무 등)

---
## 규칙:
1. ${theme.name.ko} 배경의 재미있는 모험 스토리
2. ${count}개 장면이 자연스럽게 연결
3. 빈칸 정답은 반드시 위 어휘 목록에서 선택
4. 각 장면: 정답 1개 + 비슷한 오답 2개
5. 해요체만 사용할 것!

## JSON 출력 형식:
{
  "title": "재미있는 제목",
  "scenes": [
    {
      "story": "장면 설명 (2-3문장, 해요체)",
      "npc_dialogue": "NPC 대사 (해요체, 자연스럽게)",
      "blank_sentence": "저기 (___) 가 있어요!",
      "choices": [
        {"korean": "정답", "correct": true, "translation": {"mn": "몽골어", "ru": "러시아어", "vi": "베트남어"}},
        {"korean": "오답1", "correct": false, "translation": {"mn": "몽골어", "ru": "러시아어", "vi": "베트남어"}},
        {"korean": "오답2", "correct": false, "translation": {"mn": "몽골어", "ru": "러시아어", "vi": "베트남어"}}
      ],
      "hint": "도움말",
      "vocabulary": [{"word": "단어", "meaning": {"mn": "몽골어", "ru": "러시아어", "vi": "베트남어"}}],
      "xp_reward": 10
    }
  ]
}

JSON만 출력하세요. ${count}개 장면 모두 생성하세요.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      level,
      locale,
      setId,
      generateNew = true,
      count = 10,
      theme = 'medieval',
      topic = 'greetings'
    } = body;

    const gameLevel = Math.min(Math.max(level || 1, 1), 3) as 1 | 2 | 3;

    // Get theme and topic configurations
    const themeConfig = getTheme(theme);
    const topicConfig = getTopic(topic);

    if (!themeConfig || !topicConfig) {
      return NextResponse.json(
        { error: 'Invalid theme or topic' },
        { status: 400 }
      );
    }

    // If setId is provided, try to load existing set
    if (setId) {
      const existingSet = await getSet(setId);
      if (existingSet) {
        return NextResponse.json({ storySet: existingSet });
      }
    }

    // If not generating new, try to get a random existing set for this theme/topic
    if (!generateNew) {
      const randomSet = await getRandomSetByThemeTopic(theme, topic, gameLevel);
      if (randomSet) {
        return NextResponse.json({ storySet: randomSet });
      }
    }

    // Generate new story set with theme and topic
    const prompt = generateStoryPrompt(themeConfig, topicConfig, gameLevel, count);

    console.log(`Generating ${count} story scenes for theme: ${theme}, topic: ${topic}, level: ${gameLevel}...`);

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

    console.log(`Generated ${scenes.length} scenes. Starting image generation with ${theme} theme...`);

    // Generate images for all scenes with theme-specific style
    for (let i = 0; i < scenes.length; i++) {
      console.log(`Generating ${theme} image for scene ${i + 1}/${scenes.length}...`);
      const imageUrl = await generateSceneImage(scenes[i].story, i + 1, themeConfig);
      if (imageUrl) {
        scenes[i].imageUrl = imageUrl;
        console.log(`Image ${i + 1} generated successfully`);
      } else {
        console.log(`Image ${i + 1} generation failed`);
      }
    }

    // Create story set with theme and topic
    const newSetId = generateSetId(theme, topic);
    const storySet: StorySet = {
      id: newSetId,
      level: gameLevel,
      theme,
      topic,
      title: storyData.title || `${themeConfig.name.ko} 모험: ${topicConfig.name.ko}`,
      scenes,
      createdAt: new Date().toISOString(),
      playCount: 1,
      averageScore: 0,
    };

    // Save the story set
    await saveSet(storySet);

    console.log(`Story set ${newSetId} created with ${scenes.length} scenes (theme: ${theme}, topic: ${topic})`);

    return NextResponse.json({ storySet });

  } catch (error) {
    console.error('Quest story generation error:', error);

    // Get theme and topic for fallback
    const body = await req.clone().json().catch(() => ({}));
    const theme = body.theme || 'medieval';
    const topic = body.topic || 'greetings';
    const themeConfig = getTheme(theme) || THEMES.medieval;
    const topicConfig = getTopic(topic) || TOPICS[0];

    // Safe defaults for vocabulary
    const defaultVocab = [
      { korean: '친구', translation: { mn: 'найз', ru: 'друг', vi: 'bạn' } },
      { korean: '물', translation: { mn: 'ус', ru: 'вода', vi: 'nước' } },
      { korean: '책', translation: { mn: 'ном', ru: 'книга', vi: 'sách' } }
    ];

    // Safely access vocabulary with fallbacks
    const safeVocab = topicConfig?.vocabulary || [];
    const vocab0 = safeVocab[0] || defaultVocab[0];
    const vocab1 = safeVocab[1] || defaultVocab[1];
    const vocab2 = safeVocab[2] || defaultVocab[2];

    // Return a fallback story set on error
    const fallbackScenes: StoryScene[] = Array.from({ length: 10 }, (_, i) => ({
      story: `${themeConfig?.settings?.locations?.[0] || '여기'}에 왔어요! ${themeConfig?.settings?.characters?.[0] || '누군가'}가 다가와요. (장면 ${i + 1})`,
      npc_dialogue: `${themeConfig?.settings?.characters?.[0] || '친구'}: "안녕하세요! 뭘 찾아요?"`,
      blank_sentence: `저기 (___) 가 있어요!`,
      choices: [
        { korean: vocab0.korean, correct: true, translation: vocab0.translation },
        { korean: vocab1.korean, correct: false, translation: vocab1.translation },
        { korean: vocab2.korean, correct: false, translation: vocab2.translation }
      ],
      hint: `${topicConfig?.name?.ko || '한국어'} 관련 단어예요!`,
      vocabulary: [
        { word: vocab0.korean, meaning: vocab0.translation }
      ],
      xp_reward: 10
    }));

    const fallbackSet: StorySet = {
      id: `FALLBACK-${theme.slice(0, 3).toUpperCase()}-${topic.slice(0, 3).toUpperCase()}-001`,
      level: 1,
      theme,
      topic,
      title: `${themeConfig?.name?.ko || '한국어'} 기본 모험: ${topicConfig?.name?.ko || '기초'}`,
      scenes: fallbackScenes,
      createdAt: new Date().toISOString(),
      playCount: 0,
      averageScore: 0,
    };

    return NextResponse.json({ storySet: fallbackSet });
  }
}
