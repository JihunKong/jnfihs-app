'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Volume2, Star, Flame, Trophy, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import {
  level1Words,
  level2Words,
  getRandomOptions,
  calculateLevel,
  getXpToNextLevel,
  levelThresholds,
  Word,
} from '@/lib/korean-words';

type QuizState = 'menu' | 'quiz' | 'result' | 'levelup';

interface QuizQuestion {
  word: Word;
  options: string[];
  imageUrl?: string | null;
}

export default function KoreanLearningPage() {
  const { locale } = useParams();
  const t = useTranslations('koreanLearning');

  // Progress state
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);

  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>('menu');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [previousLevel, setPreviousLevel] = useState(1);

  const QUIZ_LENGTH = 5;

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('koreanLearningProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setXp(progress.xp || 0);
        setStreak(progress.streak || 0);
        setLevel(calculateLevel(progress.xp || 0));
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
      localStorage.removeItem('koreanLearningProgress');
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((newXp: number, newStreak: number) => {
    const progress = { xp: newXp, streak: newStreak, lastStudy: new Date().toISOString() };
    localStorage.setItem('koreanLearningProgress', JSON.stringify(progress));
  }, []);

  // Generate image for a word (with caching via wordId)
  const generateImage = async (word: Word): Promise<string | null> => {
    try {
      const res = await fetch('/api/korean-learning/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordId: word.id,
          prompt: word.imagePrompt
        }),
      });
      const data = await res.json();
      return data.imageUrl || null;
    } catch {
      return null;
    }
  };

  // Start a new quiz
  const startQuiz = async () => {
    setIsLoading(true);
    setQuizState('quiz');
    setQuestionIndex(0);
    setCorrectCount(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setPreviousLevel(level);

    // Get words based on current level
    const availableWords = level >= 2 ? [...level1Words, ...level2Words] : level1Words;
    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, QUIZ_LENGTH);

    // Generate questions
    const newQuestions: QuizQuestion[] = [];
    for (const word of selectedWords) {
      const options = getRandomOptions(word, availableWords, 3);
      // Try to generate image, but don't block on failure
      const imageUrl = await generateImage(word);
      newQuestions.push({ word, options, imageUrl });
    }

    // Validate questions before starting
    if (newQuestions.length > 0) {
      setQuestions(newQuestions);
      setCurrentQuestion(newQuestions[0]);
    } else {
      setQuizState('menu');
    }
    setIsLoading(false);
  };

  // Handle answer selection
  const handleAnswer = async (answer: string) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === currentQuestion?.word.korean;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    // Wait for feedback animation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Move to next question or finish
    if (questionIndex < QUIZ_LENGTH - 1) {
      setQuestionIndex((prev) => prev + 1);
      setCurrentQuestion(questions[questionIndex + 1]);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz finished
      const earnedXp = correctCount * 10 + (isCorrect ? 10 : 0);
      const newXp = xp + earnedXp;
      const newLevel = calculateLevel(newXp);
      const newStreak = streak + 1;

      setXp(newXp);
      setStreak(newStreak);
      setLevel(newLevel);
      saveProgress(newXp, newStreak);

      // Check for level up
      if (newLevel > previousLevel) {
        setQuizState('levelup');
      } else {
        setQuizState('result');
      }
    }
  };

  // Speak the word using TTS
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Get category emoji
  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      fruit: '🍎',
      animal: '🐱',
      drink: '🥤',
      food: '🍚',
      object: '📚',
      place: '🏫',
      person: '👨‍🏫',
    };
    return emojis[category] || '📝';
  };

  // XP progress bar
  const xpProgress = getXpToNextLevel(xp);
  const progressPercent = (xpProgress.current / xpProgress.needed) * 100;

  // Get level name for current locale
  const getLevelName = () => {
    const threshold = levelThresholds.find((t) => t.level === level);
    return threshold?.name[locale as keyof typeof threshold.name] || threshold?.name.ko;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-oat-50 to-oat-100">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-oat-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${locale}`} className="p-2 hover:bg-oat-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-oat-700" />
          </Link>
          <h1 className="text-lg font-bold text-oat-800">{t('title')}</h1>
          <div className="flex items-center gap-2 text-oat-600">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold">{streak}</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Progress Card */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 mb-6 shadow-sm border border-oat-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-oat-600">{t('level')} {level}</p>
                <p className="font-bold text-oat-800">{getLevelName()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-oat-800">{xp}</p>
              <p className="text-xs text-oat-500">XP</p>
            </div>
          </div>
          <div className="h-3 bg-oat-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-oat-500 mt-1 text-right">
            {xpProgress.current} / {xpProgress.needed} XP
          </p>
        </div>

        {/* Menu State */}
        {quizState === 'menu' && (
          <div className="space-y-4">
            {/* Quiz Start Button */}
            <button
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8" />
                <div className="text-left">
                  <p className="text-xl font-bold">{t('startQuiz')}</p>
                  <p className="text-sm opacity-90">{t('quizDescription')}</p>
                </div>
              </div>
            </button>

            {/* Lesson Categories */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-oat-200">
                <div className="text-3xl mb-2">🍎</div>
                <p className="font-semibold text-oat-800">{t('categories.basic')}</p>
                <p className="text-xs text-oat-500">{level1Words.length} {t('words')}</p>
              </div>
              <div className={`bg-white/80 backdrop-blur rounded-xl p-4 border ${level >= 2 ? 'border-oat-200' : 'border-oat-100 opacity-50'}`}>
                <div className="text-3xl mb-2">🏫</div>
                <p className="font-semibold text-oat-800">{t('categories.school')}</p>
                <p className="text-xs text-oat-500">
                  {level >= 2 ? `${level2Words.length} ${t('words')}` : `${t('unlock')} Lv.2`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quiz State */}
        {quizState === 'quiz' && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="flex gap-1">
              {Array.from({ length: QUIZ_LENGTH }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i < questionIndex
                      ? 'bg-green-500'
                      : i === questionIndex
                      ? 'bg-oat-400'
                      : 'bg-oat-200'
                  }`}
                />
              ))}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-oat-200 border-t-green-500 rounded-full animate-spin" />
                <p className="mt-4 text-oat-600">{t('loading')}</p>
              </div>
            ) : currentQuestion && (
              <>
                {/* Question Card */}
                <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg border border-oat-200">
                  {/* Image or Emoji */}
                  <div className="flex justify-center mb-4">
                    {currentQuestion.imageUrl ? (
                      <img
                        src={currentQuestion.imageUrl}
                        alt="quiz"
                        className="w-40 h-40 object-contain rounded-xl"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-gradient-to-br from-oat-100 to-oat-200 rounded-xl flex items-center justify-center text-7xl">
                        {getCategoryEmoji(currentQuestion.word.category)}
                      </div>
                    )}
                  </div>

                  {/* Question text in user's language */}
                  <p className="text-center text-oat-600 mb-2">
                    {(locale && locale !== 'ko' && currentQuestion.word.translations[locale as 'mn' | 'ru' | 'vi']) ||
                      currentQuestion.word.translations.mn}
                  </p>

                  {/* Listen button */}
                  <button
                    onClick={() => speakWord(currentQuestion.word.korean)}
                    className="mx-auto flex items-center gap-2 px-4 py-2 bg-oat-100 hover:bg-oat-200 rounded-full text-oat-700 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">{t('listen')}</span>
                  </button>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-2 gap-3">
                  {currentQuestion.options.map((option) => {
                    const isCorrect = option === currentQuestion.word.korean;
                    const isSelected = option === selectedAnswer;

                    let buttonClass = 'bg-white/80 border-oat-200 text-oat-800 hover:bg-oat-50';
                    if (showFeedback) {
                      if (isCorrect) {
                        buttonClass = 'bg-green-100 border-green-500 text-green-800';
                      } else if (isSelected && !isCorrect) {
                        buttonClass = 'bg-red-100 border-red-500 text-red-800';
                      }
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={showFeedback}
                        className={`p-4 rounded-xl border-2 font-bold text-lg transition-all ${buttonClass} ${
                          showFeedback ? '' : 'active:scale-95'
                        }`}
                      >
                        <span>{option}</span>
                        {showFeedback && isCorrect && (
                          <CheckCircle className="w-5 h-5 inline ml-2 text-green-600" />
                        )}
                        {showFeedback && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 inline ml-2 text-red-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Result State */}
        {quizState === 'result' && (
          <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-lg border border-oat-200 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-oat-800 mb-2">{t('quizComplete')}</h2>
            <p className="text-oat-600 mb-6">
              {t('score')}: {correctCount} / {QUIZ_LENGTH}
            </p>

            <div className="bg-oat-50 rounded-xl p-4 mb-6">
              <p className="text-oat-600">{t('xpEarned')}</p>
              <p className="text-3xl font-bold text-green-600">+{correctCount * 10} XP</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={startQuiz}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 font-bold hover:shadow-lg transition-all"
              >
                {t('playAgain')}
              </button>
              <button
                onClick={() => setQuizState('menu')}
                className="w-full bg-oat-100 text-oat-700 rounded-xl py-3 font-bold hover:bg-oat-200 transition-all"
              >
                {t('backToMenu')}
              </button>
            </div>
          </div>
        )}

        {/* Level Up State */}
        {quizState === 'levelup' && (
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 shadow-lg text-center text-white">
            <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur rounded-full flex items-center justify-center animate-bounce">
              <Star className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">{t('levelUp')}</h2>
            <p className="text-xl mb-6">{t('level')} {level}!</p>
            <p className="text-white/90 mb-6">{getLevelName()}</p>

            <button
              onClick={() => setQuizState('result')}
              className="w-full bg-white text-orange-600 rounded-xl py-3 font-bold hover:bg-oat-50 transition-all"
            >
              {t('continue')}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
