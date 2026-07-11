-- Bloom Certificates Table
-- Stores metadata for generated certificates

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
  is_shared boolean default false,
  shared_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_rec_uni_certificates_user on public.rec_uni_certificates(user_id);
create index if not exists idx_rec_uni_certificates_integration_key on public.rec_uni_certificates(integration_key);
create index if not exists idx_rec_uni_certificates_created on public.rec_uni_certificates(created_at desc);

alter table public.rec_uni_certificates enable row level security;

drop policy if exists "Users can read own certificates" on public.rec_uni_certificates;
drop policy if exists "Users can insert own certificates" on public.rec_uni_certificates;
drop policy if exists "Users can update own certificates" on public.rec_uni_certificates;

create policy "Users can read own certificates" on public.rec_uni_certificates
  for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own certificates" on public.rec_uni_certificates
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update own certificates" on public.rec_uni_certificates
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Apply updated_at trigger
drop trigger if exists set_rec_uni_certificates_updated_at on public.rec_uni_certificates;
create trigger set_rec_uni_certificates_updated_at
  before update on public.rec_uni_certificates
  for each row execute function public.set_updated_at();
