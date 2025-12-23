'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Home,
  MessageCircle,
  Subtitles,
  Mail,
  Calendar,
  Heart,
  UtensilsCrossed,
  Building,
} from 'lucide-react';

const navItems = [
  { id: 'home', href: '', icon: Home },
  { id: 'chat', href: '/chat', icon: MessageCircle },
  { id: 'translation', href: '/translation/listen', icon: Subtitles },
  { id: 'messenger', href: '/messenger', icon: Mail },
  { id: 'leave', href: '/leave', icon: Calendar },
  { id: 'health', href: '/health', icon: Heart },
  { id: 'meals', href: '/meals', icon: UtensilsCrossed },
  { id: 'booking', href: '/booking', icon: Building },
];

export function SideNav() {
  const { locale } = useParams();
  const pathname = usePathname();
  const t = useTranslations('nav');

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === '') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(fullPath);
  };

  return (
    <nav className="hidden md:flex flex-col w-64 glass h-screen sticky top-0 p-4">
      <div className="mb-8 px-3">
        <h1 className="font-bold text-xl text-oat-900">JNFIHS</h1>
        <p className="text-sm text-oat-600">전남미래국제고</p>
      </div>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.id}
              href={`/${locale}${item.href}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-oat-200/80 text-oat-900'
                  : 'text-oat-600 hover:bg-oat-100/80 hover:text-oat-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{t(item.id)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
