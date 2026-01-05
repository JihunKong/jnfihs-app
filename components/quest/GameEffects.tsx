'use client';

import { useEffect, useState, useCallback } from 'react';

// ============================================
// Confetti Effect
// ============================================

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  velocityY: number;
  velocityX: number;
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  onComplete?: () => void;
}

export function Confetti({ active, duration = 3000, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const newPieces: ConfettiPiece[] = [];

    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        velocityY: 2 + Math.random() * 3,
        velocityX: (Math.random() - 0.5) * 4
      });
    }

    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [active, duration, onComplete]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            animationDuration: `${2 + Math.random()}s`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}

// ============================================
// XP Float Animation
// ============================================

interface XPFloatProps {
  amount: number;
  x?: number;
  y?: number;
  onComplete?: () => void;
}

export function XPFloat({ amount, x = 50, y = 50, onComplete }: XPFloatProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 animate-float-up"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold shadow-lg">
        <span className="text-lg">+{amount}</span>
        <span className="text-sm">XP</span>
      </div>
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1.2);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// ============================================
// Streak Fire Animation
// ============================================

interface StreakFireProps {
  streak: number;
  active: boolean;
}

export function StreakFire({ streak, active }: StreakFireProps) {
  if (!active || streak < 3) return null;

  const intensity = Math.min(streak / 10, 1);

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute animate-pulse"
        style={{
          filter: `drop-shadow(0 0 ${8 + intensity * 12}px #FF6B00)`
        }}
      >
        <span className="text-4xl">🔥</span>
      </div>
      <div className="relative z-10 flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold">
        <span className="text-2xl">🔥</span>
        <span>{streak} 연속!</span>
      </div>
    </div>
  );
}

// ============================================
// Achievement Unlock Animation
// ============================================

interface AchievementUnlockProps {
  icon: string;
  name: string;
  xpReward: number;
  onClose?: () => void;
}

export function AchievementUnlock({ icon, name, xpReward, onClose }: AchievementUnlockProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-achievement-pop bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-2xl text-center">
        <div className="text-5xl mb-3 animate-bounce">{icon}</div>
        <h3 className="text-white font-bold text-xl mb-1">성취 달성!</h3>
        <p className="text-white/90 font-medium">{name}</p>
        <div className="mt-3 bg-white/20 rounded-full px-4 py-1 text-white font-bold">
          +{xpReward} XP
        </div>
      </div>
      <style jsx>{`
        @keyframes achievement-pop {
          0% {
            transform: scale(0) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        .animate-achievement-pop {
          animation: achievement-pop 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// ============================================
// Correct/Wrong Feedback
// ============================================

interface FeedbackFlashProps {
  type: 'correct' | 'wrong';
  active: boolean;
}

export function FeedbackFlash({ type, active }: FeedbackFlashProps) {
  if (!active) return null;

  const bgColor = type === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20';
  const borderColor = type === 'correct' ? 'border-green-500' : 'border-red-500';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-40 ${bgColor} border-4 ${borderColor} animate-flash`}
    >
      <style jsx>{`
        @keyframes flash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: flash 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// ============================================
// Level Up Animation
// ============================================

interface LevelUpProps {
  newLevel: number;
  onClose?: () => void;
}

export function LevelUp({ newLevel, onClose }: LevelUpProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 animate-fade-in">
      <div className="animate-level-up-pop">
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-8 rounded-3xl shadow-2xl text-center">
          <div className="text-6xl mb-4">⬆️</div>
          <h2 className="text-white font-bold text-2xl mb-2">레벨 업!</h2>
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-purple-600">{newLevel}</span>
          </div>
          <p className="text-white/80">축하합니다!</p>
        </div>
      </div>
      <Confetti active={true} />
      <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes level-up-pop {
          0% { transform: scale(0.5) translateY(50px); opacity: 0; }
          70% { transform: scale(1.1) translateY(-10px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-level-up-pop {
          animation: level-up-pop 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// ============================================
// Progress Bar Animation
// ============================================

interface AnimatedProgressBarProps {
  progress: number;
  maxProgress: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
}

export function AnimatedProgressBar({
  progress,
  maxProgress,
  color = 'bg-blue-500',
  height = 'h-3',
  showLabel = false
}: AnimatedProgressBarProps) {
  const percentage = Math.min((progress / maxProgress) * 100, 100);

  return (
    <div className="relative">
      <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">
            {progress} / {maxProgress}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// Star Rating Animation
// ============================================

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function StarRating({ stars, maxStars = 3, size = 'md', animated = true }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < stars;
        const delay = animated ? index * 0.2 : 0;

        return (
          <div
            key={index}
            className={`${sizeClasses[size]} ${animated ? 'animate-star-pop' : ''}`}
            style={{ animationDelay: `${delay}s` }}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-full h-full ${
                isFilled
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 fill-gray-300'
              }`}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        );
      })}
      <style jsx>{`
        @keyframes star-pop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .animate-star-pop {
          animation: star-pop 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

// ============================================
// Game Effects Manager Hook
// ============================================

export function useGameEffects() {
  const [confetti, setConfetti] = useState(false);
  const [xpFloats, setXpFloats] = useState<Array<{ id: number; amount: number; x: number; y: number }>>([]);
  const [achievement, setAchievement] = useState<{ icon: string; name: string; xpReward: number } | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const showConfetti = useCallback(() => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  }, []);

  const showXPFloat = useCallback((amount: number, x?: number, y?: number) => {
    const id = Date.now();
    setXpFloats(prev => [...prev, { id, amount, x: x ?? 50, y: y ?? 30 }]);
    setTimeout(() => {
      setXpFloats(prev => prev.filter(f => f.id !== id));
    }, 1500);
  }, []);

  const showAchievement = useCallback((icon: string, name: string, xpReward: number) => {
    setAchievement({ icon, name, xpReward });
    setTimeout(() => setAchievement(null), 4000);
  }, []);

  const showLevelUp = useCallback((newLevel: number) => {
    setLevelUp(newLevel);
  }, []);

  const showFeedback = useCallback((type: 'correct' | 'wrong') => {
    setFeedback(type);
    setTimeout(() => setFeedback(null), 300);
  }, []);

  const EffectsRenderer = useCallback(() => (
    <>
      <Confetti active={confetti} />
      {xpFloats.map(float => (
        <XPFloat key={float.id} amount={float.amount} x={float.x} y={float.y} />
      ))}
      {achievement && (
        <AchievementUnlock
          icon={achievement.icon}
          name={achievement.name}
          xpReward={achievement.xpReward}
          onClose={() => setAchievement(null)}
        />
      )}
      {levelUp !== null && (
        <LevelUp newLevel={levelUp} onClose={() => setLevelUp(null)} />
      )}
      {feedback && <FeedbackFlash type={feedback} active={true} />}
    </>
  ), [confetti, xpFloats, achievement, levelUp, feedback]);

  return {
    showConfetti,
    showXPFloat,
    showAchievement,
    showLevelUp,
    showFeedback,
    EffectsRenderer
  };
}
