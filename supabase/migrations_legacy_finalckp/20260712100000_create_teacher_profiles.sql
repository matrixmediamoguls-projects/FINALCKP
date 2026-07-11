-- Teacher Profiles Table
-- Stores teacher/admin information and permissions

create table if not exists public.teacher_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  bio text,
  department text,
  is_admin boolean default false,
  can_manage_curriculum boolean default true,
  can_manage_students boolean default true,
  can_view_analytics boolean default true,
  can_manage_teachers boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_teacher_profiles_user on public.teacher_profiles(user_id);
create index if not exists idx_teacher_profiles_admin on public.teacher_profiles(is_admin);

alter table public.teacher_profiles enable row level security;

drop policy if exists "Teachers can read own profile" on public.teacher_profiles;
drop policy if exists "Teachers can update own profile" on public.teacher_profiles;
drop policy if exists "Admins can read all teacher profiles" on public.teacher_profiles;

create policy "Teachers can read own profile" on public.teacher_profiles
  for select to authenticated using (auth.uid() = user_id);

create policy "Teachers can update own profile" on public.teacher_profiles
  for update to authenticated using (auth.uid() = user_id);

create policy "Admins can read all teacher profiles" on public.teacher_profiles
  for select to authenticated using (
    exists (
      select 1 from public.teacher_profiles
      where user_id = auth.uid() and is_admin = true
    )
  );

-- Apply updated_at trigger
drop trigger if exists set_teacher_profiles_updated_at on public.teacher_profiles;
create trigger set_teacher_profiles_updated_at
  before update on public.teacher_profiles
  for each row execute function public.set_updated_at();
