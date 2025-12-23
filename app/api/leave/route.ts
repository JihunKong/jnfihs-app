import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

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

// In-memory store for demo (use DB in production)
const leaveRequests: LeaveRequest[] = [];
let nextId = 1;

// GET: Fetch leave requests
export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get('studentId');

  try {
    // Try database first
    const requests = await query<LeaveRequest>(
      `SELECT * FROM leave_requests WHERE student_id = $1 ORDER BY created_at DESC`,
      [studentId]
    );
    return NextResponse.json({ requests });
  } catch {
    // Fallback to in-memory
    const filtered = studentId
      ? leaveRequests.filter((r) => r.student_id === studentId)
      : leaveRequests;
    return NextResponse.json({ requests: filtered });
  }
}

// POST: Create new leave request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, leaveType, startDate, endDate, reason, destination } = body;

    if (!studentId || !leaveType || !startDate || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      // Try database first
      const result = await query<LeaveRequest>(
        `INSERT INTO leave_requests (student_id, leave_type, start_date, end_date, reason, destination, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending')
         RETURNING *`,
        [studentId, leaveType, startDate, endDate || startDate, reason, destination || '']
      );
      return NextResponse.json({ request: result[0] });
    } catch {
      // Fallback to in-memory
      const newRequest: LeaveRequest = {
        id: nextId++,
        student_id: studentId,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate || startDate,
        reason,
        destination: destination || '',
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      leaveRequests.unshift(newRequest);
      return NextResponse.json({ request: newRequest });
    }
  } catch (error) {
    console.error('Leave request error:', error);
    return NextResponse.json(
      { error: 'Failed to create leave request' },
      { status: 500 }
    );
  }
}

// DELETE: Cancel leave request
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    await query(`DELETE FROM leave_requests WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch {
    const index = leaveRequests.findIndex((r) => r.id === parseInt(id));
    if (index > -1) {
      leaveRequests.splice(index, 1);
    }
    return NextResponse.json({ success: true });
  }
}
