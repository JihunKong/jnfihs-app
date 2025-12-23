'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, Calendar, Clock, X, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput, GlassTextarea } from '@/components/ui/GlassInput';

type Facility = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  available_hours: string;
};

type Booking = {
  id: number;
  facility_id: string;
  student_id: string;
  booking_date: string;
  time_slot: string;
  purpose: string;
  status: string;
};

export default function BookingPage() {
  const t = useTranslations('booking');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const studentId = 'student-001';
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchFacilities();
    fetchMyBookings();
  }, []);

  useEffect(() => {
    if (selectedFacility && selectedDate) {
      fetchSlots();
    }
  }, [selectedFacility, selectedDate]);

  const fetchFacilities = async () => {
    try {
      const res = await fetch('/api/booking?action=facilities');
      const data = await res.json();
      setFacilities(data.facilities || []);
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await fetch(`/api/booking?studentId=${studentId}`);
      const data = await res.json();
      setMyBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await fetch(
        `/api/booking?action=slots&facilityId=${selectedFacility?.id}&date=${selectedDate}`
      );
      const data = await res.json();
      setAvailableSlots(data.slots || []);
      setSelectedSlot('');
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    }
  };

  const handleBook = async () => {
    if (!selectedFacility || !selectedDate || !selectedSlot) return;

    setLoading(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          facilityId: selectedFacility.id,
          date: selectedDate,
          timeSlot: selectedSlot,
          purpose,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setSelectedSlot('');
        setPurpose('');
        fetchMyBookings();
        fetchSlots();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await fetch(`/api/booking?id=${id}`, { method: 'DELETE' });
      fetchMyBookings();
    } catch (error) {
      console.error('Cancel error:', error);
    }
  };

  const getFacilityName = (facilityId: string) => {
    return facilities.find((f) => f.id === facilityId)?.name || facilityId;
  };

  return (
    <div className="min-h-screen bg-oat-50 pb-24">
      <Header showBack title={t('title')} />

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Facility Selection */}
        <div>
          <h2 className="text-lg font-bold text-oat-900 mb-3">{t('selectFacility')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {facilities.map((facility) => (
              <button
                key={facility.id}
                onClick={() => setSelectedFacility(facility)}
                className={`glass-card text-left transition-all ${
                  selectedFacility?.id === facility.id
                    ? 'ring-2 ring-oat-500 bg-oat-200/50'
                    : 'hover:bg-oat-200/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-oat-600" />
                  <span className="font-medium text-oat-900">{facility.name}</span>
                </div>
                <p className="text-xs text-oat-500 mb-1">{facility.description}</p>
                <p className="text-xs text-oat-400">
                  {t('capacity')}: {facility.capacity} | {facility.available_hours}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time Selection */}
        {selectedFacility && (
          <GlassCard>
            <h3 className="font-bold text-oat-900 mb-4">
              {selectedFacility.name} {t('reservation')}
            </h3>

            {/* Date Input */}
            <GlassInput
              type="date"
              label={t('selectDate')}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              icon={<Calendar className="w-4 h-4" />}
            />

            {/* Time Slots */}
            {selectedDate && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-oat-700 mb-2">
                  {t('selectTime')}
                </label>
                {availableSlots.length === 0 ? (
                  <p className="text-oat-500 text-sm">{t('noSlots')}</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded-lg text-sm text-center transition-all ${
                          selectedSlot === slot
                            ? 'bg-oat-700 text-white'
                            : 'bg-oat-100 text-oat-700 hover:bg-oat-200'
                        }`}
                      >
                        {slot.split('-')[0]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Purpose */}
            {selectedSlot && (
              <div className="mt-4">
                <GlassTextarea
                  label={t('purpose')}
                  placeholder={t('purposePlaceholder')}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={2}
                />
              </div>
            )}

            {/* Book Button */}
            {selectedSlot && (
              <GlassButton
                variant="primary"
                className="w-full mt-4"
                onClick={handleBook}
                disabled={loading}
              >
                {loading ? t('booking') : t('bookNow')}
              </GlassButton>
            )}

            {success && (
              <div className="mt-3 flex items-center justify-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm">{t('booked')}</span>
              </div>
            )}
          </GlassCard>
        )}

        {/* My Bookings */}
        <div>
          <h2 className="text-lg font-bold text-oat-900 mb-3">{t('myBookings')}</h2>
          {myBookings.length === 0 ? (
            <GlassCard className="text-center text-oat-500 py-8">
              {t('noBookings')}
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {myBookings.map((booking) => (
                <GlassCard key={booking.id} className="relative">
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-oat-200 text-oat-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-oat-600" />
                    <span className="font-medium text-oat-900">
                      {getFacilityName(booking.facility_id)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-oat-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.booking_date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time_slot}</span>
                    </div>
                  </div>

                  {booking.purpose && (
                    <p className="text-sm text-oat-500 mt-2">{booking.purpose}</p>
                  )}
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
