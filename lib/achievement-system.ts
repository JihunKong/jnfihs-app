// Achievement System for Language Quest
// Manages badges, rewards, and milestone tracking

import { LocalizedText } from './korean-curriculum';

// Achievement condition types
export type AchievementConditionType =
  | 'lesson_complete'     // Complete X lessons
  | 'perfect_score'       // Get perfect score X times
  | 'streak_days'         // X day streak
  | 'total_xp'           // Earn X total XP
  | 'words_learned'      // Learn X vocabulary words
  | 'grammar_mastered'   // Master X grammar points
  | 'exercises_correct'  // Answer X exercises correctly
  | 'time_played'        // Total play time
  | 'first_lesson'       // Complete first lesson
  | 'unit_complete'      // Complete a unit
  | 'all_lessons'        // Complete all lessons
  | 'speed_demon'        // Complete lesson under X seconds average
  | 'no_mistakes';       // Complete lesson with no mistakes

export interface AchievementCondition {
  type: AchievementConditionType;
  target: number;
}

export interface Achievement {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  category: 'milestone' | 'streak' | 'xp' | 'skill' | 'special';
  condition: AchievementCondition;
  xpReward: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: string;
  progress?: number;
}

export interface UserAchievements {
  unlocked: string[];           // Achievement IDs
  unlockedDates: Record<string, string>;  // ID -> ISO date
}

// ============================================
// Achievement Definitions (20 achievements)
// ============================================

export const ACHIEVEMENTS: Achievement[] = [
  // === MILESTONE ACHIEVEMENTS ===
  {
    id: 'first-steps',
    name: {
      ko: '첫 걸음',
      mn: 'Эхний алхам',
      ru: 'Первые шаги',
      vi: 'Bước đầu tiên'
    },
    description: {
      ko: '첫 번째 레슨을 완료했습니다',
      mn: 'Анхны хичээлийг дуусгасан',
      ru: 'Завершен первый урок',
      vi: 'Hoàn thành bài học đầu tiên'
    },
    icon: '👣',
    category: 'milestone',
    condition: { type: 'first_lesson', target: 1 },
    xpReward: 50,
    tier: 'bronze'
  },
  {
    id: 'getting-started',
    name: {
      ko: '시작이 반이다',
      mn: 'Эхлэл бол хагас',
      ru: 'Начало положено',
      vi: 'Khởi đầu tốt đẹp'
    },
    description: {
      ko: '5개 레슨 완료',
      mn: '5 хичээл дуусгасан',
      ru: 'Пройдено 5 уроков',
      vi: 'Hoàn thành 5 bài học'
    },
    icon: '🌱',
    category: 'milestone',
    condition: { type: 'lesson_complete', target: 5 },
    xpReward: 100,
    tier: 'bronze'
  },
  {
    id: 'dedicated-learner',
    name: {
      ko: '열심히 하는 학생',
      mn: 'Хичээнгүй сурагч',
      ru: 'Усердный ученик',
      vi: 'Học viên chăm chỉ'
    },
    description: {
      ko: '10개 레슨 완료',
      mn: '10 хичээл дуусгасан',
      ru: 'Пройдено 10 уроков',
      vi: 'Hoàn thành 10 bài học'
    },
    icon: '📚',
    category: 'milestone',
    condition: { type: 'lesson_complete', target: 10 },
    xpReward: 200,
    tier: 'silver'
  },
  {
    id: 'korean-master',
    name: {
      ko: '한국어 마스터',
      mn: 'Солонгос хэлний мастер',
      ru: 'Мастер корейского',
      vi: 'Bậc thầy tiếng Hàn'
    },
    description: {
      ko: '모든 레슨 완료',
      mn: 'Бүх хичээлийг дуусгасан',
      ru: 'Все уроки завершены',
      vi: 'Hoàn thành tất cả bài học'
    },
    icon: '👑',
    category: 'milestone',
    condition: { type: 'all_lessons', target: 19 },
    xpReward: 1000,
    tier: 'platinum'
  },

  // === STREAK ACHIEVEMENTS ===
  {
    id: 'three-day-streak',
    name: {
      ko: '3일 연속',
      mn: '3 өдрийн цуврал',
      ru: '3 дня подряд',
      vi: '3 ngày liên tiếp'
    },
    description: {
      ko: '3일 연속 학습',
      mn: '3 өдөр дараалан суралцсан',
      ru: '3 дня подряд учитесь',
      vi: 'Học 3 ngày liên tiếp'
    },
    icon: '🔥',
    category: 'streak',
    condition: { type: 'streak_days', target: 3 },
    xpReward: 75,
    tier: 'bronze'
  },
  {
    id: 'week-warrior',
    name: {
      ko: '일주일 전사',
      mn: '7 хоногийн дайчин',
      ru: 'Воин недели',
      vi: 'Chiến binh tuần'
    },
    description: {
      ko: '7일 연속 학습',
      mn: '7 өдөр дараалан суралцсан',
      ru: '7 дней подряд учитесь',
      vi: 'Học 7 ngày liên tiếp'
    },
    icon: '⚔️',
    category: 'streak',
    condition: { type: 'streak_days', target: 7 },
    xpReward: 150,
    tier: 'silver'
  },
  {
    id: 'monthly-master',
    name: {
      ko: '한 달 마스터',
      mn: 'Сарын мастер',
      ru: 'Месячный мастер',
      vi: 'Bậc thầy tháng'
    },
    description: {
      ko: '30일 연속 학습',
      mn: '30 өдөр дараалан суралцсан',
      ru: '30 дней подряд учитесь',
      vi: 'Học 30 ngày liên tiếp'
    },
    icon: '🏆',
    category: 'streak',
    condition: { type: 'streak_days', target: 30 },
    xpReward: 500,
    tier: 'gold'
  },

  // === XP ACHIEVEMENTS ===
  {
    id: 'xp-starter',
    name: {
      ko: 'XP 초보자',
      mn: 'XP эхлэгч',
      ru: 'XP Новичок',
      vi: 'XP Người mới'
    },
    description: {
      ko: '총 100 XP 획득',
      mn: 'Нийт 100 XP цуглуулсан',
      ru: 'Заработано 100 XP',
      vi: 'Đạt được 100 XP'
    },
    icon: '⚡',
    category: 'xp',
    condition: { type: 'total_xp', target: 100 },
    xpReward: 25,
    tier: 'bronze'
  },
  {
    id: 'xp-collector',
    name: {
      ko: 'XP 수집가',
      mn: 'XP цуглуулагч',
      ru: 'XP Коллекционер',
      vi: 'XP Nhà sưu tập'
    },
    description: {
      ko: '총 500 XP 획득',
      mn: 'Нийт 500 XP цуглуулсан',
      ru: 'Заработано 500 XP',
      vi: 'Đạt được 500 XP'
    },
    icon: '💎',
    category: 'xp',
    condition: { type: 'total_xp', target: 500 },
    xpReward: 50,
    tier: 'silver'
  },
  {
    id: 'xp-champion',
    name: {
      ko: 'XP 챔피언',
      mn: 'XP аварга',
      ru: 'XP Чемпион',
      vi: 'XP Vô địch'
    },
    description: {
      ko: '총 1000 XP 획득',
      mn: 'Нийт 1000 XP цуглуулсан',
      ru: 'Заработано 1000 XP',
      vi: 'Đạt được 1000 XP'
    },
    icon: '🌟',
    category: 'xp',
    condition: { type: 'total_xp', target: 1000 },
    xpReward: 100,
    tier: 'gold'
  },
  {
    id: 'xp-legend',
    name: {
      ko: 'XP 전설',
      mn: 'XP домог',
      ru: 'XP Легенда',
      vi: 'XP Huyền thoại'
    },
    description: {
      ko: '총 5000 XP 획득',
      mn: 'Нийт 5000 XP цуглуулсан',
      ru: 'Заработано 5000 XP',
      vi: 'Đạt được 5000 XP'
    },
    icon: '🏅',
    category: 'xp',
    condition: { type: 'total_xp', target: 5000 },
    xpReward: 250,
    tier: 'platinum'
  },

  // === SKILL ACHIEVEMENTS ===
  {
    id: 'vocab-starter',
    name: {
      ko: '단어 입문자',
      mn: 'Үг эхлэгч',
      ru: 'Начинающий словарь',
      vi: 'Từ vựng cơ bản'
    },
    description: {
      ko: '50개 단어 학습',
      mn: '50 үг сурсан',
      ru: 'Выучено 50 слов',
      vi: 'Học 50 từ vựng'
    },
    icon: '📖',
    category: 'skill',
    condition: { type: 'words_learned', target: 50 },
    xpReward: 100,
    tier: 'bronze'
  },
  {
    id: 'vocab-expert',
    name: {
      ko: '단어 전문가',
      mn: 'Үгийн мэргэжилтэн',
      ru: 'Эксперт слов',
      vi: 'Chuyên gia từ vựng'
    },
    description: {
      ko: '100개 단어 학습',
      mn: '100 үг сурсан',
      ru: 'Выучено 100 слов',
      vi: 'Học 100 từ vựng'
    },
    icon: '🎓',
    category: 'skill',
    condition: { type: 'words_learned', target: 100 },
    xpReward: 200,
    tier: 'silver'
  },
  {
    id: 'vocab-master',
    name: {
      ko: '단어 마스터',
      mn: 'Үгийн мастер',
      ru: 'Мастер слов',
      vi: 'Bậc thầy từ vựng'
    },
    description: {
      ko: '200개 단어 학습',
      mn: '200 үг сурсан',
      ru: 'Выучено 200 слов',
      vi: 'Học 200 từ vựng'
    },
    icon: '🧠',
    category: 'skill',
    condition: { type: 'words_learned', target: 200 },
    xpReward: 400,
    tier: 'gold'
  },
  {
    id: 'grammar-guru',
    name: {
      ko: '문법 전문가',
      mn: 'Дүрмийн гуру',
      ru: 'Гуру грамматики',
      vi: 'Chuyên gia ngữ pháp'
    },
    description: {
      ko: '모든 문법 포인트 완료',
      mn: 'Бүх дүрмийн цэгийг дуусгасан',
      ru: 'Все грамматические темы',
      vi: 'Hoàn thành tất cả ngữ pháp'
    },
    icon: '✍️',
    category: 'skill',
    condition: { type: 'grammar_mastered', target: 35 },
    xpReward: 300,
    tier: 'gold'
  },

  // === SPECIAL ACHIEVEMENTS ===
  {
    id: 'perfect-lesson',
    name: {
      ko: '완벽한 레슨',
      mn: 'Төгс хичээл',
      ru: 'Идеальный урок',
      vi: 'Bài học hoàn hảo'
    },
    description: {
      ko: '레슨을 틀림 없이 완료',
      mn: 'Хичээлийг алдаагүй дуусгасан',
      ru: 'Урок без ошибок',
      vi: 'Hoàn thành không sai'
    },
    icon: '💯',
    category: 'special',
    condition: { type: 'no_mistakes', target: 1 },
    xpReward: 100,
    tier: 'silver'
  },
  {
    id: 'perfectionist',
    name: {
      ko: '완벽주의자',
      mn: 'Төгс төгөлдөр',
      ru: 'Перфекционист',
      vi: 'Người cầu toàn'
    },
    description: {
      ko: '5개 레슨을 틀림 없이 완료',
      mn: '5 хичээлийг алдаагүй дуусгасан',
      ru: '5 уроков без ошибок',
      vi: '5 bài không sai'
    },
    icon: '🎯',
    category: 'special',
    condition: { type: 'no_mistakes', target: 5 },
    xpReward: 250,
    tier: 'gold'
  },
  {
    id: 'speed-learner',
    name: {
      ko: '빠른 학습자',
      mn: 'Хурдан сурагч',
      ru: 'Быстрый ученик',
      vi: 'Học nhanh'
    },
    description: {
      ko: '레슨을 평균 30초 이내로 완료',
      mn: 'Хичээлийг дунджаар 30 секундэд дуусгасан',
      ru: 'Урок менее 30 секунд в среднем',
      vi: 'Dưới 30 giây trung bình'
    },
    icon: '⚡',
    category: 'special',
    condition: { type: 'speed_demon', target: 30 },
    xpReward: 150,
    tier: 'silver'
  },
  {
    id: 'answer-machine',
    name: {
      ko: '정답 기계',
      mn: 'Хариултын машин',
      ru: 'Машина ответов',
      vi: 'Máy trả lời'
    },
    description: {
      ko: '총 100개 문제 정답',
      mn: 'Нийт 100 асуултад зөв хариулсан',
      ru: '100 правильных ответов',
      vi: '100 câu trả lời đúng'
    },
    icon: '🤖',
    category: 'special',
    condition: { type: 'exercises_correct', target: 100 },
    xpReward: 150,
    tier: 'silver'
  }
];

// ============================================
// Achievement Functions
// ============================================

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

export function getAchievementsByTier(tier: Achievement['tier']): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.tier === tier);
}

export function isAchievementUnlocked(
  achievement: Achievement,
  stats: UserStats
): boolean {
  const { condition } = achievement;

  switch (condition.type) {
    case 'first_lesson':
      return stats.lessonsCompleted >= 1;
    case 'lesson_complete':
      return stats.lessonsCompleted >= condition.target;
    case 'all_lessons':
      return stats.lessonsCompleted >= condition.target;
    case 'streak_days':
      return stats.maxStreak >= condition.target;
    case 'total_xp':
      return stats.totalXP >= condition.target;
    case 'words_learned':
      return stats.wordsLearned >= condition.target;
    case 'grammar_mastered':
      return stats.grammarMastered >= condition.target;
    case 'exercises_correct':
      return stats.exercisesCorrect >= condition.target;
    case 'no_mistakes':
      return stats.perfectLessons >= condition.target;
    case 'speed_demon':
      return stats.averageTime <= condition.target && stats.lessonsCompleted > 0;
    default:
      return false;
  }
}

export function getAchievementProgress(
  achievement: Achievement,
  stats: UserStats
): number {
  const { condition } = achievement;
  let current = 0;

  switch (condition.type) {
    case 'first_lesson':
    case 'lesson_complete':
    case 'all_lessons':
      current = stats.lessonsCompleted;
      break;
    case 'streak_days':
      current = stats.maxStreak;
      break;
    case 'total_xp':
      current = stats.totalXP;
      break;
    case 'words_learned':
      current = stats.wordsLearned;
      break;
    case 'grammar_mastered':
      current = stats.grammarMastered;
      break;
    case 'exercises_correct':
      current = stats.exercisesCorrect;
      break;
    case 'no_mistakes':
      current = stats.perfectLessons;
      break;
    case 'speed_demon':
      current = stats.averageTime > 0 ? Math.max(0, condition.target - stats.averageTime + condition.target) : 0;
      break;
  }

  return Math.min(100, Math.round((current / condition.target) * 100));
}

// Check for newly unlocked achievements
export function checkNewAchievements(
  stats: UserStats,
  unlockedIds: string[]
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlockedIds.includes(achievement.id)) {
      if (isAchievementUnlocked(achievement, stats)) {
        newlyUnlocked.push(achievement);
      }
    }
  }

  return newlyUnlocked;
}

// User stats interface for achievement checking
export interface UserStats {
  totalXP: number;
  lessonsCompleted: number;
  exercisesCorrect: number;
  wordsLearned: number;
  grammarMastered: number;
  currentStreak: number;
  maxStreak: number;
  perfectLessons: number;
  averageTime: number;
}

// Get tier color for UI
export function getTierColor(tier: Achievement['tier']): string {
  switch (tier) {
    case 'bronze': return '#CD7F32';
    case 'silver': return '#C0C0C0';
    case 'gold': return '#FFD700';
    case 'platinum': return '#E5E4E2';
    default: return '#888888';
  }
}

// Get tier gradient for UI
export function getTierGradient(tier: Achievement['tier']): string {
  switch (tier) {
    case 'bronze': return 'from-amber-600 to-amber-800';
    case 'silver': return 'from-gray-300 to-gray-500';
    case 'gold': return 'from-yellow-400 to-yellow-600';
    case 'platinum': return 'from-purple-300 to-purple-500';
    default: return 'from-gray-400 to-gray-600';
  }
}
