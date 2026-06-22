create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.rec_uni_module_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  selected_shadow_codes text[] not null default '{}',
  retrieved_light_codes text[] not null default '{}',
  declaration_json jsonb not null default '{}'::jsonb,
  integration_key text,
  is_private boolean not null default true,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);

create index if not exists idx_rec_uni_module_responses_user on public.rec_uni_module_responses(user_id, updated_at desc);
create index if not exists idx_rec_uni_module_responses_module on public.rec_uni_module_responses(module_id);

alter table public.rec_uni_module_responses enable row level security;

drop policy if exists "Users can read own rec uni module responses" on public.rec_uni_module_responses;
drop policy if exists "Users can insert own rec uni module responses" on public.rec_uni_module_responses;
drop policy if exists "Users can update own rec uni module responses" on public.rec_uni_module_responses;
drop policy if exists "Users can delete own rec uni module responses" on public.rec_uni_module_responses;

create policy "Users can read own rec uni module responses" on public.rec_uni_module_responses
  for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own rec uni module responses" on public.rec_uni_module_responses
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update own rec uni module responses" on public.rec_uni_module_responses
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own rec uni module responses" on public.rec_uni_module_responses
  for delete to authenticated using (auth.uid() = user_id);

drop trigger if exists set_rec_uni_module_responses_updated_at on public.rec_uni_module_responses;
create trigger set_rec_uni_module_responses_updated_at
  before update on public.rec_uni_module_responses
  for each row execute function public.set_updated_at();

insert into public.reclamation_university (
  lesson_title,
  lesson_type,
  primary_light_code,
  lesson_body,
  summary,
  reflection_prompt,
  unlock_order,
  difficulty_level,
  estimated_minutes,
  is_required
)
select
  'Module 1: The Fire Door',
  'interactive_module',
  'Reclamation begins when authorship returns.',
  'The student names the restriction, retrieves the authorship, and writes the first reclamation law.',
  'What tried to contain the calling becomes the ignition source for the calling.',
  'What part of your authorship are you ready to reclaim?',
  1,
  2,
  45,
  true
where not exists (
  select 1 from public.reclamation_university where lesson_title = 'Module 1: The Fire Door'
);
