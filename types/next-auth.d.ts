import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

export type UserRole = "student" | "teacher" | "admin" | "parent";
export type UserLocale = "ko" | "mn" | "ru" | "vi";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      locale: UserLocale;
      studentId?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: UserRole;
    locale: UserLocale;
    student_id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    locale: UserLocale;
    studentId?: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: UserRole;
    locale: UserLocale;
    student_id?: string;
  }
}
