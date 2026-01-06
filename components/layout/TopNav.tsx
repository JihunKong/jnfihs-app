'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  User,
  LogOut,
  BookOpen,
  Gamepad2,
  Languages,
  Radio,
  Mic,
  FileText,
  Send,
  Utensils,
  CalendarDays,
  Heart,
  Hand,
  AlertTriangle,
  MessageSquare,
  Users,
  School,
  Settings,
} from 'lucide-react';
import type { UserRole } from '@/types/next-auth';

// Menu configuration with role-based access
interface MenuItem {
  key: string;
  href: string;
  icon: React.ReactNode;
  roles?: UserRole[]; // undefined = all roles, empty array = no access
}

interface MenuGroup {
  key: string;
  label: string;
  icon: React.ReactNode;
  items: MenuItem[];
  roles?: UserRole[]; // undefined = all roles
}

const menuConfig: MenuGroup[] = [
  {
    key: 'learning',
    label: 'nav.groups.learning',
    icon: <BookOpen className="w-4 h-4" />,
    roles: ['student', 'teacher', 'admin'],
    items: [
      { key: 'koreanLearning', href: '/korean-learning', icon: <Gamepad2 className="w-4 h-4" /> },
      { key: 'quest', href: '/quest', icon: <BookOpen className="w-4 h-4" /> },
      { key: 'phrases', href: '/phrases', icon: <Languages className="w-4 h-4" /> },
      { key: 'translationListen', href: '/translation/listen', icon: <Radio className="w-4 h-4" />, roles: ['student'] },
      { key: 'translationBroadcast', href: '/translation/broadcast', icon: <Mic className="w-4 h-4" />, roles: ['teacher', 'admin'] },
    ],
  },
  {
    key: 'schoolLife',
    label: 'nav.groups.schoolLife',
    icon: <School className="w-4 h-4" />,
    items: [
      { key: 'announcements', href: '/announcements', icon: <FileText className="w-4 h-4" /> },
      { key: 'leave', href: '/leave', icon: <Send className="w-4 h-4" />, roles: ['student', 'teacher', 'admin'] },
      { key: 'meals', href: '/meals', icon: <Utensils className="w-4 h-4" /> },
      { key: 'booking', href: '/booking', icon: <CalendarDays className="w-4 h-4" />, roles: ['student', 'teacher', 'admin'] },
    ],
  },
  {
    key: 'healthSafety',
    label: 'nav.groups.healthSafety',
    icon: <Heart className="w-4 h-4" />,
    items: [
      { key: 'health', href: '/health', icon: <Heart className="w-4 h-4" />, roles: ['student', 'teacher', 'admin'] },
      { key: 'healthPointer', href: '/health-pointer', icon: <Hand className="w-4 h-4" /> },
      { key: 'emergencyCards', href: '/emergency-cards', icon: <AlertTriangle className="w-4 h-4" /> },
    ],
  },
  {
    key: 'communication',
    label: 'nav.groups.communication',
    icon: <MessageSquare className="w-4 h-4" />,
    items: [
      { key: 'messenger', href: '/messenger', icon: <MessageSquare className="w-4 h-4" />, roles: ['student', 'teacher', 'admin'] },
      { key: 'chat', href: '/chat', icon: <MessageSquare className="w-4 h-4" />, roles: ['student', 'teacher', 'admin'] },
      { key: 'parentPortal', href: '/parent-portal', icon: <Users className="w-4 h-4" />, roles: ['parent', 'admin'] },
    ],
  },
];

const locales = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'mn', name: 'Монгол', flag: '🇲🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

// Check if auth is enabled via public env var
const isAuthEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';

export default function TopNav() {
  const { data: session, status } = useSession();
  const t = useTranslations();
  const { locale } = useParams();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userRole = session?.user?.role as UserRole | undefined;
  const isAuthenticated = status === 'authenticated';

  // Get path without locale prefix
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  // Helper to create localized href
  const localizedHref = (path: string) => `/${locale}${path === '/' ? '' : path}`;

  // Switch language
  const switchLanguage = (langCode: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${langCode}`);
    window.location.href = newPath;
  };

  // Filter menu items based on user role
  const getFilteredItems = (items: MenuItem[]) => {
    if (!userRole) return items.filter((item) => !item.roles || item.roles.length === 0);
    return items.filter((item) => !item.roles || item.roles.includes(userRole));
  };

  // Filter menu groups based on user role
  // Show all groups but indicate if login is required for empty ones
  const getFilteredGroups = () => {
    return menuConfig.filter((group) => {
      // If group has role restriction and user has a role, check if allowed
      if (group.roles && userRole && !group.roles.includes(userRole)) return false;
      // Show all other groups (even if empty - will show login prompt)
      return true;
    });
  };

  const handleDropdownEnter = (key: string) => {
    setActiveDropdown(key);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-oat-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={localizedHref('/')} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-oat-400 to-oat-600 rounded-xl flex items-center justify-center shadow-md">
              <School className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-oat-800 hidden sm:block">JNFIHS</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {getFilteredGroups().map((group) => (
              <div
                key={group.key}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(group.key)}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-oat-700 hover:bg-oat-100 transition-colors">
                  {group.icon}
                  <span>{t(group.label)}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === group.key ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {activeDropdown === group.key && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-oat-200 py-2 animate-fadeIn">
                    {getFilteredItems(group.items).length > 0 ? (
                      getFilteredItems(group.items).map((item) => (
                        <Link
                          key={item.key}
                          href={localizedHref(item.href)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-oat-50 transition-colors ${
                            pathWithoutLocale === item.href ? 'text-oat-700 bg-oat-50 font-medium' : 'text-oat-600'
                          }`}
                        >
                          {item.icon}
                          <span>{t(`dashboard.features.${item.key}.title`)}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center">
                        <p className="text-sm text-oat-500 mb-2">{t('nav.loginRequired')}</p>
                        {isAuthEnabled && (
                          <Link
                            href={localizedHref('/login')}
                            className="inline-block px-3 py-1.5 bg-oat-100 text-oat-700 rounded-lg text-xs font-medium hover:bg-oat-200 transition-colors"
                          >
                            {t('auth.signInWithGoogle')}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side: Language & User */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div
              className="relative"
              onMouseEnter={() => setLangDropdownOpen(true)}
              onMouseLeave={() => setLangDropdownOpen(false)}
            >
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-oat-600 hover:bg-oat-100 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {locales.find((l) => pathname.startsWith(`/${l.code}`))?.flag || '🌐'}
                </span>
              </button>

              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-oat-200 py-2 animate-fadeIn">
                  {locales.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => switchLanguage(l.code)}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-oat-50 transition-colors text-oat-600 ${
                        locale === l.code ? 'bg-oat-50 font-medium' : ''
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu / Login - Only show if auth is enabled */}
            {isAuthEnabled && isAuthenticated && session?.user ? (
              <div
                className="relative"
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-oat-100 transition-colors">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || ''}
                      className="w-8 h-8 rounded-full border-2 border-oat-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-oat-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-oat-600" />
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-oat-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-oat-200 py-2 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-oat-100">
                      <p className="text-sm font-medium text-oat-800">{session.user.name}</p>
                      <p className="text-xs text-oat-500">{session.user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-oat-100 text-oat-600 rounded-full capitalize">
                        {userRole}
                      </span>
                    </div>
                    <Link
                      href={localizedHref('/settings')}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-oat-600 hover:bg-oat-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>{t('auth.settings')}</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('auth.signOut')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : isAuthEnabled ? (
              <Link
                href={localizedHref('/login')}
                className="flex items-center gap-2 px-4 py-2 bg-oat-600 text-white rounded-lg text-sm font-medium hover:bg-oat-700 transition-colors shadow-sm"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t('auth.signInWithGoogle')}</span>
              </Link>
            ) : null}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-oat-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-oat-600" /> : <Menu className="w-6 h-6 text-oat-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-oat-200 animate-slideDown">
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto py-4 px-4 space-y-4">
            {getFilteredGroups().map((group) => (
              <div key={group.key}>
                <p className="text-xs font-semibold text-oat-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  {group.icon}
                  {t(group.label)}
                </p>
                <div className="space-y-1">
                  {getFilteredItems(group.items).map((item) => (
                    <Link
                      key={item.key}
                      href={localizedHref(item.href)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                        pathWithoutLocale === item.href
                          ? 'bg-oat-100 text-oat-800 font-medium'
                          : 'text-oat-600 hover:bg-oat-50'
                      }`}
                    >
                      {item.icon}
                      <span>{t(`dashboard.features.${item.key}.title`)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Mobile Language Selector */}
            <div className="border-t border-oat-200 pt-4">
              <p className="text-xs font-semibold text-oat-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Language
              </p>
              <div className="grid grid-cols-2 gap-2">
                {locales.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      switchLanguage(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-oat-600 hover:bg-oat-50 transition-colors ${
                      locale === l.code ? 'bg-oat-100 font-medium' : ''
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
