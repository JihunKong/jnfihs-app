// Spaced Repetition System for Language Quest
// Implements SM-2 based algorithm for vocabulary review scheduling

// ============================================
// Types and Interfaces
// ============================================

export interface VocabularyMastery {
  wordId: string;
  level: 0 | 1 | 2 | 3 | 4 | 5;  // 0=new, 5=mastered
  correctCount: number;
  incorrectCount: number;
  lastReviewed: string;         // ISO date
  nextReview: string;           // ISO date
  easeFactor: number;           // SM-2 ease factor (1.3 - 2.5)
  interval: number;             // Days until next review
  streak: number;               // Current correct streak
}

export interface ReviewSession {
  wordId: string;
  reviewedAt: string;
  wasCorrect: boolean;
  responseTime: number;  // milliseconds
  previousLevel: number;
  newLevel: number;
}

export interface ReviewQueue {
  dueToday: string[];        // Word IDs due for review today
  upcoming: string[];        // Word IDs due in next 7 days
  newWords: string[];        // Words never reviewed
  masteredWords: string[];   // Words at level 5
}

// ============================================
// Storage Keys
// ============================================

const STORAGE_KEY = 'quest_vocabulary_mastery';
const REVIEW_HISTORY_KEY = 'quest_review_history';

// ============================================
// Helper Functions
// ============================================

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (!isBrowser()) return defaultValue;

  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
}

// ============================================
// SM-2 Algorithm Constants
// ============================================

// Review intervals in days for each level
const LEVEL_INTERVALS: Record<number, number> = {
  0: 0,    // New word - review immediately
  1: 1,    // Level 1 - review next day
  2: 3,    // Level 2 - review in 3 days
  3: 7,    // Level 3 - review in 1 week
  4: 14,   // Level 4 - review in 2 weeks
  5: 30    // Level 5 (mastered) - review in 1 month
};

// Minimum ease factor to prevent intervals from growing too slowly
const MIN_EASE_FACTOR = 1.3;

// Default ease factor for new words
const DEFAULT_EASE_FACTOR = 2.5;

// ============================================
// Mastery Functions
// ============================================

export function getAllMastery(): Record<string, VocabularyMastery> {
  return getFromStorage(STORAGE_KEY, {});
}

export function saveMastery(mastery: Record<string, VocabularyMastery>): void {
  saveToStorage(STORAGE_KEY, mastery);
}

export function getWordMastery(wordId: string): VocabularyMastery | null {
  const all = getAllMastery();
  return all[wordId] || null;
}

export function initializeWordMastery(wordId: string): VocabularyMastery {
  const today = new Date().toISOString().split('T')[0];

  return {
    wordId,
    level: 0,
    correctCount: 0,
    incorrectCount: 0,
    lastReviewed: today,
    nextReview: today,  // Review immediately for new words
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    streak: 0
  };
}

// Update word mastery after a review
export function updateWordMastery(
  wordId: string,
  wasCorrect: boolean,
  responseTime: number = 0
): VocabularyMastery {
  const all = getAllMastery();
  let mastery = all[wordId];

  // Initialize if new word
  if (!mastery) {
    mastery = initializeWordMastery(wordId);
  }

  const previousLevel = mastery.level;
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (wasCorrect) {
    mastery.correctCount++;
    mastery.streak++;

    // Level up logic
    if (mastery.level < 5) {
      // Fast response bonus: if under 3 seconds, higher chance of level up
      const isFastResponse = responseTime > 0 && responseTime < 3000;

      // Level up conditions
      // - Must have at least level+1 correct answers at current level
      // - Or fast response with correct streak >= 2
      if (mastery.streak >= mastery.level + 1 || (isFastResponse && mastery.streak >= 2)) {
        mastery.level = Math.min(5, mastery.level + 1) as 0 | 1 | 2 | 3 | 4 | 5;
        mastery.streak = 0; // Reset streak on level up
      }
    }

    // Update ease factor (SM-2)
    // Increase ease factor for correct answers
    mastery.easeFactor = Math.min(2.5, mastery.easeFactor + 0.1);

    // Calculate next interval
    const baseInterval = LEVEL_INTERVALS[mastery.level];
    mastery.interval = Math.round(baseInterval * mastery.easeFactor);

  } else {
    mastery.incorrectCount++;
    mastery.streak = 0;

    // Level down on wrong answer (but not below 0)
    if (mastery.level > 0) {
      mastery.level = Math.max(0, mastery.level - 1) as 0 | 1 | 2 | 3 | 4 | 5;
    }

    // Decrease ease factor (SM-2)
    mastery.easeFactor = Math.max(MIN_EASE_FACTOR, mastery.easeFactor - 0.2);

    // Short interval for wrong answers
    mastery.interval = 1;
  }

  // Set next review date
  mastery.lastReviewed = todayStr;
  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + mastery.interval);
  mastery.nextReview = nextDate.toISOString().split('T')[0];

  // Save review history
  saveReviewHistory({
    wordId,
    reviewedAt: new Date().toISOString(),
    wasCorrect,
    responseTime,
    previousLevel,
    newLevel: mastery.level
  });

  // Save mastery
  all[wordId] = mastery;
  saveMastery(all);

  return mastery;
}

// Batch update for multiple words
export function updateMultipleWordMastery(
  updates: Array<{ wordId: string; wasCorrect: boolean; responseTime?: number }>
): VocabularyMastery[] {
  return updates.map(update =>
    updateWordMastery(update.wordId, update.wasCorrect, update.responseTime || 0)
  );
}

// ============================================
// Review Queue Functions
// ============================================

export function getReviewQueue(allWordIds: string[]): ReviewQueue {
  const all = getAllMastery();
  const today = new Date().toISOString().split('T')[0];
  const todayDate = new Date(today);
  const weekFromNow = new Date(todayDate);
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  const weekStr = weekFromNow.toISOString().split('T')[0];

  const dueToday: string[] = [];
  const upcoming: string[] = [];
  const newWords: string[] = [];
  const masteredWords: string[] = [];

  for (const wordId of allWordIds) {
    const mastery = all[wordId];

    if (!mastery) {
      // Word never reviewed
      newWords.push(wordId);
      continue;
    }

    if (mastery.level === 5) {
      masteredWords.push(wordId);
    }

    // Check if due for review
    if (mastery.nextReview <= today) {
      dueToday.push(wordId);
    } else if (mastery.nextReview <= weekStr) {
      upcoming.push(wordId);
    }
  }

  // Sort due words by priority (lower level = higher priority)
  dueToday.sort((a, b) => {
    const masteryA = all[a];
    const masteryB = all[b];
    if (!masteryA) return -1;
    if (!masteryB) return 1;
    return masteryA.level - masteryB.level;
  });

  return {
    dueToday,
    upcoming,
    newWords,
    masteredWords
  };
}

// Get words due for review today (limited count)
export function getDueWords(allWordIds: string[], maxCount: number = 20): string[] {
  const queue = getReviewQueue(allWordIds);

  // Prioritize: overdue > due today > new words
  const result: string[] = [];

  // Add due words first
  for (const wordId of queue.dueToday) {
    if (result.length >= maxCount) break;
    result.push(wordId);
  }

  // Add new words if space available
  for (const wordId of queue.newWords) {
    if (result.length >= maxCount) break;
    result.push(wordId);
  }

  return result;
}

// ============================================
// Review History Functions
// ============================================

export function getReviewHistory(): ReviewSession[] {
  return getFromStorage(REVIEW_HISTORY_KEY, []);
}

function saveReviewHistory(session: ReviewSession): void {
  const history = getReviewHistory();
  history.push(session);

  // Keep only last 1000 reviews
  if (history.length > 1000) {
    history.splice(0, history.length - 1000);
  }

  saveToStorage(REVIEW_HISTORY_KEY, history);
}

// Get review statistics
export function getReviewStats(): {
  totalReviews: number;
  correctReviews: number;
  accuracy: number;
  todayReviews: number;
  averageResponseTime: number;
} {
  const history = getReviewHistory();
  const today = new Date().toISOString().split('T')[0];

  if (history.length === 0) {
    return {
      totalReviews: 0,
      correctReviews: 0,
      accuracy: 0,
      todayReviews: 0,
      averageResponseTime: 0
    };
  }

  const correctReviews = history.filter(h => h.wasCorrect).length;
  const todayReviews = history.filter(h => h.reviewedAt.startsWith(today)).length;
  const totalTime = history.reduce((sum, h) => sum + h.responseTime, 0);

  return {
    totalReviews: history.length,
    correctReviews,
    accuracy: Math.round((correctReviews / history.length) * 100),
    todayReviews,
    averageResponseTime: Math.round(totalTime / history.length)
  };
}

// ============================================
// Mastery Statistics Functions
// ============================================

export function getMasteryStats(allWordIds: string[]): {
  total: number;
  new: number;
  learning: number;
  mastered: number;
  averageLevel: number;
  levelCounts: Record<number, number>;
} {
  const all = getAllMastery();

  let totalLevel = 0;
  let wordCount = 0;
  const levelCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const wordId of allWordIds) {
    const mastery = all[wordId];
    if (mastery) {
      totalLevel += mastery.level;
      wordCount++;
      levelCounts[mastery.level]++;
    } else {
      levelCounts[0]++;
    }
  }

  const newCount = allWordIds.filter(id => !all[id]).length;
  const learningCount = allWordIds.filter(id =>
    all[id] && all[id].level > 0 && all[id].level < 5
  ).length;
  const masteredCount = allWordIds.filter(id =>
    all[id] && all[id].level === 5
  ).length;

  return {
    total: allWordIds.length,
    new: newCount,
    learning: learningCount,
    mastered: masteredCount,
    averageLevel: wordCount > 0 ? Math.round((totalLevel / wordCount) * 10) / 10 : 0,
    levelCounts
  };
}

// Get mastery level display text
export function getMasteryLevelText(level: number): {
  ko: string;
  mn: string;
  ru: string;
  vi: string;
} {
  const texts: Record<number, { ko: string; mn: string; ru: string; vi: string }> = {
    0: { ko: '새 단어', mn: 'Шинэ үг', ru: 'Новое слово', vi: 'Từ mới' },
    1: { ko: '학습 중', mn: 'Суралцаж байна', ru: 'Изучается', vi: 'Đang học' },
    2: { ko: '익숙함', mn: 'Танил болсон', ru: 'Знакомое', vi: 'Quen thuộc' },
    3: { ko: '잘 알음', mn: 'Сайн мэддэг', ru: 'Хорошо знаю', vi: 'Biết rõ' },
    4: { ko: '거의 완벽', mn: 'Бараг төгс', ru: 'Почти идеально', vi: 'Gần hoàn hảo' },
    5: { ko: '마스터', mn: 'Мастер', ru: 'Мастер', vi: 'Thành thạo' }
  };

  return texts[level] || texts[0];
}

// Get mastery level color
export function getMasteryLevelColor(level: number): string {
  const colors: Record<number, string> = {
    0: '#9CA3AF', // gray
    1: '#3B82F6', // blue
    2: '#10B981', // green
    3: '#F59E0B', // amber
    4: '#8B5CF6', // purple
    5: '#EC4899'  // pink/gold
  };

  return colors[level] || colors[0];
}

// ============================================
// Reset Functions
// ============================================

export function resetAllMastery(): void {
  saveMastery({});
  saveToStorage(REVIEW_HISTORY_KEY, []);
}

export function resetWordMastery(wordId: string): void {
  const all = getAllMastery();
  delete all[wordId];
  saveMastery(all);
}
