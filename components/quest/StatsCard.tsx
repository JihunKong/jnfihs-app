'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import {
  Zap,
  Flame,
  Target,
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  X
} from 'lucide-react';
import { LocalizedText } from '@/lib/korean-curriculum';
import { getProgress, getStats, StatsStorage, UserProgress } from '@/lib/quest-progress';
import { getLearningSummary, DailyActivity, WeeklyStats, LearningInsight } from '@/lib/learning-analytics';
import { getUnlockedAchievements, getLockedAchievements } from '@/lib/quest-progress';
import { Achievement, getTierGradient } from '@/lib/achievement-system';
import { getMasteryStats, getReviewQueue } from '@/lib/spaced-repetition';
import { TOPIK1_VOCABULARY } from '@/lib/korean-vocabulary';

// Helper to get localized text
function useLocalizedText() {
  const locale = useLocale();
  return (obj: LocalizedText) => obj[locale as keyof LocalizedText] || obj.ko;
}

// ============================================
// Mini Stats Bar (for header)
// ============================================

interface MiniStatsProps {
  xp: number;
  streak: number;
  level: number;
}

export function MiniStats({ xp, streak, level }: MiniStatsProps) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1 text-yellow-600">
        <Zap className="w-4 h-4 fill-yellow-500" />
        <span className="font-bold">{xp}</span>
      </div>
      {streak > 0 && (
        <div className="flex items-center gap-1 text-orange-600">
          <Flame className="w-4 h-4 fill-orange-500" />
          <span className="font-bold">{streak}</span>
        </div>
      )}
      <div className="flex items-center gap-1 text-blue-600">
        <Award className="w-4 h-4" />
        <span className="font-bold">Lv.{level}</span>
      </div>
    </div>
  );
}

// ============================================
// Activity Heatmap
// ============================================

interface ActivityHeatmapProps {
  history: DailyActivity[];
}

export function ActivityHeatmap({ history }: ActivityHeatmapProps) {
  const getIntensity = (xp: number): string => {
    if (xp === 0) return 'bg-gray-100';
    if (xp < 20) return 'bg-green-200';
    if (xp < 50) return 'bg-green-300';
    if (xp < 100) return 'bg-green-400';
    return 'bg-green-500';
  };

  return (
    <div className="flex gap-1 flex-wrap">
      {history.map((day, index) => (
        <div
          key={day.date}
          className={`w-4 h-4 rounded-sm ${getIntensity(day.xpEarned)} transition-colors hover:ring-2 hover:ring-blue-400`}
          title={`${day.date}: ${day.xpEarned} XP`}
        />
      ))}
    </div>
  );
}

// ============================================
// Weekly Summary Card
// ============================================

interface WeeklySummaryCardProps {
  weekly: WeeklyStats;
}

export function WeeklySummaryCard({ weekly }: WeeklySummaryCardProps) {
  const t = useLocalizedText();

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-500" />
        이번 주 요약
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-600">{weekly.totalXP}</p>
          <p className="text-xs text-yellow-700">XP 획득</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{weekly.lessonsCompleted}</p>
          <p className="text-xs text-green-700">레슨 완료</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{weekly.averageAccuracy}%</p>
          <p className="text-xs text-blue-700">평균 정확도</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-purple-600">{weekly.totalTimeMinutes}</p>
          <p className="text-xs text-purple-700">학습 시간 (분)</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <span>활동일: {weekly.streakDays}일</span>
        <span>{weekly.weekStart} ~ {weekly.weekEnd}</span>
      </div>
    </div>
  );
}

// ============================================
// Insight Card
// ============================================

interface InsightCardProps {
  insight: LearningInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const t = useLocalizedText();

  const bgColors = {
    strength: 'bg-green-50 border-green-200',
    weakness: 'bg-red-50 border-red-200',
    tip: 'bg-blue-50 border-blue-200',
    milestone: 'bg-yellow-50 border-yellow-200',
    recommendation: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className={`rounded-lg p-3 border ${bgColors[insight.type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{insight.icon}</span>
        <div>
          <h4 className="font-bold text-gray-800">{t(insight.title)}</h4>
          <p className="text-sm text-gray-600">{t(insight.description)}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Achievement Progress Card
// ============================================

interface AchievementProgressCardProps {
  unlocked: Achievement[];
  total: number;
  onViewAll?: () => void;
}

export function AchievementProgressCard({ unlocked, total, onViewAll }: AchievementProgressCardProps) {
  const recent = unlocked.slice(-3).reverse();
  const progress = Math.round((unlocked.length / total) * 100);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          성취
        </h3>
        <span className="text-sm text-gray-500">{unlocked.length}/{total}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Recent achievements */}
      {recent.length > 0 ? (
        <div className="flex items-center gap-2 mb-3">
          {recent.map(achievement => (
            <div
              key={achievement.id}
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTierGradient(achievement.tier)} flex items-center justify-center text-xl`}
              title={achievement.name.ko}
            >
              {achievement.icon}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 mb-3">아직 획득한 성취가 없습니다</p>
      )}

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          모두 보기
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ============================================
// Vocabulary Mastery Card
// ============================================

interface VocabularyMasteryCardProps {
  stats: {
    total: number;
    new: number;
    learning: number;
    mastered: number;
    averageLevel: number;
  };
  dueCount: number;
}

export function VocabularyMasteryCard({ stats, dueCount }: VocabularyMasteryCardProps) {
  const masteryPercent = Math.round((stats.mastered / stats.total) * 100);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-green-500" />
        어휘 마스터리
      </h3>

      {/* Mastery ring */}
      <div className="flex items-center gap-4 mb-3">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#10B981"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${masteryPercent * 1.76} 176`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-green-600">{masteryPercent}%</span>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">마스터</span>
            <span className="font-medium text-green-600">{stats.mastered}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">학습 중</span>
            <span className="font-medium text-blue-600">{stats.learning}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">새 단어</span>
            <span className="font-medium text-gray-600">{stats.new}</span>
          </div>
        </div>
      </div>

      {/* Review reminder */}
      {dueCount > 0 && (
        <div className="bg-orange-50 rounded-lg p-2 flex items-center gap-2">
          <span className="text-lg">📝</span>
          <span className="text-sm text-orange-700">
            오늘 복습할 단어: <strong>{dueCount}개</strong>
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// Full Stats Dashboard Modal
// ============================================

interface StatsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsDashboard({ isOpen, onClose }: StatsDashboardProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [stats, setStats] = useState<StatsStorage | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (isOpen) {
      setProgress(getProgress());
      setStats(getStats());
      setUnlockedAchievements(getUnlockedAchievements());
    }
  }, [isOpen]);

  if (!isOpen || !progress || !stats) return null;

  const summary = getLearningSummary(progress.totalXP, progress.currentStreak);
  const allWordIds = TOPIK1_VOCABULARY.map(v => v.id);
  const masteryStats = getMasteryStats(allWordIds);
  const reviewQueue = getReviewQueue(allWordIds);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            학습 통계
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Overall stats */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">{progress.totalXP}</p>
                <p className="text-sm opacity-80">총 XP</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{progress.level}</p>
                <p className="text-sm opacity-80">레벨</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{progress.maxStreak}</p>
                <p className="text-sm opacity-80">최대 연속</p>
              </div>
            </div>
          </div>

          {/* Activity heatmap */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-3">최근 활동</h3>
            <ActivityHeatmap history={summary.history} />
          </div>

          {/* Weekly summary */}
          <WeeklySummaryCard weekly={summary.weekly} />

          {/* Vocabulary mastery */}
          <VocabularyMasteryCard
            stats={masteryStats}
            dueCount={reviewQueue.dueToday.length}
          />

          {/* Achievements */}
          <AchievementProgressCard
            unlocked={unlockedAchievements}
            total={20}
          />

          {/* Insights */}
          {summary.insights.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-gray-700">학습 인사이트</h3>
              {summary.insights.slice(0, 3).map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          )}

          {/* Detailed stats */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-3">상세 통계</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">총 레슨 완료</span>
                <span className="font-medium">{progress.lessonsCompleted.length}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">총 문제 정답</span>
                <span className="font-medium">{stats.exercisesCorrect}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">총 문제 시도</span>
                <span className="font-medium">{stats.exercisesTotal}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">전체 정확도</span>
                <span className="font-medium">
                  {stats.exercisesTotal > 0
                    ? Math.round((stats.exercisesCorrect / stats.exercisesTotal) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">퍼펙트 레슨</span>
                <span className="font-medium">{stats.perfectLessons}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">총 학습 시간</span>
                <span className="font-medium">
                  {Math.round(stats.totalTimeSeconds / 60)}분
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
