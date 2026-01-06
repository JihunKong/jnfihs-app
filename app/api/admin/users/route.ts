import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Pool } from 'pg';

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

// GET: List all users (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    if (!pool) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const result = await pool.query(`
      SELECT
        id, name, email, role, status, locale, student_id,
        created_at, updated_at, image
      FROM users
      WHERE status != 'deleted'
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      users: result.rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        status: row.status || 'active',
        locale: row.locale,
        studentId: row.student_id,
        image: row.image,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
