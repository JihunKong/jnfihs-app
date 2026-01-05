'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CalendarDays, ChevronRight, Clock, MapPin, CheckCircle, AlertCircle, Hourglass } from 'lucide-react';

interface LeaveRequest {
  id: string;
  type: 'outing' | 'overnight';
  startDate: string;
  endDate?: string;
  destination: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Booking {
  id: string;
  facility: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface ScheduleData {
  leaveRequests: LeaveRequest[];
  bookings: Booking[];
}

export default function ScheduleWidget() {
  const { status } = useSession();
  const t = useTranslations();
  const { locale } = useParams();
  const [schedule, setSchedule] = useState<ScheduleData>({ leaveRequests: [], bookings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }

    const fetchSchedule = async () => {
      try {
        const [leaveRes, bookingRes] = await Promise.all([
          fetch('/api/leave?limit=2'),
          fetch('/api/booking?limit=2'),
        ]);

        const leaveData = leaveRes.ok ? await leaveRes.json() : { requests: [] };
        const bookingData = bookingRes.ok ? await bookingRes.json() : { bookings: [] };

        setSchedule({
          leaveRequests: leaveData.requests || [],
          bookings: bookingData.bookings || [],
        });
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [status]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'pending':
        return <Hourglass className="w-4 h-4 text-amber-500" />;
      case 'rejected':
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-oat-400" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-oat-100 text-oat-700';
    }
  };

  if (status !== 'authenticated') {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-oat-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-oat-800">{t('dashboard.widgets.schedule.title')}</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-sm text-oat-500 mb-3">{t('dashboard.widgets.schedule.loginRequired')}</p>
          <Link
            href={`/${locale}/login`}
            className="inline-block px-4 py-2 bg-oat-600 text-white rounded-lg text-sm font-medium hover:bg-oat-700 transition-colors"
          >
            {t('auth.signInWithGoogle')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-oat-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-oat-800">{t('dashboard.widgets.schedule.title')}</h3>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-oat-100 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Leave Requests */}
          {schedule.leaveRequests.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-oat-500 uppercase tracking-wider">
                  {t('dashboard.widgets.schedule.leaveRequests')}
                </p>
                <Link
                  href={`/${locale}/leave`}
                  className="text-xs text-oat-500 hover:text-oat-700 flex items-center gap-0.5"
                >
                  {t('common.viewAll')}
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {schedule.leaveRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center gap-3 p-3 bg-oat-50 rounded-xl"
                  >
                    {getStatusIcon(request.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-oat-800">
                          {t(`leave.types.${request.type}`)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyle(request.status)}`}>
                          {t(`leave.status.${request.status}`)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-oat-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{request.destination}</span>
                      </div>
                    </div>
                    <span className="text-xs text-oat-400">
                      {new Date(request.startDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings */}
          {schedule.bookings.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-oat-500 uppercase tracking-wider">
                  {t('dashboard.widgets.schedule.bookings')}
                </p>
                <Link
                  href={`/${locale}/booking`}
                  className="text-xs text-oat-500 hover:text-oat-700 flex items-center gap-0.5"
                >
                  {t('common.viewAll')}
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {schedule.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-3 p-3 bg-oat-50 rounded-xl"
                  >
                    {getStatusIcon(booking.status)}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-oat-800">{booking.facility}</span>
                      <div className="flex items-center gap-2 text-xs text-oat-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{booking.timeSlot}</span>
                      </div>
                    </div>
                    <span className="text-xs text-oat-400">
                      {new Date(booking.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {schedule.leaveRequests.length === 0 && schedule.bookings.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-oat-500 mb-3">{t('dashboard.widgets.schedule.noSchedule')}</p>
              <div className="flex gap-2 justify-center">
                <Link
                  href={`/${locale}/leave`}
                  className="text-xs px-3 py-1.5 bg-oat-100 text-oat-600 rounded-lg hover:bg-oat-200 transition-colors"
                >
                  {t('leave.newRequest')}
                </Link>
                <Link
                  href={`/${locale}/booking`}
                  className="text-xs px-3 py-1.5 bg-oat-100 text-oat-600 rounded-lg hover:bg-oat-200 transition-colors"
                >
                  {t('booking.reservation')}
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
