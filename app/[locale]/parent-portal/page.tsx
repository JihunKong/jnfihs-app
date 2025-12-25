'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Users,
  Bell,
  MessageSquare,
  Calendar,
  Newspaper,
  Send,
  Copy,
  Check,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';

type Locale = 'ko' | 'mn' | 'ru' | 'vi';

type SchoolEvent = {
  id: string;
  title: Record<Locale, string>;
  date: string;
  photos: string[];
  description: Record<Locale, string>;
};

type Newsletter = {
  id: string;
  title: Record<Locale, string>;
  date: string;
  content: Record<Locale, string>;
};

const titles: Record<Locale, string> = {
  ko: '학부모 포털',
  mn: 'Эцэг эхийн портал',
  ru: 'Портал для родителей',
  vi: 'Cổng thông tin phụ huynh',
};

const tabs: Record<Locale, { announcements: string; messages: string; events: string; news: string }> = {
  ko: { announcements: '공지사항', messages: '메시지 번역', events: '학교 행사', news: '학교 소식' },
  mn: { announcements: 'Зарлал', messages: 'Мессеж орчуулах', events: 'Сургуулийн арга хэмжээ', news: 'Мэдээ' },
  ru: { announcements: 'Объявления', messages: 'Перевод', events: 'Мероприятия', news: 'Новости' },
  vi: { announcements: 'Thông báo', messages: 'Dịch tin nhắn', events: 'Sự kiện', news: 'Tin tức' },
};

export default function ParentPortalPage() {
  const { locale } = useParams();
  const currentLocale = (locale as Locale) || 'ko';

  const [activeTab, setActiveTab] = useState<'announcements' | 'messages' | 'events' | 'news'>('announcements');
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Message translation state
  const [inputMessage, setInputMessage] = useState('');
  const [translatedMessage, setTranslatedMessage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/parent-portal');
      const data = await res.json();
      if (data.events) setEvents(data.events);
      if (data.newsletters) setNewsletters(data.newsletters);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTranslate = async () => {
    if (!inputMessage.trim()) return;

    setIsTranslating(true);
    try {
      const res = await fetch('/api/parent-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          sourceLocale: currentLocale,
        }),
      });

      const data = await res.json();
      if (data.korean) {
        setTranslatedMessage(data.korean);
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(translatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      currentLocale === 'ko' ? 'ko-KR' :
      currentLocale === 'mn' ? 'mn-MN' :
      currentLocale === 'ru' ? 'ru-RU' : 'vi-VN',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  return (
    <div className="min-h-screen bg-oat-50">
      <Header showBack title={titles[currentLocale]} />

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Welcome message */}
        <GlassCard className="bg-gradient-to-br from-purple-100 to-blue-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/50 rounded-full">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-oat-900 text-lg">
                {currentLocale === 'ko' ? '환영합니다!' :
                 currentLocale === 'mn' ? 'Тавтай морилно уу!' :
                 currentLocale === 'ru' ? 'Добро пожаловать!' : 'Chào mừng!'}
              </h2>
              <p className="text-oat-600 text-sm">
                {currentLocale === 'ko' ? '자녀의 학교 생활을 확인하세요' :
                 currentLocale === 'mn' ? 'Хүүхдийнхээ сургуулийн амьдралыг харна уу' :
                 currentLocale === 'ru' ? 'Следите за школьной жизнью вашего ребёнка' :
                 'Theo dõi cuộc sống học đường của con bạn'}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Tab navigation */}
        <div className="grid grid-cols-4 gap-2">
          {(['announcements', 'messages', 'events', 'news'] as const).map((tab) => {
            const icons = {
              announcements: Bell,
              messages: MessageSquare,
              events: Calendar,
              news: Newspaper,
            };
            const Icon = icons[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-colors ${
                  activeTab === tab
                    ? 'bg-oat-800 text-white'
                    : 'bg-white/50 text-oat-600 hover:bg-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tabs[currentLocale][tab]}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'announcements' && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-oat-800 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {tabs[currentLocale].announcements}
            </h3>
            <p className="text-oat-600 text-sm">
              {currentLocale === 'ko' ? '학교 공지사항을 확인하세요' :
               currentLocale === 'mn' ? 'Сургуулийн зарлалыг үзнэ үү' :
               currentLocale === 'ru' ? 'Просмотрите школьные объявления' :
               'Xem thông báo của trường'}
            </p>
            <a
              href={`/${currentLocale}/announcements`}
              className="block"
            >
              <GlassCard className="hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-oat-600" />
                    <span className="font-medium text-oat-900">
                      {currentLocale === 'ko' ? '공지사항 보기' :
                       currentLocale === 'mn' ? 'Зарлал үзэх' :
                       currentLocale === 'ru' ? 'Смотреть объявления' :
                       'Xem thông báo'}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-oat-400" />
                </div>
              </GlassCard>
            </a>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-oat-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {tabs[currentLocale].messages}
            </h3>
            <p className="text-oat-600 text-sm">
              {currentLocale === 'ko' ? '학교에 보낼 메시지를 한국어로 번역해 드립니다' :
               currentLocale === 'mn' ? 'Сургуульд илгээх мессежийг солонгос хэлээр орчуулна' :
               currentLocale === 'ru' ? 'Переведём ваше сообщение на корейский' :
               'Chúng tôi sẽ dịch tin nhắn của bạn sang tiếng Hàn'}
            </p>

            <GlassCard className="bg-white/90">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-oat-700 mb-2">
                    {currentLocale === 'ko' ? '원문 (한국어 → 번역 필요 없음)' :
                     currentLocale === 'mn' ? 'Эх бичвэр (Монгол хэлээр)' :
                     currentLocale === 'ru' ? 'Ваше сообщение (на русском)' :
                     'Tin nhắn của bạn (bằng tiếng Việt)'}
                  </label>
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      currentLocale === 'ko' ? '메시지를 입력하세요...' :
                      currentLocale === 'mn' ? 'Мессежээ бичнэ үү...' :
                      currentLocale === 'ru' ? 'Введите сообщение...' :
                      'Nhập tin nhắn...'
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-oat-50 border border-oat-200 focus:border-oat-400 focus:ring-2 focus:ring-oat-200 outline-none resize-none"
                  />
                </div>

                <GlassButton
                  variant="primary"
                  onClick={handleTranslate}
                  disabled={isTranslating || !inputMessage.trim()}
                  className="w-full flex items-center justify-center whitespace-nowrap"
                >
                  {isTranslating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin flex-shrink-0" />
                      {currentLocale === 'ko' ? '번역 중...' :
                       currentLocale === 'mn' ? 'Орчуулж байна...' :
                       currentLocale === 'ru' ? 'Перевод...' : 'Đang dịch...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2 flex-shrink-0" />
                      {currentLocale === 'ko' ? '한국어로 번역' :
                       currentLocale === 'mn' ? 'Солонгос хэлрүү орчуулах' :
                       currentLocale === 'ru' ? 'Перевести на корейский' :
                       'Dịch sang tiếng Hàn'}
                    </>
                  )}
                </GlassButton>

                {translatedMessage && (
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex justify-between items-start mb-2">
                      <label className="text-sm font-medium text-green-700">
                        {currentLocale === 'ko' ? '번역 결과' :
                         currentLocale === 'mn' ? 'Орчуулсан' :
                         currentLocale === 'ru' ? 'Перевод (корейский)' :
                         'Bản dịch (tiếng Hàn)'}
                      </label>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            {currentLocale === 'ko' ? '복사됨' :
                             currentLocale === 'mn' ? 'Хуулсан' :
                             currentLocale === 'ru' ? 'Скопировано' : 'Đã sao chép'}
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            {currentLocale === 'ko' ? '복사' :
                             currentLocale === 'mn' ? 'Хуулах' :
                             currentLocale === 'ru' ? 'Копировать' : 'Sao chép'}
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-lg text-oat-900">{translatedMessage}</p>
                  </div>
                )}
              </div>
            </GlassCard>

            <div className="bg-oat-100 rounded-xl p-3 text-center">
              <p className="text-oat-600 text-sm">
                {currentLocale === 'ko' ? '💡 번역된 메시지를 복사해서 선생님께 보내세요' :
                 currentLocale === 'mn' ? '💡 Орчуулсан мессежийг хуулж багшид илгээнэ үү' :
                 currentLocale === 'ru' ? '💡 Скопируйте перевод и отправьте учителю' :
                 '💡 Sao chép bản dịch và gửi cho giáo viên'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-oat-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {tabs[currentLocale].events}
            </h3>

            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 text-oat-400 animate-spin mx-auto" />
              </div>
            ) : events.length === 0 ? (
              <p className="text-center text-oat-500 py-8">
                {currentLocale === 'ko' ? '등록된 행사가 없습니다' :
                 currentLocale === 'mn' ? 'Арга хэмжээ байхгүй' :
                 currentLocale === 'ru' ? 'Нет мероприятий' : 'Không có sự kiện'}
              </p>
            ) : (
              events.map((event) => (
                <GlassCard key={event.id} className="bg-white/80">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-oat-500 mb-1">
                        {formatDate(event.date)}
                      </p>
                      <h4 className="font-bold text-oat-900">
                        {event.title[currentLocale]}
                      </h4>
                      <p className="text-sm text-oat-600 mt-1">
                        {event.description[currentLocale]}
                      </p>
                      {event.photos.length > 0 && (
                        <p className="text-xs text-blue-600 mt-2">
                          📷 {event.photos.length} {
                            currentLocale === 'ko' ? '개의 사진' :
                            currentLocale === 'mn' ? 'зураг' :
                            currentLocale === 'ru' ? 'фото' : 'ảnh'
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-oat-800 flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              {tabs[currentLocale].news}
            </h3>

            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 text-oat-400 animate-spin mx-auto" />
              </div>
            ) : newsletters.length === 0 ? (
              <p className="text-center text-oat-500 py-8">
                {currentLocale === 'ko' ? '등록된 소식이 없습니다' :
                 currentLocale === 'mn' ? 'Мэдээ байхгүй' :
                 currentLocale === 'ru' ? 'Нет новостей' : 'Không có tin tức'}
              </p>
            ) : (
              newsletters.map((news) => (
                <GlassCard key={news.id} className="bg-white/80">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Newspaper className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-oat-500 mb-1">
                        {formatDate(news.date)}
                      </p>
                      <h4 className="font-bold text-oat-900">
                        {news.title[currentLocale]}
                      </h4>
                      <p className="text-sm text-oat-600 mt-2 whitespace-pre-wrap">
                        {news.content[currentLocale]}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}

        {/* Contact info */}
        <GlassCard className="bg-oat-100">
          <h4 className="font-bold text-oat-800 mb-2">
            {currentLocale === 'ko' ? '📞 학교 연락처' :
             currentLocale === 'mn' ? '📞 Сургуулийн холбоо барих' :
             currentLocale === 'ru' ? '📞 Контакты школы' : '📞 Liên hệ trường'}
          </h4>
          <div className="text-sm text-oat-600 space-y-1">
            <p>
              {currentLocale === 'ko' ? '교무실:' :
               currentLocale === 'mn' ? 'Багшийн өрөө:' :
               currentLocale === 'ru' ? 'Учительская:' : 'Phòng giáo vụ:'} 061-123-4567
            </p>
            <p>
              {currentLocale === 'ko' ? '기숙사:' :
               currentLocale === 'mn' ? 'Дотуур байр:' :
               currentLocale === 'ru' ? 'Общежитие:' : 'Ký túc xá:'} 061-123-4568
            </p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
