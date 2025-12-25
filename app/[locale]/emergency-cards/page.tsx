'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Volume2, X, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { emergencyCards, type EmergencyCard, type CardCategory } from '@/lib/emergency-cards';

type Locale = 'ko' | 'mn' | 'ru' | 'vi';

const categoryColors: Record<string, string> = {
  health: 'from-red-500/20 to-red-600/20 border-red-500/30',
  classroom: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  dormitory: 'from-green-500/20 to-green-600/20 border-green-500/30',
  emergency: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
};

const titles: Record<Locale, string> = {
  ko: '긴급 상황 카드',
  mn: 'Яаралтай карт',
  ru: 'Экстренные карточки',
  vi: 'Thẻ khẩn cấp',
};

export default function EmergencyCardsPage() {
  const { locale } = useParams();
  const currentLocale = (locale as Locale) || 'ko';

  const [selectedCard, setSelectedCard] = useState<EmergencyCard | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | null>(null);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Full screen card display
  if (selectedCard) {
    return (
      <div
        className="fixed inset-0 bg-gradient-to-br from-oat-100 to-oat-200 z-50 flex flex-col items-center justify-center p-6"
        onClick={() => setSelectedCard(null)}
      >
        <button
          onClick={() => setSelectedCard(null)}
          className="absolute top-4 right-4 p-3 rounded-full bg-white/50 hover:bg-white/70 transition-colors"
        >
          <X className="w-6 h-6 text-oat-700" />
        </button>

        <div className="text-center max-w-2xl">
          <span className="text-8xl mb-8 block">{selectedCard.emoji}</span>

          {/* Korean - Large */}
          <p className="text-5xl md:text-6xl font-bold text-oat-900 mb-8">
            {selectedCard.ko}
          </p>

          {/* Other languages */}
          <div className="space-y-3 text-2xl text-oat-600">
            {currentLocale !== 'ko' && (
              <p className="text-3xl font-medium text-oat-700">
                {selectedCard[currentLocale]}
              </p>
            )}
            {currentLocale !== 'mn' && (
              <p>🇲🇳 {selectedCard.mn}</p>
            )}
            {currentLocale !== 'ru' && (
              <p>🇷🇺 {selectedCard.ru}</p>
            )}
            {currentLocale !== 'vi' && (
              <p>🇻🇳 {selectedCard.vi}</p>
            )}
          </div>

          {/* Speak button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              speakText(selectedCard.ko);
            }}
            className="mt-8 px-8 py-4 bg-oat-800 text-white rounded-2xl flex items-center gap-3 mx-auto text-xl hover:bg-oat-900 transition-colors"
          >
            <Volume2 className="w-6 h-6" />
            발음 듣기
          </button>
        </div>

        <p className="absolute bottom-8 text-oat-500 text-lg">
          화면을 탭하면 돌아갑니다
        </p>
      </div>
    );
  }

  // Category view
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-oat-50">
        <Header
          showBack
          title={selectedCategory.name[currentLocale]}
        />

        <main className="max-w-4xl mx-auto p-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-oat-600 mb-4 hover:text-oat-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            뒤로
          </button>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedCategory.cards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className={`p-4 rounded-2xl bg-gradient-to-br ${categoryColors[selectedCategory.id]} border backdrop-blur-sm hover:scale-105 transition-transform text-left`}
              >
                <span className="text-3xl mb-2 block">{card.emoji}</span>
                <p className="font-bold text-oat-900 text-lg mb-1">{card.ko}</p>
                <p className="text-sm text-oat-600">{card[currentLocale]}</p>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Main category selection
  return (
    <div className="min-h-screen bg-oat-50">
      <Header showBack title={titles[currentLocale]} />

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Quick access cards */}
        <div className="grid grid-cols-2 gap-3">
          {emergencyCards[0].cards.slice(0, 4).map((card) => (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="p-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 backdrop-blur-sm hover:scale-105 transition-transform text-left"
            >
              <span className="text-2xl mb-1 block">{card.emoji}</span>
              <p className="font-bold text-oat-900">{card.ko}</p>
              <p className="text-xs text-oat-600">{card[currentLocale]}</p>
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-oat-800">카테고리</h2>

          {emergencyCards.map((category) => (
            <GlassCard
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer hover:scale-[1.02] transition-transform bg-gradient-to-br ${categoryColors[category.id]}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{category.emoji}</span>
                  <div>
                    <p className="font-bold text-oat-900 text-lg">
                      {category.name.ko}
                    </p>
                    <p className="text-sm text-oat-600">
                      {category.name[currentLocale]}
                    </p>
                  </div>
                </div>
                <div className="text-oat-400">
                  {category.cards.length}개
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Usage tip */}
        <div className="bg-oat-100 rounded-2xl p-4 text-center">
          <p className="text-oat-600 text-sm">
            💡 카드를 선택하면 큰 화면으로 보여줄 수 있어요
          </p>
          <p className="text-oat-500 text-xs mt-1">
            선생님이나 친구에게 화면을 보여주세요
          </p>
        </div>
      </main>
    </div>
  );
}
