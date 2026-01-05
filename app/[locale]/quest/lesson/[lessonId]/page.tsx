'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  ArrowLeft,
  X,
  Heart,
  Zap,
  Trophy,
  Star,
  ChevronRight,
  Volume2,
  Loader2
} from 'lucide-react';
import {
  getLesson,
  getSection,
  getUnit,
  LocalizedText
} from '@/lib/korean-curriculum';
import {
  getVocabularyByLesson,
  VocabularyWord
} from '@/lib/korean-vocabulary';
import {
  Exercise,
  ExerciseResult,
  LessonResult,
  isLessonPassed,
  getPerformanceRating
} from '@/lib/exercise-types';
import { generateLessonExercises } from '@/lib/exercise-generator';
import ExerciseRenderer from '@/components/exercises/ExerciseRenderer';

type GameState = 'loading' | 'vocabulary' | 'exercises' | 'complete';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('quest');
  const locale = useLocale();
  const lessonId = params.lessonId as string;

  // Game state
  const [gameState, setGameState] = useState<GameState>('loading');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [lives, setLives] = useState(3);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showVocabIndex, setShowVocabIndex] = useState(0);

  // Lesson data
  const lesson = useMemo(() => getLesson(lessonId), [lessonId]);
  const vocabulary = useMemo(() => getVocabularyByLesson(lessonId), [lessonId]);

  // Helper function
  const getLocalized = (obj: LocalizedText) => {
    return obj[locale as keyof LocalizedText] || obj.ko;
  };

  // Initialize lesson
  useEffect(() => {
    if (!lesson) {
      router.push(`/${locale}/quest`);
      return;
    }

    // Generate exercises for this lesson
    const generatedExercises = generateLessonExercises({
      lessonId,
      vocabularyIds: lesson.vocabularyIds,
      grammarIds: lesson.grammarIds,
      exerciseCount: lesson.exerciseCount,
      includeVoice: true
    });

    setExercises(generatedExercises);
    setGameState(vocabulary.length > 0 ? 'vocabulary' : 'exercises');
  }, [lessonId, lesson, vocabulary.length, router, locale]);

  // Handle exercise completion
  const handleExerciseComplete = (result: ExerciseResult) => {
    setResults([...results, result]);
    setTotalXP(prev => prev + result.xpEarned);

    if (result.isCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
      setLives(prev => prev - 1);
    }

    // Move to next exercise or complete
    if (currentExerciseIndex < exercises.length - 1 && lives > (result.isCorrect ? 0 : 1)) {
      setTimeout(() => {
        setCurrentExerciseIndex(prev => prev + 1);
      }, 500);
    } else {
      setGameState('complete');
    }
  };

  // Handle vocabulary card navigation
  const nextVocab = () => {
    if (showVocabIndex < vocabulary.length - 1) {
      setShowVocabIndex(prev => prev + 1);
    } else {
      setGameState('exercises');
    }
  };

  // Play audio for vocabulary
  const playAudio = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Calculate final result
  const finalResult: LessonResult | null = gameState === 'complete' ? {
    lessonId,
    completedAt: new Date().toISOString(),
    totalExercises: exercises.length,
    correctAnswers: results.filter(r => r.isCorrect).length,
    totalXP,
    averageTime: results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length,
    exerciseResults: results,
    passed: results.filter(r => r.isCorrect).length / exercises.length >= 0.7
  } : null;

  // Get section and unit for breadcrumb
  const section = lesson ? getSection(lesson.sectionId) : null;
  const unit = section ? getUnit(section.id.split('-sec')[0]) : null;

  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push(`/${locale}/quest`)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>

          {/* Progress bar */}
          {gameState === 'exercises' && (
            <div className="flex-1 mx-4">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                  style={{ width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Lives and XP */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${
                    i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Zap className="w-5 h-5 fill-yellow-500" />
              <span className="font-bold">{totalXP}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Vocabulary Introduction */}
        {gameState === 'vocabulary' && vocabulary.length > 0 && (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex justify-center gap-2">
              {vocabulary.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === showVocabIndex
                      ? 'bg-blue-500'
                      : idx < showVocabIndex
                        ? 'bg-blue-300'
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Vocabulary card */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  {t('vocabulary')} ({showVocabIndex + 1}/{vocabulary.length})
                </p>

                <div className="mb-6">
                  <h2 className="text-5xl font-bold text-blue-600 mb-2">
                    {vocabulary[showVocabIndex].korean}
                  </h2>
                  <p className="text-gray-400 text-lg">
                    {vocabulary[showVocabIndex].pronunciation}
                  </p>
                  <button
                    onClick={() => playAudio(vocabulary[showVocabIndex].korean)}
                    className="mt-2 p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <Volume2 className="w-6 h-6 text-blue-600" />
                  </button>
                </div>

                <div className="py-4 border-t border-b border-gray-100">
                  <p className="text-2xl text-gray-700">
                    {getLocalized(vocabulary[showVocabIndex].meaning)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1 capitalize">
                    {vocabulary[showVocabIndex].partOfSpeech}
                  </p>
                </div>

                {vocabulary[showVocabIndex].exampleSentence && (
                  <div className="mt-6 bg-gray-50 rounded-xl p-4">
                    <p className="text-lg text-gray-700 mb-1">
                      {vocabulary[showVocabIndex].exampleSentence.korean}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getLocalized(vocabulary[showVocabIndex].exampleSentence.translation)}
                    </p>
                    <button
                      onClick={() => playAudio(vocabulary[showVocabIndex].exampleSentence!.korean)}
                      className="mt-2 p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Continue button */}
            <button
              onClick={nextVocab}
              className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              {showVocabIndex < vocabulary.length - 1 ? (
                <>
                  다음 단어
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  연습 시작
                  <Zap className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Exercises */}
        {gameState === 'exercises' && exercises.length > 0 && (
          <div className="space-y-6">
            {/* Streak indicator */}
            {streak >= 3 && (
              <div className="flex justify-center">
                <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <span className="font-bold">{streak} {t('consecutive')}</span>
                </div>
              </div>
            )}

            {/* Current exercise */}
            <ExerciseRenderer
              exercise={exercises[currentExerciseIndex]}
              onComplete={handleExerciseComplete}
              locale={locale}
              showHint={true}
              streak={streak}
            />

            {/* Exercise counter */}
            <p className="text-center text-gray-400 text-sm">
              {currentExerciseIndex + 1} / {exercises.length}
            </p>
          </div>
        )}

        {/* Completion screen */}
        {gameState === 'complete' && finalResult && (
          <div className="text-center space-y-8">
            {/* Result icon */}
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
              finalResult.passed
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                : 'bg-gradient-to-br from-gray-300 to-gray-400'
            }`}>
              {finalResult.passed ? (
                <Trophy className="w-16 h-16 text-white" />
              ) : (
                <X className="w-16 h-16 text-white" />
              )}
            </div>

            {/* Result message */}
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {finalResult.passed ? t('questComplete') : '다시 도전해요!'}
              </h2>
              <p className="text-gray-600">
                {getLocalized(lesson.name)}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow">
                <p className="text-3xl font-bold text-blue-600">
                  {finalResult.correctAnswers}/{finalResult.totalExercises}
                </p>
                <p className="text-sm text-gray-500">{t('score')}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <p className="text-3xl font-bold text-yellow-500">
                  +{totalXP}
                </p>
                <p className="text-sm text-gray-500">XP</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <p className="text-3xl font-bold text-green-500">
                  {Math.round((finalResult.correctAnswers / finalResult.totalExercises) * 100)}%
                </p>
                <p className="text-sm text-gray-500">정확도</p>
              </div>
            </div>

            {/* Performance stars */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((star) => {
                const ratio = finalResult.correctAnswers / finalResult.totalExercises;
                const filled = (star === 1 && ratio >= 0.5) ||
                              (star === 2 && ratio >= 0.7) ||
                              (star === 3 && ratio >= 0.9);
                return (
                  <Star
                    key={star}
                    className={`w-12 h-12 ${
                      filled
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              {!finalResult.passed && (
                <button
                  onClick={() => {
                    setGameState('vocabulary');
                    setCurrentExerciseIndex(0);
                    setResults([]);
                    setLives(3);
                    setTotalXP(0);
                    setStreak(0);
                    setShowVocabIndex(0);
                  }}
                  className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors"
                >
                  {t('playAgain')}
                </button>
              )}
              <button
                onClick={() => router.push(`/${locale}/quest`)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                  finalResult.passed
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t('backToMenu')}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
