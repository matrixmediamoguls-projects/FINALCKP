-- Enable Row Level Security on all tables.
--
-- Architecture note: the FastAPI backend authenticates with the Supabase SERVICE_ROLE key,
-- which bypasses RLS entirely. These policies therefore protect against:
--   1. Direct frontend Supabase client queries using the public anon key
--   2. Any other client that obtains the anon or authenticated JWT
--
-- Since the app uses its own JWT (not Supabase Auth), auth.uid() is null for
-- requests not going through Supabase Auth. All legitimate data access goes
-- through the FastAPI backend (service_role), so the safest policy is:
--   - user-owned tables: no direct access via anon/authenticated role
--   - shared read-only tables (tracks, app_settings): SELECT for authenticated role only
--
-- The backend is unaffected because service_role bypasses RLS.

-- ============================================================
-- Enable RLS
-- ============================================================

ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections         ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_keys        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_steps      ENABLE ROW LEVEL SECURITY;
ALTER TABLE act_completions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings        ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- users
-- No direct client access — all user reads/writes go through the backend.
-- ============================================================

-- (No policies added — RLS enabled with no policies = deny all for non-service_role)

-- ============================================================
-- reflections  (user-owned)
-- ============================================================

-- (No policies — deny all direct client access)

-- ============================================================
-- journal_entries  (user-owned)
-- ============================================================

-- (No policies — deny all direct client access)

-- ============================================================
-- payment_transactions  (user-owned, write-only via backend/webhook)
-- ============================================================

-- (No policies — deny all direct client access)

-- ============================================================
-- license_keys  (admin-managed)
-- ============================================================

-- (No policies — deny all direct client access)

-- ============================================================
-- tracks  (shared read-only content)
-- Authenticated users may SELECT; all writes go through the admin backend.
-- ============================================================

CREATE POLICY "tracks_select_authenticated"
  ON tracks
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- protocol_sessions  (user-owned)
-- ============================================================

-- (No policies — deny all direct client access)

-- ============================================================
-- protocol_steps  (user-owned)
-- ============================================================

-- (No policies — deny all direct client access)

-- ============================================================
-- act_completions  (user-owned, insert-only via backend)
-- ============================================================

-- (No policies — deny all direct client access)

-- ============================================================
-- app_settings  (global config, read-only for clients)
-- Authenticated users may SELECT public settings.
-- ============================================================

CREATE POLICY "app_settings_select_authenticated"
  ON app_settings
  FOR SELECT
  TO authenticated
  USING (true);
