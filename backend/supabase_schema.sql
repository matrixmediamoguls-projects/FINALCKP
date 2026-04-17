-- Schema for Chroma Key Protocol Migration to Supabase
-- Run this in the Supabase SQL Editor

-- 1. users
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT,
    picture TEXT,
    level INTEGER DEFAULT 0,
    current_act INTEGER DEFAULT 1,
    completed_acts INTEGER[] DEFAULT '{}',
    tier TEXT DEFAULT 'free',
    spins_earned INTEGER DEFAULT 0,
    spins_used INTEGER DEFAULT 0,
    owns_all_albums BOOLEAN DEFAULT FALSE,
    act3_unlocked BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. user_sessions
CREATE TABLE user_sessions (
    session_token TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. reflections
CREATE TABLE reflections (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    act INTEGER NOT NULL,
    items JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, act)
);

-- 4. journal_entries
CREATE TABLE journal_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    act INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. payment_transactions
CREATE TABLE payment_transactions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    amount NUMERIC,
    currency TEXT,
    payment_status TEXT,
    status TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- 6. license_keys
CREATE TABLE license_keys (
    key TEXT PRIMARY KEY,
    used BOOLEAN DEFAULT FALSE,
    used_by TEXT REFERENCES users(user_id) ON DELETE SET NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. tracks
CREATE TABLE tracks (
    track_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    act INTEGER NOT NULL,
    type TEXT NOT NULL,
    color TEXT,
    lyrics TEXT,
    lore TEXT,
    lightcodes TEXT,
    shadowcodes TEXT,
    system_role TEXT,
    spotify_uri TEXT,
    audio_storage_path TEXT,
    audio_filename TEXT,
    audio_content_type TEXT,
    audio_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. protocol_sessions
CREATE TABLE protocol_sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    act INTEGER NOT NULL,
    phase INTEGER DEFAULT 0,
    scores JSONB DEFAULT '{"depth":0,"clarity":0,"ownership":0}',
    messages JSONB DEFAULT '[]',
    declaration TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. protocol_steps
CREATE TABLE protocol_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    act INTEGER NOT NULL,
    step INTEGER NOT NULL,
    data JSONB DEFAULT '{}',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, act, step)
);

-- 10. act_completions
CREATE TABLE act_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    act INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, act)
);

-- 11. app_settings
CREATE TABLE app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);
