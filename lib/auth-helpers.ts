import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { UserRole } from "@/types/next-auth";

// Get authenticated user from session
export async function getAuthenticatedUser() {
  const session = await auth();
  return session?.user || null;
}

// Require authentication - throws if not authenticated
export async function requireAuth() {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new AuthError("Unauthorized - Please log in", 401);
  }
  return user;
}

// Require specific role(s) - throws if user doesn't have required role
export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new AuthError("Forbidden - Insufficient permissions", 403);
  }
  return user;
}

// Check if user has a specific role (without throwing)
export async function hasRole(allowedRoles: UserRole[]): Promise<boolean> {
  try {
    const user = await getAuthenticatedUser();
    return user ? allowedRoles.includes(user.role) : false;
  } catch {
    return false;
  }
}

// Check if user is authenticated (without throwing)
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  return !!user;
}

// Custom auth error class
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// Handle auth errors in API routes
export function handleAuthError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  // Re-throw unknown errors
  throw error;
}

// Wrapper for protected API routes
export function withAuth<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  options?: { roles?: UserRole[] }
) {
  return async (...args: Parameters<T>): Promise<NextResponse> => {
    try {
      if (options?.roles) {
        await requireRole(options.roles);
      } else {
        await requireAuth();
      }
      return handler(...args);
    } catch (error) {
      return handleAuthError(error);
    }
  };
}

// Role hierarchy helpers
export function isAdminOrTeacher(role: UserRole): boolean {
  return role === "admin" || role === "teacher";
}

export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}

export function isTeacher(role: UserRole): boolean {
  return role === "teacher";
}

export function isStudent(role: UserRole): boolean {
  return role === "student";
}

export function isParent(role: UserRole): boolean {
  return role === "parent";
}
