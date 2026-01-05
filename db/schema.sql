-- JNFIHS NextAuth Database Schema
-- Run this SQL to set up authentication tables

-- Drop existing tables if needed (be careful in production!)
-- DROP TABLE IF EXISTS verification_tokens CASCADE;
-- DROP TABLE IF EXISTS sessions CASCADE;
-- DROP TABLE IF EXISTS accounts CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Users table (enhanced for JNFIHS with role support)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified TIMESTAMP WITH TIME ZONE,
  image VARCHAR(500),
  -- JNFIHS specific fields
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'parent')),
  locale VARCHAR(5) DEFAULT 'ko' CHECK (locale IN ('ko', 'mn', 'ru', 'vi')),
  student_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table (OAuth providers)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(50),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  UNIQUE (provider, provider_account_id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Verification tokens (for email verification)
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add user_id to existing tables if they exist
-- (These will fail silently if tables don't exist or column already exists)
DO $$
BEGIN
    -- Add user_id to leave_requests if table exists
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'leave_requests') THEN
        ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
        CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON leave_requests(user_id);
    END IF;

    -- Add user_id to health_checks if table exists
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'health_checks') THEN
        ALTER TABLE health_checks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
        CREATE INDEX IF NOT EXISTS idx_health_checks_user_id ON health_checks(user_id);
    END IF;

    -- Add user_id to facility_bookings if table exists
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'facility_bookings') THEN
        ALTER TABLE facility_bookings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
        CREATE INDEX IF NOT EXISTS idx_facility_bookings_user_id ON facility_bookings(user_id);
    END IF;

    -- Add teacher_id to broadcast_sessions if table exists
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'broadcast_sessions') THEN
        ALTER TABLE broadcast_sessions ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES users(id);
    END IF;
END $$;

-- Sample admin user (change email to your admin email)
-- INSERT INTO users (name, email, role, locale)
-- VALUES ('Admin', 'admin@jnfihs.kr', 'admin', 'ko')
-- ON CONFLICT (email) DO NOTHING;
