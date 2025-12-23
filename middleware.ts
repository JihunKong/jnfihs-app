import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const locales = ['ko', 'mn', 'ru', 'vi'];
const defaultLocale = 'ko';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(ko|mn|ru|vi)/:path*'],
};
