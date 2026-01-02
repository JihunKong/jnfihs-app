import fs from 'fs';
import path from 'path';

// Story scene interface
export interface Choice {
  korean: string;
  correct: boolean;
  translation: {
    mn: string;
    ru: string;
    vi: string;
  };
}

export interface VocabWord {
  word: string;
  meaning: {
    mn: string;
    ru: string;
    vi: string;
  };
}

export interface StoryScene {
  story: string;
  npc_dialogue: string;
  blank_sentence: string;
  choices: Choice[];
  hint: string;
  vocabulary: VocabWord[];
  xp_reward: number;
  imageUrl?: string;
}

// Story set interface
export interface StorySet {
  id: string;
  level: number;
  title: string;
  scenes: StoryScene[];
  createdAt: string;
  playCount: number;
  averageScore: number;
}

// In-memory cache
const setsCache: Map<string, StorySet> = new Map();

// Data directory path
const DATA_DIR = path.join(process.cwd(), 'data', 'quest-sets');

// Ensure data directory exists
function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (error) {
    console.error('Failed to create data directory:', error);
  }
}

// Generate unique set ID: SET-YYYYMMDD-NNN
export function generateSetId(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');

  // Find existing sets for today to get the next number
  const todaySets = Array.from(setsCache.keys()).filter(id =>
    id.startsWith(`SET-${dateStr}`)
  );

  const nextNum = todaySets.length + 1;
  const numStr = String(nextNum).padStart(3, '0');

  return `SET-${dateStr}-${numStr}`;
}

// Save a story set
export async function saveSet(set: StorySet): Promise<void> {
  // Save to memory cache
  setsCache.set(set.id, set);

  // Save to file
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, `${set.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(set, null, 2));
    console.log(`Saved story set: ${set.id}`);
  } catch (error) {
    console.error('Failed to save set to file:', error);
    // Still keep in memory even if file save fails
  }
}

// Get a specific story set by ID
export async function getSet(id: string): Promise<StorySet | null> {
  // Check memory cache first
  if (setsCache.has(id)) {
    const set = setsCache.get(id)!;
    // Increment play count
    set.playCount++;
    await saveSet(set);
    return set;
  }

  // Try to load from file
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const set = JSON.parse(data) as StorySet;
      setsCache.set(id, set);
      set.playCount++;
      await saveSet(set);
      return set;
    }
  } catch (error) {
    console.error(`Failed to load set ${id}:`, error);
  }

  return null;
}

// Get a random story set for a specific level
export async function getRandomSet(level: number): Promise<StorySet | null> {
  // Load all sets from files if cache is empty
  if (setsCache.size === 0) {
    await loadAllSets();
  }

  // Filter by level
  const levelSets = Array.from(setsCache.values()).filter(
    set => set.level === level
  );

  if (levelSets.length === 0) {
    return null;
  }

  // Return random set
  const randomIndex = Math.floor(Math.random() * levelSets.length);
  const set = levelSets[randomIndex];

  // Increment play count
  set.playCount++;
  await saveSet(set);

  return set;
}

// List all story sets
export async function listSets(level?: number): Promise<StorySet[]> {
  // Load all sets from files if cache is empty
  if (setsCache.size === 0) {
    await loadAllSets();
  }

  let sets = Array.from(setsCache.values());

  // Filter by level if specified
  if (level !== undefined) {
    sets = sets.filter(set => set.level === level);
  }

  // Sort by play count (most popular first)
  sets.sort((a, b) => b.playCount - a.playCount);

  return sets;
}

// Load all sets from files into memory
async function loadAllSets(): Promise<void> {
  try {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR);

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(DATA_DIR, file);
          const data = fs.readFileSync(filePath, 'utf-8');
          const set = JSON.parse(data) as StorySet;
          setsCache.set(set.id, set);
        } catch (error) {
          console.error(`Failed to load set from ${file}:`, error);
        }
      }
    }

    console.log(`Loaded ${setsCache.size} story sets from files`);
  } catch (error) {
    console.error('Failed to load sets:', error);
  }
}

// Update set statistics after a game
export async function updateSetStats(
  id: string,
  correctAnswers: number,
  totalQuestions: number
): Promise<void> {
  const set = await getSet(id);
  if (set) {
    // Update average score using running average
    const newScore = (correctAnswers / totalQuestions) * 100;
    const totalPlays = set.playCount;
    set.averageScore = ((set.averageScore * (totalPlays - 1)) + newScore) / totalPlays;
    await saveSet(set);
  }
}

// Get set count
export function getSetCount(): number {
  return setsCache.size;
}

// Clear cache (for testing)
export function clearCache(): void {
  setsCache.clear();
}
