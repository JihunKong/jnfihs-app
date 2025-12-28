'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Scroll,
  Sword,
  Wand2,
  MapPin,
  Star,
  Flame,
  Sparkles,
  Lightbulb,
  BookOpen,
  Volume2,
  CheckCircle,
  XCircle,
  Trophy
} from 'lucide-react';
import Link from 'next/link';

type GameState = 'menu' | 'loading' | 'playing' | 'feedback' | 'result' | 'levelup';
type LoadingStep = 'story' | 'image' | 'preparing';

interface Choice {
  korean: string;
  correct: boolean;
  translation: {
    mn: string;
    ru: string;
    vi: string;
  };
}

interface VocabWord {
  word: string;
  meaning: {
    mn: string;
    ru: string;
    vi: string;
  };
}

interface StoryScene {
  story: string;
  npc_dialogue: string;
  blank_sentence: string;
  choices: Choice[];
  hint: string;
  vocabulary: VocabWord[];
  xp_reward: number;
  imageUrl?: string;
}

// Level thresholds and names
const levelThresholds = [
  { level: 1, xp: 0, name: { ko: '견습 모험가', mn: 'Дадлагажигч', ru: 'Ученик', vi: 'Tập sự' } },
  { level: 2, xp: 100, name: { ko: '숙련 모험가', mn: 'Туршлагатай', ru: 'Опытный', vi: 'Thành thạo' } },
  { level: 3, xp: 300, name: { ko: '영웅', mn: 'Баатар', ru: 'Герой', vi: 'Anh hùng' } },
  { level: 4, xp: 600, name: { ko: '전설', mn: 'Домог', ru: 'Легенда', vi: 'Huyền thoại' } },
  { level: 5, xp: 1000, name: { ko: '신화', mn: 'Үлгэр', ru: 'Миф', vi: 'Thần thoại' } },
];

function calculateLevel(xp: number): number {
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (xp >= levelThresholds[i].xp) {
      return levelThresholds[i].level;
    }
  }
  return 1;
}

function getXpToNextLevel(xp: number): { current: number; needed: number } {
  const currentLevel = calculateLevel(xp);
  const nextThreshold = levelThresholds.find(t => t.level === currentLevel + 1);
  const currentThreshold = levelThresholds.find(t => t.level === currentLevel);

  if (!nextThreshold) {
    return { current: xp - (currentThreshold?.xp || 0), needed: 500 };
  }

  return {
    current: xp - (currentThreshold?.xp || 0),
    needed: nextThreshold.xp - (currentThreshold?.xp || 0)
  };
}

export default function QuestPage() {
  const { locale } = useParams();
  const t = useTranslations('quest');

  // Progress state
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [storyHistory, setStoryHistory] = useState<string[]>([]);

  // Game state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Loading progress state
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>('story');

  const ROUNDS_PER_SESSION = 5;

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('questProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setXp(progress.xp || 0);
      setStreak(progress.streak || 0);
      setLevel(calculateLevel(progress.xp || 0));
      setStoryHistory(progress.history || []);
    }
  }, []);

  // Loading progress simulation
  useEffect(() => {
    if (gameState !== 'loading') {
      return;
    }

    setLoadingProgress(0);
    setLoadingStep('story');

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        // Story generation phase: 0-30%
        if (prev < 30) {
          setLoadingStep('story');
          return prev + 1.5;
        }
        // Image generation phase: 30-70%
        if (prev < 70) {
          setLoadingStep('image');
          return prev + 0.8;
        }
        // Preparing phase: 70-95%
        if (prev < 95) {
          setLoadingStep('preparing');
          return prev + 0.3;
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState]);

  // Save progress
  const saveProgress = useCallback((newXp: number, newStreak: number, newHistory: string[]) => {
    const progress = {
      xp: newXp,
      streak: newStreak,
      history: newHistory.slice(-10), // Keep last 10 story events
      lastPlay: new Date().toISOString()
    };
    localStorage.setItem('questProgress', JSON.stringify(progress));
  }, []);

  // Fetch a new story scene from the API
  const fetchStoryScene = async (previousChoice?: string): Promise<StoryScene | null> => {
    try {
      setError(null);
      const response = await fetch('/api/quest/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          previousStory: storyHistory.slice(-3).join('\n'),
          playerChoice: previousChoice || null,
          locale
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      return data.scene;
    } catch (err) {
      console.error('Story generation error:', err);
      setError(t('errorGenerating'));
      return null;
    }
  };

  // Start a new game session
  const startGame = async () => {
    setGameState('loading');
    setRoundsPlayed(0);
    setCorrectCount(0);
    setPreviousLevel(level);
    setShowHint(false);

    const scene = await fetchStoryScene();
    if (scene) {
      setCurrentScene(scene);
      setGameState('playing');
    } else {
      setGameState('menu');
    }
  };

  // Handle player choice
  const handleChoice = async (choice: Choice) => {
    if (gameState !== 'playing') return;

    setSelectedChoice(choice);
    setGameState('feedback');

    if (choice.correct) {
      setCorrectCount(prev => prev + 1);
    }

    // Update story history
    const newHistory = [...storyHistory, currentScene?.story || '', choice.korean];
    setStoryHistory(newHistory);

    // Wait for feedback animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newRoundsPlayed = roundsPlayed + 1;
    setRoundsPlayed(newRoundsPlayed);

    // Check if session is complete
    if (newRoundsPlayed >= ROUNDS_PER_SESSION) {
      // Calculate rewards
      const earnedXp = correctCount * 10 + (choice.correct ? 10 : 0);
      const newXp = xp + earnedXp;
      const newLevel = calculateLevel(newXp);
      const newStreak = streak + 1;

      setXp(newXp);
      setStreak(newStreak);
      setLevel(newLevel);
      saveProgress(newXp, newStreak, newHistory);

      // Check for level up
      if (newLevel > previousLevel) {
        setGameState('levelup');
      } else {
        setGameState('result');
      }
    } else {
      // Continue to next scene
      setGameState('loading');
      setShowHint(false);

      const scene = await fetchStoryScene(choice.korean);
      if (scene) {
        setCurrentScene(scene);
        setSelectedChoice(null);
        setGameState('playing');
      } else {
        setGameState('result');
      }
    }
  };

  // Speak Korean text
  const speakKorean = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Get translation for current locale
  const getTranslation = (translations: { mn: string; ru: string; vi: string }) => {
    return translations[locale as keyof typeof translations] || translations.mn;
  };

  // XP progress
  const xpProgress = getXpToNextLevel(xp);
  const progressPercent = (xpProgress.current / xpProgress.needed) * 100;

  // Get level name
  const getLevelName = () => {
    const threshold = levelThresholds.find(t => t.level === level);
    return threshold?.name[locale as keyof typeof threshold.name] || threshold?.name.ko;
  };

  // Get difficulty icon
  const getDifficultyIcon = () => {
    if (level === 1) return <Sword className="w-5 h-5" />;
    if (level === 2) return <Scroll className="w-5 h-5" />;
    return <Wand2 className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${locale}`} className="p-2 hover:bg-purple-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-purple-700" />
          </Link>
          <h1 className="text-lg font-bold text-purple-800">{t('title')}</h1>
          <div className="flex items-center gap-2 text-purple-600">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold">{streak}</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Progress Card */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 mb-6 shadow-sm border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                {getDifficultyIcon()}
              </div>
              <div>
                <p className="text-sm text-purple-600">{t('level')} {level}</p>
                <p className="font-bold text-purple-800">{getLevelName()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-800">{xp}</p>
              <p className="text-xs text-purple-500">XP</p>
            </div>
          </div>
          <div className="h-3 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-purple-500 mt-1 text-right">
            {xpProgress.current} / {xpProgress.needed} XP
          </p>
        </div>

        {/* Menu State */}
        {gameState === 'menu' && (
          <div className="space-y-4">
            {/* Start Button */}
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-center gap-3">
                <MapPin className="w-8 h-8" />
                <div className="text-left">
                  <p className="text-xl font-bold">{t('startQuest')}</p>
                  <p className="text-sm opacity-90">{t('questDescription')}</p>
                </div>
              </div>
            </button>

            {/* Difficulty Info */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`bg-white/80 backdrop-blur rounded-xl p-4 border text-center ${level === 1 ? 'border-purple-400 ring-2 ring-purple-200' : 'border-purple-200'}`}>
                <Sword className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-semibold text-purple-800">{t('difficultyBasic')}</p>
                <p className="text-xs text-purple-500">{t('words')}</p>
              </div>
              <div className={`bg-white/80 backdrop-blur rounded-xl p-4 border text-center ${level === 2 ? 'border-purple-400 ring-2 ring-purple-200' : 'border-purple-200'}`}>
                <Scroll className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-semibold text-purple-800">{t('difficultySentence')}</p>
                <p className="text-xs text-purple-500">{t('sentences')}</p>
              </div>
              <div className={`bg-white/80 backdrop-blur rounded-xl p-4 border text-center ${level >= 3 ? 'border-purple-400 ring-2 ring-purple-200' : 'border-purple-200 opacity-50'}`}>
                <Wand2 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-semibold text-purple-800">{t('difficultyAdvanced')}</p>
                <p className="text-xs text-purple-500">{t('magic')}</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-4 text-center">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Loading State with Progress Bar */}
        {gameState === 'loading' && (
          <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-lg border border-purple-200">
            {/* Castle Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center animate-pulse">
                <MapPin className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-purple-800 text-center mb-6">
              {t('preparingAdventure')}
            </h2>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-4 bg-purple-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600 rounded-full transition-all duration-300 relative"
                  style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </div>
              </div>
              <p className="text-right text-sm text-purple-600 mt-1 font-bold">
                {Math.round(loadingProgress)}%
              </p>
            </div>

            {/* Loading Step */}
            <div className="flex items-center justify-center gap-2 text-purple-600">
              {loadingStep === 'story' && (
                <>
                  <Scroll className="w-5 h-5 animate-bounce" />
                  <span>{t('loadingStory')}</span>
                </>
              )}
              {loadingStep === 'image' && (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>{t('loadingImage')}</span>
                </>
              )}
              {loadingStep === 'preparing' && (
                <>
                  <Sword className="w-5 h-5 animate-pulse" />
                  <span>{t('loadingPreparing')}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Playing State */}
        {(gameState === 'playing' || gameState === 'feedback') && currentScene && (
          <div className="space-y-4">
            {/* Progress Dots */}
            <div className="flex gap-1 justify-center mb-4">
              {Array.from({ length: ROUNDS_PER_SESSION }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < roundsPlayed
                      ? 'bg-purple-500'
                      : i === roundsPlayed
                      ? 'bg-purple-300'
                      : 'bg-purple-200'
                  }`}
                />
              ))}
            </div>

            {/* Scene Image */}
            {currentScene.imageUrl && (
              <div className="bg-white/90 backdrop-blur rounded-2xl p-2 shadow-lg border border-purple-200 overflow-hidden">
                <img
                  src={currentScene.imageUrl}
                  alt="Scene illustration"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Story Card */}
            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg border border-purple-200">
              {/* Story Text */}
              <div className="mb-4">
                <p className="text-purple-800 leading-relaxed mb-3">{currentScene.story}</p>
                {currentScene.npc_dialogue && (
                  <div className="bg-purple-50 rounded-xl p-3 border-l-4 border-purple-400">
                    <p className="text-purple-700 italic">"{currentScene.npc_dialogue}"</p>
                  </div>
                )}
              </div>

              {/* Blank Sentence */}
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-purple-600 font-semibold">{t('fillBlank')}</span>
                  <button
                    onClick={() => speakKorean(currentScene.blank_sentence.replace('(___)', ''))}
                    className="p-1 hover:bg-purple-200 rounded-full"
                  >
                    <Volume2 className="w-4 h-4 text-purple-600" />
                  </button>
                </div>
                <p className="text-lg font-bold text-purple-900 text-center">
                  {currentScene.blank_sentence}
                </p>
              </div>

              {/* Choices */}
              <div className="space-y-2">
                {currentScene.choices.map((choice, idx) => {
                  const isSelected = selectedChoice?.korean === choice.korean;
                  const showResult = gameState === 'feedback';

                  let buttonClass = 'bg-white border-purple-200 text-purple-800 hover:bg-purple-50';
                  if (showResult) {
                    if (choice.correct) {
                      buttonClass = 'bg-green-100 border-green-500 text-green-800';
                    } else if (isSelected && !choice.correct) {
                      buttonClass = 'bg-red-100 border-red-500 text-red-800';
                    } else {
                      buttonClass = 'bg-gray-100 border-gray-300 text-gray-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleChoice(choice)}
                      disabled={gameState === 'feedback'}
                      className={`w-full p-4 rounded-xl border-2 font-bold text-left transition-all flex items-center justify-between ${buttonClass}`}
                    >
                      <div>
                        <span className="text-lg">{choice.korean}</span>
                        {showResult && (
                          <p className="text-sm font-normal mt-1 opacity-80">
                            {getTranslation(choice.translation)}
                          </p>
                        )}
                      </div>
                      {showResult && choice.correct && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                      {showResult && isSelected && !choice.correct && (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hint Section */}
            {gameState === 'playing' && (
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-purple-200">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-purple-600 font-semibold w-full"
                >
                  <Lightbulb className="w-5 h-5" />
                  <span>{t('hint')}</span>
                </button>
                {showHint && (
                  <p className="mt-2 text-purple-700 text-sm">{currentScene.hint}</p>
                )}
              </div>
            )}

            {/* Vocabulary */}
            {currentScene.vocabulary.length > 0 && (
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 text-purple-600 font-semibold mb-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{t('vocabulary')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentScene.vocabulary.map((vocab, idx) => (
                    <button
                      key={idx}
                      onClick={() => speakKorean(vocab.word)}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      <span className="font-bold">{vocab.word}</span>
                      <span className="text-purple-600">({getTranslation(vocab.meaning)})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result State */}
        {gameState === 'result' && (
          <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-lg border border-purple-200 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-purple-800 mb-2">{t('questComplete')}</h2>
            <p className="text-purple-600 mb-6">
              {t('score')}: {correctCount} / {ROUNDS_PER_SESSION}
            </p>

            <div className="bg-purple-50 rounded-xl p-4 mb-6">
              <p className="text-purple-600">{t('xpEarned')}</p>
              <p className="text-3xl font-bold text-purple-600">+{correctCount * 10} XP</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl py-3 font-bold hover:shadow-lg transition-all"
              >
                {t('playAgain')}
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="w-full bg-purple-100 text-purple-700 rounded-xl py-3 font-bold hover:bg-purple-200 transition-all"
              >
                {t('backToMenu')}
              </button>
            </div>
          </div>
        )}

        {/* Level Up State */}
        {gameState === 'levelup' && (
          <div className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl p-8 shadow-lg text-center text-white">
            <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur rounded-full flex items-center justify-center animate-bounce">
              <Star className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">{t('levelUp')}</h2>
            <p className="text-xl mb-6">{t('level')} {level}!</p>
            <p className="text-white/90 mb-6">{getLevelName()}</p>

            <button
              onClick={() => setGameState('result')}
              className="w-full bg-white text-purple-600 rounded-xl py-3 font-bold hover:bg-purple-50 transition-all"
            >
              {t('continue')}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
