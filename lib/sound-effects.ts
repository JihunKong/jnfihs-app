// Sound Effects System for Language Quest
// Provides audio feedback for game events using Web Audio API

// ============================================
// Types
// ============================================

export type SoundType =
  | 'correct'
  | 'wrong'
  | 'levelUp'
  | 'achievement'
  | 'streak'
  | 'click'
  | 'complete'
  | 'bonus'
  | 'countdown'
  | 'start';

export interface SoundSettings {
  enabled: boolean;
  volume: number; // 0-1
}

// ============================================
// Storage
// ============================================

const STORAGE_KEY = 'quest_sound_settings';

function getSettings(): SoundSettings {
  if (typeof window === 'undefined') {
    return { enabled: true, volume: 0.7 };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore errors
  }
  return { enabled: true, volume: 0.7 };
}

export function saveSettings(settings: SoundSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore errors
  }
}

export function toggleSound(): boolean {
  const settings = getSettings();
  settings.enabled = !settings.enabled;
  saveSettings(settings);
  return settings.enabled;
}

export function setVolume(volume: number): void {
  const settings = getSettings();
  settings.volume = Math.max(0, Math.min(1, volume));
  saveSettings(settings);
}

export function isSoundEnabled(): boolean {
  return getSettings().enabled;
}

export function getVolume(): number {
  return getSettings().volume;
}

// ============================================
// Audio Context Management
// ============================================

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      console.warn('Web Audio API not supported');
      return null;
    }
  }

  // Resume context if suspended (due to browser autoplay policies)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
}

// ============================================
// Sound Generation Functions
// ============================================

// Play a simple tone with the given frequency and duration
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 1
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const settings = getSettings();
  if (!settings.enabled) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gainNode.gain.value = settings.volume * volume;
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + duration
  );

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

// Play a sequence of tones
function playSequence(
  notes: Array<{ freq: number; dur: number; delay: number }>,
  type: OscillatorType = 'sine',
  volume: number = 1
): void {
  notes.forEach(note => {
    setTimeout(() => {
      playTone(note.freq, note.dur, type, volume);
    }, note.delay * 1000);
  });
}

// ============================================
// Sound Effect Definitions
// ============================================

export function playCorrectSound(): void {
  // Happy ascending chime
  playSequence([
    { freq: 523.25, dur: 0.1, delay: 0 },      // C5
    { freq: 659.25, dur: 0.1, delay: 0.08 },   // E5
    { freq: 783.99, dur: 0.15, delay: 0.16 }   // G5
  ], 'sine', 0.6);
}

export function playWrongSound(): void {
  // Low buzz
  playSequence([
    { freq: 200, dur: 0.15, delay: 0 },
    { freq: 180, dur: 0.2, delay: 0.1 }
  ], 'square', 0.3);
}

export function playLevelUpSound(): void {
  // Triumphant fanfare
  playSequence([
    { freq: 523.25, dur: 0.1, delay: 0 },      // C5
    { freq: 659.25, dur: 0.1, delay: 0.1 },    // E5
    { freq: 783.99, dur: 0.1, delay: 0.2 },    // G5
    { freq: 1046.50, dur: 0.3, delay: 0.3 }    // C6
  ], 'sine', 0.7);
}

export function playAchievementSound(): void {
  // Magical sparkle
  playSequence([
    { freq: 880, dur: 0.1, delay: 0 },         // A5
    { freq: 1108.73, dur: 0.1, delay: 0.05 },  // C#6
    { freq: 1318.51, dur: 0.1, delay: 0.1 },   // E6
    { freq: 1760, dur: 0.3, delay: 0.15 }      // A6
  ], 'sine', 0.5);
}

export function playStreakSound(): void {
  // Fire crackle (quick ascending)
  playSequence([
    { freq: 440, dur: 0.05, delay: 0 },
    { freq: 554.37, dur: 0.05, delay: 0.03 },
    { freq: 659.25, dur: 0.05, delay: 0.06 },
    { freq: 880, dur: 0.1, delay: 0.09 }
  ], 'triangle', 0.4);
}

export function playClickSound(): void {
  // Soft click
  playTone(800, 0.05, 'sine', 0.3);
}

export function playCompleteSound(): void {
  // Victory melody
  playSequence([
    { freq: 523.25, dur: 0.15, delay: 0 },     // C5
    { freq: 587.33, dur: 0.15, delay: 0.15 },  // D5
    { freq: 659.25, dur: 0.15, delay: 0.3 },   // E5
    { freq: 783.99, dur: 0.15, delay: 0.45 },  // G5
    { freq: 1046.50, dur: 0.4, delay: 0.6 }    // C6
  ], 'sine', 0.7);
}

export function playBonusSound(): void {
  // Coin collect
  playSequence([
    { freq: 987.77, dur: 0.08, delay: 0 },     // B5
    { freq: 1318.51, dur: 0.15, delay: 0.06 }  // E6
  ], 'square', 0.3);
}

export function playCountdownSound(): void {
  // Tick
  playTone(600, 0.05, 'sine', 0.5);
}

export function playStartSound(): void {
  // Go!
  playSequence([
    { freq: 440, dur: 0.08, delay: 0 },
    { freq: 554.37, dur: 0.08, delay: 0.08 },
    { freq: 659.25, dur: 0.15, delay: 0.16 }
  ], 'triangle', 0.5);
}

// ============================================
// Main Play Function
// ============================================

export function playSound(type: SoundType): void {
  switch (type) {
    case 'correct':
      playCorrectSound();
      break;
    case 'wrong':
      playWrongSound();
      break;
    case 'levelUp':
      playLevelUpSound();
      break;
    case 'achievement':
      playAchievementSound();
      break;
    case 'streak':
      playStreakSound();
      break;
    case 'click':
      playClickSound();
      break;
    case 'complete':
      playCompleteSound();
      break;
    case 'bonus':
      playBonusSound();
      break;
    case 'countdown':
      playCountdownSound();
      break;
    case 'start':
      playStartSound();
      break;
  }
}

// ============================================
// Haptic Feedback (for mobile devices)
// ============================================

export function vibrate(pattern: number | number[] = 50): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore errors
    }
  }
}

export function vibrateCorrect(): void {
  vibrate([30, 50, 30]);
}

export function vibrateWrong(): void {
  vibrate([100, 50, 100]);
}

export function vibrateClick(): void {
  vibrate(10);
}
