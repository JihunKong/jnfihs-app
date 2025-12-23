-- JNFIHS Platform Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  student_id VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'student', -- student, teacher, parent, admin
  locale VARCHAR(5) NOT NULL DEFAULT 'ko', -- ko, mn, ru, vi
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages (AI chatbot)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- user, assistant
  content TEXT NOT NULL,
  locale VARCHAR(5) NOT NULL DEFAULT 'ko',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Broadcast sessions (real-time translation)
CREATE TABLE IF NOT EXISTS broadcast_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code VARCHAR(50) UNIQUE NOT NULL,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  class_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

-- Broadcast captions (auto-saved subtitles)
CREATE TABLE IF NOT EXISTS broadcast_captions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES broadcast_sessions(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  translations JSONB NOT NULL DEFAULT '{}', -- {mn: "", ru: "", vi: ""}
  created_at TIMESTAMP DEFAULT NOW()
);

-- Student notes (for translation sessions)
CREATE TABLE IF NOT EXISTS student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES broadcast_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- Messages (student-teacher messenger)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_translated TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leave requests (외출/외박 신청)
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- outing, overnight
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  destination VARCHAR(255) NOT NULL,
  contact VARCHAR(50),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Health checks (건강 체크)
CREATE TABLE IF NOT EXISTS health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  check_date DATE NOT NULL,
  temperature DECIMAL(4,1),
  condition VARCHAR(20) NOT NULL, -- excellent, good, normal, poor, sick
  symptoms TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, check_date)
);

-- Meals (급식 메뉴)
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_date DATE NOT NULL,
  meal_type VARCHAR(20) NOT NULL, -- breakfast, lunch, dinner
  items TEXT[] NOT NULL,
  halal_items TEXT[],
  allergens TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(meal_date, meal_type)
);

-- Facilities (시설)
CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  name_ko VARCHAR(100),
  capacity INT,
  reservation_unit INT DEFAULT 60, -- minutes
  open_time TIME DEFAULT '09:00',
  close_time TIME DEFAULT '21:00',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Facility bookings (시설 예약)
CREATE TABLE IF NOT EXISTS facility_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default facilities
INSERT INTO facilities (name, name_ko, capacity, reservation_unit) VALUES
  ('Gym', '체력단련실', 10, 60),
  ('Music Room', '음악실', 5, 60),
  ('Art Room', '미술실', 15, 120),
  ('Computer Lab', '컴퓨터실', 20, 60),
  ('Laundry Room', '세탁실', 3, 30),
  ('Counseling Room', '상담실', 2, 30)
ON CONFLICT DO NOTHING;

-- Korean learning progress (한국어 학습 진행)
CREATE TABLE IF NOT EXISTS korean_learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(100) UNIQUE NOT NULL,
  xp INT DEFAULT 0,
  streak INT DEFAULT 0,
  total_correct INT DEFAULT 0,
  total_attempts INT DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Word images cache (단어 이미지 캐시)
CREATE TABLE IF NOT EXISTS word_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id VARCHAR(50) UNIQUE NOT NULL,
  image_data TEXT NOT NULL,
  mime_type VARCHAR(50) DEFAULT 'image/png',
  prompt TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_broadcast_sessions_code ON broadcast_sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_broadcast_captions_session ON broadcast_captions(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user ON leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_health_checks_user_date ON health_checks(user_id, check_date);
CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(meal_date);
CREATE INDEX IF NOT EXISTS idx_facility_bookings_facility ON facility_bookings(facility_id);
CREATE INDEX IF NOT EXISTS idx_korean_learning_student ON korean_learning_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_word_images_word ON word_images(word_id);
