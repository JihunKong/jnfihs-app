'use client';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import TopNav from '@/components/layout/TopNav';
import MealsWidget from '@/components/dashboard/MealsWidget';
import AnnouncementsWidget from '@/components/dashboard/AnnouncementsWidget';
import KoreanWidget from '@/components/dashboard/KoreanWidget';
import ScheduleWidget from '@/components/dashboard/ScheduleWidget';

export default function DashboardPage() {
  const t = useTranslations();
  const { data: session } = useSession();
  const { locale } = useParams();

  const today = format(new Date(), 'yyyy.MM.dd');
  const userName = session?.user?.name?.split(' ')[0] || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-oat-50 via-oat-100/50 to-oat-50">
      <TopNav />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-oat-900">
            {t('dashboard.greeting')}
            {userName && <span className="text-oat-600 ml-2">{userName}</span>}
          </h1>
          <p className="text-oat-500 mt-1">
            {t('dashboard.todayDate')}: {today}
          </p>
        </div>

        {/* Dashboard Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Row 1: Meals & Announcements */}
          <MealsWidget />
          <AnnouncementsWidget />

          {/* Row 2: Korean Learning & Schedule */}
          <KoreanWidget />
          <ScheduleWidget />
        </div>

        {/* Quick Access Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-oat-800 mb-4">
            {t('dashboard.quickAccess')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickAccessCard
              href="/emergency-cards"
              icon="🚨"
              label={t('dashboard.features.emergencyCards.title')}
              locale={locale as string}
            />
            <QuickAccessCard
              href="/health-pointer"
              icon="🏥"
              label={t('dashboard.features.healthPointer.title')}
              locale={locale as string}
            />
            <QuickAccessCard
              href="/phrases"
              icon="📚"
              label={t('dashboard.features.phrases.title')}
              locale={locale as string}
            />
            <QuickAccessCard
              href="/chat"
              icon="💬"
              label={t('dashboard.features.chat.title')}
              locale={locale as string}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickAccessCard({
  href,
  icon,
  label,
  locale,
}: {
  href: string;
  icon: string;
  label: string;
  locale: string;
}) {
  return (
    <a
      href={`/${locale}${href}`}
      className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-oat-200 hover:bg-white hover:shadow-md transition-all group"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm text-oat-700 text-center font-medium">{label}</span>
    </a>
  );
}
