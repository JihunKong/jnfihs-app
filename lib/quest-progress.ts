// Client-side Progress Storage for Language Quest
// Manages user progress, achievements, and statistics

import {
  Achievement,
  ACHIEVEMENTS,
  UserStats,
  checkNewAchievements
} from './achievement-system';

// ============================================
// Storage Keys
// ============================================

const STORAGE_KEYS = {
  PROGRESS: 'quest_progress',
  ACHIEVEMENTS: 'quest_achievements',
  STATS: 'quest_stats',
  VOCABULARY: 'quest_vocabulary',
  DAILY: 'quest_daily'
} as const;

// ============================================
// User Progress Interface
// ============================================

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  bestScore: number;
  bestXP: number;
  attempts: number;
  stars: number; // 0-3 stars
  lastPlayedAt: string;
}

export interface UserProgress {
  userId?: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayDate: string;
  lessonsCompleted: string[];
  lessonProgress: Record<string, LessonProgress>;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Achievement Storage Interface
// ============================================

export interface AchievementStorage {
  unlockedIds: string[];
  unlockedDates: Record<string, string>;
  totalXPFromAchievements: number;
  lastChecked: string;
}

// ============================================
// Statistics Storage Interface
// ============================================

export interface StatsStorage {
  totalXP: number;
  lessonsCompleted: number;
  exercisesCorrect: number;
  exercisesTotal: number;
  wordsLearned: number;
  grammarMastered: number;
  currentStreak: number;
  maxStreak: number;
  perfectLessons: number;
  totalTimeSeconds: number;
  averageTime: number;
  sessionsCount: number;
  lastUpdated: string;
}

// ============================================
// Daily Challenge Interface
// ============================================

export interface DailyChallenge {
  id: string;
  date: string;
  type: 'xp_goal' | 'lesson_count' | 'perfect_score' | 'exercises';
  target: number;
  current: number;
  completed: boolean;
  xpBonus: number;
}

export interface DailyStorage {
  date: string;
  challenges: DailyChallenge[];
  bonusCollected: boolean;
}

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
// Progress Functions
// ============================================

export function getDefaultProgress(): UserProgress {
  return {
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    maxStreak: 0,
    lastPlayDate: '',
    lessonsCompleted: [],
    lessonProgress: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function getProgress(): UserProgress {
  return getFromStorage(STORAGE_KEYS.PROGRESS, getDefaultProgress());
}

export function saveProgress(progress: UserProgress): void {
  progress.updatedAt = new Date().toISOString();
  saveToStorage(STORAGE_KEYS.PROGRESS, progress);
}

export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split('T')[0];
  const lastPlay = progress.lastPlayDate;

  if (!lastPlay) {
    // First time playing
    progress.currentStreak = 1;
    progress.maxStreak = 1;
  } else {
    const lastDate = new Date(lastPlay);
    const todayDate = new Date(today);
    const diffDays = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      // Same day, no change
    } else if (diffDays === 1) {
      // Consecutive day
      progress.currentStreak++;
      progress.maxStreak = Math.max(progress.maxStreak, progress.currentStreak);
    } else {
      // Streak broken
      progress.currentStreak = 1;
    }
  }

  progress.lastPlayDate = today;
  return progress;
}

export function calculateLevel(totalXP: number): number {
  // XP thresholds for each level
  const levelThresholds = [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    500,    // Level 4
    850,    // Level 5
    1300,   // Level 6
    1850,   // Level 7
    2500,   // Level 8
    3300,   // Level 9
    4200,   // Level 10
    5500,   // Level 11
    7000,   // Level 12
    9000,   // Level 13
    11500,  // Level 14
    15000   // Level 15
  ];

  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (totalXP >= levelThresholds[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  const levelThresholds = [0, 100, 250, 500, 850, 1300, 1850, 2500, 3300, 4200, 5500, 7000, 9000, 11500, 15000];
  if (currentLevel >= levelThresholds.length) return 0;
  return levelThresholds[currentLevel];
}

// ============================================
// Lesson Progress Functions
// ============================================

export function getLessonProgress(lessonId: string): LessonProgress | null {
  const progress = getProgress();
  return progress.lessonProgress[lessonId] || null;
}

export function updateLessonProgress(
  lessonId: string,
  score: number,
  xpEarned: number,
  totalExercises: number,
  correctAnswers: number
): { progress: UserProgress; newAchievements: Achievement[] } {
  let progress = getProgress();

  // Update streak
  progress = updateStreak(progress);

  // Calculate stars (0-3)
  const accuracy = correctAnswers / totalExercises;
  let stars = 0;
  if (accuracy >= 0.5) stars = 1;
  if (accuracy >= 0.7) stars = 2;
  if (accuracy >= 0.9) stars = 3;

  // Get or create lesson progress
  const lessonProgress = progress.lessonProgress[lessonId] || {
    lessonId,
    completed: false,
    bestScore: 0,
    bestXP: 0,
    attempts: 0,
    stars: 0,
    lastPlayedAt: ''
  };

  // Update lesson progress
  lessonProgress.attempts++;
  lessonProgress.lastPlayedAt = new Date().toISOString();

  if (score > lessonProgress.bestScore) {
    lessonProgress.bestScore = score;
    lessonProgress.bestXP = xpEarned;
  }
  if (stars > lessonProgress.stars) {
    lessonProgress.stars = stars;
  }

  // Mark as completed if passed (70%)
  if (accuracy >= 0.7 && !lessonProgress.completed) {
    lessonProgress.completed = true;
    if (!progress.lessonsCompleted.includes(lessonId)) {
      progress.lessonsCompleted.push(lessonId);
    }
  }

  progress.lessonProgress[lessonId] = lessonProgress;

  // Update total XP (only add new XP if it's better than previous)
  const previousXP = getLessonProgress(lessonId)?.bestXP || 0;
  if (xpEarned > previousXP) {
    progress.totalXP += (xpEarned - previousXP);
  }

  // Update level
  progress.level = calculateLevel(progress.totalXP);

  // Save progress
  saveProgress(progress);

  // Update stats
  const stats = getStats();
  stats.exercisesCorrect += correctAnswers;
  stats.exercisesTotal += totalExercises;
  if (correctAnswers === totalExercises) {
    stats.perfectLessons++;
  }
  stats.lessonsCompleted = progress.lessonsCompleted.length;
  stats.totalXP = progress.totalXP;
  stats.currentStreak = progress.currentStreak;
  stats.maxStreak = progress.maxStreak;
  saveStats(stats);

  // Check for new achievements
  const achievements = getAchievements();
  const newAchievements = checkNewAchievements(stats, achievements.unlockedIds);

  // Unlock new achievements
  for (const achievement of newAchievements) {
    unlockAchievement(achievement.id);
    progress.totalXP += achievement.xpReward;
  }

  if (newAchievements.length > 0) {
    saveProgress(progress);
  }

  return { progress, newAchievements };
}

// ============================================
// Achievement Functions
// ============================================

export function getDefaultAchievements(): AchievementStorage {
  return {
    unlockedIds: [],
    unlockedDates: {},
    totalXPFromAchievements: 0,
    lastChecked: new Date().toISOString()
  };
}

export function getAchievements(): AchievementStorage {
  return getFromStorage(STORAGE_KEYS.ACHIEVEMENTS, getDefaultAchievements());
}

export function saveAchievements(achievements: AchievementStorage): void {
  saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements);
}

export function unlockAchievement(achievementId: string): boolean {
  const achievements = getAchievements();

  if (achievements.unlockedIds.includes(achievementId)) {
    return false; // Already unlocked
  }

  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return false;

  achievements.unlockedIds.push(achievementId);
  achievements.unlockedDates[achievementId] = new Date().toISOString();
  achievements.totalXPFromAchievements += achievement.xpReward;
  achievements.lastChecked = new Date().toISOString();

  saveAchievements(achievements);
  return true;
}

export function isAchievementUnlockedById(achievementId: string): boolean {
  const achievements = getAchievements();
  return achievements.unlockedIds.includes(achievementId);
}

export function getUnlockedAchievements(): Achievement[] {
  const achievements = getAchievements();
  return ACHIEVEMENTS.filter(a => achievements.unlockedIds.includes(a.id));
}

export function getLockedAchievements(): Achievement[] {
  const achievements = getAchievements();
  return ACHIEVEMENTS.filter(a => !achievements.unlockedIds.includes(a.id));
}

// ============================================
// Statistics Functions
// ============================================

export function getDefaultStats(): StatsStorage {
  return {
    totalXP: 0,
    lessonsCompleted: 0,
    exercisesCorrect: 0,
    exercisesTotal: 0,
    wordsLearned: 0,
    grammarMastered: 0,
    currentStreak: 0,
    maxStreak: 0,
    perfectLessons: 0,
    totalTimeSeconds: 0,
    averageTime: 0,
    sessionsCount: 0,
    lastUpdated: new Date().toISOString()
  };
}

export function getStats(): StatsStorage {
  return getFromStorage(STORAGE_KEYS.STATS, getDefaultStats());
}

export function saveStats(stats: StatsStorage): void {
  stats.lastUpdated = new Date().toISOString();
  saveToStorage(STORAGE_KEYS.STATS, stats);
}

export function getUserStats(): UserStats {
  const stats = getStats();
  return {
    totalXP: stats.totalXP,
    lessonsCompleted: stats.lessonsCompleted,
    exercisesCorrect: stats.exercisesCorrect,
    wordsLearned: stats.wordsLearned,
    grammarMastered: stats.grammarMastered,
    currentStreak: stats.currentStreak,
    maxStreak: stats.maxStreak,
    perfectLessons: stats.perfectLessons,
    averageTime: stats.averageTime
  };
}

export function addWordsLearned(count: number): void {
  const stats = getStats();
  stats.wordsLearned += count;
  saveStats(stats);
}

export function addGrammarMastered(count: number): void {
  const stats = getStats();
  stats.grammarMastered += count;
  saveStats(stats);
}

export function addSessionTime(seconds: number): void {
  const stats = getStats();
  stats.totalTimeSeconds += seconds;
  stats.sessionsCount++;
  stats.averageTime = stats.totalTimeSeconds / stats.sessionsCount;
  saveStats(stats);
}

// ============================================
// Daily Challenge Functions
// ============================================

export function getDailyChallenges(): DailyStorage {
  const today = new Date().toISOString().split('T')[0];
  const stored = getFromStorage<DailyStorage | null>(STORAGE_KEYS.DAILY, null);

  // If no stored data or different day, generate new challenges
  if (!stored || stored.date !== today) {
    return generateDailyChallenges();
  }

  return stored;
}

export function generateDailyChallenges(): DailyStorage {
  const today = new Date().toISOString().split('T')[0];

  const challenges: DailyChallenge[] = [
    {
      id: `daily-xp-${today}`,
      date: today,
      type: 'xp_goal',
      target: 50,
      current: 0,
      completed: false,
      xpBonus: 25
    },
    {
      id: `daily-lessons-${today}`,
      date: today,
      type: 'lesson_count',
      target: 2,
      current: 0,
      completed: false,
      xpBonus: 30
    },
    {
      id: `daily-exercises-${today}`,
      date: today,
      type: 'exercises',
      target: 15,
      current: 0,
      completed: false,
      xpBonus: 20
    }
  ];

  const daily: DailyStorage = {
    date: today,
    challenges,
    bonusCollected: false
  };

  saveToStorage(STORAGE_KEYS.DAILY, daily);
  return daily;
}

export function updateDailyChallenge(
  xpEarned: number,
  lessonCompleted: boolean,
  exercisesCompleted: number
): { daily: DailyStorage; bonusXP: number } {
  let daily = getDailyChallenges();
  let bonusXP = 0;

  for (const challenge of daily.challenges) {
    if (challenge.completed) continue;

    switch (challenge.type) {
      case 'xp_goal':
        challenge.current += xpEarned;
        break;
      case 'lesson_count':
        if (lessonCompleted) challenge.current++;
        break;
      case 'exercises':
        challenge.current += exercisesCompleted;
        break;
    }

    if (challenge.current >= challenge.target && !challenge.completed) {
      challenge.completed = true;
      bonusXP += challenge.xpBonus;
    }
  }

  saveToStorage(STORAGE_KEYS.DAILY, daily);
  return { daily, bonusXP };
}

export function collectDailyBonus(): number {
  const daily = getDailyChallenges();

  if (daily.bonusCollected) return 0;

  const allCompleted = daily.challenges.every(c => c.completed);
  if (!allCompleted) return 0;

  daily.bonusCollected = true;
  saveToStorage(STORAGE_KEYS.DAILY, daily);

  // Bonus for completing all daily challenges
  return 50;
}

// ============================================
// Reset Functions
// ============================================

export function resetProgress(): void {
  saveProgress(getDefaultProgress());
  saveAchievements(getDefaultAchievements());
  saveStats(getDefaultStats());
  if (isBrowser()) {
    localStorage.removeItem(STORAGE_KEYS.DAILY);
    localStorage.removeItem(STORAGE_KEYS.VOCABULARY);
  }
}

// ============================================
// Export all storage for debugging
// ============================================

export function exportAllData(): {
  progress: UserProgress;
  achievements: AchievementStorage;
  stats: StatsStorage;
  daily: DailyStorage;
} {
  return {
    progress: getProgress(),
    achievements: getAchievements(),
    stats: getStats(),
    daily: getDailyChallenges()
  };
}
