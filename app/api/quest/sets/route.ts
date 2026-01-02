import { NextRequest, NextResponse } from 'next/server';
import {
  listSets,
  getSet,
  getRandomSet,
  updateSetStats,
  getSetCount,
} from '@/lib/quest-storage';

// GET: List all story sets or get a specific set
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const setId = searchParams.get('id');
    const level = searchParams.get('level');
    const random = searchParams.get('random');

    // Get specific set by ID
    if (setId) {
      const set = await getSet(setId);
      if (set) {
        return NextResponse.json({ set });
      }
      return NextResponse.json({ error: 'Set not found' }, { status: 404 });
    }

    // Get random set for a level
    if (random && level) {
      const randomSet = await getRandomSet(parseInt(level));
      if (randomSet) {
        return NextResponse.json({ set: randomSet });
      }
      return NextResponse.json({ error: 'No sets available for this level' }, { status: 404 });
    }

    // List all sets
    const sets = await listSets(level ? parseInt(level) : undefined);

    // Return summary info (without full scene data)
    const setsSummary = sets.map(set => ({
      id: set.id,
      level: set.level,
      title: set.title,
      sceneCount: set.scenes.length,
      createdAt: set.createdAt,
      playCount: set.playCount,
      averageScore: set.averageScore,
    }));

    return NextResponse.json({
      sets: setsSummary,
      totalCount: getSetCount(),
    });

  } catch (error) {
    console.error('Quest sets API error:', error);
    return NextResponse.json({ error: 'Failed to fetch sets' }, { status: 500 });
  }
}

// POST: Update set statistics after a game
export async function POST(req: NextRequest) {
  try {
    const { setId, correctAnswers, totalQuestions } = await req.json();

    if (!setId || correctAnswers === undefined || !totalQuestions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await updateSetStats(setId, correctAnswers, totalQuestions);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Quest sets update error:', error);
    return NextResponse.json({ error: 'Failed to update set stats' }, { status: 500 });
  }
}
