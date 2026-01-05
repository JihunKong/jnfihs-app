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
  Trophy,
  Zap,
  RefreshCw,
  List,
  Lock,
  Castle,
  Building2,
  Columns,
  Sun,
  Cherry,
  Rocket,
  Users,
  BookOpenCheck,
  Clock,
  Shirt,
  ShoppingCart,
  Bus,
  Map,
  Briefcase,
  Gamepad2,
  Smartphone,
  Cloud,
  Heart,
  Stethoscope,
  MessageCircle,
  Quote,
} from 'lucide-react';
import Link from 'next/link';
import {
  THEMES,
  TOPICS,
  ThemeConfig,
  TopicConfig,
  getTheme,
  getTopic,
  getUnlockedTopics,
  isTopicUnlocked,
} from '@/lib/quest-config';
import {
  TOPIK_LEVELS,
  TOPIK1_UNITS,
  getUnitsForLevel,
  getUnit,
  LocalizedText,
} from '@/lib/korean-curriculum';
import { getTotalVocabularyCount } from '@/lib/korean-vocabulary';

type GameState = 'menu' | 'curriculum' | 'selectTheme' | 'selectTopic' | 'loading' | 'playing' | 'feedback' | 'result' | 'levelup' | 'selectSet';
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

interface StorySet {
  id: string;
  level: number;
  theme: string;
  topic: string;
  title: string;
  scenes: StoryScene[];
  createdAt: string;
  playCount: number;
  averageScore: number;
}

interface SetSummary {
  id: string;
  level: number;
  theme: string;
  topic: string;
  title: string;
  sceneCount: number;
  createdAt: string;
  playCount: number;
  averageScore: number;
}

// Level thresholds and names
const levelThresholds = [
  { level: 1, xp: 0, name: { ko: '견습 모험가', mn: 'Дадлагажигч', ru: 'Ученик', vi: 'Tập sự' } },
  { level: 2, xp: 100, name: { ko: '숙련 모험가', mn: 'Туршлагатай', ru: 'Опытный', vi: 'Thành thạo' } },
  { level: 3, xp: 300, name: { ko: '영웅', mn: 'Баатар', ru: 'Герой', vi: 'Anh hùng' } },
  { level: 4, xp: 600, name: { ko: '전설', mn: 'Домог', ru: 'Легенда', vi: 'Huyền thoại' } },
  { level: 5, xp: 1000, name: { ko: '신화', mn: 'Үлгэр', ru: 'Миф', vi: 'Thần thoại' } },
];

// Theme icons mapping
const themeIcons: Record<string, React.ReactNode> = {
  medieval: <Castle className="w-8 h-8" />,
  modern: <Building2 className="w-8 h-8" />,
  ancient: <Columns className="w-8 h-8" />,
  primitive: <Flame className="w-8 h-8" />,
  western: <Sun className="w-8 h-8" />,
  eastern: <Cherry className="w-8 h-8" />,
  space: <Rocket className="w-8 h-8" />,
};

// Topic icons mapping
const topicIcons: Record<string, React.ReactNode> = {
  greetings: <MessageCircle className="w-5 h-5" />,
  numbers: <BookOpenCheck className="w-5 h-5" />,
  colors: <Sparkles className="w-5 h-5" />,
  family: <Users className="w-5 h-5" />,
  food: <Star className="w-5 h-5" />,
  school: <BookOpen className="w-5 h-5" />,
  time: <Clock className="w-5 h-5" />,
  clothes: <Shirt className="w-5 h-5" />,
  body: <Heart className="w-5 h-5" />,
  shopping: <ShoppingCart className="w-5 h-5" />,
  transport: <Bus className="w-5 h-5" />,
  directions: <Map className="w-5 h-5" />,
  jobs: <Briefcase className="w-5 h-5" />,
  hobbies: <Gamepad2 className="w-5 h-5" />,
  technology: <Smartphone className="w-5 h-5" />,
  weather: <Cloud className="w-5 h-5" />,
  emotions: <Heart className="w-5 h-5" />,
  health: <Stethoscope className="w-5 h-5" />,
  expressions: <MessageCircle className="w-5 h-5" />,
  idioms: <Quote className="w-5 h-5" />,
};

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
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  // Theme and Topic selection
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Game state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [storySet, setStorySet] = useState<StorySet | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // XP animation state
  const [xpGain, setXpGain] = useState<number | null>(null);
  const [showStreakBonus, setShowStreakBonus] = useState(false);

  // Loading progress state
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>('story');
  const [loadingMessage, setLoadingMessage] = useState('');

  // Existing sets for selection
  const [availableSets, setAvailableSets] = useState<SetSummary[]>([]);

  // TOPIK Curriculum state
  const [selectedTopikLevel, setSelectedTopikLevel] = useState<number>(1);
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);

  const TOTAL_SCENES = 10;

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('questProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setXp(progress.xp || 0);
      setStreak(progress.streak || 0);
      setLevel(calculateLevel(progress.xp || 0));
    }
  }, []);

  // Save progress
  const saveProgress = useCallback((newXp: number, newStreak: number) => {
    const progress = {
      xp: newXp,
      streak: newStreak,
      lastPlay: new Date().toISOString()
    };
    localStorage.setItem('questProgress', JSON.stringify(progress));
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
        // Story generation phase: 0-20%
        if (prev < 20) {
          setLoadingStep('story');
          setLoadingMessage(t('loadingStory'));
          return prev + 0.5;
        }
        // Image generation phase: 20-90%
        if (prev < 90) {
          setLoadingStep('image');
          const imageNum = Math.floor((prev - 20) / 7) + 1;
          setLoadingMessage(`${t('loadingImage')} (${Math.min(imageNum, 10)}/10)`);
          return prev + 0.3;
        }
        // Preparing phase: 90-99%
        if (prev < 99) {
          setLoadingStep('preparing');
          setLoadingMessage(t('loadingPreparing'));
          return prev + 0.1;
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, t]);

  // Fetch story set from API
  const fetchStorySet = async (existingSetId?: string): Promise<StorySet | null> => {
    try {
      setError(null);
      const response = await fetch('/api/quest/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          locale,
          setId: existingSetId,
          generateNew: !existingSetId,
          count: TOTAL_SCENES,
          theme: selectedTheme || 'medieval',
          topic: selectedTopic || 'greetings',
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate story set');
      }

      const data = await response.json();
      return data.storySet;
    } catch (err) {
      console.error('Story set generation error:', err);
      setError(t('errorGenerating'));
      return null;
    }
  };

  // Fetch available sets for selection
  const fetchAvailableSets = async () => {
    try {
      let url = `/api/quest/sets?level=${level}`;
      if (selectedTheme) url += `&theme=${selectedTheme}`;
      if (selectedTopic) url += `&topic=${selectedTopic}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAvailableSets(data.sets || []);
      }
    } catch (err) {
      console.error('Failed to fetch available sets:', err);
    }
  };

  // Start theme selection
  const startThemeSelection = () => {
    setGameState('selectTheme');
  };

  // Handle theme selection
  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    setGameState('selectTopic');
  };

  // Handle topic selection
  const handleTopicSelect = (topicId: string) => {
    if (!isTopicUnlocked(topicId, xp)) return;
    setSelectedTopic(topicId);
    startNewGame(topicId);
  };

  // Start a new game with new story generation
  const startNewGame = async (topicOverride?: string) => {
    setGameState('loading');
    setCurrentSceneIndex(0);
    setCorrectCount(0);
    setPreviousLevel(level);
    setShowHint(false);
    setConsecutiveCorrect(0);

    // Temporarily set topic if override provided
    const topicToUse = topicOverride || selectedTopic;
    if (topicOverride) {
      setSelectedTopic(topicOverride);
    }

    const newSet = await fetchStorySet();
    if (newSet) {
      setStorySet(newSet);
      setLoadingProgress(100);
      setTimeout(() => setGameState('playing'), 500);
    } else {
      setGameState('menu');
    }
  };

  // Start game with existing set
  const startWithExistingSet = async (setId: string) => {
    setGameState('loading');
    setCurrentSceneIndex(0);
    setCorrectCount(0);
    setPreviousLevel(level);
    setShowHint(false);
    setConsecutiveCorrect(0);

    const existingSet = await fetchStorySet(setId);
    if (existingSet) {
      setStorySet(existingSet);
      setLoadingProgress(100);
      setTimeout(() => setGameState('playing'), 500);
    } else {
      setGameState('menu');
    }
  };

  // Show set selection
  const showSetSelection = async () => {
    await fetchAvailableSets();
    setGameState('selectSet');
  };

  // Handle player choice
  const handleChoice = async (choice: Choice) => {
    if (gameState !== 'playing') return;

    setSelectedChoice(choice);
    setGameState('feedback');

    let earnedXp = 0;

    if (choice.correct) {
      setCorrectCount(prev => prev + 1);
      const newConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutive);

      // Base XP
      earnedXp = 10;

      // Streak bonus (3+ consecutive correct)
      if (newConsecutive >= 3) {
        earnedXp += 5;
        setShowStreakBonus(true);
        setTimeout(() => setShowStreakBonus(false), 1500);
      }

      // Update XP immediately
      const newXp = xp + earnedXp;
      setXp(newXp);
      setXpGain(earnedXp);
      setTimeout(() => setXpGain(null), 1500);

      // Check level up
      const newLevel = calculateLevel(newXp);
      if (newLevel > level) {
        setLevel(newLevel);
      }

      // Save progress
      saveProgress(newXp, streak);
    } else {
      // Wrong answer - reset consecutive count
      setConsecutiveCorrect(0);
    }

    // Wait for feedback animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const nextIndex = currentSceneIndex + 1;

    // Check if game is complete
    if (nextIndex >= (storySet?.scenes.length || TOTAL_SCENES)) {
      // Update set statistics
      if (storySet) {
        try {
          await fetch('/api/quest/sets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              setId: storySet.id,
              correctAnswers: correctCount + (choice.correct ? 1 : 0),
              totalQuestions: storySet.scenes.length
            })
          });
        } catch (err) {
          console.error('Failed to update set stats:', err);
        }
      }

      const newStreak = streak + 1;
      setStreak(newStreak);
      saveProgress(xp, newStreak);

      // Check for level up
      const currentLevel = calculateLevel(xp);
      if (currentLevel > previousLevel) {
        setGameState('levelup');
      } else {
        setGameState('result');
      }
    } else {
      // Move to next scene
      setCurrentSceneIndex(nextIndex);
      setSelectedChoice(null);
      setShowHint(false);
      setGameState('playing');
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

  // Get localized name
  const getLocalizedName = (name: { ko: string; mn: string; ru: string; vi: string }) => {
    return name[locale as keyof typeof name] || name.ko;
  };

  // Get localized text for curriculum
  const getLocalized = (text: LocalizedText) => {
    return text[locale as keyof LocalizedText] || text.ko;
  };

  // Current scene
  const currentScene = storySet?.scenes[currentSceneIndex];

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

  // Get current theme config
  const currentThemeConfig = selectedTheme ? getTheme(selectedTheme) : null;

  // Get gradient style based on theme
  const getThemeGradient = (theme: ThemeConfig) => {
    return theme.colorScheme.gradient;
  };

  // Get unlocked topics
  const unlockedTopics = getUnlockedTopics(xp);

  return (
    <div className={`min-h-screen ${currentThemeConfig ? currentThemeConfig.colorScheme.bgGradient : 'bg-gradient-to-b from-purple-50 to-indigo-100'}`}>
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              if (gameState === 'selectTopic') {
                setGameState('selectTheme');
              } else if (gameState === 'selectTheme' || gameState === 'selectSet' || gameState === 'curriculum') {
                setGameState('menu');
              } else if (gameState === 'menu') {
                window.location.href = `/${locale}`;
              } else {
                setGameState('menu');
                setSelectedTheme(null);
                setSelectedTopic(null);
              }
            }}
            className="p-2 hover:bg-purple-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-purple-700" />
          </button>
          <h1 className="text-lg font-bold text-purple-800">{t('title')}</h1>
          <div className="flex items-center gap-2 text-purple-600">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold">{streak}</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Progress Card */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 mb-6 shadow-sm border border-purple-200 relative">
          {/* XP Gain Animation */}
          {xpGain !== null && (
            <div className="absolute top-2 right-2 animate-bounce">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Zap className="w-4 h-4" />
                +{xpGain} XP
              </div>
            </div>
          )}

          {/* Streak Bonus Animation */}
          {showStreakBonus && (
            <div className="absolute top-12 right-2 animate-pulse">
              <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                {t('streakBonus')}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white">
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

          {/* Consecutive streak indicator */}
          {consecutiveCorrect >= 2 && gameState === 'playing' && (
            <div className="mt-2 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-600">
                {consecutiveCorrect} {t('consecutive')}!
              </span>
            </div>
          )}
        </div>

        {/* Menu State */}
        {gameState === 'menu' && (
          <div className="space-y-4">
            {/* TOPIK Learning Section */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">TOPIK 한국어</h3>
                  <p className="text-sm opacity-90">체계적인 한국어 학습</p>
                </div>
              </div>

              {/* TOPIK Levels Preview */}
              <div className="flex gap-2 mb-3">
                {TOPIK_LEVELS.slice(0, 3).map((level) => (
                  <div
                    key={level.id}
                    className={`flex-1 py-2 px-3 rounded-lg text-center ${
                      level.id === 1
                        ? 'bg-white/30'
                        : 'bg-white/10 opacity-60'
                    }`}
                  >
                    <p className="text-xs">{level.id}급</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setGameState('curriculum')}
                className="w-full bg-white text-blue-600 rounded-xl py-3 font-bold hover:bg-blue-50 transition-all"
              >
                학습 시작하기
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 text-purple-400">
              <div className="flex-1 h-px bg-purple-200" />
              <span className="text-sm">모험 모드</span>
              <div className="flex-1 h-px bg-purple-200" />
            </div>

            {/* New Adventure Button */}
            <button
              onClick={startThemeSelection}
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

            {/* Existing Adventure Button */}
            <button
              onClick={showSetSelection}
              className="w-full bg-white/80 backdrop-blur border-2 border-purple-300 text-purple-700 rounded-2xl p-4 shadow hover:bg-purple-50 transition-all"
            >
              <div className="flex items-center justify-center gap-2">
                <List className="w-5 h-5" />
                <span className="font-semibold">{t('existingAdventures')}</span>
              </div>
            </button>

            {/* Topic Progress */}
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-purple-700">{t('topicProgress')}</span>
                <span className="text-sm text-purple-500">{unlockedTopics.length} / {TOPICS.length}</span>
              </div>
              <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  style={{ width: `${(unlockedTopics.length / TOPICS.length) * 100}%` }}
                />
              </div>
            </div>

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

        {/* TOPIK Curriculum State */}
        {gameState === 'curriculum' && (
          <div className="space-y-4">
            {/* Level Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {TOPIK_LEVELS.map((level) => {
                const isAvailable = level.id === 1; // Only TOPIK 1 for MVP
                return (
                  <button
                    key={level.id}
                    onClick={() => isAvailable && setSelectedTopikLevel(level.id)}
                    disabled={!isAvailable}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl font-bold transition-all ${
                      selectedTopikLevel === level.id
                        ? level.gradient + ' text-white shadow-lg'
                        : isAvailable
                          ? 'bg-white/80 text-gray-700 hover:bg-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <p className="text-lg">{level.id}급</p>
                    <p className="text-xs opacity-80">{getLocalized(level.name)}</p>
                    {!isAvailable && (
                      <Lock className="w-4 h-4 mt-1 mx-auto" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Level Info */}
            {TOPIK_LEVELS.find(l => l.id === selectedTopikLevel) && (
              <div className={`rounded-xl p-4 text-white ${TOPIK_LEVELS.find(l => l.id === selectedTopikLevel)?.gradient}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">
                      TOPIK {selectedTopikLevel}급
                    </h3>
                    <p className="text-sm opacity-90">
                      {getLocalized(TOPIK_LEVELS.find(l => l.id === selectedTopikLevel)?.description || { ko: '', mn: '', ru: '', vi: '' })}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{TOPIK_LEVELS.find(l => l.id === selectedTopikLevel)?.vocabCount} 단어</p>
                    <p>{TOPIK_LEVELS.find(l => l.id === selectedTopikLevel)?.grammarCount} 문법</p>
                  </div>
                </div>
              </div>
            )}

            {/* Units List */}
            <div className="space-y-3">
              {getUnitsForLevel(selectedTopikLevel).map((unit, unitIndex) => (
                <div
                  key={unit.id}
                  className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Unit Header */}
                  <button
                    onClick={() => setExpandedUnitId(expandedUnitId === unit.id ? null : unit.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                        {unit.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-800">
                          Unit {unit.order}: {getLocalized(unit.name)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getLocalized(unit.description)}
                        </p>
                      </div>
                    </div>
                    <div className={`transition-transform ${expandedUnitId === unit.id ? 'rotate-90' : ''}`}>
                      <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                    </div>
                  </button>

                  {/* Sections and Lessons */}
                  {expandedUnitId === unit.id && (
                    <div className="px-4 pb-4 space-y-3">
                      {unit.sections.map((section, sectionIndex) => (
                        <div key={section.id} className="space-y-2">
                          <p className="text-sm font-semibold text-gray-600 px-2">
                            {getLocalized(section.name)}
                          </p>
                          <div className="grid gap-2">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <Link
                                key={lesson.id}
                                href={`/${locale}/quest/lesson/${lesson.id}`}
                                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors group"
                              >
                                <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                  {lessonIndex + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800 group-hover:text-blue-700">
                                    {getLocalized(lesson.name)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {lesson.exerciseCount} 활동 · +{lesson.xpReward} XP
                                  </p>
                                </div>
                                <Zap className="w-5 h-5 text-yellow-500" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Back Button */}
            <button
              onClick={() => setGameState('menu')}
              className="w-full bg-white/80 backdrop-blur text-gray-700 rounded-xl p-3 font-semibold hover:bg-gray-50 transition-all"
            >
              {t('backToMenu')}
            </button>
          </div>
        )}

        {/* Theme Selection State */}
        {gameState === 'selectTheme' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-purple-800 text-center mb-4">{t('selectTheme')}</h2>

            <div className="grid grid-cols-2 gap-3">
              {Object.values(THEMES).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] text-white ${theme.colorScheme.gradient}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {themeIcons[theme.id]}
                    <span className="font-bold">{getLocalizedName(theme.name)}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setGameState('menu')}
              className="w-full bg-white/80 backdrop-blur text-purple-700 rounded-xl p-3 font-semibold hover:bg-purple-50 transition-all"
            >
              {t('backToMenu')}
            </button>
          </div>
        )}

        {/* Topic Selection State */}
        {gameState === 'selectTopic' && currentThemeConfig && (
          <div className="space-y-4">
            {/* Selected Theme Header */}
            <div className={`rounded-2xl p-4 text-white ${currentThemeConfig.colorScheme.gradient}`}>
              <div className="flex items-center gap-3">
                {themeIcons[currentThemeConfig.id]}
                <div>
                  <p className="text-sm opacity-90">{t('selectedTheme')}</p>
                  <p className="text-xl font-bold">{getLocalizedName(currentThemeConfig.name)}</p>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-purple-800">{t('selectTopic')}</h2>

            {/* Beginner Topics */}
            <div>
              <p className="text-sm font-semibold text-green-600 mb-2">{t('beginner')}</p>
              <div className="grid grid-cols-3 gap-2">
                {TOPICS.filter(t => t.difficulty === 'beginner').map((topic) => {
                  const unlocked = isTopicUnlocked(topic.id, xp);
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic.id)}
                      disabled={!unlocked}
                      className={`rounded-xl p-3 text-center transition-all ${
                        unlocked
                          ? 'bg-green-100 border-2 border-green-300 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 border-2 border-gray-200 text-gray-400'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {unlocked ? topicIcons[topic.id] : <Lock className="w-5 h-5" />}
                        <span className="text-xs font-semibold">{getLocalizedName(topic.name)}</span>
                        {!unlocked && (
                          <span className="text-[10px]">{topic.xpRequired} XP</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Intermediate Topics */}
            <div>
              <p className="text-sm font-semibold text-blue-600 mb-2">{t('intermediate')}</p>
              <div className="grid grid-cols-3 gap-2">
                {TOPICS.filter(t => t.difficulty === 'intermediate').map((topic) => {
                  const unlocked = isTopicUnlocked(topic.id, xp);
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic.id)}
                      disabled={!unlocked}
                      className={`rounded-xl p-3 text-center transition-all ${
                        unlocked
                          ? 'bg-blue-100 border-2 border-blue-300 text-blue-800 hover:bg-blue-200'
                          : 'bg-gray-100 border-2 border-gray-200 text-gray-400'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {unlocked ? topicIcons[topic.id] : <Lock className="w-5 h-5" />}
                        <span className="text-xs font-semibold">{getLocalizedName(topic.name)}</span>
                        {!unlocked && (
                          <span className="text-[10px]">{topic.xpRequired} XP</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advanced Topics */}
            <div>
              <p className="text-sm font-semibold text-purple-600 mb-2">{t('advanced')}</p>
              <div className="grid grid-cols-3 gap-2">
                {TOPICS.filter(t => t.difficulty === 'advanced').map((topic) => {
                  const unlocked = isTopicUnlocked(topic.id, xp);
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic.id)}
                      disabled={!unlocked}
                      className={`rounded-xl p-3 text-center transition-all ${
                        unlocked
                          ? 'bg-purple-100 border-2 border-purple-300 text-purple-800 hover:bg-purple-200'
                          : 'bg-gray-100 border-2 border-gray-200 text-gray-400'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {unlocked ? topicIcons[topic.id] : <Lock className="w-5 h-5" />}
                        <span className="text-xs font-semibold">{getLocalizedName(topic.name)}</span>
                        {!unlocked && (
                          <span className="text-[10px]">{topic.xpRequired} XP</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setGameState('selectTheme')}
              className="w-full bg-white/80 backdrop-blur text-purple-700 rounded-xl p-3 font-semibold hover:bg-purple-50 transition-all"
            >
              {t('changeTheme')}
            </button>
          </div>
        )}

        {/* Set Selection State */}
        {gameState === 'selectSet' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-purple-800">{t('selectAdventure')}</h2>
              <button
                onClick={() => setGameState('menu')}
                className="p-2 hover:bg-purple-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-purple-700" />
              </button>
            </div>

            {availableSets.length === 0 ? (
              <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center">
                <p className="text-purple-600">{t('noSetsAvailable')}</p>
                <button
                  onClick={startThemeSelection}
                  className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  {t('createNew')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {availableSets.map(set => {
                  const setTheme = getTheme(set.theme);
                  return (
                    <button
                      key={set.id}
                      onClick={() => startWithExistingSet(set.id)}
                      className={`w-full rounded-xl p-4 text-left hover:opacity-90 transition-all text-white ${setTheme?.colorScheme.gradient || 'bg-gradient-to-r from-purple-500 to-indigo-600'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {themeIcons[set.theme]}
                          <div>
                            <p className="font-bold">{set.title}</p>
                            <p className="text-xs opacity-80">{setTheme ? getLocalizedName(setTheme.name) : set.theme}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{set.sceneCount} {t('scenes')}</p>
                          <p className="text-xs opacity-80">{set.playCount} {t('plays')}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Loading State with Progress Bar */}
        {gameState === 'loading' && (
          <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-lg border border-purple-200">
            {/* Theme Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center animate-pulse text-white ${currentThemeConfig?.colorScheme.gradient || 'bg-gradient-to-br from-purple-400 to-indigo-500'}`}>
                {currentThemeConfig ? themeIcons[currentThemeConfig.id] : <MapPin className="w-10 h-10" />}
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
                  className={`h-full rounded-full transition-all duration-300 relative ${currentThemeConfig?.colorScheme.gradient || 'bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600'}`}
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
                <Scroll className="w-5 h-5 animate-bounce" />
              )}
              {loadingStep === 'image' && (
                <Sparkles className="w-5 h-5 animate-spin" />
              )}
              {loadingStep === 'preparing' && (
                <Sword className="w-5 h-5 animate-pulse" />
              )}
              <span>{loadingMessage || t('loading')}</span>
            </div>

            <p className="text-center text-xs text-purple-400 mt-4">
              {t('loadingTime')}
            </p>
          </div>
        )}

        {/* Playing State */}
        {(gameState === 'playing' || gameState === 'feedback') && currentScene && (
          <div className="space-y-4">
            {/* Set ID & Progress */}
            <div className="flex items-center justify-between text-xs text-purple-500">
              <span>{storySet?.id}</span>
              <span>{currentSceneIndex + 1} / {storySet?.scenes.length || TOTAL_SCENES}</span>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-1 justify-center mb-4">
              {Array.from({ length: storySet?.scenes.length || TOTAL_SCENES }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < currentSceneIndex
                      ? 'bg-purple-500'
                      : i === currentSceneIndex
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
            {currentScene.vocabulary && currentScene.vocabulary.length > 0 && (
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
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${currentThemeConfig?.colorScheme.gradient || 'bg-gradient-to-br from-purple-400 to-indigo-500'}`}>
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-purple-800 mb-2">{t('questComplete')}</h2>
            <p className="text-purple-600 mb-2">
              {storySet?.title}
            </p>
            <p className="text-sm text-purple-500 mb-6">
              {t('score')}: {correctCount} / {storySet?.scenes.length || TOTAL_SCENES}
            </p>

            <div className="bg-purple-50 rounded-xl p-4 mb-6">
              <p className="text-purple-600">{t('xpEarned')}</p>
              <p className="text-3xl font-bold text-purple-600">+{correctCount * 10} XP</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={startThemeSelection}
                className={`w-full text-white rounded-xl py-3 font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 ${currentThemeConfig?.colorScheme.gradient || 'bg-gradient-to-r from-purple-500 to-indigo-600'}`}
              >
                <RefreshCw className="w-5 h-5" />
                {t('newAdventure')}
              </button>
              <button
                onClick={() => {
                  setGameState('menu');
                  setSelectedTheme(null);
                  setSelectedTopic(null);
                }}
                className="w-full bg-purple-100 text-purple-700 rounded-xl py-3 font-bold hover:bg-purple-200 transition-all"
              >
                {t('backToMenu')}
              </button>
            </div>
          </div>
        )}

        {/* Level Up State */}
        {gameState === 'levelup' && (
          <div className={`rounded-2xl p-8 shadow-lg text-center text-white ${currentThemeConfig?.colorScheme.gradient || 'bg-gradient-to-br from-purple-400 to-indigo-500'}`}>
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
