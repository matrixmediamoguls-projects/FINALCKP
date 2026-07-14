-- Reclamation University Complete Schema Migration
-- This migration creates the normalized schema for Reclamation University
-- including faculties, modules, user progress, journal entries, and analytics events.

create extension if not exists pgcrypto;

-- ============================================================================
-- FACULTIES TABLE
-- ============================================================================

create table if not exists public.rec_uni_faculties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  faculty_order integer not null,
  accent text,
  artwork_url text,
  is_published boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_rec_uni_faculties_slug on public.rec_uni_faculties(slug);
create index if not exists idx_rec_uni_faculties_order on public.rec_uni_faculties(faculty_order);

alter table public.rec_uni_faculties enable row level security;

drop policy if exists "Public read published faculties" on public.rec_uni_faculties;
create policy "Public read published faculties" on public.rec_uni_faculties
  for select using (is_published = true);

-- ============================================================================
-- MODULES TABLE
-- ============================================================================

create table if not exists public.rec_uni_modules (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references public.rec_uni_faculties(id) on delete cascade,
  slug text not null,
  title text not null,
  subtitle text,
  module_order integer not null,
  content jsonb not null default '{}',
  xp_reward integer not null default 0,
  is_published boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (faculty_id, slug)
);

create index if not exists idx_rec_uni_modules_faculty on public.rec_uni_modules(faculty_id);
create index if not exists idx_rec_uni_modules_slug on public.rec_uni_modules(slug);
create index if not exists idx_rec_uni_modules_order on public.rec_uni_modules(module_order);

alter table public.rec_uni_modules enable row level security;

drop policy if exists "Public read published modules" on public.rec_uni_modules;
create policy "Public read published modules" on public.rec_uni_modules
  for select using (is_published = true);

-- ============================================================================
-- USER PROGRESS TABLE
-- ============================================================================

create table if not exists public.rec_uni_user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.rec_uni_modules(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  active_scene integer default 0,
  listened_track_ids text[] default '{}',
  selected_shadow_codes text[] default '{}',
  retrieved_light_codes text[] default '{}',
  declaration_json jsonb default '{}',
  integration_key text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);

create index if not exists idx_rec_uni_user_progress_user on public.rec_uni_user_progress(user_id);
create index if not exists idx_rec_uni_user_progress_module on public.rec_uni_user_progress(module_id);
create index if not exists idx_rec_uni_user_progress_status on public.rec_uni_user_progress(status);
create index if not exists idx_rec_uni_user_progress_user_updated on public.rec_uni_user_progress(user_id, updated_at desc);

alter table public.rec_uni_user_progress enable row level security;

drop policy if exists "Users can read own progress" on public.rec_uni_user_progress;
drop policy if exists "Users can insert own progress" on public.rec_uni_user_progress;
drop policy if exists "Users can update own progress" on public.rec_uni_user_progress;
drop policy if exists "Users can delete own progress" on public.rec_uni_user_progress;

create policy "Users can read own progress" on public.rec_uni_user_progress
  for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own progress" on public.rec_uni_user_progress
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update own progress" on public.rec_uni_user_progress
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own progress" on public.rec_uni_user_progress
  for delete to authenticated using (auth.uid() = user_id);

-- ============================================================================
-- JOURNAL ENTRIES TABLE
-- ============================================================================

create table if not exists public.rec_uni_journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid references public.rec_uni_modules(id) on delete set null,
  entry_type text default 'module_completion',
  title text,
  body text,
  payload jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_rec_uni_journal_user on public.rec_uni_journal_entries(user_id);
create index if not exists idx_rec_uni_journal_module on public.rec_uni_journal_entries(module_id);
create index if not exists idx_rec_uni_journal_created on public.rec_uni_journal_entries(created_at desc);
create index if not exists idx_rec_uni_journal_user_created on public.rec_uni_journal_entries(user_id, created_at desc);

alter table public.rec_uni_journal_entries enable row level security;

drop policy if exists "Users can read own journal" on public.rec_uni_journal_entries;
drop policy if exists "Users can insert own journal" on public.rec_uni_journal_entries;
drop policy if exists "Users can update own journal" on public.rec_uni_journal_entries;
drop policy if exists "Users can delete own journal" on public.rec_uni_journal_entries;

create policy "Users can read own journal" on public.rec_uni_journal_entries
  for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own journal" on public.rec_uni_journal_entries
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update own journal" on public.rec_uni_journal_entries
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own journal" on public.rec_uni_journal_entries
  for delete to authenticated using (auth.uid() = user_id);

-- ============================================================================
-- ANALYTICS EVENTS TABLE
-- ============================================================================

create table if not exists public.rec_uni_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  faculty_slug text,
  module_slug text,
  event_name text not null,
  event_payload jsonb default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_rec_uni_events_user on public.rec_uni_events(user_id);
create index if not exists idx_rec_uni_events_event_name on public.rec_uni_events(event_name);
create index if not exists idx_rec_uni_events_created on public.rec_uni_events(created_at desc);
create index if not exists idx_rec_uni_events_user_created on public.rec_uni_events(user_id, created_at desc);

alter table public.rec_uni_events enable row level security;

drop policy if exists "Users can read own events" on public.rec_uni_events;
create policy "Users can read own events" on public.rec_uni_events
  for select to authenticated using (auth.uid() = user_id);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at trigger to all tables
drop trigger if exists set_rec_uni_faculties_updated_at on public.rec_uni_faculties;
create trigger set_rec_uni_faculties_updated_at
  before update on public.rec_uni_faculties
  for each row execute function public.set_updated_at();

drop trigger if exists set_rec_uni_modules_updated_at on public.rec_uni_modules;
create trigger set_rec_uni_modules_updated_at
  before update on public.rec_uni_modules
  for each row execute function public.set_updated_at();

drop trigger if exists set_rec_uni_user_progress_updated_at on public.rec_uni_user_progress;
create trigger set_rec_uni_user_progress_updated_at
  before update on public.rec_uni_user_progress
  for each row execute function public.set_updated_at();

drop trigger if exists set_rec_uni_journal_entries_updated_at on public.rec_uni_journal_entries;
create trigger set_rec_uni_journal_entries_updated_at
  before update on public.rec_uni_journal_entries
  for each row execute function public.set_updated_at();

-- ============================================================================
-- SEED DATA: FACULTIES AND MODULES
-- ============================================================================

-- Seed faculties
insert into public.rec_uni_faculties (slug, title, subtitle, description, faculty_order, accent, is_published)
values
  ('foundations', 'Foundations of Reclamation', 'Understand the war for consciousness and the nature of power.', 'Learn the core principles of Reclamation: how to identify Shadow Codes, recover Light Codes, and understand fire as ordered pressure rather than chaos.', 1, 'green', true),
  ('identity', 'The Architecture of Identity', 'Deconstruct the false self and reclaim your divine architecture.', 'Explore how hidden laws become walls. Learn to identify the thought forms that build your reality and rewrite the instruction beneath the pattern.', 2, 'blue', true),
  ('language', 'The Language Protocol', 'Words are weapons. Master the code you create with your voice.', 'Discover how speech is creative law. Learn to move from silence to clean declaration and understand the power of naming.', 3, 'red', true),
  ('thought-forms', 'Thought Forms & Reality', 'Decode the mechanics of thought and how realities are built.', 'Master the mechanics of manifestation. Learn how thought precedes form and how to align your inner architecture with your desired reality.', 4, 'amber', true),
  ('sovereign-mind', 'The Sovereign Mind', 'Train the mind beyond conditioned limits and programmed patterns.', 'Transcend inherited programming and conditioned responses. Develop the mental discipline to choose your thoughts and author your consciousness.', 5, 'gold', true),
  ('aftermath', 'Architect of the Aftermath', 'Learn to build, protect, and leave a legacy beyond the system.', 'Transform your personal reclamation into service. Learn to teach what you survived and build systems that protect others from repeating the damage.', 6, 'purple', true)
on conflict (slug) do nothing;

-- Seed modules for Identity faculty
insert into public.rec_uni_modules (faculty_id, slug, title, subtitle, module_order, content, xp_reward, is_published)
select
  f.id,
  'thought-form-studio',
  'Module 2: Thought Form Studio',
  'The mind is a medium. Learn to author the structure beneath the pattern.',
  1,
  '{}'::jsonb,
  600,
  true
from public.rec_uni_faculties f
where f.slug = 'identity'
on conflict (faculty_id, slug) do nothing;

-- Seed modules for Language faculty
insert into public.rec_uni_modules (faculty_id, slug, title, subtitle, module_order, content, xp_reward, is_published)
select
  f.id,
  'voice-recovery',
  'Module 3: Voice Recovery',
  'The voice cannot be confiscated. Learn to speak the truth that reshapes fate.',
  1,
  '{}'::jsonb,
  600,
  true
from public.rec_uni_faculties f
where f.slug = 'language'
on conflict (faculty_id, slug) do nothing;

-- Seed modules for Thought Forms faculty
insert into public.rec_uni_modules (faculty_id, slug, title, subtitle, module_order, content, xp_reward, is_published)
select
  f.id,
  'manifestation-lab',
  'Module 4: Manifestation Lab',
  'Align thought, feeling, action, and identity to build the future you author.',
  1,
  '{}'::jsonb,
  700,
  true
from public.rec_uni_faculties f
where f.slug = 'thought-forms'
on conflict (faculty_id, slug) do nothing;

-- Seed modules for Sovereign Mind faculty
insert into public.rec_uni_modules (faculty_id, slug, title, subtitle, module_order, content, xp_reward, is_published)
select
  f.id,
  'sovereign-training',
  'Module 5: Sovereign Training',
  'Reclaim dominion over your own consciousness.',
  1,
  '{}'::jsonb,
  700,
  true
from public.rec_uni_faculties f
where f.slug = 'sovereign-mind'
on conflict (faculty_id, slug) do nothing;

-- Seed modules for Aftermath faculty
insert into public.rec_uni_modules (faculty_id, slug, title, subtitle, module_order, content, xp_reward, is_published)
select
  f.id,
  'teaching-transmission',
  'Module 6: Teaching Transmission',
  'Return as a teacher. Build the map so others need not suffer blindly.',
  1,
  '{}'::jsonb,
  800,
  true
from public.rec_uni_faculties f
where f.slug = 'aftermath'
on conflict (faculty_id, slug) do nothing;
