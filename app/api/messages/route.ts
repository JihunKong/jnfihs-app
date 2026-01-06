import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

type Message = {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

type Teacher = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Fallback teachers list if DB is not available
const fallbackTeachers: Teacher[] = [
  { id: 'teacher-001', name: '김선생님', email: 'kim@jnfihs.kr', role: 'teacher' },
  { id: 'teacher-002', name: '이선생님', email: 'lee@jnfihs.kr', role: 'teacher' },
  { id: 'teacher-003', name: '박선생님', email: 'park@jnfihs.kr', role: 'teacher' },
];

// Fetch teachers from database
async function getTeachers(): Promise<Teacher[]> {
  try {
    const result = await query<Teacher>(
      `SELECT id, name, email, role FROM users
       WHERE role IN ('teacher', 'admin') AND status = 'active'
       ORDER BY name ASC`
    );
    if (result && result.length > 0) {
      return result;
    }
    return fallbackTeachers;
  } catch (error) {
    console.error('Failed to fetch teachers from DB:', error);
    return fallbackTeachers;
  }
}

// In-memory message store
const messages: Message[] = [];
let nextId = 1;

// GET: Fetch messages or teacher list
export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action');
  const senderId = req.nextUrl.searchParams.get('senderId');
  const receiverId = req.nextUrl.searchParams.get('receiverId');
  const since = req.nextUrl.searchParams.get('since');

  // Get teacher list
  if (action === 'teachers') {
    const teachers = await getTeachers();
    return NextResponse.json({ teachers });
  }

  // Get conversation messages
  if (senderId && receiverId) {
    try {
      const dbMessages = await query<Message>(
        `SELECT * FROM messages
         WHERE (sender_id = $1 AND receiver_id = $2)
            OR (sender_id = $2 AND receiver_id = $1)
         ORDER BY created_at ASC`,
        [senderId, receiverId]
      );
      return NextResponse.json({ messages: dbMessages });
    } catch {
      // Fallback to in-memory
      const filtered = messages.filter(
        (m) =>
          (m.sender_id === senderId && m.receiver_id === receiverId) ||
          (m.sender_id === receiverId && m.receiver_id === senderId)
      );

      if (since) {
        const sinceTime = parseInt(since);
        return NextResponse.json({
          messages: filtered.filter((m) => new Date(m.created_at).getTime() > sinceTime),
        });
      }

      return NextResponse.json({ messages: filtered });
    }
  }

  return NextResponse.json({ messages: [] });
}

// POST: Send a message
export async function POST(req: NextRequest) {
  try {
    const { senderId, receiverId, content } = await req.json();

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      const result = await query<Message>(
        `INSERT INTO messages (sender_id, receiver_id, content, is_read)
         VALUES ($1, $2, $3, false)
         RETURNING *`,
        [senderId, receiverId, content]
      );
      return NextResponse.json({ message: result[0] });
    } catch {
      // Fallback to in-memory
      const newMessage: Message = {
        id: nextId++,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      messages.push(newMessage);
      return NextResponse.json({ message: newMessage });
    }
  } catch (error) {
    console.error('Message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// PATCH: Mark messages as read
export async function PATCH(req: NextRequest) {
  try {
    const { senderId, receiverId } = await req.json();

    try {
      await query(
        `UPDATE messages SET is_read = true
         WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false`,
        [senderId, receiverId]
      );
    } catch {
      messages.forEach((m) => {
        if (m.sender_id === senderId && m.receiver_id === receiverId) {
          m.is_read = true;
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    return NextResponse.json(
      { error: 'Failed to mark as read' },
      { status: 500 }
    );
  }
}
