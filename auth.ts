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
