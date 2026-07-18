-- Reclamation University runtime schema.
-- Curriculum content remains code-owned in reclamationUniversityCurriculum.js;
-- these tables persist learner state and optional published registry metadata.

create extension if not exists pgcrypto;

create table if not exists public.rec_uni_faculties (
  id text primary key,
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  faculty_order integer not null,
  accent text,
  artwork_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rec_uni_modules (
  id text primary key,
  faculty_id text not null references public.rec_uni_faculties(id) on delete cascade,
  slug text not null,
  title text not null,
  subtitle text,
  module_order integer not null,
  content jsonb not null default '{}'::jsonb,
  xp_reward integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (faculty_id, slug)
);

create table if not exists public.rec_uni_user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  active_scene integer not null default 0 check (active_scene >= 0),
  listened_track_ids text[] not null default '{}',
  selected_shadow_codes text[] not null default '{}',
  retrieved_light_codes text[] not null default '{}',
  declaration_json jsonb not null default '{}'::jsonb,
  integration_key text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);

create table if not exists public.rec_uni_module_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  selected_shadow_codes text[] not null default '{}',
  retrieved_light_codes text[] not null default '{}',
  declaration_json jsonb not null default '{}'::jsonb,
  integration_key text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);

create table if not exists public.rec_uni_journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text,
  entry_type text not null default 'module_completion',
  title text,
  body text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rec_uni_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  faculty_slug text,
  module_slug text,
  event_name text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rec_uni_certificates (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  student_name text not null,
  faculty_title text not null,
  module_title text not null,
  integration_key text not null,
  xp_reward integer not null,
  completion_date timestamptz not null,
  pdf_url text,
  is_shared boolean not null default false,
  shared_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_rec_uni_faculties_order
  on public.rec_uni_faculties(faculty_order);
create index if not exists idx_rec_uni_modules_faculty
  on public.rec_uni_modules(faculty_id, module_order);
create index if not exists idx_rec_uni_user_progress_user_updated
  on public.rec_uni_user_progress(user_id, updated_at desc);
create index if not exists idx_rec_uni_user_progress_module
  on public.rec_uni_user_progress(module_id);
create index if not exists idx_rec_uni_module_responses_user
  on public.rec_uni_module_responses(user_id, completed_at desc);
create index if not exists idx_rec_uni_journal_user_created
  on public.rec_uni_journal_entries(user_id, created_at desc);
create index if not exists idx_rec_uni_events_user_created
  on public.rec_uni_events(user_id, created_at desc);
create index if not exists idx_rec_uni_events_name_created
  on public.rec_uni_events(event_name, created_at desc);
create index if not exists idx_rec_uni_certificates_user_created
  on public.rec_uni_certificates(user_id, created_at desc);

alter table public.rec_uni_faculties enable row level security;
alter table public.rec_uni_modules enable row level security;
alter table public.rec_uni_user_progress enable row level security;
alter table public.rec_uni_module_responses enable row level security;
alter table public.rec_uni_journal_entries enable row level security;
alter table public.rec_uni_events enable row level security;
alter table public.rec_uni_certificates enable row level security;

create policy "Published faculties are readable"
  on public.rec_uni_faculties for select
  to anon, authenticated
  using (is_published = true);

create policy "Published modules are readable"
  on public.rec_uni_modules for select
  to anon, authenticated
  using (is_published = true);

create policy "Users read own progress"
  on public.rec_uni_user_progress for select
  to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users insert own progress"
  on public.rec_uni_user_progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users update own progress"
  on public.rec_uni_user_progress for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users delete own progress"
  on public.rec_uni_user_progress for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users read own module responses"
  on public.rec_uni_module_responses for select
  to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users insert own module responses"
  on public.rec_uni_module_responses for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users update own module responses"
  on public.rec_uni_module_responses for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users read own journal entries"
  on public.rec_uni_journal_entries for select
  to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users insert own journal entries"
  on public.rec_uni_journal_entries for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users update own journal entries"
  on public.rec_uni_journal_entries for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users delete own journal entries"
  on public.rec_uni_journal_entries for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users read own events"
  on public.rec_uni_events for select
  to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users insert own events"
  on public.rec_uni_events for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users read own certificates"
  on public.rec_uni_certificates for select
  to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users insert own certificates"
  on public.rec_uni_certificates for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users update own certificates"
  on public.rec_uni_certificates for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select on public.rec_uni_faculties, public.rec_uni_modules to anon, authenticated;
grant select, insert, update, delete on
  public.rec_uni_user_progress,
  public.rec_uni_module_responses,
  public.rec_uni_journal_entries
to authenticated;
grant select, insert on public.rec_uni_events to authenticated;
grant select, insert, update on public.rec_uni_certificates to authenticated;
grant usage, select on sequence public.rec_uni_events_id_seq to authenticated;

create or replace function public.set_rec_uni_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_rec_uni_faculties_updated_at
  before update on public.rec_uni_faculties
  for each row execute function public.set_rec_uni_updated_at();
create trigger set_rec_uni_modules_updated_at
  before update on public.rec_uni_modules
  for each row execute function public.set_rec_uni_updated_at();
create trigger set_rec_uni_user_progress_updated_at
  before update on public.rec_uni_user_progress
  for each row execute function public.set_rec_uni_updated_at();
create trigger set_rec_uni_module_responses_updated_at
  before update on public.rec_uni_module_responses
  for each row execute function public.set_rec_uni_updated_at();
create trigger set_rec_uni_journal_entries_updated_at
  before update on public.rec_uni_journal_entries
  for each row execute function public.set_rec_uni_updated_at();
create trigger set_rec_uni_certificates_updated_at
  before update on public.rec_uni_certificates
  for each row execute function public.set_rec_uni_updated_at();
