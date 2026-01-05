'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Utensils, ChevronRight, Coffee, Sun, Moon } from 'lucide-react';

interface MealData {
  date: string;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

export default function MealsWidget() {
  const t = useTranslations();
  const { locale } = useParams();
  const [meals, setMeals] = useState<MealData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await fetch(`/api/meals?date=${today}`);
        if (res.ok) {
          const data = await res.json();
          setMeals(data);
        }
      } catch (error) {
        console.error('Failed to fetch meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'lunch':
        return <Sun className="w-4 h-4 text-orange-500" />;
      case 'dinner':
        return <Moon className="w-4 h-4 text-indigo-500" />;
      default:
        return <Utensils className="w-4 h-4" />;
    }
  };

  const getCurrentMealType = () => {
    const hour = new Date().getHours();
    if (hour < 10) return 'breakfast';
    if (hour < 14) return 'lunch';
    return 'dinner';
  };

  const currentMealType = getCurrentMealType();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-oat-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-oat-800">{t('dashboard.widgets.meals.title')}</h3>
        </div>
        <Link
          href={`/${locale}/meals`}
          className="flex items-center gap-1 text-sm text-oat-500 hover:text-oat-700 transition-colors"
        >
          <span>{t('common.viewAll')}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-8 h-8 bg-oat-200 rounded-lg" />
              <div className="flex-1 h-4 bg-oat-200 rounded" />
            </div>
          ))}
        </div>
      ) : meals ? (
        <div className="space-y-3">
          {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
            <div
              key={mealType}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                mealType === currentMealType ? 'bg-oat-100' : 'hover:bg-oat-50'
              }`}
            >
              <div className={`mt-0.5 ${mealType === currentMealType ? 'animate-pulse' : ''}`}>
                {getMealIcon(mealType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-oat-500 mb-0.5">
                  {t(`meals.${mealType}`)}
                  {mealType === currentMealType && (
                    <span className="ml-1 text-orange-500">({t('dashboard.widgets.meals.now')})</span>
                  )}
                </p>
                <p className="text-sm text-oat-700 truncate">
                  {meals[mealType]?.slice(0, 3).join(', ') || t('meals.noMealInfo')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-oat-500 text-sm">
          {t('meals.noMealInfo')}
        </div>
      )}
    </div>
  );
}
