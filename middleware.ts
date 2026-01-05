import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Check if OAuth is configured at build time
const isOAuthConfigured = !!(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
);

// Routes that require authentication (only enforced if OAuth is configured)
const protectedRoutes = [
  '/leave',
  '/messenger',
  '/booking',
  '/translation/listen',
];

// Routes restricted by role
const roleRestrictedRoutes: Record<string, string[]> = {
  '/translation/broadcast': ['teacher', 'admin'],
  '/admin': ['admin'],
};

// Public routes (no auth required)
const publicRoutes = [
  '/login',
  '/meals',
  '/announcements',
  '/parent-portal',
  '/emergency-cards',
  '/health-pointer',
  '/phrases',
  '/chat',
  '/health',
  '/korean-learning',
  '/quest',
];

// Create intl middleware
const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Skip other API routes (they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/sounds') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Extract locale from path
  const localeMatch = pathname.match(/^\/(ko|mn|ru|vi)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : 'ko';
  const pathWithoutLocale = localeMatch
    ? pathname.replace(`/${locale}`, '') || '/'
    : pathname;

  // If OAuth is not configured, skip all auth checks
  if (!isOAuthConfigured) {
    return intlMiddleware(request);
  }

  // Check if route is public
  const isPublicRoute =
    pathWithoutLocale === '/' ||
    publicRoutes.some((route) => pathWithoutLocale.startsWith(route));

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Get session for protected routes
  if (isProtectedRoute && !isPublicRoute) {
    try {
      // Dynamically import auth to avoid issues when OAuth is not configured
      const { auth } = await import('./auth');
      const session = await auth();

      // Redirect to login if not authenticated
      if (!session) {
        const loginUrl = new URL(`/${locale}/login`, request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check role-restricted routes
      for (const [route, allowedRoles] of Object.entries(roleRestrictedRoutes)) {
        if (pathWithoutLocale.startsWith(route)) {
          if (!allowedRoles.includes(session.user.role)) {
            return NextResponse.redirect(new URL(`/${locale}`, request.url));
          }
        }
      }
    } catch (error) {
      // If auth check fails, allow the request to continue
      console.error('Auth check failed:', error);
      // Don't block the user, let them see the page
    }
  }

  // Apply intl middleware for locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(ko|mn|ru|vi)/:path*',
    '/((?!api|_next|images|sounds|favicon.ico).*)',
  ],
};
