'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Bell,
  Plus,
  AlertCircle,
  AlertTriangle,
  Info,
  Send,
  X,
  RefreshCw
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';

type Locale = 'ko' | 'mn' | 'ru' | 'vi';

type Announcement = {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'important' | 'urgent';
  translations: {
    ko: { title: string; content: string };
    mn: { title: string; content: string };
    ru: { title: string; content: string };
    vi: { title: string; content: string };
  };
  createdAt: number;
  author: string;
};

const titles: Record<Locale, string> = {
  ko: '공지사항',
  mn: 'Зарлал',
  ru: 'Объявления',
  vi: 'Thông báo',
};

const priorityColors = {
  normal: 'bg-blue-50 border-blue-200',
  important: 'bg-yellow-50 border-yellow-200',
  urgent: 'bg-red-50 border-red-200',
};

const priorityIcons = {
  normal: Info,
  important: AlertTriangle,
  urgent: AlertCircle,
};

const priorityLabels: Record<Locale, Record<string, string>> = {
  ko: { normal: '일반', important: '중요', urgent: '긴급' },
  mn: { normal: 'Энгийн', important: 'Чухал', urgent: 'Яаралтай' },
  ru: { normal: 'Обычное', important: 'Важное', urgent: 'Срочное' },
  vi: { normal: 'Bình thường', important: 'Quan trọng', urgent: 'Khẩn cấp' },
};

function formatTimeAgo(timestamp: number, locale: Locale): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  const timeStrings: Record<Locale, { min: string; hour: string; day: string; now: string }> = {
    ko: { min: '분 전', hour: '시간 전', day: '일 전', now: '방금' },
    mn: { min: 'минутын өмнө', hour: 'цагийн өмнө', day: 'өдрийн өмнө', now: 'Сая' },
    ru: { min: 'мин. назад', hour: 'ч. назад', day: 'дн. назад', now: 'Сейчас' },
    vi: { min: 'phút trước', hour: 'giờ trước', day: 'ngày trước', now: 'Vừa xong' },
  };

  if (minutes < 1) return timeStrings[locale].now;
  if (minutes < 60) return `${minutes} ${timeStrings[locale].min}`;
  if (hours < 24) return `${hours} ${timeStrings[locale].hour}`;
  return `${days} ${timeStrings[locale].day}`;
}

export default function AnnouncementsPage() {
  const { locale } = useParams();
  const currentLocale = (locale as Locale) || 'ko';

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isTeacherMode, setIsTeacherMode] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      if (data.announcements) {
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
    // Poll every 30 seconds
    const interval = setInterval(fetchAnnouncements, 30000);
    return () => clearInterval(interval);
  }, [fetchAnnouncements]);

  const handleSubmit = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          priority: newPriority,
        }),
      });

      if (res.ok) {
        setNewTitle('');
        setNewContent('');
        setNewPriority('normal');
        setShowCreateForm(false);
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Failed to create announcement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-oat-50">
      <Header showBack title={titles[currentLocale]} />

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setIsTeacherMode(false)}
            className={`flex-1 py-2 px-4 rounded-xl transition-colors ${
              !isTeacherMode
                ? 'bg-oat-800 text-white'
                : 'bg-white/50 text-oat-600 hover:bg-white'
            }`}
          >
            {currentLocale === 'ko' ? '학생 보기' :
             currentLocale === 'mn' ? 'Сурагч' :
             currentLocale === 'ru' ? 'Ученик' : 'Học sinh'}
          </button>
          <button
            onClick={() => setIsTeacherMode(true)}
            className={`flex-1 py-2 px-4 rounded-xl transition-colors ${
              isTeacherMode
                ? 'bg-oat-800 text-white'
                : 'bg-white/50 text-oat-600 hover:bg-white'
            }`}
          >
            {currentLocale === 'ko' ? '교사 모드' :
             currentLocale === 'mn' ? 'Багш' :
             currentLocale === 'ru' ? 'Учитель' : 'Giáo viên'}
          </button>
        </div>

        {/* Teacher: Create announcement button */}
        {isTeacherMode && !showCreateForm && (
          <GlassButton
            variant="primary"
            onClick={() => setShowCreateForm(true)}
            className="w-full"
          >
            <Plus className="w-5 h-5 mr-2" />
            새 공지 작성
          </GlassButton>
        )}

        {/* Create form */}
        {showCreateForm && (
          <GlassCard className="bg-white/90">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-oat-900">새 공지 작성</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-1 rounded-full hover:bg-oat-100"
              >
                <X className="w-5 h-5 text-oat-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-oat-700 mb-1">
                  제목
                </label>
                <GlassInput
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="공지 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-oat-700 mb-1">
                  내용
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="공지 내용을 입력하세요"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-oat-200 focus:border-oat-400 focus:ring-2 focus:ring-oat-200 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-oat-700 mb-2">
                  중요도
                </label>
                <div className="flex gap-2">
                  {(['normal', 'important', 'urgent'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewPriority(p)}
                      className={`flex-1 py-2 px-3 rounded-xl border-2 transition-colors ${
                        newPriority === p
                          ? priorityColors[p] + ' border-current'
                          : 'bg-white/50 border-transparent hover:bg-oat-50'
                      }`}
                    >
                      {priorityLabels.ko[p]}
                    </button>
                  ))}
                </div>
              </div>

              <GlassButton
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    번역 중...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    공지 등록 (자동 번역)
                  </>
                )}
              </GlassButton>
            </div>
          </GlassCard>
        )}

        {/* Refresh button */}
        <div className="flex justify-end">
          <button
            onClick={fetchAnnouncements}
            className="flex items-center gap-1 text-sm text-oat-500 hover:text-oat-700"
          >
            <RefreshCw className="w-4 h-4" />
            새로고침
          </button>
        </div>

        {/* Announcements list */}
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-oat-400 animate-spin mx-auto mb-2" />
            <p className="text-oat-500">
              {currentLocale === 'ko' ? '로딩 중...' :
               currentLocale === 'mn' ? 'Ачаалж байна...' :
               currentLocale === 'ru' ? 'Загрузка...' : 'Đang tải...'}
            </p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-oat-300 mx-auto mb-3" />
            <p className="text-oat-500">
              {currentLocale === 'ko' ? '공지사항이 없습니다' :
               currentLocale === 'mn' ? 'Зарлал байхгүй' :
               currentLocale === 'ru' ? 'Нет объявлений' : 'Không có thông báo'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => {
              const PriorityIcon = priorityIcons[announcement.priority];
              const translation = announcement.translations[currentLocale] ||
                                  announcement.translations.ko;

              return (
                <GlassCard
                  key={announcement.id}
                  className={`${priorityColors[announcement.priority]} border`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      announcement.priority === 'urgent' ? 'bg-red-100' :
                      announcement.priority === 'important' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <PriorityIcon className={`w-5 h-5 ${
                        announcement.priority === 'urgent' ? 'text-red-600' :
                        announcement.priority === 'important' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          announcement.priority === 'urgent' ? 'bg-red-200 text-red-700' :
                          announcement.priority === 'important' ? 'bg-yellow-200 text-yellow-700' :
                          'bg-blue-200 text-blue-700'
                        }`}>
                          {priorityLabels[currentLocale][announcement.priority]}
                        </span>
                        <span className="text-xs text-oat-500">
                          {formatTimeAgo(announcement.createdAt, currentLocale)}
                        </span>
                      </div>
                      <h3 className="font-bold text-oat-900 mb-1">
                        {translation.title}
                      </h3>
                      <p className="text-oat-700 text-sm whitespace-pre-wrap">
                        {translation.content}
                      </p>

                      {/* Show original Korean if not Korean locale */}
                      {currentLocale !== 'ko' && (
                        <div className="mt-3 pt-3 border-t border-oat-200">
                          <p className="text-xs text-oat-500 mb-1">원문 (Korean):</p>
                          <p className="text-sm text-oat-600">
                            <span className="font-medium">{announcement.translations.ko.title}</span>
                            {' - '}
                            {announcement.translations.ko.content}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* Usage tip */}
        <div className="bg-oat-100 rounded-2xl p-4 text-center mt-6">
          <p className="text-oat-600 text-sm">
            {currentLocale === 'ko' ? '💡 공지사항은 자동으로 4개 언어로 번역됩니다' :
             currentLocale === 'mn' ? '💡 Зарлал автоматаар 4 хэл рүү орчуулагдана' :
             currentLocale === 'ru' ? '💡 Объявления автоматически переводятся на 4 языка' :
             '💡 Thông báo được tự động dịch sang 4 ngôn ngữ'}
          </p>
        </div>
      </main>
    </div>
  );
}
