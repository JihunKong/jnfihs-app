'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import {
  MessageCircle,
  Subtitles,
  Radio,
  Mail,
  Calendar,
  Heart,
  UtensilsCrossed,
  Building,
  GraduationCap,
  AlertCircle,
  Stethoscope,
  BookOpen,
  Bell,
  Users,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { FeatureTile } from '@/components/ui/FeatureTile';
import { useDevice } from '@/hooks/useDevice';

export default function DashboardPage() {
  const { locale } = useParams();
  const t = useTranslations();
  const { isChromebook, isMobile } = useDevice();

  const features = [
    {
      id: 'chat',
      href: `/${locale}/chat`,
      icon: MessageCircle,
      title: t('dashboard.features.chat.title'),
      description: t('dashboard.features.chat.desc'),
      optimizedFor: 'mobile' as const,
    },
    {
      id: 'translation',
      href: `/${locale}/translation/listen`,
      icon: Subtitles,
      title: t('dashboard.features.translation.title'),
      description: t('dashboard.features.translation.desc'),
      optimizedFor: 'chromebook' as const,
    },
    {
      id: 'broadcast',
      href: `/${locale}/translation/broadcast`,
      icon: Radio,
      title: t('dashboard.features.broadcast.title'),
      description: t('dashboard.features.broadcast.desc'),
      optimizedFor: 'chromebook' as const,
    },
    {
      id: 'messenger',
      href: `/${locale}/messenger`,
      icon: Mail,
      title: t('dashboard.features.messenger.title'),
      description: t('dashboard.features.messenger.desc'),
      optimizedFor: 'both' as const,
    },
    {
      id: 'leave',
      href: `/${locale}/leave`,
      icon: Calendar,
      title: t('dashboard.features.leave.title'),
      description: t('dashboard.features.leave.desc'),
      optimizedFor: 'mobile' as const,
    },
    {
      id: 'health',
      href: `/${locale}/health`,
      icon: Heart,
      title: t('dashboard.features.health.title'),
      description: t('dashboard.features.health.desc'),
      optimizedFor: 'mobile' as const,
    },
    {
      id: 'meals',
      href: `/${locale}/meals`,
      icon: UtensilsCrossed,
      title: t('dashboard.features.meals.title'),
      description: t('dashboard.features.meals.desc'),
      optimizedFor: 'both' as const,
    },
    {
      id: 'booking',
      href: `/${locale}/booking`,
      icon: Building,
      title: t('dashboard.features.booking.title'),
      description: t('dashboard.features.booking.desc'),
      optimizedFor: 'chromebook' as const,
    },
    {
      id: 'korean-learning',
      href: `/${locale}/korean-learning`,
      icon: GraduationCap,
      title: t('dashboard.features.koreanLearning.title'),
      description: t('dashboard.features.koreanLearning.desc'),
      optimizedFor: 'both' as const,
    },
    {
      id: 'emergency-cards',
      href: `/${locale}/emergency-cards`,
      icon: AlertCircle,
      title: t('dashboard.features.emergencyCards.title'),
      description: t('dashboard.features.emergencyCards.desc'),
      optimizedFor: 'mobile' as const,
    },
    {
      id: 'health-pointer',
      href: `/${locale}/health-pointer`,
      icon: Stethoscope,
      title: t('dashboard.features.healthPointer.title'),
      description: t('dashboard.features.healthPointer.desc'),
      optimizedFor: 'mobile' as const,
    },
    {
      id: 'phrases',
      href: `/${locale}/phrases`,
      icon: BookOpen,
      title: t('dashboard.features.phrases.title'),
      description: t('dashboard.features.phrases.desc'),
      optimizedFor: 'both' as const,
    },
    {
      id: 'announcements',
      href: `/${locale}/announcements`,
      icon: Bell,
      title: t('dashboard.features.announcements.title'),
      description: t('dashboard.features.announcements.desc'),
      optimizedFor: 'both' as const,
    },
    {
      id: 'parent-portal',
      href: `/${locale}/parent-portal`,
      icon: Users,
      title: t('dashboard.features.parentPortal.title'),
      description: t('dashboard.features.parentPortal.desc'),
      optimizedFor: 'both' as const,
    },
  ];

  const today = format(new Date(), 'yyyy.MM.dd');

  return (
    <div className="min-h-screen bg-oat-50">
      <Header />

      <main className={`max-w-4xl mx-auto p-4 ${isMobile ? 'pb-24' : 'pb-8'}`}>
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-oat-900">
            {t('dashboard.greeting')}
          </h2>
          <p className="text-oat-600 mt-1">
            {t('dashboard.todayDate')}: {today}
          </p>
        </div>

        {/* Feature Grid */}
        <div className={`grid gap-4 ${isChromebook ? 'grid-cols-4' : 'grid-cols-2'}`}>
          {features.map((feature) => (
            <FeatureTile
              key={feature.id}
              href={feature.href}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              optimizedFor={feature.optimizedFor}
            />
          ))}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
