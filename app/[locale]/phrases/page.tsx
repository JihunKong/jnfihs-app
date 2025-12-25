'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Volume2, Search, ArrowLeft, Copy, Check, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { phraseCategories, searchPhrases, type PhraseCategory, type Phrase } from '@/lib/phrases';

type Locale = 'ko' | 'mn' | 'ru' | 'vi';

const titles: Record<Locale, string> = {
  ko: '교실 필수 문장',
  mn: 'Хичээлийн хэллэгүүд',
  ru: 'Полезные фразы',
  vi: 'Cụm từ hữu ích',
};

const searchPlaceholder: Record<Locale, string> = {
  ko: '문장 검색...',
  mn: 'Хэллэг хайх...',
  ru: 'Поиск фраз...',
  vi: 'Tìm cụm từ...',
};

const categoryColors: Record<string, string> = {
  classroom: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  dormitory: 'from-green-500/20 to-green-600/20 border-green-500/30',
  cafeteria: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  health: 'from-red-500/20 to-red-600/20 border-red-500/30',
  office: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
};

export default function PhrasesPage() {
  const { locale } = useParams();
  const currentLocale = (locale as Locale) || 'ko';

  const [selectedCategory, setSelectedCategory] = useState<PhraseCategory | null>(null);
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchPhrases(searchQuery);
  }, [searchQuery]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Phrase detail view
  if (selectedPhrase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-oat-50">
        <Header showBack title={titles[currentLocale]} />

        <main className="max-w-2xl mx-auto p-4">
          <button
            onClick={() => setSelectedPhrase(null)}
            className="flex items-center gap-2 text-oat-600 mb-4 hover:text-oat-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            뒤로
          </button>

          {/* Main phrase card */}
          <GlassCard className="bg-white/80 text-center mb-6">
            <div className="py-6">
              {/* Korean - Large */}
              <p className="text-4xl font-bold text-oat-900 mb-6">
                {selectedPhrase.ko}
              </p>

              {/* Divider */}
              <div className="border-t border-oat-200 my-6" />

              {/* All translations */}
              <div className="space-y-3 text-left px-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <span className="text-2xl">🇲🇳</span>
                  <p className="text-lg">{selectedPhrase.mn}</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                  <span className="text-2xl">🇷🇺</span>
                  <p className="text-lg">{selectedPhrase.ru}</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                  <span className="text-2xl">🇻🇳</span>
                  <p className="text-lg">{selectedPhrase.vi}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Actions */}
          <div className="flex gap-3">
            <GlassButton
              variant="primary"
              className="flex-1"
              onClick={() => speakText(selectedPhrase.ko)}
            >
              <Volume2 className="w-5 h-5 mr-2" />
              발음 듣기
            </GlassButton>

            <GlassButton
              className="flex-1"
              onClick={() => copyText(selectedPhrase.ko)}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  복사
                </>
              )}
            </GlassButton>
          </div>

          {/* Tip */}
          <div className="mt-6 bg-oat-100 rounded-2xl p-4 text-center">
            <p className="text-oat-600">
              📱 이 화면을 선생님께 보여주세요
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Category phrases view
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-oat-50">
        <Header
          showBack
          title={`${selectedCategory.emoji} ${selectedCategory.name[currentLocale]}`}
        />

        <main className="max-w-2xl mx-auto p-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-oat-600 mb-4 hover:text-oat-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            카테고리로 돌아가기
          </button>

          <div className="grid gap-3">
            {selectedCategory.phrases.map((phrase) => (
              <GlassCard
                key={phrase.id}
                onClick={() => setSelectedPhrase(phrase)}
                className={`cursor-pointer hover:scale-[1.02] transition-transform bg-gradient-to-br ${categoryColors[selectedCategory.id]}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-oat-900 text-lg">{phrase.ko}</p>
                    <p className="text-sm text-oat-600 mt-1">{phrase[currentLocale]}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(phrase.ko);
                    }}
                    className="p-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors"
                  >
                    <Volume2 className="w-5 h-5 text-oat-600" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Main view with search and categories
  return (
    <div className="min-h-screen bg-oat-50">
      <Header showBack title={titles[currentLocale]} />

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <GlassInput
            type="text"
            placeholder={searchPlaceholder[currentLocale]}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-oat-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-oat-200"
            >
              <X className="w-4 h-4 text-oat-500" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-oat-800">
              검색 결과 ({searchResults.length}개)
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid gap-2">
                {searchResults.map((phrase) => (
                  <GlassCard
                    key={phrase.id}
                    onClick={() => setSelectedPhrase(phrase)}
                    className="cursor-pointer hover:scale-[1.01] transition-transform"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-oat-900">{phrase.ko}</p>
                        <p className="text-sm text-oat-600">{phrase[currentLocale]}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(phrase.ko);
                        }}
                        className="p-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors"
                      >
                        <Volume2 className="w-4 h-4 text-oat-600" />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <p className="text-center text-oat-500 py-8">
                검색 결과가 없습니다
              </p>
            )}
          </div>
        )}

        {/* Categories */}
        {!searchQuery && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-oat-800">카테고리</h2>

            {phraseCategories.map((category) => (
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
                    {category.phrases.length}개
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Quick phrases */}
        {!searchQuery && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-oat-800">자주 쓰는 문장</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                phraseCategories[0].phrases[0], // 안녕하세요
                phraseCategories[0].phrases[1], // 감사합니다
                phraseCategories[0].phrases[4], // 이해 못했어요
                phraseCategories[0].phrases[6], // 천천히 말해주세요
                phraseCategories[0].phrases[8], // 화장실
                phraseCategories[3].phrases[0], // 아파요
              ].map((phrase) => (
                <button
                  key={phrase.id}
                  onClick={() => setSelectedPhrase(phrase)}
                  className="p-3 rounded-xl bg-white/50 border border-oat-200 hover:bg-white hover:border-oat-300 transition-colors text-left"
                >
                  <p className="font-medium text-oat-900 text-sm">{phrase.ko}</p>
                  <p className="text-xs text-oat-500">{phrase[currentLocale]}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Usage tip */}
        <div className="bg-oat-100 rounded-2xl p-4 text-center">
          <p className="text-oat-600 text-sm">
            💡 문장을 클릭하면 발음을 듣고 복사할 수 있어요
          </p>
          <p className="text-oat-500 text-xs mt-1">
            선생님께 화면을 보여주세요
          </p>
        </div>
      </main>
    </div>
  );
}
