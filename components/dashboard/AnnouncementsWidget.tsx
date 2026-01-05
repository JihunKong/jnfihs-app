'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FileText, ChevronRight, AlertCircle, Bell, Info } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  category: 'urgent' | 'important' | 'general';
  date: string;
  excerpt?: string;
}

export default function AnnouncementsWidget() {
  const t = useTranslations();
  const { locale } = useParams();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcements?limit=3');
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data.announcements || []);
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'urgent':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          bg: 'bg-red-100',
          text: 'text-red-600',
          label: t('dashboard.widgets.announcements.urgent'),
        };
      case 'important':
        return {
          icon: <Bell className="w-3.5 h-3.5" />,
          bg: 'bg-amber-100',
          text: 'text-amber-600',
          label: t('dashboard.widgets.announcements.important'),
        };
      default:
        return {
          icon: <Info className="w-3.5 h-3.5" />,
          bg: 'bg-blue-100',
          text: 'text-blue-600',
          label: t('dashboard.widgets.announcements.general'),
        };
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-oat-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-oat-800">{t('dashboard.widgets.announcements.title')}</h3>
        </div>
        <Link
          href={`/${locale}/announcements`}
          className="flex items-center gap-1 text-sm text-oat-500 hover:text-oat-700 transition-colors"
        >
          <span>{t('common.viewAll')}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-oat-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-oat-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : announcements.length > 0 ? (
        <div className="space-y-3">
          {announcements.map((announcement) => {
            const style = getCategoryStyle(announcement.category);
            return (
              <Link
                key={announcement.id}
                href={`/${locale}/announcements/${announcement.id}`}
                className="block p-3 rounded-xl hover:bg-oat-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                    {style.icon}
                    {style.label}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-oat-800 mt-2 group-hover:text-oat-600 transition-colors line-clamp-1">
                  {announcement.title}
                </h4>
                <p className="text-xs text-oat-500 mt-1">
                  {new Date(announcement.date).toLocaleDateString()}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-oat-500 text-sm">
          {t('dashboard.widgets.announcements.noAnnouncements')}
        </div>
      )}
    </div>
  );
}
