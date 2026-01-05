// Exercise Types for TOPIK Korean Learning Platform
// 16 exercise types across 4 categories: Vocabulary, Sentence, Listening, Speaking

import { LocalizedText } from './korean-curriculum';

// ============================================
// Core Types
// ============================================

export type ExerciseCategory = 'vocabulary' | 'sentence' | 'listening' | 'speaking';

export type ExerciseType =
  // Vocabulary exercises (4 types)
  | 'word-match'      // Match Korean word to meaning
  | 'word-picture'    // Select word that matches picture
  | 'word-audio'      // Listen and select correct word
  | 'word-spell'      // Type the Korean word
  // Sentence exercises (4 types)
  | 'fill-blank'      // Fill in the blank
  | 'word-order'      // Arrange words in correct order
  | 'translate'       // Translate sentence
  | 'grammar-choice'  // Choose correct grammar form
  // Listening exercises (4 types)
  | 'listen-select'   // Listen and select correct answer
  | 'listen-type'     // Listen and type what you hear
  | 'listen-comprehend' // Listen to passage and answer questions
  | 'listen-repeat'   // Listen and repeat (pronunciation check)
  // Speaking exercises (4 types)
  | 'speak-word'      // Pronounce a word
  | 'speak-sentence'  // Read a sentence aloud
  | 'speak-answer'    // Answer a question verbally
  | 'speak-describe'  // Describe an image verbally
;

export interface ExerciseTypeConfig {
  id: ExerciseType;
  category: ExerciseCategory;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  requiresAudio: boolean;      // Needs TTS playback
  requiresMicrophone: boolean; // Needs speech recognition
  requiresImage: boolean;      // Shows an image
  difficulty: 1 | 2 | 3;       // Relative difficulty within category
  xpMultiplier: number;        // XP bonus multiplier
}

// ============================================
// Choice/Answer Types
// ============================================

export interface Choice {
  id: string;
  text: string;
  translation?: LocalizedText;
  isCorrect: boolean;
  audioUrl?: string;
}

export interface WordItem {
  id: string;
  korean: string;
  pronunciation: string;  // Romanization
  meaning: LocalizedText;
  audioUrl?: string;
  imageUrl?: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression' | 'pronoun';
  exampleSentence?: {
    korean: string;
    translation: LocalizedText;
  };
}

// ============================================
// Exercise Base Interface
// ============================================

export interface ExerciseBase {
  id: string;
  type: ExerciseType;
  lessonId: string;
  order: number;
  xpReward: number;
  timeLimit?: number;  // Optional time limit in seconds
}

// ============================================
// Vocabulary Exercises
// ============================================

// Type 1: Match Korean word to meaning
export interface WordMatchExercise extends ExerciseBase {
  type: 'word-match';
  word: WordItem;
  choices: Choice[];  // 4 choices, one correct
}

// Type 2: Select word that matches picture
export interface WordPictureExercise extends ExerciseBase {
  type: 'word-picture';
  imageUrl: string;
  imageAlt: string;
  correctWord: WordItem;
  choices: Choice[];  // 4 Korean words, one correct
}

// Type 3: Listen and select correct word
export interface WordAudioExercise extends ExerciseBase {
  type: 'word-audio';
  audioWord: WordItem;  // The word being spoken
  choices: Choice[];    // 4 Korean words to choose from
}

// Type 4: Type the Korean word
export interface WordSpellExercise extends ExerciseBase {
  type: 'word-spell';
  word: WordItem;
  showMeaning: boolean;
  showImage: boolean;
  acceptableAnswers: string[];  // Allow variations
}

// ============================================
// Sentence Exercises
// ============================================

// Type 5: Fill in the blank
export interface FillBlankExercise extends ExerciseBase {
  type: 'fill-blank';
  sentence: string;           // With (___) for blank
  translation: LocalizedText;
  correctAnswer: string;
  choices: Choice[];          // 4 choices
  hint?: string;
}

// Type 6: Arrange words in correct order
export interface WordOrderExercise extends ExerciseBase {
  type: 'word-order';
  shuffledWords: string[];    // Words in random order
  correctOrder: string[];     // Words in correct order
  translation: LocalizedText;
  hint?: string;
}

// Type 7: Translate sentence
export interface TranslateExercise extends ExerciseBase {
  type: 'translate';
  sourceText: string;
  sourceLanguage: 'ko' | 'mn' | 'ru' | 'vi';
  targetLanguage: 'ko' | 'mn' | 'ru' | 'vi';
  acceptableAnswers: string[];
  hint?: string;
}

// Type 8: Choose correct grammar form
export interface GrammarChoiceExercise extends ExerciseBase {
  type: 'grammar-choice';
  sentence: string;           // With (___) for grammar point
  context: LocalizedText;     // Explanation of situation
  correctAnswer: string;
  choices: Choice[];          // Grammar options like 을/를, 이/가, etc.
  grammarPoint: string;       // e.g., "object particle", "topic marker"
}

// ============================================
// Listening Exercises
// ============================================

// Type 9: Listen and select correct answer
export interface ListenSelectExercise extends ExerciseBase {
  type: 'listen-select';
  audioText: string;          // Text being spoken
  audioUrl?: string;          // Pre-recorded or use TTS
  question: LocalizedText;
  choices: Choice[];
}

// Type 10: Listen and type what you hear
export interface ListenTypeExercise extends ExerciseBase {
  type: 'listen-type';
  audioText: string;
  audioUrl?: string;
  acceptableAnswers: string[];
  showHint: boolean;
  hint?: string;              // First character or partial word
}

// Type 11: Listen to passage and answer questions
export interface ListenComprehendExercise extends ExerciseBase {
  type: 'listen-comprehend';
  passage: string;            // Longer text/dialogue
  audioUrl?: string;
  questions: {
    question: LocalizedText;
    choices: Choice[];
  }[];
}

// Type 12: Listen and repeat (pronunciation check)
export interface ListenRepeatExercise extends ExerciseBase {
  type: 'listen-repeat';
  targetText: string;
  audioUrl?: string;
  acceptableScore: number;    // 0-100, minimum score to pass
}

// ============================================
// Speaking Exercises
// ============================================

// Type 13: Pronounce a word
export interface SpeakWordExercise extends ExerciseBase {
  type: 'speak-word';
  word: WordItem;
  showMeaning: boolean;
  acceptableScore: number;
}

// Type 14: Read a sentence aloud
export interface SpeakSentenceExercise extends ExerciseBase {
  type: 'speak-sentence';
  sentence: string;
  translation: LocalizedText;
  acceptableScore: number;
}

// Type 15: Answer a question verbally
export interface SpeakAnswerExercise extends ExerciseBase {
  type: 'speak-answer';
  question: string;
  questionTranslation: LocalizedText;
  expectedAnswers: string[];  // Acceptable responses
  acceptableScore: number;
}

// Type 16: Describe an image verbally
export interface SpeakDescribeExercise extends ExerciseBase {
  type: 'speak-describe';
  imageUrl: string;
  imageAlt: string;
  promptText: LocalizedText;  // "What do you see?" etc.
  expectedKeywords: string[]; // Words that should appear
  acceptableScore: number;
}

// ============================================
// Union Type for All Exercises
// ============================================

export type Exercise =
  | WordMatchExercise
  | WordPictureExercise
  | WordAudioExercise
  | WordSpellExercise
  | FillBlankExercise
  | WordOrderExercise
  | TranslateExercise
  | GrammarChoiceExercise
  | ListenSelectExercise
  | ListenTypeExercise
  | ListenComprehendExercise
  | ListenRepeatExercise
  | SpeakWordExercise
  | SpeakSentenceExercise
  | SpeakAnswerExercise
  | SpeakDescribeExercise;

// ============================================
// Exercise Type Configurations
// ============================================

export const EXERCISE_TYPES: Record<ExerciseType, ExerciseTypeConfig> = {
  // Vocabulary exercises
  'word-match': {
    id: 'word-match',
    category: 'vocabulary',
    name: {
      ko: '단어 의미 맞추기',
      mn: 'Үгийн утга тааруулах',
      ru: 'Подбор значения слова',
      vi: 'Nối nghĩa từ'
    },
    description: {
      ko: '한국어 단어의 뜻을 고르세요',
      mn: 'Солонгос үгийн утгыг сонгоно уу',
      ru: 'Выберите значение корейского слова',
      vi: 'Chọn nghĩa của từ tiếng Hàn'
    },
    icon: '🔤',
    requiresAudio: false,
    requiresMicrophone: false,
    requiresImage: false,
    difficulty: 1,
    xpMultiplier: 1.0
  },
  'word-picture': {
    id: 'word-picture',
    category: 'vocabulary',
    name: {
      ko: '그림 보고 단어 고르기',
      mn: 'Зураг харж үг сонгох',
      ru: 'Выбор слова по картинке',
      vi: 'Chọn từ theo hình'
    },
    description: {
      ko: '그림에 맞는 단어를 고르세요',
      mn: 'Зурагт тохирох үгийг сонгоно уу',
      ru: 'Выберите слово, соответствующее картинке',
      vi: 'Chọn từ phù hợp với hình'
    },
    icon: '🖼️',
    requiresAudio: false,
    requiresMicrophone: false,
    requiresImage: true,
    difficulty: 1,
    xpMultiplier: 1.0
  },
  'word-audio': {
    id: 'word-audio',
    category: 'vocabulary',
    name: {
      ko: '듣고 단어 고르기',
      mn: 'Сонсоод үг сонгох',
      ru: 'Выбор слова на слух',
      vi: 'Nghe và chọn từ'
    },
    description: {
      ko: '들은 단어를 고르세요',
      mn: 'Сонссон үгээ сонгоно уу',
      ru: 'Выберите услышанное слово',
      vi: 'Chọn từ bạn nghe được'
    },
    icon: '🔊',
    requiresAudio: true,
    requiresMicrophone: false,
    requiresImage: false,
    difficulty: 2,
    xpMultiplier: 1.2
  },
  'word-spell': {
    id: 'word-spell',
    category: 'vocabulary',
    name: {
      ko: '단어 쓰기',
      mn: 'Үг бичих',
      ru: 'Написание слова',
      vi: 'Viết từ'
    },
    description: {
      ko: '한국어로 단어를 입력하세요',
      mn: 'Солонгос хэлээр үг бичнэ үү',
      ru: 'Напишите слово по-корейски',
      vi: 'Nhập từ bằng tiếng Hàn'
    },
    icon: '✏️',
    requiresAudio: false,
    requiresMicrophone: false,
    requiresImage: false,
    difficulty: 3,
    xpMultiplier: 1.5
  },

  // Sentence exercises
  'fill-blank': {
    id: 'fill-blank',
    category: 'sentence',
    name: {
      ko: '빈칸 채우기',
      mn: 'Хоосон зай бөглөх',
      ru: 'Заполнение пропуска',
      vi: 'Điền vào chỗ trống'
    },
    description: {
      ko: '문장의 빈칸에 알맞은 말을 고르세요',
      mn: 'Өгүүлбэрийн хоосон зайд тохирох үгийг сонгоно уу',
      ru: 'Выберите подходящее слово для пропуска',
      vi: 'Chọn từ thích hợp cho chỗ trống'
    },
    icon: '📝',
    requiresAudio: false,
    requiresMicrophone: false,
    requiresImage: false,
    difficulty: 1,
    xpMultiplier: 1.0
  },
  'word-order': {
    id: 'word-order',
    category: 'sentence',
    name: {
      ko: '어순 맞추기',
      mn: 'Үг эрэмбэлэх',
      ru: 'Порядок слов',
      vi: 'Sắp xếp từ'
    },
    description: {
      ko: '단어를 올바른 순서로 배열하세요',
      mn: 'Үгсийг зөв дарааллаар байрлуулна уу',
      ru: 'Расставьте слова в правильном порядке',
      vi: 'Sắp xếp từ theo đúng thứ tự'
    },
    icon: '🔀',
    requiresAudio: false,
    requiresMicrophone: false,
    requiresImage: false,
    difficulty: 2,
    xpMultiplier: 1.3
  },
  'translate': {
    id: 'translate',
    category: 'sentence',
    name: {
      ko: '번역하기',
      mn: 'Орчуулах',
      ru: 'Перевод',
      vi: 'Dịch'
    },
    description: {
      ko: '문장을 번역하세요',
      mn: 'Өгүүлбэрийг орчуулна уу',
      ru: 'Переведите предложение',
      vi: 'Dịch câu'
    },
    icon: '🌐',
    requiresAudio: false,
    requiresMicrophone: false,
    requiresImage: false,
    difficulty: 3,
    xpMultiplier: 1.5
  },
  'grammar-choice': {
    id: 'grammar-choice',
    category: 'sentence',
    name: {
      ko: '문법 고르기',
      mn: 'Дүрэм сонгох',
      ru: 'Выбор грамматики',
      vi: 'Chọn ngữ pháp'
    },
    description: {
      ko: '알맞은 문법 형태를 고르세요',
      mn: 'Зөв дүрмийн хэлбэрийг сонгоно уу',
      ru: 'Выберите правильную грамматическую форму',
      vi: 'Chọn dạng ngữ pháp đúng'
    },
    icon: '📚',
    requiresAudio: false,
    requiresMicrophone: false,
    requiresImage: false,
    difficulty: 2,
    xpMultiplier: 1.3
  },

  // Listening exercises
  'listen-select': {
    id: 'listen-select',
    category: 'listening',
    name: {
      ko: '듣고 고르기',
      mn: 'Сонсоод сонгох',
      ru: 'Слушать и выбирать',
      vi: 'Nghe và chọn'
    },
    description: {
      ko: '듣고 알맞은 답을 고르세요',
      mn: 'Сонсоод зөв хариултыг сонгоно уу',
      ru: 'Прослушайте и выберите правильный ответ',
      vi: 'Nghe và chọn câu trả lời đúng'
    },
    icon: '👂',
    requiresAudio: true,
    requiresMicrophone: false,
    requiresImage: false,
    difficulty: 1,
    xpMultiplier: 1.2
  },
  'listen-type': {
    id: 'listen-type',
    category: 'listening',
    name: {
      ko: '듣고 쓰기',
      mn: 'Сонсоод бичих',
      ru: 'Слушать и писать',
      vi: 'Nghe và viết'
    },
    description: {
      ko: '들은 내용을 받아쓰세요',
      mn: 'Сонссон зүйлээ бичнэ үү',
      ru: 'Напишите услышанное',
      vi: 'Viết lại những gì bạn nghe'
    },
    icon: '📻',
    requiresAudio: true,
    requiresMicrophone: false,
    requiresImage: false,
    difficulty: 3,
    xpMultiplier: 1.5
  },
  'listen-comprehend': {
    id: 'listen-comprehend',
    category: 'listening',
    name: {
      ko: '듣기 이해',
      mn: 'Сонсоод ойлгох',
      ru: 'Понимание на слух',
      vi: 'Nghe hiểu'
    },
    description: {
      ko: '대화를 듣고 질문에 답하세요',
      mn: 'Яриаг сонсоод асуултад хариулна уу',
      ru: 'Прослушайте диалог и ответьте на вопросы',
      vi: 'Nghe đoạn hội thoại và trả lời câu hỏi'
    },
    icon: '🎧',
    requiresAudio: true,
    requiresMicrophone: false,
    requiresImage: false,
    difficulty: 3,
    xpMultiplier: 1.5
  },
  'listen-repeat': {
    id: 'listen-repeat',
    category: 'listening',
    name: {
      ko: '듣고 따라하기',
      mn: 'Сонсоод давтах',
      ru: 'Слушать и повторять',
      vi: 'Nghe và nhắc lại'
    },
    description: {
      ko: '들은 대로 따라 말하세요',
      mn: 'Сонссон зүйлээ давтаж хэлнэ үү',
      ru: 'Повторите услышанное',
      vi: 'Nhắc lại những gì bạn nghe'
    },
    icon: '🔁',
    requiresAudio: true,
    requiresMicrophone: true,
    requiresImage: false,
    difficulty: 2,
    xpMultiplier: 1.3
  },

  // Speaking exercises
  'speak-word': {
    id: 'speak-word',
    category: 'speaking',
    name: {
      ko: '단어 발음하기',
      mn: 'Үг дуудах',
      ru: 'Произношение слова',
      vi: 'Phát âm từ'
    },
    description: {
      ko: '단어를 소리내어 읽으세요',
      mn: 'Үгийг чанга уншина уу',
      ru: 'Прочитайте слово вслух',
      vi: 'Đọc to từ này'
    },
    icon: '🗣️',
    requiresAudio: true,
    requiresMicrophone: true,
    requiresImage: false,
    difficulty: 1,
    xpMultiplier: 1.2
  },
  'speak-sentence': {
    id: 'speak-sentence',
    category: 'speaking',
    name: {
      ko: '문장 읽기',
      mn: 'Өгүүлбэр унших',
      ru: 'Чтение предложения',
      vi: 'Đọc câu'
    },
    description: {
      ko: '문장을 소리내어 읽으세요',
      mn: 'Өгүүлбэрийг чанга уншина уу',
      ru: 'Прочитайте предложение вслух',
      vi: 'Đọc to câu này'
    },
    icon: '💬',
    requiresAudio: true,
    requiresMicrophone: true,
    requiresImage: false,
    difficulty: 2,
    xpMultiplier: 1.3
  },
  'speak-answer': {
    id: 'speak-answer',
    category: 'speaking',
    name: {
      ko: '질문에 대답하기',
      mn: 'Асуултад хариулах',
      ru: 'Ответ на вопрос',
      vi: 'Trả lời câu hỏi'
    },
    description: {
      ko: '질문을 듣고 대답하세요',
      mn: 'Асуултыг сонсоод хариулна уу',
      ru: 'Послушайте вопрос и ответьте',
      vi: 'Nghe câu hỏi và trả lời'
    },
    icon: '❓',
    requiresAudio: true,
    requiresMicrophone: true,
    requiresImage: false,
    difficulty: 3,
    xpMultiplier: 1.5
  },
  'speak-describe': {
    id: 'speak-describe',
    category: 'speaking',
    name: {
      ko: '그림 설명하기',
      mn: 'Зураг тайлбарлах',
      ru: 'Описание картинки',
      vi: 'Mô tả hình'
    },
    description: {
      ko: '그림을 보고 설명하세요',
      mn: 'Зургийг харж тайлбарлана уу',
      ru: 'Посмотрите на картинку и опишите её',
      vi: 'Nhìn hình và mô tả'
    },
    icon: '🎨',
    requiresAudio: true,
    requiresMicrophone: true,
    requiresImage: true,
    difficulty: 3,
    xpMultiplier: 1.5
  }
};

// ============================================
// Helper Functions
// ============================================

export function getExercisesByCategory(category: ExerciseCategory): ExerciseTypeConfig[] {
  return Object.values(EXERCISE_TYPES).filter(e => e.category === category);
}

export function getExerciseConfig(type: ExerciseType): ExerciseTypeConfig {
  return EXERCISE_TYPES[type];
}

export function requiresMicrophone(type: ExerciseType): boolean {
  return EXERCISE_TYPES[type].requiresMicrophone;
}

export function requiresAudio(type: ExerciseType): boolean {
  return EXERCISE_TYPES[type].requiresAudio;
}

// Generate a balanced exercise set for a lesson
export function generateExerciseSequence(
  totalExercises: number,
  includeVoice: boolean = true
): ExerciseType[] {
  const sequence: ExerciseType[] = [];

  // Categories to include
  const categories: ExerciseCategory[] = includeVoice
    ? ['vocabulary', 'sentence', 'listening', 'speaking']
    : ['vocabulary', 'sentence'];

  // Get exercises per category
  const exercisesPerCategory = Math.ceil(totalExercises / categories.length);

  for (const category of categories) {
    const categoryExercises = getExercisesByCategory(category)
      .filter(e => !e.requiresMicrophone || includeVoice)
      .sort((a, b) => a.difficulty - b.difficulty);

    // Add exercises from this category
    for (let i = 0; i < exercisesPerCategory && sequence.length < totalExercises; i++) {
      const exercise = categoryExercises[i % categoryExercises.length];
      sequence.push(exercise.id);
    }
  }

  return sequence.slice(0, totalExercises);
}

// Calculate XP for an exercise result
export function calculateExerciseXP(
  baseXP: number,
  type: ExerciseType,
  isCorrect: boolean,
  timeBonus: boolean = false,
  streak: number = 0
): number {
  if (!isCorrect) return 0;

  const config = EXERCISE_TYPES[type];
  let xp = baseXP * config.xpMultiplier;

  // Time bonus: +20% if answered quickly
  if (timeBonus) {
    xp *= 1.2;
  }

  // Streak bonus: +10% per consecutive correct, max +50%
  const streakBonus = Math.min(streak * 0.1, 0.5);
  xp *= (1 + streakBonus);

  return Math.round(xp);
}

// ============================================
// Exercise Validation Types
// ============================================

export interface ExerciseResult {
  exerciseId: string;
  type: ExerciseType;
  isCorrect: boolean;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  timeSpent: number;  // in seconds
  xpEarned: number;
  pronunciationScore?: number;  // 0-100 for speaking exercises
}

export interface LessonResult {
  lessonId: string;
  completedAt: string;
  totalExercises: number;
  correctAnswers: number;
  totalXP: number;
  averageTime: number;
  exerciseResults: ExerciseResult[];
  passed: boolean;  // >= 70% correct
}

// Check if lesson is passed (70% threshold)
export function isLessonPassed(result: LessonResult): boolean {
  return (result.correctAnswers / result.totalExercises) >= 0.7;
}

// Get performance rating
export function getPerformanceRating(result: LessonResult): 'perfect' | 'great' | 'good' | 'retry' {
  const ratio = result.correctAnswers / result.totalExercises;
  if (ratio === 1) return 'perfect';
  if (ratio >= 0.9) return 'great';
  if (ratio >= 0.7) return 'good';
  return 'retry';
}
