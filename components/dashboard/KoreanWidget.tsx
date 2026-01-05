'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, ChevronRight, Trophy, Zap, Target, Flame } from 'lucide-react';

interface QuestProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  completedSets: number;
  todayWord?: {
    korean: string;
    meaning: string;
  };
}

export default function KoreanWidget() {
  const t = useTranslations();
  const { locale } = useParams();
  const [progress, setProgress] = useState<QuestProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load progress from localStorage
    try {
      const savedProgress = localStorage.getItem('quest-progress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        setProgress({
          level: parsed.level || 1,
          xp: parsed.xp || 0,
          xpToNextLevel: parsed.xpToNextLevel || 100,
          streak: parsed.streak || 0,
          completedSets: parsed.completedSets || 0,
          todayWord: parsed.todayWord,
        });
      } else {
        setProgress({
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          streak: 0,
          completedSets: 0,
        });
      }
    } catch (error) {
      console.error('Failed to load quest progress:', error);
      setProgress({
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        streak: 0,
        completedSets: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const xpPercentage = progress ? Math.round((progress.xp / progress.xpToNextLevel) * 100) : 0;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-oat-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-oat-800">{t('dashboard.widgets.korean.title')}</h3>
        </div>
        <Link
          href={`/${locale}/quest`}
          className="flex items-center gap-1 text-sm text-oat-500 hover:text-oat-700 transition-colors"
        >
          <span>{t('dashboard.widgets.korean.continue')}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-oat-200 rounded w-1/2" />
          <div className="h-3 bg-oat-100 rounded-full" />
          <div className="flex gap-3">
            <div className="h-16 bg-oat-200 rounded-xl flex-1" />
            <div className="h-16 bg-oat-200 rounded-xl flex-1" />
          </div>
        </div>
      ) : progress ? (
        <div className="space-y-4">
          {/* Level & XP */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-oat-700">
                  {t('quest.level')} {progress.level}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-oat-500">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>{progress.xp} / {progress.xpToNextLevel} XP</span>
              </div>
            </div>
            <div className="h-2.5 bg-oat-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-oat-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-lg font-bold text-oat-800">{progress.streak}</span>
              </div>
              <p className="text-xs text-oat-500">{t('dashboard.widgets.korean.streak')}</p>
            </div>
            <div className="bg-oat-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="text-lg font-bold text-oat-800">{progress.completedSets}</span>
              </div>
              <p className="text-xs text-oat-500">{t('dashboard.widgets.korean.completed')}</p>
            </div>
          </div>

          {/* Today's Word (if available) */}
          {progress.todayWord && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-medium mb-1">
                {t('dashboard.widgets.korean.todayWord')}
              </p>
              <p className="text-lg font-bold text-oat-800">{progress.todayWord.korean}</p>
              <p className="text-sm text-oat-600">{progress.todayWord.meaning}</p>
            </div>
          )}

          {/* CTA */}
          <Link
            href={`/${locale}/quest`}
            className="block w-full text-center py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium text-sm hover:from-emerald-600 hover:to-teal-600 transition-colors"
          >
            {t('dashboard.widgets.korean.startQuest')}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
