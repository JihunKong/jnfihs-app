'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Volume2, ArrowLeft, Copy, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { bodyParts, type BodyPart, type Symptom } from '@/lib/health-symptoms';

type Locale = 'ko' | 'mn' | 'ru' | 'vi';

const titles: Record<Locale, string> = {
  ko: '어디가 아파요?',
  mn: 'Хаана өвдөж байна?',
  ru: 'Где болит?',
  vi: 'Đau ở đâu?',
};

const showToNurse: Record<Locale, string> = {
  ko: '보건 선생님께 보여주세요',
  mn: 'Эмч багшдаа үзүүлнэ үү',
  ru: 'Покажите медсестре',
  vi: 'Hãy cho y tá xem',
};

export default function HealthPointerPage() {
  const { locale } = useParams();
  const currentLocale = (locale as Locale) || 'ko';

  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [copied, setCopied] = useState(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
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

  // Result screen - show to nurse
  if (selectedSymptom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-oat-50">
        <Header showBack title={showToNurse[currentLocale]} />

        <main className="max-w-2xl mx-auto p-4">
          <button
            onClick={() => setSelectedSymptom(null)}
            className="flex items-center gap-2 text-oat-600 mb-4 hover:text-oat-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            다른 증상 선택
          </button>

          {/* Main display card */}
          <GlassCard className="bg-white/80 text-center mb-6">
            <div className="py-6">
              <span className="text-6xl mb-4 block">{selectedSymptom.emoji}</span>

              {/* Korean - Large */}
              <p className="text-4xl font-bold text-oat-900 mb-2">
                {selectedSymptom.ko}
              </p>

              {selectedSymptom.description && (
                <p className="text-xl text-oat-600 mb-4">
                  {selectedSymptom.description.ko}
                </p>
              )}

              {/* Divider */}
              <div className="border-t border-oat-200 my-6" />

              {/* All translations */}
              <div className="space-y-3 text-left px-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <span className="text-2xl">🇲🇳</span>
                  <p className="text-lg">{selectedSymptom.mn}</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                  <span className="text-2xl">🇷🇺</span>
                  <p className="text-lg">{selectedSymptom.ru}</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                  <span className="text-2xl">🇻🇳</span>
                  <p className="text-lg">{selectedSymptom.vi}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Actions */}
          <div className="flex gap-3">
            <GlassButton
              variant="primary"
              className="flex-1"
              onClick={() => speakText(selectedSymptom.ko)}
            >
              <Volume2 className="w-5 h-5 mr-2" />
              발음 듣기
            </GlassButton>

            <GlassButton
              className="flex-1"
              onClick={() => copyText(selectedSymptom.ko)}
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
              📱 이 화면을 보건 선생님께 보여주세요
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Symptom selection for a body part
  if (selectedPart) {
    return (
      <div className="min-h-screen bg-oat-50">
        <Header
          showBack
          title={`${selectedPart.emoji} ${selectedPart.name[currentLocale]}`}
        />

        <main className="max-w-2xl mx-auto p-4">
          <button
            onClick={() => setSelectedPart(null)}
            className="flex items-center gap-2 text-oat-600 mb-4 hover:text-oat-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            다른 부위 선택
          </button>

          <h2 className="text-lg font-bold text-oat-800 mb-4">
            {selectedPart.name.ko}이(가) 어떻게 아파요?
          </h2>

          <div className="grid gap-3">
            {selectedPart.symptoms.map((symptom) => (
              <GlassCard
                key={symptom.id}
                onClick={() => setSelectedSymptom(symptom)}
                className="cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{symptom.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-oat-900 text-lg">{symptom.ko}</p>
                    <p className="text-sm text-oat-600">{symptom[currentLocale]}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Body part selection (main view)
  return (
    <div className="min-h-screen bg-oat-50">
      <Header showBack title={titles[currentLocale]} />

      <main className="max-w-4xl mx-auto p-4">
        {/* Visual body map - simplified grid */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-oat-800 mb-4 text-center">
            아픈 부위를 선택하세요
          </h2>

          {/* Body illustration with clickable areas */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {/* Top row: Head */}
            <div className="col-start-2">
              <button
                onClick={() => setSelectedPart(bodyParts.find(p => p.id === 'head')!)}
                className="w-full aspect-square rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 flex items-center justify-center text-4xl hover:scale-110 transition-transform shadow-lg"
              >
                🧠
              </button>
              <p className="text-center text-sm mt-1 text-oat-600">머리</p>
            </div>

            {/* Second row: Eyes, Nose, Throat */}
            <button
              onClick={() => setSelectedPart(bodyParts.find(p => p.id === 'eyes')!)}
              className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
            >
              👁️
            </button>
            <button
              onClick={() => setSelectedPart(bodyParts.find(p => p.id === 'nose')!)}
              className="aspect-square rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
            >
              👃
            </button>
            <button
              onClick={() => setSelectedPart(bodyParts.find(p => p.id === 'throat')!)}
              className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
            >
              🗣️
            </button>

            {/* Third row: Arm, Chest, Arm */}
            <button
              onClick={() => setSelectedPart(bodyParts.find(p => p.id === 'arm')!)}
              className="aspect-square rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
            >
              💪
            </button>
            <button
              onClick={() => setSelectedPart(bodyParts.find(p => p.id === 'chest')!)}
              className="aspect-square rounded-2xl bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-300 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
            >
              💗
            </button>
            <button
              onClick={() => setSelectedPart(bodyParts.find(p => p.id === 'skin')!)}
              className="aspect-square rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
            >
              🖐️
            </button>

            {/* Fourth row: Stomach */}
            <div className="col-start-2">
              <button
                onClick={() => setSelectedPart(bodyParts.find(p => p.id === 'stomach')!)}
                className="w-full aspect-square rounded-2xl bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
              >
                🤢
              </button>
              <p className="text-center text-sm mt-1 text-oat-600">배</p>
            </div>

            {/* Fifth row: Legs */}
            <button
              onClick={() => setSelectedPart(bodyParts.find(p => p.id === 'leg')!)}
              className="aspect-square rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 border-2 border-teal-300 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
            >
              🦵
            </button>
            <button
              onClick={() => setSelectedPart(bodyParts.find(p => p.id === 'general')!)}
              className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
            >
              😷
            </button>
            <button
              onClick={() => setSelectedPart(bodyParts.find(p => p.id === 'leg')!)}
              className="aspect-square rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 border-2 border-teal-300 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
            >
              🦶
            </button>
          </div>
        </div>

        {/* List view of all body parts */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-oat-600 mb-2">모든 부위</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {bodyParts.map((part) => (
              <button
                key={part.id}
                onClick={() => setSelectedPart(part)}
                className="flex items-center gap-2 p-3 rounded-xl bg-white/50 border border-oat-200 hover:bg-white hover:border-oat-300 transition-colors text-left"
              >
                <span className="text-2xl">{part.emoji}</span>
                <div>
                  <p className="font-medium text-oat-900 text-sm">{part.name.ko}</p>
                  <p className="text-xs text-oat-500">{part.name[currentLocale]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Usage tip */}
        <div className="mt-6 bg-oat-100 rounded-2xl p-4 text-center">
          <p className="text-oat-600 text-sm">
            💡 아픈 부위를 선택하고 → 증상을 선택하면
          </p>
          <p className="text-oat-600 text-sm">
            보건 선생님께 보여줄 수 있어요
          </p>
        </div>
      </main>
    </div>
  );
}
