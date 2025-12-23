'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Home,
  MessageCircle,
  Subtitles,
  Calendar,
  Menu,
} from 'lucide-react';

const navItems = [
  { id: 'home', href: '', icon: Home },
  { id: 'chat', href: '/chat', icon: MessageCircle },
  { id: 'translation', href: '/translation/listen', icon: Subtitles },
  { id: 'leave', href: '/leave', icon: Calendar },
];

export function MobileNav() {
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
    <nav className="mobile-nav md:hidden pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.id}
            href={`/${locale}${item.href}`}
            className={`mobile-nav-item ${active ? 'active' : ''}`}
          >
            <Icon className={`w-6 h-6 ${active ? 'text-oat-800' : 'text-oat-500'}`} />
            <span className={`text-xs ${active ? 'text-oat-800 font-medium' : 'text-oat-500'}`}>
              {t(item.id)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
