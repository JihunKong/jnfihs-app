'use client';

import { Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Globe, Loader2, School, Shield, BookOpen } from 'lucide-react';

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'mn', name: 'Монгол', flag: '🇲🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

function LoginContent() {
  const t = useTranslations();
  const router = useRouter();
  const { locale } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get('callbackUrl') || `/${locale}`;

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn('google', { callbackUrl });
    } catch (err) {
      setError(t('auth.signInError'));
      setIsLoading(false);
    }
  };

  const switchLanguage = (langCode: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${langCode}`);
    window.location.href = newPath;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-oat-50 via-oat-100 to-oat-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-oat-300 border-t-oat-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-oat-50 via-oat-100 to-oat-200 flex flex-col">
      {/* Header with Language Selector */}
      <header className="p-4 flex justify-end">
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
          <Globe className="w-4 h-4 text-oat-600" />
          <div className="flex gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`px-2 py-1 rounded-lg text-sm font-medium transition-colors ${
                  locale === lang.code
                    ? 'bg-oat-200 text-oat-800'
                    : 'text-oat-600 hover:bg-oat-100'
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo & Title Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-oat-200">
            {/* School Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-oat-400 to-oat-600 rounded-2xl shadow-lg mb-4">
                <School className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-oat-800">
                {t('common.appName')}
              </h1>
              <p className="text-oat-600 mt-1">JNFIHS Platform</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="text-center p-3 bg-oat-50 rounded-xl">
                <BookOpen className="w-6 h-6 mx-auto text-oat-600 mb-1" />
                <span className="text-xs text-oat-600">{t('auth.features.learning')}</span>
              </div>
              <div className="text-center p-3 bg-oat-50 rounded-xl">
                <Globe className="w-6 h-6 mx-auto text-oat-600 mb-1" />
                <span className="text-xs text-oat-600">{t('auth.features.multilingual')}</span>
              </div>
              <div className="text-center p-3 bg-oat-50 rounded-xl">
                <Shield className="w-6 h-6 mx-auto text-oat-600 mb-1" />
                <span className="text-xs text-oat-600">{t('auth.features.secure')}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-oat-200 hover:border-oat-400 hover:bg-oat-50 rounded-xl px-4 py-3 text-oat-700 font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {/* Google Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t('auth.signInWithGoogle')}
                </>
              )}
            </button>

            {/* Help Text */}
            <p className="mt-4 text-center text-sm text-oat-500">
              {t('auth.useSchoolAccount')}
            </p>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center text-xs text-oat-500">
            <p>{t('auth.privacyNotice')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-oat-50 via-oat-100 to-oat-200 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-oat-300 border-t-oat-600" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
