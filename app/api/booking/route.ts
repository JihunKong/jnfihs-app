import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
  status: 'confirmed' | 'cancelled';
  created_at: string;
};

// Demo facilities
const facilities: Facility[] = [
  {
    id: 'gym',
    name: '체육관',
    description: '농구, 배드민턴, 배구 가능',
    capacity: 40,
    available_hours: '07:00-21:00',
  },
  {
    id: 'music',
    name: '음악실',
    description: '피아노, 기타 연습 가능',
    capacity: 10,
    available_hours: '09:00-20:00',
  },
  {
    id: 'art',
    name: '미술실',
    description: '그림, 조각 작업 가능',
    capacity: 20,
    available_hours: '09:00-18:00',
  },
  {
    id: 'study',
    name: '자습실',
    description: '개인/그룹 학습 공간',
    capacity: 50,
    available_hours: '06:00-23:00',
  },
  {
    id: 'computer',
    name: '컴퓨터실',
    description: '컴퓨터 사용 가능',
    capacity: 30,
    available_hours: '09:00-21:00',
  },
];

// Time slots
const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00',
  '18:00-19:00',
  '19:00-20:00',
];

// In-memory bookings
const bookings: Booking[] = [];
let nextId = 1;

// GET: Fetch facilities or bookings
export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action');
  const facilityId = req.nextUrl.searchParams.get('facilityId');
  const date = req.nextUrl.searchParams.get('date');
  const studentId = req.nextUrl.searchParams.get('studentId');

  // Get facilities list
  if (action === 'facilities') {
    return NextResponse.json({ facilities });
  }

  // Get time slots for a facility on a date
  if (action === 'slots' && facilityId && date) {
    try {
      const dbBookings = await query<Booking>(
        `SELECT * FROM facility_bookings
         WHERE facility_id = $1 AND booking_date = $2 AND status = 'confirmed'`,
        [facilityId, date]
      );
      const bookedSlots = dbBookings.map((b) => b.time_slot);
      const availableSlots = TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));
      return NextResponse.json({ slots: availableSlots, bookedSlots });
    } catch {
      const facilityBookings = bookings.filter(
        (b) => b.facility_id === facilityId && b.booking_date === date && b.status === 'confirmed'
      );
      const bookedSlots = facilityBookings.map((b) => b.time_slot);
      const availableSlots = TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));
      return NextResponse.json({ slots: availableSlots, bookedSlots });
    }
  }

  // Get student's bookings
  if (studentId) {
    try {
      const dbBookings = await query<Booking>(
        `SELECT * FROM facility_bookings
         WHERE student_id = $1 AND status = 'confirmed'
         ORDER BY booking_date ASC`,
        [studentId]
      );
      return NextResponse.json({ bookings: dbBookings });
    } catch {
      const studentBookings = bookings.filter(
        (b) => b.student_id === studentId && b.status === 'confirmed'
      );
      return NextResponse.json({ bookings: studentBookings });
    }
  }

  return NextResponse.json({ facilities, slots: TIME_SLOTS });
}

// POST: Create booking
export async function POST(req: NextRequest) {
  try {
    const { studentId, facilityId, date, timeSlot, purpose } = await req.json();

    if (!studentId || !facilityId || !date || !timeSlot) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slot is available
    const existingBooking = bookings.find(
      (b) =>
        b.facility_id === facilityId &&
        b.booking_date === date &&
        b.time_slot === timeSlot &&
        b.status === 'confirmed'
    );

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Time slot already booked' },
        { status: 409 }
      );
    }

    try {
      const result = await query<Booking>(
        `INSERT INTO facility_bookings (facility_id, student_id, booking_date, time_slot, purpose, status)
         VALUES ($1, $2, $3, $4, $5, 'confirmed')
         RETURNING *`,
        [facilityId, studentId, date, timeSlot, purpose || '']
      );
      return NextResponse.json({ booking: result[0] });
    } catch {
      const newBooking: Booking = {
        id: nextId++,
        facility_id: facilityId,
        student_id: studentId,
        booking_date: date,
        time_slot: timeSlot,
        purpose: purpose || '',
        status: 'confirmed',
        created_at: new Date().toISOString(),
      };
      bookings.push(newBooking);
      return NextResponse.json({ booking: newBooking });
    }
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// DELETE: Cancel booking
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    await query(
      `UPDATE facility_bookings SET status = 'cancelled' WHERE id = $1`,
      [id]
    );
  } catch {
    const booking = bookings.find((b) => b.id === parseInt(id));
    if (booking) {
      booking.status = 'cancelled';
    }
  }

  return NextResponse.json({ success: true });
}
