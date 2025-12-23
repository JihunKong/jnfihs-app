'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Coffee, Sun, Moon, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { GlassCard } from '@/components/ui/GlassCard';

type Meal = {
  date: string;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  allergens: string[];
};

export default function MealsPage() {
  const t = useTranslations('meals');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [view, setView] = useState<'day' | 'week'>('day');

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await fetch('/api/meals?week=current');
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
    }
  };

  const selectedMeal = meals.find((m) => m.date === selectedDate);

  const navigateDate = (direction: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + direction);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return <Coffee className="w-5 h-5" />;
      case 'lunch':
        return <Sun className="w-5 h-5" />;
      case 'dinner':
        return <Moon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-oat-50 pb-24">
      <Header showBack title={t('title')} />

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* View Toggle */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'day'
                ? 'bg-oat-700 text-white'
                : 'bg-oat-200 text-oat-700 hover:bg-oat-300'
            }`}
          >
            {t('dayView')}
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'week'
                ? 'bg-oat-700 text-white'
                : 'bg-oat-200 text-oat-700 hover:bg-oat-300'
            }`}
          >
            {t('weekView')}
          </button>
        </div>

        {view === 'day' ? (
          <>
            {/* Date Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateDate(-1)}
                className="p-2 rounded-full hover:bg-oat-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-oat-700" />
              </button>

              <div className="text-center">
                <h2 className="text-lg font-bold text-oat-900">{formatDate(selectedDate)}</h2>
                {isToday && (
                  <span className="text-xs bg-oat-700 text-white px-2 py-0.5 rounded-full">
                    {t('today')}
                  </span>
                )}
              </div>

              <button
                onClick={() => navigateDate(1)}
                className="p-2 rounded-full hover:bg-oat-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-oat-700" />
              </button>
            </div>

            {/* Daily Meals */}
            {selectedMeal ? (
              <div className="space-y-4">
                {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                  <GlassCard key={mealType}>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`p-2 rounded-lg ${
                          mealType === 'breakfast'
                            ? 'bg-orange-100 text-orange-600'
                            : mealType === 'lunch'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-indigo-100 text-indigo-600'
                        }`}
                      >
                        {getMealIcon(mealType)}
                      </div>
                      <h3 className="font-bold text-oat-900">{t(mealType)}</h3>
                    </div>

                    <ul className="space-y-1">
                      {selectedMeal[mealType].map((item, i) => (
                        <li key={i} className="text-oat-700 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-oat-400 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                ))}

                {/* Allergens */}
                {selectedMeal.allergens.length > 0 && (
                  <div className="flex items-start gap-2 bg-amber-50 text-amber-800 p-4 rounded-lg">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{t('allergenWarning')}</p>
                      <p className="text-sm">{selectedMeal.allergens.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <GlassCard className="text-center text-oat-500 py-8">
                {t('noMealInfo')}
              </GlassCard>
            )}
          </>
        ) : (
          /* Week View */
          <div className="space-y-3">
            {meals.map((meal) => {
              const isSelected = meal.date === selectedDate;
              const isTodayMeal = meal.date === new Date().toISOString().split('T')[0];

              return (
                <button
                  key={meal.date}
                  onClick={() => {
                    setSelectedDate(meal.date);
                    setView('day');
                  }}
                  className={`w-full glass-card text-left hover:bg-oat-200/50 transition-colors ${
                    isSelected ? 'ring-2 ring-oat-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-oat-900">{formatDate(meal.date)}</span>
                    {isTodayMeal && (
                      <span className="text-xs bg-oat-700 text-white px-2 py-0.5 rounded-full">
                        {t('today')}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-oat-600">
                    <div>
                      <span className="font-medium">{t('breakfast')}</span>
                      <p className="truncate">{meal.breakfast.slice(0, 2).join(', ')}</p>
                    </div>
                    <div>
                      <span className="font-medium">{t('lunch')}</span>
                      <p className="truncate">{meal.lunch.slice(0, 2).join(', ')}</p>
                    </div>
                    <div>
                      <span className="font-medium">{t('dinner')}</span>
                      <p className="truncate">{meal.dinner.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
