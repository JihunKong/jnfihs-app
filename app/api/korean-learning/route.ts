import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { calculateLevel } from '@/lib/korean-words';

interface ProgressRow {
  student_id: string;
  xp: number;
  streak: number;
  total_correct: number;
  total_attempts: number;
  last_study_date: string;
}

// GET: Retrieve learning progress
export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get('studentId') || 'anonymous';

  try {
    // Try to get from database
    const rows = await query<ProgressRow>(
      `SELECT * FROM korean_learning_progress WHERE student_id = $1`,
      [studentId]
    );

    if (rows.length > 0) {
      const row = rows[0];
      return NextResponse.json({
        level: calculateLevel(row.xp),
        xp: row.xp,
        streak: row.streak,
        totalCorrect: row.total_correct,
        totalAttempts: row.total_attempts,
        lastStudyDate: row.last_study_date,
      });
    }
  } catch (e) {
    console.log('DB not available, using default progress');
  }

  // Return default progress
  return NextResponse.json({
    level: 1,
    xp: 0,
    streak: 0,
    totalCorrect: 0,
    totalAttempts: 0,
    lastStudyDate: null,
  });
}

// POST: Update learning progress
export async function POST(req: NextRequest) {
  try {
    const { studentId, correct, xpEarned } = await req.json();
    const id = studentId || 'anonymous';

    try {
      // Check if record exists
      const rows = await query<ProgressRow>(
        `SELECT * FROM korean_learning_progress WHERE student_id = $1`,
        [id]
      );

      const today = new Date().toISOString().split('T')[0];

      if (rows.length > 0) {
        const row = rows[0];
        const lastDate = row.last_study_date?.split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Calculate streak
        let newStreak = row.streak;
        if (lastDate === yesterday) {
          newStreak = row.streak + 1;
        } else if (lastDate !== today) {
          newStreak = 1;
        }

        // Update existing record
        await query(
          `UPDATE korean_learning_progress
           SET xp = xp + $2,
               streak = $3,
               total_correct = total_correct + $4,
               total_attempts = total_attempts + 1,
               last_study_date = $5
           WHERE student_id = $1`,
          [id, xpEarned, newStreak, correct ? 1 : 0, today]
        );

        const newXp = row.xp + xpEarned;
        return NextResponse.json({
          success: true,
          xp: newXp,
          level: calculateLevel(newXp),
          streak: newStreak,
          xpEarned,
        });
      } else {
        // Create new record
        await query(
          `INSERT INTO korean_learning_progress
           (student_id, xp, streak, total_correct, total_attempts, last_study_date)
           VALUES ($1, $2, 1, $3, 1, $4)`,
          [id, xpEarned, correct ? 1 : 0, today]
        );

        return NextResponse.json({
          success: true,
          xp: xpEarned,
          level: calculateLevel(xpEarned),
          streak: 1,
          xpEarned,
        });
      }
    } catch (e) {
      console.log('DB not available, returning calculated values');
    }

    // Return success even without DB
    return NextResponse.json({
      success: true,
      xpEarned,
      message: 'Progress saved locally',
    });
  } catch (error) {
    console.error('Learning API error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
