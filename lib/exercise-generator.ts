// Exercise Generator
// Creates exercises from vocabulary and grammar data

import {
  Exercise,
  ExerciseType,
  WordMatchExercise,
  WordPictureExercise,
  WordAudioExercise,
  WordSpellExercise,
  FillBlankExercise,
  WordOrderExercise,
  TranslateExercise,
  GrammarChoiceExercise,
  ListenSelectExercise,
  ListenTypeExercise,
  ListenComprehendExercise,
  ListenRepeatExercise,
  SpeakWordExercise,
  SpeakSentenceExercise,
  SpeakAnswerExercise,
  SpeakDescribeExercise,
  Choice,
  generateExerciseSequence
} from './exercise-types';
import {
  VocabularyWord,
  GrammarPoint,
  getVocabularyByLesson,
  getRandomVocabulary,
  TOPIK1_GRAMMAR
} from './korean-vocabulary';
import { LocalizedText } from './korean-curriculum';
import { TOPIK1_SENTENCE_PATTERNS, SentencePattern } from './sentence-patterns';

// ============================================
// Helper Functions
// ============================================

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateId(): string {
  return `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createChoicesFromVocab(
  correctWord: VocabularyWord,
  allVocab: VocabularyWord[],
  useKorean: boolean = false
): Choice[] {
  // Get 3 wrong answers from the same tags if possible
  const wrongChoices = allVocab
    .filter(v => v.id !== correctWord.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const choices: Choice[] = [
    {
      id: correctWord.id,
      text: useKorean ? correctWord.korean : '',
      translation: correctWord.meaning,
      isCorrect: true
    },
    ...wrongChoices.map(v => ({
      id: v.id,
      text: useKorean ? v.korean : '',
      translation: v.meaning,
      isCorrect: false
    }))
  ];

  return shuffleArray(choices);
}

// ============================================
// Vocabulary Exercise Generators
// ============================================

export function generateWordMatchExercise(
  word: VocabularyWord,
  allVocab: VocabularyWord[],
  lessonId: string,
  order: number
): WordMatchExercise {
  return {
    id: generateId(),
    type: 'word-match',
    lessonId,
    order,
    xpReward: 10,
    word: {
      id: word.id,
      korean: word.korean,
      pronunciation: word.pronunciation,
      meaning: word.meaning,
      partOfSpeech: word.partOfSpeech,
      exampleSentence: word.exampleSentence
    },
    choices: createChoicesFromVocab(word, allVocab, false)
  };
}

export function generateWordAudioExercise(
  word: VocabularyWord,
  allVocab: VocabularyWord[],
  lessonId: string,
  order: number
): WordAudioExercise {
  const choices = createChoicesFromVocab(word, allVocab, true);
  // For audio exercises, text should be Korean
  choices.forEach(c => {
    if (c.isCorrect) {
      c.text = word.korean;
    } else {
      const vocab = allVocab.find(v => v.id === c.id);
      if (vocab) c.text = vocab.korean;
    }
  });

  return {
    id: generateId(),
    type: 'word-audio',
    lessonId,
    order,
    xpReward: 12,
    audioWord: {
      id: word.id,
      korean: word.korean,
      pronunciation: word.pronunciation,
      meaning: word.meaning,
      partOfSpeech: word.partOfSpeech
    },
    choices
  };
}

export function generateWordSpellExercise(
  word: VocabularyWord,
  lessonId: string,
  order: number
): WordSpellExercise {
  return {
    id: generateId(),
    type: 'word-spell',
    lessonId,
    order,
    xpReward: 15,
    word: {
      id: word.id,
      korean: word.korean,
      pronunciation: word.pronunciation,
      meaning: word.meaning,
      partOfSpeech: word.partOfSpeech
    },
    showMeaning: true,
    showImage: false,
    acceptableAnswers: [word.korean]
  };
}

// ============================================
// Sentence Exercise Generators
// ============================================

export function generateFillBlankExercise(
  word: VocabularyWord,
  allVocab: VocabularyWord[],
  lessonId: string,
  order: number
): FillBlankExercise | null {
  if (!word.exampleSentence) return null;

  const sentence = word.exampleSentence.korean.replace(word.korean, '(___)');

  const wrongWords = allVocab
    .filter(v => v.id !== word.id && v.partOfSpeech === word.partOfSpeech)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const choices: Choice[] = shuffleArray([
    {
      id: word.id,
      text: word.korean,
      translation: word.meaning,
      isCorrect: true
    },
    ...wrongWords.map(v => ({
      id: v.id,
      text: v.korean,
      translation: v.meaning,
      isCorrect: false
    }))
  ]);

  return {
    id: generateId(),
    type: 'fill-blank',
    lessonId,
    order,
    xpReward: 10,
    sentence,
    translation: word.exampleSentence.translation,
    correctAnswer: word.korean,
    choices,
    hint: `${word.pronunciation}`
  };
}

export function generateWordOrderExercise(
  word: VocabularyWord,
  lessonId: string,
  order: number
): WordOrderExercise | null {
  if (!word.exampleSentence) return null;

  // Split sentence into words (simple Korean word splitting)
  const sentence = word.exampleSentence.korean;
  const words = sentence.replace(/[.,!?]/g, '').split(/\s+/).filter(w => w.length > 0);

  if (words.length < 3) return null;

  return {
    id: generateId(),
    type: 'word-order',
    lessonId,
    order,
    xpReward: 13,
    shuffledWords: shuffleArray(words),
    correctOrder: words,
    translation: word.exampleSentence.translation
  };
}

export function generateGrammarChoiceExercise(
  grammar: GrammarPoint,
  lessonId: string,
  order: number
): GrammarChoiceExercise | null {
  if (!grammar.examples.length) return null;

  const example = grammar.examples[0];

  // Create grammar choices based on the grammar point
  let choices: Choice[] = [];
  let sentence = '';
  let correctAnswer = '';

  // Handle common grammar patterns
  if (grammar.korean === '은/는') {
    sentence = example.korean.replace(/은|는/, '(___)');
    correctAnswer = example.korean.includes('은') ? '은' : '는';
    choices = [
      { id: '1', text: '은', isCorrect: correctAnswer === '은' },
      { id: '2', text: '는', isCorrect: correctAnswer === '는' },
      { id: '3', text: '이', isCorrect: false },
      { id: '4', text: '가', isCorrect: false }
    ];
  } else if (grammar.korean === '이/가') {
    sentence = example.korean.replace(/이|가/, '(___)');
    correctAnswer = example.korean.includes('이 ') || example.korean.endsWith('이') ? '이' : '가';
    choices = [
      { id: '1', text: '이', isCorrect: correctAnswer === '이' },
      { id: '2', text: '가', isCorrect: correctAnswer === '가' },
      { id: '3', text: '을', isCorrect: false },
      { id: '4', text: '를', isCorrect: false }
    ];
  } else if (grammar.korean === '을/를') {
    sentence = example.korean.replace(/을|를/, '(___)');
    correctAnswer = example.korean.includes('을') ? '을' : '를';
    choices = [
      { id: '1', text: '을', isCorrect: correctAnswer === '을' },
      { id: '2', text: '를', isCorrect: correctAnswer === '를' },
      { id: '3', text: '은', isCorrect: false },
      { id: '4', text: '는', isCorrect: false }
    ];
  } else if (grammar.korean === '에') {
    sentence = example.korean.replace(/에(?=\s|$)/, '(___)');
    correctAnswer = '에';
    choices = [
      { id: '1', text: '에', isCorrect: true },
      { id: '2', text: '에서', isCorrect: false },
      { id: '3', text: '으로', isCorrect: false },
      { id: '4', text: '까지', isCorrect: false }
    ];
  } else if (grammar.korean === '에서') {
    sentence = example.korean.replace(/에서/, '(___)');
    correctAnswer = '에서';
    choices = [
      { id: '1', text: '에서', isCorrect: true },
      { id: '2', text: '에', isCorrect: false },
      { id: '3', text: '에게', isCorrect: false },
      { id: '4', text: '한테', isCorrect: false }
    ];
  } else if (grammar.korean === '도') {
    sentence = example.korean.replace(/도(?=\s|$)/, '(___)');
    correctAnswer = '도';
    choices = [
      { id: '1', text: '도', isCorrect: true },
      { id: '2', text: '만', isCorrect: false },
      { id: '3', text: '는', isCorrect: false },
      { id: '4', text: '가', isCorrect: false }
    ];
  } else if (grammar.korean === '만') {
    sentence = example.korean.replace(/만(?=\s|$)/, '(___)');
    correctAnswer = '만';
    choices = [
      { id: '1', text: '만', isCorrect: true },
      { id: '2', text: '도', isCorrect: false },
      { id: '3', text: '는', isCorrect: false },
      { id: '4', text: '을', isCorrect: false }
    ];
  } else if (grammar.korean === '와/과') {
    const hasWa = example.korean.includes('와 ') || example.korean.includes('와,');
    sentence = example.korean.replace(/와|과/, '(___)');
    correctAnswer = hasWa ? '와' : '과';
    choices = [
      { id: '1', text: '와', isCorrect: correctAnswer === '와' },
      { id: '2', text: '과', isCorrect: correctAnswer === '과' },
      { id: '3', text: '하고', isCorrect: false },
      { id: '4', text: '랑', isCorrect: false }
    ];
  } else if (grammar.korean === '(으)로') {
    const hasEuro = example.korean.includes('으로');
    sentence = example.korean.replace(/으로|로/, '(___)');
    correctAnswer = hasEuro ? '으로' : '로';
    choices = [
      { id: '1', text: '로', isCorrect: correctAnswer === '로' },
      { id: '2', text: '으로', isCorrect: correctAnswer === '으로' },
      { id: '3', text: '에', isCorrect: false },
      { id: '4', text: '까지', isCorrect: false }
    ];
  } else if (grammar.korean === '보다') {
    sentence = example.korean.replace(/보다/, '(___)');
    correctAnswer = '보다';
    choices = [
      { id: '1', text: '보다', isCorrect: true },
      { id: '2', text: '처럼', isCorrect: false },
      { id: '3', text: '만큼', isCorrect: false },
      { id: '4', text: '같이', isCorrect: false }
    ];
  } else if (grammar.korean === '(으)면') {
    const hasEumyeon = example.korean.includes('으면');
    sentence = example.korean.replace(/으면|면/, '(___)');
    correctAnswer = hasEumyeon ? '으면' : '면';
    choices = [
      { id: '1', text: '면', isCorrect: correctAnswer === '면' },
      { id: '2', text: '으면', isCorrect: correctAnswer === '으면' },
      { id: '3', text: '니까', isCorrect: false },
      { id: '4', text: '어서', isCorrect: false }
    ];
  } else if (grammar.korean === '아서/어서') {
    const hasAseo = example.korean.includes('아서');
    sentence = example.korean.replace(/아서|어서/, '(___)');
    correctAnswer = hasAseo ? '아서' : '어서';
    choices = [
      { id: '1', text: '아서', isCorrect: correctAnswer === '아서' },
      { id: '2', text: '어서', isCorrect: correctAnswer === '어서' },
      { id: '3', text: '니까', isCorrect: false },
      { id: '4', text: '고', isCorrect: false }
    ];
  } else if (grammar.korean === '(으)니까') {
    const hasEunikka = example.korean.includes('으니까');
    sentence = example.korean.replace(/으니까|니까/, '(___)');
    correctAnswer = hasEunikka ? '으니까' : '니까';
    choices = [
      { id: '1', text: '니까', isCorrect: correctAnswer === '니까' },
      { id: '2', text: '으니까', isCorrect: correctAnswer === '으니까' },
      { id: '3', text: '어서', isCorrect: false },
      { id: '4', text: '면', isCorrect: false }
    ];
  } else if (grammar.korean === '고') {
    sentence = example.korean.replace(/고(?=\s|$)/, '(___)');
    correctAnswer = '고';
    choices = [
      { id: '1', text: '고', isCorrect: true },
      { id: '2', text: '어서', isCorrect: false },
      { id: '3', text: '지만', isCorrect: false },
      { id: '4', text: '면', isCorrect: false }
    ];
  } else if (grammar.korean === '지만') {
    sentence = example.korean.replace(/지만/, '(___)');
    correctAnswer = '지만';
    choices = [
      { id: '1', text: '지만', isCorrect: true },
      { id: '2', text: '고', isCorrect: false },
      { id: '3', text: '어서', isCorrect: false },
      { id: '4', text: '는데', isCorrect: false }
    ];
  } else if (grammar.korean === '에게/한테') {
    const hasEge = example.korean.includes('에게');
    sentence = example.korean.replace(/에게|한테/, '(___)');
    correctAnswer = hasEge ? '에게' : '한테';
    choices = [
      { id: '1', text: '에게', isCorrect: correctAnswer === '에게' },
      { id: '2', text: '한테', isCorrect: correctAnswer === '한테' },
      { id: '3', text: '에서', isCorrect: false },
      { id: '4', text: '에', isCorrect: false }
    ];
  } else if (grammar.korean === '부터') {
    sentence = example.korean.replace(/부터/, '(___)');
    correctAnswer = '부터';
    choices = [
      { id: '1', text: '부터', isCorrect: true },
      { id: '2', text: '까지', isCorrect: false },
      { id: '3', text: '에서', isCorrect: false },
      { id: '4', text: '에', isCorrect: false }
    ];
  } else if (grammar.korean === '까지') {
    sentence = example.korean.replace(/까지/, '(___)');
    correctAnswer = '까지';
    choices = [
      { id: '1', text: '까지', isCorrect: true },
      { id: '2', text: '부터', isCorrect: false },
      { id: '3', text: '에', isCorrect: false },
      { id: '4', text: '으로', isCorrect: false }
    ];
  } else {
    // Generic fallback - try to create exercise from the grammar point
    return null;
  }

  return {
    id: generateId(),
    type: 'grammar-choice',
    lessonId,
    order,
    xpReward: 13,
    sentence,
    context: grammar.description,
    correctAnswer,
    choices: shuffleArray(choices),
    grammarPoint: grammar.korean
  };
}

// ============================================
// Listening Exercise Generators
// ============================================

export function generateListenSelectExercise(
  word: VocabularyWord,
  allVocab: VocabularyWord[],
  lessonId: string,
  order: number
): ListenSelectExercise {
  const choices = createChoicesFromVocab(word, allVocab, false);

  const question: LocalizedText = {
    ko: '들은 단어의 뜻을 고르세요',
    mn: 'Сонссон үгийн утгыг сонгоно уу',
    ru: 'Выберите значение услышанного слова',
    vi: 'Chọn nghĩa của từ bạn nghe'
  };

  return {
    id: generateId(),
    type: 'listen-select',
    lessonId,
    order,
    xpReward: 12,
    audioText: word.korean,
    question,
    choices
  };
}

export function generateListenTypeExercise(
  word: VocabularyWord,
  lessonId: string,
  order: number
): ListenTypeExercise {
  return {
    id: generateId(),
    type: 'listen-type',
    lessonId,
    order,
    xpReward: 15,
    audioText: word.korean,
    acceptableAnswers: [word.korean],
    showHint: true,
    hint: word.korean.charAt(0) + '...'
  };
}

export function generateListenRepeatExercise(
  word: VocabularyWord,
  lessonId: string,
  order: number
): ListenRepeatExercise {
  return {
    id: generateId(),
    type: 'listen-repeat',
    lessonId,
    order,
    xpReward: 13,
    targetText: word.korean,
    acceptableScore: 60
  };
}

// ============================================
// Speaking Exercise Generators
// ============================================

export function generateSpeakWordExercise(
  word: VocabularyWord,
  lessonId: string,
  order: number
): SpeakWordExercise {
  return {
    id: generateId(),
    type: 'speak-word',
    lessonId,
    order,
    xpReward: 12,
    word: {
      id: word.id,
      korean: word.korean,
      pronunciation: word.pronunciation,
      meaning: word.meaning,
      partOfSpeech: word.partOfSpeech
    },
    showMeaning: true,
    acceptableScore: 60
  };
}

export function generateSpeakSentenceExercise(
  word: VocabularyWord,
  lessonId: string,
  order: number
): SpeakSentenceExercise | null {
  if (!word.exampleSentence) return null;

  return {
    id: generateId(),
    type: 'speak-sentence',
    lessonId,
    order,
    xpReward: 13,
    sentence: word.exampleSentence.korean,
    translation: word.exampleSentence.translation,
    acceptableScore: 55
  };
}

// ============================================
// Picture Exercise Generator
// ============================================

// Image categories mapped to vocabulary tags
const IMAGE_CATEGORIES: Record<string, string[]> = {
  food: ['apple', 'banana', 'rice', 'water', 'coffee', 'bread', 'kimchi', 'bibimbap'],
  animal: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'elephant', 'lion', 'tiger'],
  body: ['head', 'eye', 'nose', 'mouth', 'ear', 'hand', 'foot', 'leg'],
  weather: ['sun', 'rain', 'snow', 'cloud', 'wind', 'rainbow'],
  nature: ['mountain', 'sea', 'river', 'tree', 'flower', 'sky', 'star', 'moon'],
  place: ['school', 'hospital', 'restaurant', 'bank', 'library', 'park', 'station'],
  object: ['book', 'pen', 'phone', 'computer', 'chair', 'table', 'door', 'window']
};

function getImageUrlForWord(word: VocabularyWord): string | null {
  // Generate placeholder image URL based on vocabulary tags
  // In production, this would point to actual image assets
  const tag = word.tags[0];
  if (tag && IMAGE_CATEGORIES[tag]) {
    // Use a placeholder service or local assets
    return `/images/vocabulary/${word.id}.png`;
  }
  return null;
}

export function generateWordPictureExercise(
  word: VocabularyWord,
  allVocab: VocabularyWord[],
  lessonId: string,
  order: number
): WordPictureExercise | null {
  // Only generate for words that can have meaningful images
  const imageableTags = ['food', 'animal', 'body', 'weather', 'nature', 'place', 'object'];
  const hasImageableTag = word.tags.some(tag => imageableTags.includes(tag));

  if (!hasImageableTag) return null;

  const imageUrl = getImageUrlForWord(word);
  if (!imageUrl) return null;

  // Get wrong choices from the same category for better distraction
  const sameTagWords = allVocab.filter(v =>
    v.id !== word.id &&
    v.tags.some(tag => word.tags.includes(tag))
  );

  const differentTagWords = allVocab.filter(v =>
    v.id !== word.id &&
    !v.tags.some(tag => word.tags.includes(tag))
  );

  // Prefer same-category distractors, fill with different if needed
  const distractors = [
    ...shuffleArray(sameTagWords).slice(0, 2),
    ...shuffleArray(differentTagWords).slice(0, 1)
  ].slice(0, 3);

  const choices: Choice[] = shuffleArray([
    {
      id: word.id,
      text: word.korean,
      translation: word.meaning,
      isCorrect: true
    },
    ...distractors.map(v => ({
      id: v.id,
      text: v.korean,
      translation: v.meaning,
      isCorrect: false
    }))
  ]);

  return {
    id: generateId(),
    type: 'word-picture',
    lessonId,
    order,
    xpReward: 12,
    imageUrl,
    imageAlt: word.meaning.ko,
    correctWord: {
      id: word.id,
      korean: word.korean,
      pronunciation: word.pronunciation,
      meaning: word.meaning,
      partOfSpeech: word.partOfSpeech
    },
    choices
  };
}

// ============================================
// Translation Exercise Generator
// ============================================

export function generateTranslateExercise(
  word: VocabularyWord,
  lessonId: string,
  order: number,
  targetLocale: string = 'ko'
): TranslateExercise | null {
  if (!word.exampleSentence) return null;

  // Determine source and target languages
  let sourceText: string;
  let sourceLanguage: 'ko' | 'mn' | 'ru' | 'vi';
  let targetLanguage: 'ko' | 'mn' | 'ru' | 'vi';
  let acceptableAnswers: string[];

  if (targetLocale === 'ko') {
    // Translate from user's language to Korean
    sourceLanguage = 'ko';
    targetLanguage = 'ko';
    sourceText = word.exampleSentence.korean;
    acceptableAnswers = [word.exampleSentence.korean];
  } else {
    // Translate from Korean to user's language
    sourceLanguage = 'ko';
    targetLanguage = targetLocale as 'mn' | 'ru' | 'vi';
    sourceText = word.exampleSentence.korean;
    const translation = word.exampleSentence.translation[targetLanguage];
    acceptableAnswers = translation ? [translation] : [];
  }

  if (acceptableAnswers.length === 0) return null;

  return {
    id: generateId(),
    type: 'translate',
    lessonId,
    order,
    xpReward: 15,
    sourceText,
    sourceLanguage,
    targetLanguage,
    acceptableAnswers,
    hint: word.korean
  };
}

// Generate translation exercise from sentence patterns
export function generatePatternTranslateExercise(
  pattern: SentencePattern,
  lessonId: string,
  order: number,
  targetLocale: string = 'ko'
): TranslateExercise | null {
  if (pattern.examples.length === 0) return null;

  const example = pattern.examples[Math.floor(Math.random() * pattern.examples.length)];

  let sourceText: string;
  let sourceLanguage: 'ko' | 'mn' | 'ru' | 'vi';
  let targetLanguage: 'ko' | 'mn' | 'ru' | 'vi';
  let acceptableAnswers: string[];

  if (targetLocale === 'ko') {
    // Translate from meaning to Korean
    sourceLanguage = 'mn'; // Default to Mongolian as source
    targetLanguage = 'ko';
    sourceText = example.translation.mn;
    acceptableAnswers = [example.korean];
  } else {
    // Translate from Korean to user's language
    sourceLanguage = 'ko';
    targetLanguage = targetLocale as 'mn' | 'ru' | 'vi';
    sourceText = example.korean;
    const translation = example.translation[targetLanguage];
    acceptableAnswers = translation ? [translation] : [];
  }

  if (acceptableAnswers.length === 0) return null;

  return {
    id: generateId(),
    type: 'translate',
    lessonId,
    order,
    xpReward: 15,
    sourceText,
    sourceLanguage,
    targetLanguage,
    acceptableAnswers,
    hint: pattern.patternKorean
  };
}

// ============================================
// Listen Comprehend Exercise Generator
// ============================================

// Sample comprehension passages for listen-comprehend exercises
const COMPREHENSION_PASSAGES = [
  {
    passage: '안녕하세요. 저는 김민수입니다. 저는 학생이에요. 학교에서 한국어를 공부해요. 한국어가 재미있어요.',
    questions: [
      {
        question: { ko: '이 사람의 이름은 뭐예요?', mn: 'Энэ хүний нэр хэн бэ?', ru: 'Как зовут этого человека?', vi: 'Người này tên gì?' },
        correctAnswer: '김민수',
        wrongAnswers: ['박지영', '이수진', '최영희']
      },
      {
        question: { ko: '이 사람은 뭐 해요?', mn: 'Энэ хүн юу хийдэг вэ?', ru: 'Чем занимается этот человек?', vi: 'Người này làm gì?' },
        correctAnswer: '한국어를 공부해요',
        wrongAnswers: ['일해요', '쉬어요', '운동해요']
      }
    ]
  },
  {
    passage: '오늘 날씨가 좋아요. 저는 공원에 가요. 친구를 만나요. 같이 점심을 먹어요.',
    questions: [
      {
        question: { ko: '오늘 날씨가 어때요?', mn: 'Өнөөдөр цаг агаар ямар байна вэ?', ru: 'Какая сегодня погода?', vi: 'Thời tiết hôm nay thế nào?' },
        correctAnswer: '좋아요',
        wrongAnswers: ['나빠요', '추워요', '더워요']
      },
      {
        question: { ko: '어디에 가요?', mn: 'Хаашаа явж байна вэ?', ru: 'Куда идёт?', vi: 'Đi đâu?' },
        correctAnswer: '공원에 가요',
        wrongAnswers: ['학교에 가요', '집에 가요', '회사에 가요']
      }
    ]
  },
  {
    passage: '저는 아침 7시에 일어나요. 8시에 아침을 먹어요. 9시에 학교에 가요. 오후 4시에 집에 와요.',
    questions: [
      {
        question: { ko: '몇 시에 일어나요?', mn: 'Хэдэн цагт босдог вэ?', ru: 'Во сколько встаёт?', vi: 'Dậy lúc mấy giờ?' },
        correctAnswer: '7시',
        wrongAnswers: ['6시', '8시', '9시']
      },
      {
        question: { ko: '몇 시에 학교에 가요?', mn: 'Хэдэн цагт сургуульд явдаг вэ?', ru: 'Во сколько идёт в школу?', vi: 'Mấy giờ đi học?' },
        correctAnswer: '9시',
        wrongAnswers: ['7시', '8시', '10시']
      }
    ]
  }
];

export function generateListenComprehendExercise(
  lessonId: string,
  order: number
): ListenComprehendExercise {
  const passageData = COMPREHENSION_PASSAGES[Math.floor(Math.random() * COMPREHENSION_PASSAGES.length)];

  const questions = passageData.questions.map(q => ({
    question: q.question,
    choices: shuffleArray([
      { id: generateId(), text: q.correctAnswer, isCorrect: true },
      ...q.wrongAnswers.map(wa => ({ id: generateId(), text: wa, isCorrect: false }))
    ])
  }));

  return {
    id: generateId(),
    type: 'listen-comprehend',
    lessonId,
    order,
    xpReward: 20,
    passage: passageData.passage,
    questions
  };
}

// ============================================
// Speak Answer Exercise Generator
// ============================================

// Sample Q&A pairs for speak-answer exercises
const QA_PAIRS = [
  {
    question: '이름이 뭐예요?',
    translation: { ko: '이름이 뭐예요?', mn: 'Нэр чинь хэн бэ?', ru: 'Как вас зовут?', vi: 'Tên bạn là gì?' },
    expectedAnswers: ['저는', '이에요', '예요', '입니다']
  },
  {
    question: '어디에서 왔어요?',
    translation: { ko: '어디에서 왔어요?', mn: 'Хаанаас ирсэн бэ?', ru: 'Откуда вы?', vi: 'Bạn đến từ đâu?' },
    expectedAnswers: ['에서', '왔어요', '사람이에요']
  },
  {
    question: '오늘 날씨가 어때요?',
    translation: { ko: '오늘 날씨가 어때요?', mn: 'Өнөөдөр цаг агаар ямар байна вэ?', ru: 'Какая сегодня погода?', vi: 'Thời tiết hôm nay thế nào?' },
    expectedAnswers: ['좋아요', '나빠요', '더워요', '추워요', '맑아요', '흐려요']
  },
  {
    question: '뭐 해요?',
    translation: { ko: '뭐 해요?', mn: 'Юу хийж байна вэ?', ru: 'Что делаете?', vi: 'Bạn đang làm gì?' },
    expectedAnswers: ['공부해요', '일해요', '먹어요', '쉬어요', '봐요', '들어요']
  },
  {
    question: '뭐 먹고 싶어요?',
    translation: { ko: '뭐 먹고 싶어요?', mn: 'Юу идмээр байна вэ?', ru: 'Что хотите есть?', vi: 'Bạn muốn ăn gì?' },
    expectedAnswers: ['먹고 싶어요', '밥', '김치', '불고기', '비빔밥']
  },
  {
    question: '어디에 가요?',
    translation: { ko: '어디에 가요?', mn: 'Хаашаа явж байна вэ?', ru: 'Куда идёте?', vi: 'Bạn đi đâu?' },
    expectedAnswers: ['에 가요', '학교', '집', '회사', '공원', '식당']
  },
  {
    question: '몇 시에 일어나요?',
    translation: { ko: '몇 시에 일어나요?', mn: 'Хэдэн цагт босдог вэ?', ru: 'Во сколько встаёте?', vi: 'Bạn dậy lúc mấy giờ?' },
    expectedAnswers: ['시에', '일어나요', '아침']
  },
  {
    question: '취미가 뭐예요?',
    translation: { ko: '취미가 뭐예요?', mn: 'Хобби чинь юу вэ?', ru: 'Какое у вас хобби?', vi: 'Sở thích của bạn là gì?' },
    expectedAnswers: ['취미', '좋아해요', '운동', '음악', '영화', '독서', '여행']
  }
];

export function generateSpeakAnswerExercise(
  lessonId: string,
  order: number
): SpeakAnswerExercise {
  const qa = QA_PAIRS[Math.floor(Math.random() * QA_PAIRS.length)];

  return {
    id: generateId(),
    type: 'speak-answer',
    lessonId,
    order,
    xpReward: 15,
    question: qa.question,
    questionTranslation: qa.translation,
    expectedAnswers: qa.expectedAnswers,
    acceptableScore: 50
  };
}

// ============================================
// Speak Describe Exercise Generator
// ============================================

// Sample image descriptions for speak-describe exercises
const IMAGE_DESCRIPTIONS = [
  {
    imageUrl: '/images/exercises/classroom.png',
    imageAlt: '교실',
    prompt: { ko: '이 그림에서 무엇이 보여요?', mn: 'Энэ зурагт юу харагдаж байна вэ?', ru: 'Что вы видите на картинке?', vi: 'Bạn thấy gì trong hình?' },
    keywords: ['교실', '학생', '선생님', '책상', '의자', '칠판', '공부']
  },
  {
    imageUrl: '/images/exercises/restaurant.png',
    imageAlt: '식당',
    prompt: { ko: '이 그림에서 무엇이 보여요?', mn: 'Энэ зурагт юу харагдаж байна вэ?', ru: 'Что вы видите на картинке?', vi: 'Bạn thấy gì trong hình?' },
    keywords: ['식당', '음식', '밥', '먹어요', '사람', '메뉴', '물']
  },
  {
    imageUrl: '/images/exercises/park.png',
    imageAlt: '공원',
    prompt: { ko: '이 그림에서 무엇이 보여요?', mn: 'Энэ зурагт юу харагдаж байна вэ?', ru: 'Что вы видите на картинке?', vi: 'Bạn thấy gì trong hình?' },
    keywords: ['공원', '나무', '꽃', '사람', '걸어요', '운동', '벤치']
  },
  {
    imageUrl: '/images/exercises/family.png',
    imageAlt: '가족',
    prompt: { ko: '이 그림에서 무엇이 보여요?', mn: 'Энэ зурагт юу харагдаж байна вэ?', ru: 'Что вы видите на картинке?', vi: 'Bạn thấy gì trong hình?' },
    keywords: ['가족', '아버지', '어머니', '형', '동생', '집', '행복']
  },
  {
    imageUrl: '/images/exercises/market.png',
    imageAlt: '시장',
    prompt: { ko: '이 그림에서 무엇이 보여요?', mn: 'Энэ зурагт юу харагдаж байна вэ?', ru: 'Что вы видите на картинке?', vi: 'Bạn thấy gì trong hình?' },
    keywords: ['시장', '과일', '야채', '사요', '사람', '돈', '물건']
  },
  {
    imageUrl: '/images/exercises/weather.png',
    imageAlt: '날씨',
    prompt: { ko: '오늘 날씨가 어때요?', mn: 'Өнөөдөр цаг агаар ямар байна вэ?', ru: 'Какая сегодня погода?', vi: 'Thời tiết hôm nay thế nào?' },
    keywords: ['날씨', '해', '구름', '비', '바람', '맑아요', '흐려요', '더워요', '추워요']
  }
];

export function generateSpeakDescribeExercise(
  lessonId: string,
  order: number
): SpeakDescribeExercise {
  const desc = IMAGE_DESCRIPTIONS[Math.floor(Math.random() * IMAGE_DESCRIPTIONS.length)];

  return {
    id: generateId(),
    type: 'speak-describe',
    lessonId,
    order,
    xpReward: 18,
    imageUrl: desc.imageUrl,
    imageAlt: desc.imageAlt,
    promptText: desc.prompt,
    expectedKeywords: desc.keywords,
    acceptableScore: 50
  };
}

// ============================================
// Main Exercise Generation Function
// ============================================

export interface GenerateLessonExercisesOptions {
  lessonId: string;
  vocabularyIds: string[];
  grammarIds?: string[];
  exerciseCount?: number;
  includeVoice?: boolean;
}

export function generateLessonExercises(
  options: GenerateLessonExercisesOptions
): Exercise[] {
  const {
    lessonId,
    vocabularyIds,
    grammarIds = [],
    exerciseCount = 10,
    includeVoice = true
  } = options;

  // Get vocabulary for this lesson
  const lessonVocab = getVocabularyByLesson(lessonId);
  const allVocab = getRandomVocabulary(20);

  // Get grammar points
  const grammarPoints = TOPIK1_GRAMMAR.filter(g => grammarIds.includes(g.id));

  // Generate exercise sequence
  const exerciseTypes = generateExerciseSequence(exerciseCount, includeVoice);

  const exercises: Exercise[] = [];
  let vocabIndex = 0;
  let grammarIndex = 0;

  exerciseTypes.forEach((type, order) => {
    const word = lessonVocab[vocabIndex % lessonVocab.length];
    vocabIndex++;

    let exercise: Exercise | null = null;

    switch (type) {
      case 'word-match':
        exercise = generateWordMatchExercise(word, allVocab, lessonId, order);
        break;
      case 'word-picture':
        exercise = generateWordPictureExercise(word, allVocab, lessonId, order);
        break;
      case 'word-audio':
        exercise = generateWordAudioExercise(word, allVocab, lessonId, order);
        break;
      case 'word-spell':
        exercise = generateWordSpellExercise(word, lessonId, order);
        break;
      case 'fill-blank':
        exercise = generateFillBlankExercise(word, allVocab, lessonId, order);
        break;
      case 'word-order':
        exercise = generateWordOrderExercise(word, lessonId, order);
        break;
      case 'translate':
        exercise = generateTranslateExercise(word, lessonId, order);
        break;
      case 'grammar-choice':
        if (grammarPoints.length > 0) {
          const grammar = grammarPoints[grammarIndex % grammarPoints.length];
          grammarIndex++;
          exercise = generateGrammarChoiceExercise(grammar, lessonId, order);
        }
        break;
      case 'listen-select':
        exercise = generateListenSelectExercise(word, allVocab, lessonId, order);
        break;
      case 'listen-type':
        exercise = generateListenTypeExercise(word, lessonId, order);
        break;
      case 'listen-repeat':
        exercise = generateListenRepeatExercise(word, lessonId, order);
        break;
      case 'speak-word':
        exercise = generateSpeakWordExercise(word, lessonId, order);
        break;
      case 'speak-sentence':
        exercise = generateSpeakSentenceExercise(word, lessonId, order);
        break;
      case 'listen-comprehend':
        exercise = generateListenComprehendExercise(lessonId, order);
        break;
      case 'speak-answer':
        exercise = generateSpeakAnswerExercise(lessonId, order);
        break;
      case 'speak-describe':
        exercise = generateSpeakDescribeExercise(lessonId, order);
        break;
    }

    // Fallback to word-match if exercise generation failed
    if (!exercise) {
      exercise = generateWordMatchExercise(word, allVocab, lessonId, order);
    }

    exercises.push(exercise);
  });

  return exercises;
}

// Generate a quick practice set for a specific vocabulary word
export function generateWordPractice(
  word: VocabularyWord,
  allVocab: VocabularyWord[]
): Exercise[] {
  const lessonId = 'quick-practice';
  return [
    generateWordMatchExercise(word, allVocab, lessonId, 0),
    generateWordAudioExercise(word, allVocab, lessonId, 1),
    generateListenRepeatExercise(word, lessonId, 2),
    generateWordSpellExercise(word, lessonId, 3)
  ];
}
