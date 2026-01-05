import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import type { UserRole, UserLocale } from "./types/next-auth";

// Create PostgreSQL pool for NextAuth adapter
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    'postgresql://jnfihs:jnfihs123@localhost:5432/jnfihs',
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // Optionally restrict to school domain
          ...(process.env.GOOGLE_HOSTED_DOMAIN && {
            hd: process.env.GOOGLE_HOSTED_DOMAIN,
          }),
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Optional: Restrict to allowed email domains
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
      // Add custom fields to session
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user.role as UserRole) || "student";
        session.user.locale = (user.locale as UserLocale) || "ko";
        session.user.studentId = user.student_id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirect after sign-in/sign-out
      // If the url starts with baseUrl, allow it
      if (url.startsWith(baseUrl)) return url;
      // If it's a relative url, prepend baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Default to baseUrl
      return baseUrl;
    },
  },
  pages: {
    signIn: "/ko/login", // Default login page (locale will be adjusted by middleware)
    error: "/ko/login", // Redirect errors to login
  },
  session: {
    strategy: "database", // Use database sessions for better security
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
});
