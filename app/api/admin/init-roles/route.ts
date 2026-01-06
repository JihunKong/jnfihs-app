import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

// Initial role assignments
const INITIAL_ROLES: Record<string, string> = {
  'purusil55@gmail.com': 'teacher',
  'purusil54@gmail.com': 'admin',
};

// POST: Initialize roles for predefined users
// This endpoint can be called once to set up initial admin/teacher roles
export async function POST(req: NextRequest) {
  try {
    // Check for secret key to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.ADMIN_INIT_SECRET || process.env.NEXTAUTH_SECRET;

    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!pool) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const results: { email: string; role: string; updated: boolean }[] = [];

    for (const [email, role] of Object.entries(INITIAL_ROLES)) {
      try {
        // Update existing user's role, or do nothing if user doesn't exist yet
        const result = await pool.query(
          `UPDATE users SET role = $1, updated_at = NOW() WHERE email = $2 RETURNING email`,
          [role, email]
        );

        results.push({
          email,
          role,
          updated: result.rowCount !== null && result.rowCount > 0,
        });
      } catch (err) {
        console.error(`Failed to update role for ${email}:`, err);
        results.push({ email, role, updated: false });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Initial roles processed',
      results,
    });
  } catch (error) {
    console.error('Failed to initialize roles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Check current role assignments
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.ADMIN_INIT_SECRET || process.env.NEXTAUTH_SECRET;

    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!pool) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const emails = Object.keys(INITIAL_ROLES);
    const result = await pool.query(
      `SELECT email, role, status FROM users WHERE email = ANY($1)`,
      [emails]
    );

    const currentRoles: Record<string, { role: string; status: string } | null> = {};

    for (const email of emails) {
      const user = result.rows.find(r => r.email === email);
      currentRoles[email] = user
        ? { role: user.role, status: user.status }
        : null;
    }

    return NextResponse.json({
      expectedRoles: INITIAL_ROLES,
      currentRoles,
    });
  } catch (error) {
    console.error('Failed to check roles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
