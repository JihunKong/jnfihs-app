import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

type HealthCheck = {
  id: number;
  student_id: string;
  temperature: number;
  symptoms: string[];
  feeling: 'good' | 'okay' | 'bad';
  notes: string;
  check_date: string;
  created_at: string;
};

// In-memory store
const healthChecks: HealthCheck[] = [];
let nextId = 1;

// GET: Fetch health checks
export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get('studentId');
  const date = req.nextUrl.searchParams.get('date');

  try {
    if (date) {
      // Get specific date check
      const checks = await query<HealthCheck>(
        `SELECT * FROM health_checks WHERE student_id = $1 AND check_date = $2`,
        [studentId, date]
      );
      return NextResponse.json({ check: checks[0] || null });
    } else {
      // Get recent checks
      const checks = await query<HealthCheck>(
        `SELECT * FROM health_checks WHERE student_id = $1 ORDER BY check_date DESC LIMIT 7`,
        [studentId]
      );
      return NextResponse.json({ checks });
    }
  } catch {
    // Fallback to in-memory
    if (date) {
      const check = healthChecks.find(
        (c) => c.student_id === studentId && c.check_date === date
      );
      return NextResponse.json({ check: check || null });
    } else {
      const filtered = healthChecks
        .filter((c) => c.student_id === studentId)
        .slice(0, 7);
      return NextResponse.json({ checks: filtered });
    }
  }
}

// POST: Submit health check
export async function POST(req: NextRequest) {
  try {
    const { studentId, temperature, symptoms, feeling, notes } = await req.json();

    if (!studentId || temperature === undefined || !feeling) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    try {
      // Check if already submitted today
      const existing = await query<HealthCheck>(
        `SELECT * FROM health_checks WHERE student_id = $1 AND check_date = $2`,
        [studentId, today]
      );

      if (existing.length > 0) {
        // Update existing
        const result = await query<HealthCheck>(
          `UPDATE health_checks
           SET temperature = $2, symptoms = $3, feeling = $4, notes = $5
           WHERE student_id = $1 AND check_date = $6
           RETURNING *`,
          [studentId, temperature, JSON.stringify(symptoms || []), feeling, notes || '', today]
        );
        return NextResponse.json({ check: result[0] });
      } else {
        // Insert new
        const result = await query<HealthCheck>(
          `INSERT INTO health_checks (student_id, temperature, symptoms, feeling, notes, check_date)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [studentId, temperature, JSON.stringify(symptoms || []), feeling, notes || '', today]
        );
        return NextResponse.json({ check: result[0] });
      }
    } catch {
      // Fallback to in-memory
      const existingIndex = healthChecks.findIndex(
        (c) => c.student_id === studentId && c.check_date === today
      );

      const newCheck: HealthCheck = {
        id: existingIndex > -1 ? healthChecks[existingIndex].id : nextId++,
        student_id: studentId,
        temperature,
        symptoms: symptoms || [],
        feeling,
        notes: notes || '',
        check_date: today,
        created_at: new Date().toISOString(),
      };

      if (existingIndex > -1) {
        healthChecks[existingIndex] = newCheck;
      } else {
        healthChecks.unshift(newCheck);
      }

      return NextResponse.json({ check: newCheck });
    }
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { error: 'Failed to submit health check' },
      { status: 500 }
    );
  }
}
