'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, Clock, MapPin, FileText, Send, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput, GlassTextarea, GlassSelect } from '@/components/ui/GlassInput';

type LeaveRequest = {
  id: number;
  student_id: string;
  leave_type: 'outing' | 'overnight';
  start_date: string;
  end_date: string;
  reason: string;
  destination: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export default function LeavePage() {
  const t = useTranslations('leave');
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [leaveType, setLeaveType] = useState<'outing' | 'overnight'>('outing');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');

  // Demo student ID
  const studentId = 'student-001';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`/api/leave?studentId=${studentId}`);
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !reason) return;

    setLoading(true);
    try {
      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          leaveType,
          startDate,
          endDate: leaveType === 'overnight' ? endDate : startDate,
          reason,
          destination,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setReason('');
        setDestination('');
        setStartDate('');
        setEndDate('');
        fetchRequests();
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/leave?id=${id}`, { method: 'DELETE' });
      fetchRequests();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: t('status.pending'),
      approved: t('status.approved'),
      rejected: t('status.rejected'),
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="min-h-screen bg-oat-50 pb-24">
      <Header showBack title={t('title')} />

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* New Request Form */}
        <GlassCard>
          <h2 className="text-lg font-bold text-oat-900 mb-4">{t('newRequest')}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Leave Type */}
            <GlassSelect
              label={t('leaveType')}
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as 'outing' | 'overnight')}
            >
              <option value="outing">{t('types.outing')}</option>
              <option value="overnight">{t('types.overnight')}</option>
            </GlassSelect>

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4">
              <GlassInput
                type="date"
                label={leaveType === 'overnight' ? t('startDate') : t('date')}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              {leaveType === 'overnight' && (
                <GlassInput
                  type="date"
                  label={t('endDate')}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  required
                />
              )}
            </div>

            {/* Destination */}
            <GlassInput
              label={t('destination')}
              placeholder={t('destinationPlaceholder')}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              icon={<MapPin className="w-4 h-4" />}
            />

            {/* Reason */}
            <GlassTextarea
              label={t('reason')}
              placeholder={t('reasonPlaceholder')}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
            />

            {/* Submit Button */}
            <GlassButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || !startDate || !reason}
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? t('submitting') : t('submit')}
            </GlassButton>

            {submitted && (
              <p className="text-center text-green-600 text-sm">{t('submitted')}</p>
            )}
          </form>
        </GlassCard>

        {/* Request History */}
        <div>
          <h2 className="text-lg font-bold text-oat-900 mb-3">{t('history')}</h2>

          {requests.length === 0 ? (
            <GlassCard className="text-center text-oat-500 py-8">
              {t('noRequests')}
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <GlassCard key={request.id} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        request.status
                      )}`}
                    >
                      {getStatusText(request.status)}
                    </span>
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="text-oat-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-oat-700">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {request.leave_type === 'overnight'
                          ? `${request.start_date} ~ ${request.end_date}`
                          : request.start_date}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-oat-200 rounded">
                        {request.leave_type === 'outing' ? t('types.outing') : t('types.overnight')}
                      </span>
                    </div>

                    {request.destination && (
                      <div className="flex items-center gap-2 text-oat-600">
                        <MapPin className="w-4 h-4" />
                        <span>{request.destination}</span>
                      </div>
                    )}

                    <div className="flex items-start gap-2 text-oat-600">
                      <FileText className="w-4 h-4 mt-0.5" />
                      <span>{request.reason}</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
