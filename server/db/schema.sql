-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT,
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Groups Table
CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Group Members Table
CREATE TABLE group_members (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  group_id INT REFERENCES groups(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member',
  UNIQUE (user_id, group_id)
);

-- Messages Table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  group_id INT REFERENCES groups(id) ON DELETE CASCADE,
  sender_id INT REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Study Sessions Table
CREATE TABLE study_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration_seconds INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wakeups Table
CREATE TABLE wakeups (
  id SERIAL PRIMARY KEY,
  from_user_id INT REFERENCES users(id) ON DELETE CASCADE,
  to_user_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Group Invites Table
CREATE TABLE group_invites (
  id SERIAL PRIMARY KEY,
  group_id INT REFERENCES groups(id) ON DELETE CASCADE,
  invited_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Helpful Indexes
CREATE INDEX idx_group_members_group_user ON group_members(group_id, user_id);
CREATE INDEX idx_messages_group_created ON messages(group_id, created_at DESC);
CREATE INDEX idx_study_user_start ON study_sessions(user_id, start_time);
CREATE INDEX idx_study_user_end ON study_sessions(user_id, end_time);
CREATE INDEX idx_wakeups_to_created ON wakeups(to_user_id, created_at DESC);
CREATE INDEX idx_wakeups_pair_created ON wakeups(from_user_id, to_user_id, created_at DESC);
CREATE INDEX idx_invites_group_email ON group_invites(group_id, invited_email);
