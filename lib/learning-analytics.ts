// Learning Analytics for Language Quest
// Tracks and analyzes learning patterns, progress, and provides insights

import { LocalizedText } from './korean-curriculum';

// ============================================
// Types and Interfaces
// ============================================

export interface DailyActivity {
  date: string;
  xpEarned: number;
  lessonsCompleted: number;
  exercisesCorrect: number;
  exercisesTotal: number;
  timeSpentSeconds: number;
  streak: number;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalXP: number;
  lessonsCompleted: number;
  averageAccuracy: number;
  totalTimeMinutes: number;
  mostActiveDay: string;
  streakDays: number;
}

export interface ExerciseTypeStats {
  type: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  averageTime: number;
}

export interface LearningInsight {
  type: 'strength' | 'weakness' | 'tip' | 'milestone' | 'recommendation';
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  priority: number;
}

export interface VocabularyAnalysis {
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  newWords: number;
  troubleWords: string[];
  strongWords: string[];
}

// ============================================
// Storage Key
// ============================================

const ACTIVITY_KEY = 'quest_daily_activity';

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

// Get date string in YYYY-MM-DD format
function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

// Get start of week (Monday)
function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ============================================
// Activity Tracking
// ============================================

export function getDailyActivities(): Record<string, DailyActivity> {
  return getFromStorage(ACTIVITY_KEY, {});
}

export function saveDailyActivities(activities: Record<string, DailyActivity>): void {
  saveToStorage(ACTIVITY_KEY, activities);
}

export function getTodayActivity(): DailyActivity {
  const today = getDateString();
  const activities = getDailyActivities();

  return activities[today] || {
    date: today,
    xpEarned: 0,
    lessonsCompleted: 0,
    exercisesCorrect: 0,
    exercisesTotal: 0,
    timeSpentSeconds: 0,
    streak: 0
  };
}

export function updateTodayActivity(update: Partial<DailyActivity>): DailyActivity {
  const today = getDateString();
  const activities = getDailyActivities();
  const current = getTodayActivity();

  const updated: DailyActivity = {
    ...current,
    xpEarned: current.xpEarned + (update.xpEarned || 0),
    lessonsCompleted: current.lessonsCompleted + (update.lessonsCompleted || 0),
    exercisesCorrect: current.exercisesCorrect + (update.exercisesCorrect || 0),
    exercisesTotal: current.exercisesTotal + (update.exercisesTotal || 0),
    timeSpentSeconds: current.timeSpentSeconds + (update.timeSpentSeconds || 0),
    streak: update.streak ?? current.streak
  };

  activities[today] = updated;

  // Keep only last 90 days
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);
  const cutoff = getDateString(cutoffDate);

  Object.keys(activities).forEach(date => {
    if (date < cutoff) {
      delete activities[date];
    }
  });

  saveDailyActivities(activities);
  return updated;
}

// ============================================
// Statistics Functions
// ============================================

export function getWeeklyStats(): WeeklyStats {
  const activities = getDailyActivities();
  const weekStart = getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weekActivities: DailyActivity[] = [];
  let currentDate = new Date(weekStart);

  while (currentDate <= weekEnd) {
    const dateStr = getDateString(currentDate);
    if (activities[dateStr]) {
      weekActivities.push(activities[dateStr]);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const totalXP = weekActivities.reduce((sum, a) => sum + a.xpEarned, 0);
  const lessonsCompleted = weekActivities.reduce((sum, a) => sum + a.lessonsCompleted, 0);
  const totalCorrect = weekActivities.reduce((sum, a) => sum + a.exercisesCorrect, 0);
  const totalExercises = weekActivities.reduce((sum, a) => sum + a.exercisesTotal, 0);
  const totalTime = weekActivities.reduce((sum, a) => sum + a.timeSpentSeconds, 0);

  // Find most active day
  let mostActiveDay = '';
  let maxXP = 0;
  weekActivities.forEach(a => {
    if (a.xpEarned > maxXP) {
      maxXP = a.xpEarned;
      mostActiveDay = a.date;
    }
  });

  return {
    weekStart: getDateString(weekStart),
    weekEnd: getDateString(weekEnd),
    totalXP,
    lessonsCompleted,
    averageAccuracy: totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0,
    totalTimeMinutes: Math.round(totalTime / 60),
    mostActiveDay,
    streakDays: weekActivities.filter(a => a.xpEarned > 0).length
  };
}

export function getActivityHistory(days: number = 30): DailyActivity[] {
  const activities = getDailyActivities();
  const result: DailyActivity[] = [];

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = getDateString(currentDate);
    result.push(activities[dateStr] || {
      date: dateStr,
      xpEarned: 0,
      lessonsCompleted: 0,
      exercisesCorrect: 0,
      exercisesTotal: 0,
      timeSpentSeconds: 0,
      streak: 0
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

// ============================================
// Learning Insights
// ============================================

export function generateInsights(
  weeklyStats: WeeklyStats,
  totalXP: number,
  streak: number,
  accuracy: number
): LearningInsight[] {
  const insights: LearningInsight[] = [];

  // Streak insights
  if (streak >= 7) {
    insights.push({
      type: 'milestone',
      title: {
        ko: '일주일 연속 학습!',
        mn: '7 хоног дараалан суралцлаа!',
        ru: 'Неделя обучения подряд!',
        vi: 'Học 7 ngày liên tiếp!'
      },
      description: {
        ko: `${streak}일 연속으로 학습하고 있습니다. 대단해요!`,
        mn: `${streak} өдөр дараалан суралцаж байна. Гайхалтай!`,
        ru: `Вы учитесь ${streak} дней подряд. Отлично!`,
        vi: `Bạn đã học ${streak} ngày liên tiếp. Tuyệt vời!`
      },
      icon: '🔥',
      priority: 1
    });
  } else if (streak === 0) {
    insights.push({
      type: 'recommendation',
      title: {
        ko: '다시 시작해요!',
        mn: 'Дахин эхлэцгээе!',
        ru: 'Начнём заново!',
        vi: 'Bắt đầu lại nào!'
      },
      description: {
        ko: '오늘 첫 레슨을 완료하고 연속 학습을 시작하세요.',
        mn: 'Өнөөдөр анхны хичээлээ дуусгаад дараалсан суралцалтыг эхлүүлээрэй.',
        ru: 'Завершите первый урок сегодня и начните серию.',
        vi: 'Hoàn thành bài học đầu tiên hôm nay để bắt đầu chuỗi.'
      },
      icon: '🌱',
      priority: 2
    });
  }

  // Accuracy insights
  if (accuracy >= 90) {
    insights.push({
      type: 'strength',
      title: {
        ko: '놀라운 정확도!',
        mn: 'Гайхалтай нарийвчлал!',
        ru: 'Потрясающая точность!',
        vi: 'Độ chính xác tuyệt vời!'
      },
      description: {
        ko: `정확도 ${accuracy}%! 완벽에 가깝습니다.`,
        mn: `${accuracy}% нарийвчлал! Төгс төгөлдөрт ойрхон.`,
        ru: `Точность ${accuracy}%! Почти идеально.`,
        vi: `Độ chính xác ${accuracy}%! Gần như hoàn hảo.`
      },
      icon: '🎯',
      priority: 1
    });
  } else if (accuracy < 60 && accuracy > 0) {
    insights.push({
      type: 'tip',
      title: {
        ko: '복습이 필요해요',
        mn: 'Давтлага хэрэгтэй',
        ru: 'Нужно повторить',
        vi: 'Cần ôn tập'
      },
      description: {
        ko: '이전 레슨을 다시 연습하면 실력이 늘어요.',
        mn: 'Өмнөх хичээлүүдээ дахин дадлага хийвэл ур чадвар дээшлэнэ.',
        ru: 'Повторение предыдущих уроков поможет улучшить навыки.',
        vi: 'Luyện tập lại các bài trước sẽ giúp tiến bộ.'
      },
      icon: '📚',
      priority: 2
    });
  }

  // XP milestone insights
  const xpMilestones = [100, 500, 1000, 2500, 5000, 10000];
  for (const milestone of xpMilestones) {
    if (totalXP >= milestone && totalXP < milestone * 1.1) {
      insights.push({
        type: 'milestone',
        title: {
          ko: `${milestone} XP 달성!`,
          mn: `${milestone} XP хүрлээ!`,
          ru: `${milestone} XP достигнуто!`,
          vi: `Đạt ${milestone} XP!`
        },
        description: {
          ko: '꾸준한 학습의 결과입니다. 계속 화이팅!',
          mn: 'Тогтмол суралцсаны үр дүн. Тэвчээртэй бай!',
          ru: 'Результат постоянного обучения. Продолжайте!',
          vi: 'Kết quả của việc học đều đặn. Tiếp tục cố gắng!'
        },
        icon: '⭐',
        priority: 1
      });
      break;
    }
  }

  // Weekly activity insight
  if (weeklyStats.streakDays >= 5) {
    insights.push({
      type: 'strength',
      title: {
        ko: '이번 주 열심히!',
        mn: 'Энэ долоо хоногт хичээнгүй!',
        ru: 'Отличная неделя!',
        vi: 'Tuần này rất chăm!'
      },
      description: {
        ko: `이번 주 ${weeklyStats.streakDays}일 동안 학습했습니다.`,
        mn: `Энэ долоо хоногт ${weeklyStats.streakDays} өдөр суралцлаа.`,
        ru: `На этой неделе вы учились ${weeklyStats.streakDays} дней.`,
        vi: `Tuần này bạn đã học ${weeklyStats.streakDays} ngày.`
      },
      icon: '📅',
      priority: 2
    });
  }

  // Sort by priority
  return insights.sort((a, b) => a.priority - b.priority);
}

// ============================================
// Export Summary
// ============================================

export interface LearningSummary {
  today: DailyActivity;
  weekly: WeeklyStats;
  history: DailyActivity[];
  insights: LearningInsight[];
}

export function getLearningSummary(totalXP: number, streak: number): LearningSummary {
  const today = getTodayActivity();
  const weekly = getWeeklyStats();
  const history = getActivityHistory(14);

  const accuracy = today.exercisesTotal > 0
    ? Math.round((today.exercisesCorrect / today.exercisesTotal) * 100)
    : weekly.averageAccuracy;

  const insights = generateInsights(weekly, totalXP, streak, accuracy);

  return {
    today,
    weekly,
    history,
    insights
  };
}
