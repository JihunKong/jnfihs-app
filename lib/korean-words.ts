// Korean Learning Content Data

export interface Word {
  id: string;
  korean: string;
  romanization: string;
  translations: {
    mn: string;
    ru: string;
    vi: string;
  };
  level: number;
  category: string;
  imagePrompt: string;
}

export interface Sentence {
  id: string;
  korean: string;
  romanization: string;
  translations: {
    mn: string;
    ru: string;
    vi: string;
  };
  level: number;
  words: string[]; // Word blocks for sentence building
  imagePrompt: string;
}

export interface FillBlank {
  id: string;
  sentence: string; // With ___ placeholder
  answer: string;
  options: string[];
  translations: {
    mn: string;
    ru: string;
    vi: string;
  };
  level: number;
}

// Level 1: Basic words (Numbers, Greetings)
export const level1Words: Word[] = [
  {
    id: 'w1-1',
    korean: '사과',
    romanization: 'sagwa',
    translations: { mn: 'Алим', ru: 'Яблоко', vi: 'Táo' },
    level: 1,
    category: 'fruit',
    imagePrompt: 'a red apple, simple cartoon illustration, white background',
  },
  {
    id: 'w1-2',
    korean: '바나나',
    romanization: 'banana',
    translations: { mn: 'Гадил', ru: 'Банан', vi: 'Chuối' },
    level: 1,
    category: 'fruit',
    imagePrompt: 'a yellow banana, simple cartoon illustration, white background',
  },
  {
    id: 'w1-3',
    korean: '고양이',
    romanization: 'goyangi',
    translations: { mn: 'Муур', ru: 'Кошка', vi: 'Con mèo' },
    level: 1,
    category: 'animal',
    imagePrompt: 'a cute orange cat sitting, simple cartoon illustration, white background',
  },
  {
    id: 'w1-4',
    korean: '강아지',
    romanization: 'gangaji',
    translations: { mn: 'Гөлөг', ru: 'Щенок', vi: 'Con chó con' },
    level: 1,
    category: 'animal',
    imagePrompt: 'a cute brown puppy, simple cartoon illustration, white background',
  },
  {
    id: 'w1-5',
    korean: '물',
    romanization: 'mul',
    translations: { mn: 'Ус', ru: 'Вода', vi: 'Nước' },
    level: 1,
    category: 'drink',
    imagePrompt: 'a glass of water, simple cartoon illustration, white background',
  },
  {
    id: 'w1-6',
    korean: '밥',
    romanization: 'bap',
    translations: { mn: 'Будаа', ru: 'Рис', vi: 'Cơm' },
    level: 1,
    category: 'food',
    imagePrompt: 'a bowl of white rice, simple cartoon illustration, white background',
  },
  {
    id: 'w1-7',
    korean: '책',
    romanization: 'chaek',
    translations: { mn: 'Ном', ru: 'Книга', vi: 'Sách' },
    level: 1,
    category: 'object',
    imagePrompt: 'an open book, simple cartoon illustration, white background',
  },
  {
    id: 'w1-8',
    korean: '연필',
    romanization: 'yeonpil',
    translations: { mn: 'Харандаа', ru: 'Карандаш', vi: 'Bút chì' },
    level: 1,
    category: 'object',
    imagePrompt: 'a yellow pencil, simple cartoon illustration, white background',
  },
];

// Level 2: Daily words (Food, Places)
export const level2Words: Word[] = [
  {
    id: 'w2-1',
    korean: '학교',
    romanization: 'hakgyo',
    translations: { mn: 'Сургууль', ru: 'Школа', vi: 'Trường học' },
    level: 2,
    category: 'place',
    imagePrompt: 'a school building with students, simple cartoon illustration, white background',
  },
  {
    id: 'w2-2',
    korean: '교실',
    romanization: 'gyosil',
    translations: { mn: 'Анги', ru: 'Класс', vi: 'Lớp học' },
    level: 2,
    category: 'place',
    imagePrompt: 'a classroom with desks and chairs, simple cartoon illustration, white background',
  },
  {
    id: 'w2-3',
    korean: '선생님',
    romanization: 'seonsaengnim',
    translations: { mn: 'Багш', ru: 'Учитель', vi: 'Giáo viên' },
    level: 2,
    category: 'person',
    imagePrompt: 'a friendly teacher at a blackboard, simple cartoon illustration, white background',
  },
  {
    id: 'w2-4',
    korean: '친구',
    romanization: 'chingu',
    translations: { mn: 'Найз', ru: 'Друг', vi: 'Bạn bè' },
    level: 2,
    category: 'person',
    imagePrompt: 'two friends smiling together, simple cartoon illustration, white background',
  },
  {
    id: 'w2-5',
    korean: '식당',
    romanization: 'sikdang',
    translations: { mn: 'Зоогийн газар', ru: 'Столовая', vi: 'Nhà ăn' },
    level: 2,
    category: 'place',
    imagePrompt: 'a cafeteria with tables, simple cartoon illustration, white background',
  },
  {
    id: 'w2-6',
    korean: '도서관',
    romanization: 'doseogwan',
    translations: { mn: 'Номын сан', ru: 'Библиотека', vi: 'Thư viện' },
    level: 2,
    category: 'place',
    imagePrompt: 'a library with bookshelves, simple cartoon illustration, white background',
  },
  {
    id: 'w2-7',
    korean: '김치',
    romanization: 'gimchi',
    translations: { mn: 'Кимчи', ru: 'Кимчи', vi: 'Kim chi' },
    level: 2,
    category: 'food',
    imagePrompt: 'korean kimchi in a bowl, simple cartoon illustration, white background',
  },
  {
    id: 'w2-8',
    korean: '라면',
    romanization: 'ramyeon',
    translations: { mn: 'Рамён', ru: 'Рамен', vi: 'Mì ramen' },
    level: 2,
    category: 'food',
    imagePrompt: 'a bowl of korean ramen noodles, simple cartoon illustration, white background',
  },
];

// Level 3: Simple sentences
export const level3Sentences: Sentence[] = [
  {
    id: 's3-1',
    korean: '나는 학교에 갑니다',
    romanization: 'naneun hakgyoe gamnida',
    translations: {
      mn: 'Би сургууль руу явж байна',
      ru: 'Я иду в школу',
      vi: 'Tôi đi đến trường',
    },
    level: 3,
    words: ['나는', '학교에', '갑니다'],
    imagePrompt: 'a student walking to school, simple cartoon illustration',
  },
  {
    id: 's3-2',
    korean: '밥을 먹습니다',
    romanization: 'babeul meokseumnida',
    translations: {
      mn: 'Би хоол идэж байна',
      ru: 'Я ем',
      vi: 'Tôi ăn cơm',
    },
    level: 3,
    words: ['밥을', '먹습니다'],
    imagePrompt: 'a person eating rice with chopsticks, simple cartoon illustration',
  },
  {
    id: 's3-3',
    korean: '책을 읽습니다',
    romanization: 'chaekeul ilkseumnida',
    translations: {
      mn: 'Би ном уншиж байна',
      ru: 'Я читаю книгу',
      vi: 'Tôi đọc sách',
    },
    level: 3,
    words: ['책을', '읽습니다'],
    imagePrompt: 'a student reading a book, simple cartoon illustration',
  },
  {
    id: 's3-4',
    korean: '친구와 놀아요',
    romanization: 'chinguwa norayo',
    translations: {
      mn: 'Би найзтайгаа тоглож байна',
      ru: 'Я играю с другом',
      vi: 'Tôi chơi với bạn',
    },
    level: 3,
    words: ['친구와', '놀아요'],
    imagePrompt: 'two friends playing together, simple cartoon illustration',
  },
];

// Level 4: School life expressions
export const level4Sentences: Sentence[] = [
  {
    id: 's4-1',
    korean: '숙제를 했습니다',
    romanization: 'sukjereul haetseumnida',
    translations: {
      mn: 'Би гэрийн даалгавар хийсэн',
      ru: 'Я сделал домашнее задание',
      vi: 'Tôi đã làm bài tập về nhà',
    },
    level: 4,
    words: ['숙제를', '했습니다'],
    imagePrompt: 'a student doing homework at desk, simple cartoon illustration',
  },
  {
    id: 's4-2',
    korean: '수업이 끝났습니다',
    romanization: 'sueobi kkeunnatseumnida',
    translations: {
      mn: 'Хичээл дууссан',
      ru: 'Урок закончился',
      vi: 'Buổi học đã kết thúc',
    },
    level: 4,
    words: ['수업이', '끝났습니다'],
    imagePrompt: 'students leaving classroom after class, simple cartoon illustration',
  },
  {
    id: 's4-3',
    korean: '질문이 있습니다',
    romanization: 'jilmuni itseumnida',
    translations: {
      mn: 'Надад асуулт байна',
      ru: 'У меня есть вопрос',
      vi: 'Tôi có câu hỏi',
    },
    level: 4,
    words: ['질문이', '있습니다'],
    imagePrompt: 'a student raising hand in class, simple cartoon illustration',
  },
];

// Fill in the blank exercises
export const fillBlankExercises: FillBlank[] = [
  {
    id: 'fb-1',
    sentence: '나는 ___에 갑니다',
    answer: '학교',
    options: ['학교', '사과', '고양이', '물'],
    translations: {
      mn: 'Би ___ руу явж байна',
      ru: 'Я иду в ___',
      vi: 'Tôi đi đến ___',
    },
    level: 2,
  },
  {
    id: 'fb-2',
    sentence: '___을 먹습니다',
    answer: '밥',
    options: ['밥', '책', '연필', '학교'],
    translations: {
      mn: 'Би ___ идэж байна',
      ru: 'Я ем ___',
      vi: 'Tôi ăn ___',
    },
    level: 2,
  },
  {
    id: 'fb-3',
    sentence: '___을 읽습니다',
    answer: '책',
    options: ['책', '밥', '물', '고양이'],
    translations: {
      mn: 'Би ___ уншиж байна',
      ru: 'Я читаю ___',
      vi: 'Tôi đọc ___',
    },
    level: 2,
  },
  {
    id: 'fb-4',
    sentence: '___님, 안녕하세요',
    answer: '선생',
    options: ['선생', '강아지', '사과', '물'],
    translations: {
      mn: '___, сайн байна уу',
      ru: 'Здравствуйте, ___',
      vi: 'Xin chào, ___',
    },
    level: 3,
  },
];

// Get all words for a specific level
export function getWordsForLevel(level: number): Word[] {
  const allWords = [...level1Words, ...level2Words];
  return allWords.filter((w) => w.level <= level);
}

// Get sentences for a specific level
export function getSentencesForLevel(level: number): Sentence[] {
  const allSentences = [...level3Sentences, ...level4Sentences];
  return allSentences.filter((s) => s.level <= level);
}

// Get fill-blank exercises for a specific level
export function getFillBlanksForLevel(level: number): FillBlank[] {
  return fillBlankExercises.filter((fb) => fb.level <= level);
}

// Generate random wrong options for word quiz
export function getRandomOptions(
  correctWord: Word,
  allWords: Word[],
  count: number = 3
): string[] {
  const options = allWords
    .filter((w) => w.id !== correctWord.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((w) => w.korean);

  return [...options, correctWord.korean].sort(() => Math.random() - 0.5);
}

// Level thresholds
export const levelThresholds = [
  { level: 1, xpRequired: 0, name: { ko: '입문', mn: 'Анхан', ru: 'Начальный', vi: 'Nhập môn' } },
  { level: 2, xpRequired: 100, name: { ko: '초급', mn: 'Бага', ru: 'Базовый', vi: 'Sơ cấp' } },
  { level: 3, xpRequired: 300, name: { ko: '중급', mn: 'Дунд', ru: 'Средний', vi: 'Trung cấp' } },
  { level: 4, xpRequired: 600, name: { ko: '고급', mn: 'Ахисан', ru: 'Продвинутый', vi: 'Cao cấp' } },
  { level: 5, xpRequired: 1000, name: { ko: '마스터', mn: 'Мастер', ru: 'Мастер', vi: 'Bậc thầy' } },
];

// Calculate level from XP
export function calculateLevel(xp: number): number {
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (xp >= levelThresholds[i].xpRequired) {
      return levelThresholds[i].level;
    }
  }
  return 1;
}

// Get XP needed for next level
export function getXpToNextLevel(currentXp: number): { current: number; needed: number } {
  const currentLevel = calculateLevel(currentXp);
  const nextThreshold = levelThresholds.find((t) => t.level === currentLevel + 1);

  if (!nextThreshold) {
    return { current: currentXp, needed: currentXp }; // Max level
  }

  const prevThreshold = levelThresholds.find((t) => t.level === currentLevel);
  const xpInLevel = currentXp - (prevThreshold?.xpRequired || 0);
  const xpNeeded = nextThreshold.xpRequired - (prevThreshold?.xpRequired || 0);

  return { current: xpInLevel, needed: xpNeeded };
}
