'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Exercise, ExerciseResult, ExerciseType, EXERCISE_TYPES, calculateExerciseXP } from '@/lib/exercise-types';
import { useLocale, useTranslations } from 'next-intl';
import { Volume2, Mic, Check, X, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';

// Hooks for speech synthesis and recognition
function useSpeechSynthesis() {
  const speak = useCallback((text: string, lang: string = 'ko-KR') => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return { speak };
}

interface ExerciseRendererProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
  locale: string;
  showHint?: boolean;
  streak?: number;
}

export default function ExerciseRenderer({
  exercise,
  onComplete,
  locale,
  showHint = false,
  streak = 0
}: ExerciseRendererProps) {
  const t = useTranslations('quest');
  const { speak } = useSpeechSynthesis();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [startTime] = useState(Date.now());
  const [hintShown, setHintShown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);

  const config = EXERCISE_TYPES[exercise.type];

  // Get localized text helper
  const getLocalized = (obj: { ko: string; mn: string; ru: string; vi: string }) => {
    return obj[locale as keyof typeof obj] || obj.ko;
  };

  // Auto-play audio for listening exercises
  useEffect(() => {
    if (config.requiresAudio && !config.requiresMicrophone) {
      // Auto-play for pure listening exercises
      const timer = setTimeout(() => {
        playAudio();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [exercise.id]);

  const playAudio = () => {
    if (exercise.type === 'word-audio' && 'audioWord' in exercise) {
      speak(exercise.audioWord.korean);
    } else if (exercise.type === 'listen-select' && 'audioText' in exercise) {
      speak(exercise.audioText);
    } else if (exercise.type === 'listen-type' && 'audioText' in exercise) {
      speak(exercise.audioText);
    } else if (exercise.type === 'listen-repeat' && 'targetText' in exercise) {
      speak(exercise.targetText);
    } else if (exercise.type === 'speak-word' && 'word' in exercise) {
      speak(exercise.word.korean);
    } else if (exercise.type === 'speak-sentence' && 'sentence' in exercise) {
      speak(exercise.sentence);
    }
  };

  const checkAnswer = () => {
    setIsChecking(true);
    let isCorrect = false;
    let userAnswer: string | string[] = '';
    let correctAnswer: string | string[] = '';

    switch (exercise.type) {
      case 'word-match':
      case 'word-picture':
      case 'word-audio':
      case 'fill-blank':
      case 'grammar-choice':
      case 'listen-select':
        userAnswer = selectedAnswer || '';
        const correctChoice = 'choices' in exercise
          ? exercise.choices.find(c => c.isCorrect)
          : null;
        correctAnswer = correctChoice?.text || '';
        isCorrect = userAnswer === correctAnswer;
        break;

      case 'word-spell':
        userAnswer = typedAnswer.trim();
        correctAnswer = 'word' in exercise ? exercise.word.korean : '';
        isCorrect = 'acceptableAnswers' in exercise
          ? exercise.acceptableAnswers.includes(userAnswer)
          : userAnswer === correctAnswer;
        break;

      case 'word-order':
        userAnswer = orderedWords;
        correctAnswer = 'correctOrder' in exercise ? exercise.correctOrder : [];
        isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
        break;

      case 'translate':
      case 'listen-type':
        userAnswer = typedAnswer.trim();
        correctAnswer = 'acceptableAnswers' in exercise
          ? exercise.acceptableAnswers[0]
          : '';
        isCorrect = 'acceptableAnswers' in exercise
          ? exercise.acceptableAnswers.some(ans =>
              ans.toLowerCase() === (userAnswer as string).toLowerCase()
            )
          : false;
        break;

      case 'listen-repeat':
      case 'speak-word':
      case 'speak-sentence':
      case 'speak-answer':
      case 'speak-describe':
        // Speaking exercises are evaluated by pronunciation score
        isCorrect = (pronunciationScore || 0) >= ('acceptableScore' in exercise ? exercise.acceptableScore : 70);
        userAnswer = typedAnswer; // transcription
        correctAnswer = 'targetText' in exercise ? exercise.targetText : '';
        break;
    }

    setResult(isCorrect ? 'correct' : 'wrong');

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const timeBonus = timeSpent < 10;
    const xpEarned = calculateExerciseXP(
      exercise.xpReward,
      exercise.type,
      isCorrect,
      timeBonus,
      streak
    );

    // Delay to show result before moving on
    setTimeout(() => {
      onComplete({
        exerciseId: exercise.id,
        type: exercise.type,
        isCorrect,
        userAnswer,
        correctAnswer,
        timeSpent,
        xpEarned,
        pronunciationScore: pronunciationScore || undefined
      });
    }, 1500);
  };

  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      setTypedAnswer(transcript);
      setPronunciationScore(Math.round(confidence * 100));
    };

    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  // Render different exercise types
  const renderExercise = () => {
    switch (exercise.type) {
      // ===== VOCABULARY EXERCISES =====
      case 'word-match':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {'word' in exercise ? exercise.word.korean : ''}
              </p>
              <p className="text-gray-500">
                {'word' in exercise ? exercise.word.pronunciation : ''}
              </p>
              <button
                onClick={playAudio}
                className="mt-2 p-2 text-blue-500 hover:bg-blue-50 rounded-full"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
            <p className="text-center text-gray-600">
              {getLocalized(config.description)}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {'choices' in exercise && exercise.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(choice.text)}
                  disabled={result !== null}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === choice.text
                      ? result === 'correct'
                        ? 'border-green-500 bg-green-50'
                        : result === 'wrong' && choice.isCorrect
                          ? 'border-green-500 bg-green-50'
                          : result === 'wrong'
                            ? 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                      : result !== null && choice.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-lg">
                    {choice.translation
                      ? getLocalized(choice.translation as any)
                      : choice.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'word-picture':
        return (
          <div className="space-y-6">
            {'imageUrl' in exercise && (
              <div className="flex justify-center">
                <img
                  src={exercise.imageUrl}
                  alt={'imageAlt' in exercise ? exercise.imageAlt : ''}
                  className="w-48 h-48 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}
            <p className="text-center text-gray-600">
              {getLocalized(config.description)}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {'choices' in exercise && exercise.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(choice.text)}
                  disabled={result !== null}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === choice.text
                      ? result === 'correct'
                        ? 'border-green-500 bg-green-50'
                        : result === 'wrong' && choice.isCorrect
                          ? 'border-green-500 bg-green-50'
                          : result === 'wrong'
                            ? 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                      : result !== null && choice.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-xl font-medium">{choice.text}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'word-audio':
        return (
          <div className="space-y-6">
            <div className="flex justify-center">
              <button
                onClick={playAudio}
                className="p-6 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
              >
                <Volume2 className="w-12 h-12 text-blue-600" />
              </button>
            </div>
            <p className="text-center text-gray-600">
              {getLocalized(config.description)}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {'choices' in exercise && exercise.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(choice.text)}
                  disabled={result !== null}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === choice.text
                      ? result === 'correct'
                        ? 'border-green-500 bg-green-50'
                        : result === 'wrong' && choice.isCorrect
                          ? 'border-green-500 bg-green-50'
                          : result === 'wrong'
                            ? 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                      : result !== null && choice.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-xl font-medium">{choice.text}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'word-spell':
        return (
          <div className="space-y-6">
            <div className="text-center">
              {'word' in exercise && 'showMeaning' in exercise && exercise.showMeaning && (
                <p className="text-lg text-gray-700 mb-4">
                  {getLocalized(exercise.word.meaning)}
                </p>
              )}
              {'word' in exercise && 'showImage' in exercise && exercise.showImage && exercise.word.imageUrl && (
                <img
                  src={exercise.word.imageUrl}
                  alt={exercise.word.korean}
                  className="w-32 h-32 object-cover rounded-xl mx-auto mb-4"
                />
              )}
            </div>
            <p className="text-center text-gray-600">
              {getLocalized(config.description)}
            </p>
            <input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder="한국어로 입력하세요"
              disabled={result !== null}
              className={`w-full p-4 text-xl text-center border-2 rounded-xl ${
                result === 'correct'
                  ? 'border-green-500 bg-green-50'
                  : result === 'wrong'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {result === 'wrong' && 'word' in exercise && (
              <p className="text-center text-green-600">
                정답: {exercise.word.korean}
              </p>
            )}
          </div>
        );

      // ===== SENTENCE EXERCISES =====
      case 'fill-blank':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-xl text-center leading-relaxed">
                {'sentence' in exercise ? exercise.sentence.replace('(___)', '______') : ''}
              </p>
              {'translation' in exercise && (
                <p className="text-gray-500 text-center mt-2">
                  {getLocalized(exercise.translation)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {'choices' in exercise && exercise.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(choice.text)}
                  disabled={result !== null}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === choice.text
                      ? result === 'correct'
                        ? 'border-green-500 bg-green-50'
                        : result === 'wrong' && choice.isCorrect
                          ? 'border-green-500 bg-green-50'
                          : result === 'wrong'
                            ? 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                      : result !== null && choice.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-lg">{choice.text}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'word-order':
        const availableWords = 'shuffledWords' in exercise
          ? exercise.shuffledWords.filter(w => !orderedWords.includes(w))
          : [];
        return (
          <div className="space-y-6">
            {'translation' in exercise && (
              <p className="text-center text-gray-600">
                {getLocalized(exercise.translation)}
              </p>
            )}
            <div className="bg-gray-50 p-4 rounded-xl min-h-16 flex flex-wrap gap-2 justify-center">
              {orderedWords.length === 0 ? (
                <span className="text-gray-400">단어를 순서대로 선택하세요</span>
              ) : (
                orderedWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setOrderedWords(orderedWords.filter((_, i) => i !== idx));
                    }}
                    disabled={result !== null}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      result === 'correct'
                        ? 'bg-green-100 text-green-700'
                        : result === 'wrong'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {word}
                  </button>
                ))
              )}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {availableWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => setOrderedWords([...orderedWords, word])}
                  disabled={result !== null}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all"
                >
                  {word}
                </button>
              ))}
            </div>
            {result === 'wrong' && 'correctOrder' in exercise && (
              <p className="text-center text-green-600">
                정답: {exercise.correctOrder.join(' ')}
              </p>
            )}
          </div>
        );

      case 'translate':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-xl text-center">
                {'sourceText' in exercise ? exercise.sourceText : ''}
              </p>
            </div>
            <p className="text-center text-gray-600">
              {getLocalized(config.description)}
            </p>
            <textarea
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder={'targetLanguage' in exercise && exercise.targetLanguage === 'ko'
                ? '한국어로 번역하세요'
                : '번역하세요'}
              disabled={result !== null}
              rows={3}
              className={`w-full p-4 text-lg border-2 rounded-xl resize-none ${
                result === 'correct'
                  ? 'border-green-500 bg-green-50'
                  : result === 'wrong'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {result === 'wrong' && 'acceptableAnswers' in exercise && (
              <p className="text-center text-green-600">
                정답 예시: {exercise.acceptableAnswers[0]}
              </p>
            )}
          </div>
        );

      case 'grammar-choice':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-xl text-center leading-relaxed">
                {'sentence' in exercise ? exercise.sentence.replace('(___)', '______') : ''}
              </p>
              {'context' in exercise && (
                <p className="text-gray-500 text-center mt-2 text-sm">
                  {getLocalized(exercise.context)}
                </p>
              )}
            </div>
            {'grammarPoint' in exercise && (
              <p className="text-center text-blue-600 text-sm">
                문법: {exercise.grammarPoint}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {'choices' in exercise && exercise.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(choice.text)}
                  disabled={result !== null}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === choice.text
                      ? result === 'correct'
                        ? 'border-green-500 bg-green-50'
                        : result === 'wrong' && choice.isCorrect
                          ? 'border-green-500 bg-green-50'
                          : result === 'wrong'
                            ? 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                      : result !== null && choice.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-xl font-medium">{choice.text}</span>
                </button>
              ))}
            </div>
          </div>
        );

      // ===== LISTENING EXERCISES =====
      case 'listen-select':
        return (
          <div className="space-y-6">
            <div className="flex justify-center">
              <button
                onClick={playAudio}
                className="p-6 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
              >
                <Volume2 className="w-12 h-12 text-purple-600" />
              </button>
            </div>
            {'question' in exercise && (
              <p className="text-center text-gray-700">
                {getLocalized(exercise.question)}
              </p>
            )}
            <div className="grid grid-cols-1 gap-3">
              {'choices' in exercise && exercise.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(choice.text)}
                  disabled={result !== null}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === choice.text
                      ? result === 'correct'
                        ? 'border-green-500 bg-green-50'
                        : result === 'wrong' && choice.isCorrect
                          ? 'border-green-500 bg-green-50'
                          : result === 'wrong'
                            ? 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                      : result !== null && choice.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-lg">{choice.text}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'listen-type':
        return (
          <div className="space-y-6">
            <div className="flex justify-center">
              <button
                onClick={playAudio}
                className="p-6 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
              >
                <Volume2 className="w-12 h-12 text-purple-600" />
              </button>
            </div>
            <p className="text-center text-gray-600">
              {getLocalized(config.description)}
            </p>
            {'showHint' in exercise && exercise.showHint && 'hint' in exercise && (
              <p className="text-center text-blue-600">힌트: {exercise.hint}</p>
            )}
            <input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder="들은 내용을 입력하세요"
              disabled={result !== null}
              className={`w-full p-4 text-xl text-center border-2 rounded-xl ${
                result === 'correct'
                  ? 'border-green-500 bg-green-50'
                  : result === 'wrong'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {result === 'wrong' && 'audioText' in exercise && (
              <p className="text-center text-green-600">
                정답: {exercise.audioText}
              </p>
            )}
          </div>
        );

      // ===== SPEAKING EXERCISES =====
      case 'listen-repeat':
      case 'speak-word':
      case 'speak-sentence':
        const targetText = exercise.type === 'listen-repeat' && 'targetText' in exercise
          ? exercise.targetText
          : exercise.type === 'speak-word' && 'word' in exercise
            ? exercise.word.korean
            : exercise.type === 'speak-sentence' && 'sentence' in exercise
              ? exercise.sentence
              : '';
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="text-2xl font-medium mb-2">{targetText}</p>
              <button
                onClick={playAudio}
                className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
            <p className="text-center text-gray-600">
              {getLocalized(config.description)}
            </p>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={startSpeechRecognition}
                disabled={isListening || result !== null}
                className={`p-6 rounded-full transition-all ${
                  isListening
                    ? 'bg-red-500 animate-pulse'
                    : result !== null
                      ? result === 'correct'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
              {isListening && (
                <p className="text-red-500 animate-pulse">듣고 있어요...</p>
              )}
              {typedAnswer && (
                <div className="text-center">
                  <p className="text-lg">{typedAnswer}</p>
                  {pronunciationScore !== null && (
                    <p className={`text-sm ${
                      pronunciationScore >= 70 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      발음 점수: {pronunciationScore}%
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'speak-answer':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              {'question' in exercise && (
                <>
                  <p className="text-xl font-medium mb-2">{exercise.question}</p>
                  {'questionTranslation' in exercise && (
                    <p className="text-gray-500">
                      {getLocalized(exercise.questionTranslation)}
                    </p>
                  )}
                </>
              )}
              <button
                onClick={playAudio}
                className="mt-2 p-2 text-blue-500 hover:bg-blue-100 rounded-full"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={startSpeechRecognition}
                disabled={isListening || result !== null}
                className={`p-6 rounded-full transition-all ${
                  isListening
                    ? 'bg-red-500 animate-pulse'
                    : result !== null
                      ? result === 'correct'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
              {typedAnswer && (
                <p className="text-lg text-center">{typedAnswer}</p>
              )}
            </div>
          </div>
        );

      case 'speak-describe':
        return (
          <div className="space-y-6">
            {'imageUrl' in exercise && (
              <img
                src={exercise.imageUrl}
                alt={'imageAlt' in exercise ? exercise.imageAlt : ''}
                className="w-full max-w-md mx-auto rounded-xl shadow-lg"
              />
            )}
            {'promptText' in exercise && (
              <p className="text-center text-gray-700">
                {getLocalized(exercise.promptText)}
              </p>
            )}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={startSpeechRecognition}
                disabled={isListening || result !== null}
                className={`p-6 rounded-full transition-all ${
                  isListening
                    ? 'bg-red-500 animate-pulse'
                    : result !== null
                      ? result === 'correct'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
              {typedAnswer && (
                <p className="text-lg text-center">{typedAnswer}</p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500">
            지원하지 않는 활동 유형입니다
          </div>
        );
    }
  };

  const canCheck = () => {
    switch (exercise.type) {
      case 'word-match':
      case 'word-picture':
      case 'word-audio':
      case 'fill-blank':
      case 'grammar-choice':
      case 'listen-select':
        return selectedAnswer !== null;
      case 'word-spell':
      case 'translate':
      case 'listen-type':
        return typedAnswer.trim().length > 0;
      case 'word-order':
        return 'shuffledWords' in exercise && orderedWords.length === exercise.shuffledWords.length;
      case 'listen-repeat':
      case 'speak-word':
      case 'speak-sentence':
      case 'speak-answer':
      case 'speak-describe':
        return pronunciationScore !== null;
      default:
        return false;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Exercise Type Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <span className="text-sm font-medium text-gray-600">
            {getLocalized(config.name)}
          </span>
        </div>
        {showHint && 'hint' in exercise && !hintShown && (
          <button
            onClick={() => setHintShown(true)}
            className="flex items-center gap-1 text-blue-500 text-sm hover:text-blue-600"
          >
            <HelpCircle className="w-4 h-4" />
            {t('hint')}
          </button>
        )}
      </div>

      {/* Hint Display */}
      {hintShown && 'hint' in exercise && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-sm">{exercise.hint}</p>
        </div>
      )}

      {/* Exercise Content */}
      <div className="mb-6">
        {renderExercise()}
      </div>

      {/* Result Display */}
      {result && (
        <div className={`mb-4 p-4 rounded-xl flex items-center justify-center gap-2 ${
          result === 'correct'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {result === 'correct' ? (
            <>
              <Check className="w-6 h-6" />
              <span className="font-bold">{t('correct')}</span>
            </>
          ) : (
            <>
              <X className="w-6 h-6" />
              <span className="font-bold">{t('wrong')}</span>
            </>
          )}
        </div>
      )}

      {/* Action Button */}
      {result === null && (
        <button
          onClick={checkAnswer}
          disabled={!canCheck() || isChecking}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            canCheck() && !isChecking
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isChecking ? '확인 중...' : '확인'}
        </button>
      )}
    </div>
  );
}
