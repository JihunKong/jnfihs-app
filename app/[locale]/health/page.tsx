'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Thermometer, Check, AlertCircle, Smile, Meh, Frown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput, GlassTextarea } from '@/components/ui/GlassInput';

type HealthCheck = {
  id: number;
  student_id: string;
  temperature: number;
  symptoms: string[];
  feeling: 'good' | 'okay' | 'bad';
  notes: string;
  check_date: string;
};

const SYMPTOMS = [
  { id: 'cough', icon: '🤧' },
  { id: 'headache', icon: '🤕' },
  { id: 'fatigue', icon: '😴' },
  { id: 'soreThroat', icon: '😷' },
  { id: 'runnyNose', icon: '🤒' },
  { id: 'bodyAche', icon: '💪' },
];

export default function HealthPage() {
  const t = useTranslations('health');
  const [todayCheck, setTodayCheck] = useState<HealthCheck | null>(null);
  const [history, setHistory] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [temperature, setTemperature] = useState('36.5');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [feeling, setFeeling] = useState<'good' | 'okay' | 'bad'>('good');
  const [notes, setNotes] = useState('');

  const studentId = 'student-001';
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodayCheck();
    fetchHistory();
  }, []);

  const fetchTodayCheck = async () => {
    try {
      const res = await fetch(`/api/health?studentId=${studentId}&date=${today}`);
      const data = await res.json();
      if (data.check) {
        setTodayCheck(data.check);
        setTemperature(String(data.check.temperature));
        setSymptoms(data.check.symptoms || []);
        setFeeling(data.check.feeling);
        setNotes(data.check.notes || '');
      }
    } catch (error) {
      console.error('Failed to fetch today check:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/health?studentId=${studentId}`);
      const data = await res.json();
      setHistory(data.checks || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          temperature: parseFloat(temperature),
          symptoms,
          feeling,
          notes,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        fetchTodayCheck();
        fetchHistory();
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptomId: string) => {
    setSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((s) => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const getFeelingIcon = (f: string) => {
    switch (f) {
      case 'good':
        return <Smile className="w-6 h-6" />;
      case 'okay':
        return <Meh className="w-6 h-6" />;
      case 'bad':
        return <Frown className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-oat-50 pb-24">
      <Header showBack title={t('title')} />

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Today's Status */}
        {todayCheck && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">{t('alreadySubmitted')}</span>
          </div>
        )}

        {/* Health Check Form */}
        <GlassCard>
          <h2 className="text-lg font-bold text-oat-900 mb-4">{t('dailyCheck')}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-oat-700 mb-2">
                {t('temperature')}
              </label>
              <div className="flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-oat-500" />
                <input
                  type="number"
                  step="0.1"
                  min="35"
                  max="42"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="glass-input w-24 text-center text-lg font-medium"
                />
                <span className="text-oat-600">°C</span>
              </div>
            </div>

            {/* Feeling */}
            <div>
              <label className="block text-sm font-medium text-oat-700 mb-3">
                {t('howAreYou')}
              </label>
              <div className="flex gap-3">
                {(['good', 'okay', 'bad'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFeeling(f)}
                    className={`flex-1 p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      feeling === f
                        ? f === 'good'
                          ? 'bg-green-100 text-green-700 ring-2 ring-green-400'
                          : f === 'okay'
                          ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400'
                          : 'bg-red-100 text-red-700 ring-2 ring-red-400'
                        : 'bg-oat-100 text-oat-500 hover:bg-oat-200'
                    }`}
                  >
                    {getFeelingIcon(f)}
                    <span className="text-sm font-medium">{t(`feelings.${f}`)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium text-oat-700 mb-3">
                {t('symptoms')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SYMPTOMS.map((symptom) => (
                  <button
                    key={symptom.id}
                    type="button"
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
                      symptoms.includes(symptom.id)
                        ? 'bg-oat-300 ring-2 ring-oat-500'
                        : 'bg-oat-100 hover:bg-oat-200'
                    }`}
                  >
                    <span className="text-xl">{symptom.icon}</span>
                    <span className="text-xs text-oat-700">{t(`symptomList.${symptom.id}`)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <GlassTextarea
              label={t('additionalNotes')}
              placeholder={t('notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />

            {/* Submit */}
            <GlassButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? t('submitting') : todayCheck ? t('update') : t('submit')}
            </GlassButton>

            {submitted && (
              <p className="text-center text-green-600 text-sm">{t('submitted')}</p>
            )}
          </form>
        </GlassCard>

        {/* History */}
        <div>
          <h2 className="text-lg font-bold text-oat-900 mb-3">{t('weeklyHistory')}</h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateStr = date.toISOString().split('T')[0];
              const check = history.find((h) => h.check_date === dateStr);

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${
                    check
                      ? check.feeling === 'good'
                        ? 'bg-green-100 text-green-700'
                        : check.feeling === 'okay'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                      : 'bg-oat-100 text-oat-400'
                  }`}
                >
                  <span className="font-medium">
                    {date.toLocaleDateString('ko-KR', { weekday: 'short' })}
                  </span>
                  <span>{date.getDate()}</span>
                  {check && <span className="mt-1">{getFeelingIcon(check.feeling)}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
