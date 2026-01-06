import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import type { NextAuthConfig } from "next-auth";
import type { UserRole, UserLocale } from "./types/next-auth";

// Check if OAuth is configured
const isOAuthConfigured = !!(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
);

// Initial role assignments for specific emails
const INITIAL_ROLES: Record<string, UserRole> = {
  'purusil55@gmail.com': 'teacher',
  'purusil54@gmail.com': 'admin',
};

// Create PostgreSQL pool only if DATABASE_URL is set
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

// Build providers array conditionally
const providers: NextAuthConfig["providers"] = [];

if (isOAuthConfigured) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          ...(process.env.GOOGLE_HOSTED_DOMAIN && {
            hd: process.env.GOOGLE_HOSTED_DOMAIN,
          }),
        },
      },
    })
  );
}

// Build config conditionally
const config: NextAuthConfig = {
  // Only use database adapter if pool exists
  ...(pool && { adapter: PostgresAdapter(pool) }),
  providers,
  callbacks: {
    async signIn({ user }) {
      const email = user.email || "";
      const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(",") || [];

      if (allowedDomains.length > 0) {
        const domain = email.split("@")[1];
        if (!allowedDomains.includes(domain)) {
          console.warn(`Sign-in rejected: ${email} not in allowed domains`);
          return false;
        }
      }

      // Check if user is suspended and apply initial roles
      if (pool) {
        try {
          const result = await pool.query(
            'SELECT id, status, role FROM users WHERE email = $1',
            [email]
          );

          if (result.rows.length > 0) {
            const dbUser = result.rows[0];

            // Check if suspended
            if (dbUser.status === 'suspended') {
              console.warn(`Sign-in rejected: ${email} is suspended`);
              return false;
            }

            // Apply initial role if user has predefined role and current role is student
            const initialRole = INITIAL_ROLES[email];
            if (initialRole && dbUser.role === 'student') {
              await pool.query(
                'UPDATE users SET role = $1 WHERE id = $2',
                [initialRole, dbUser.id]
              );
              console.log(`Applied initial role '${initialRole}' to ${email}`);
            }
          }
        } catch (err) {
          console.error('Error checking user status:', err);
        }
      }

      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user.role as UserRole) || "student";
        session.user.locale = (user.locale as UserLocale) || "ko";
        session.user.studentId = user.student_id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/ko/login",
    error: "/ko/login",
  },
  session: {
    // Use JWT if no database, otherwise use database sessions
    strategy: pool ? "database" : "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

// Export helper to check if auth is enabled
export const isAuthEnabled = isOAuthConfigured;
