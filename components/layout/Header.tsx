'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ChevronLeft, Globe } from 'lucide-react';
import { useState } from 'react';

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'mn', name: 'Монгол', flag: '🇲🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

interface HeaderProps {
  showBack?: boolean;
  title?: string;
}

export function Header({ showBack = false, title }: HeaderProps) {
  const { locale } = useParams();
  const pathname = usePathname();
  const t = useTranslations('common');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  const switchLanguage = (langCode: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${langCode}`);
    window.location.href = newPath;
  };

  return (
    <header className="glass-header px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left: Back button or Logo */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <Link
              href={`/${locale}`}
              className="p-2 -ml-2 hover:bg-oat-200/50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-oat-700" />
            </Link>
          ) : null}
          <h1 className="font-bold text-lg text-oat-900">
            {title || t('appName')}
          </h1>
        </div>

        {/* Right: Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-oat-200/50 rounded-lg transition-colors"
          >
            <span className="text-lg">{currentLang.flag}</span>
            <Globe className="w-4 h-4 text-oat-600" />
          </button>

          {showLangMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowLangMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50 glass-card-sm min-w-[160px] animate-fade-in">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      switchLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-oat-200/50 rounded-lg transition-colors ${
                      lang.code === locale ? 'bg-oat-200/50' : ''
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium text-oat-800">{lang.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
