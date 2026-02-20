-- ============================================================
-- SlowAge DB Schema — Step 2
-- Tables: profiles, daily_checks, weekly_summary
-- All tables have RLS enabled with user_id = auth.uid() policy
-- ============================================================

-- 1. profiles ------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nickname    text,
  birth_year  int,
  gender      text check (gender in ('M', 'F', 'O')),
  is_premium  boolean not null default false,
  created_at  timestamptz not null default now()
);

comment on table public.profiles is '사용자 프로필';

-- RLS
alter table public.profiles enable row level security;

create policy "profiles: users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. daily_checks --------------------------------------------
create table if not exists public.daily_checks (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  check_date      date not null,
  sleep_score     int not null check (sleep_score between 1 and 5),
  exercise_score  int not null check (exercise_score between 1 and 5),
  diet_score      int not null check (diet_score between 1 and 5),
  stress_score    int not null check (stress_score between 1 and 5),
  social_score    int not null check (social_score between 1 and 5),
  total_score     int not null generated always as (
    round(((sleep_score + exercise_score + diet_score + stress_score + social_score - 5)::numeric / 20) * 100)::int
  ) stored,
  created_at      timestamptz not null default now(),

  -- One check per user per day
  unique (user_id, check_date)
);

comment on table public.daily_checks is '일일 체크 (5항목 점수)';

-- Index for dashboard queries
create index idx_daily_checks_user_date
  on public.daily_checks (user_id, check_date desc);

-- RLS
alter table public.daily_checks enable row level security;

create policy "daily_checks: users can view own checks"
  on public.daily_checks for select
  using (auth.uid() = user_id);

create policy "daily_checks: users can insert own checks"
  on public.daily_checks for insert
  with check (auth.uid() = user_id);

create policy "daily_checks: users can update own checks"
  on public.daily_checks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. weekly_summary ------------------------------------------
create table if not exists public.weekly_summary (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  week_start  date not null,
  avg_score   numeric(5,2) not null,
  percentile  int check (percentile between 0 and 100),
  trend       text check (trend in ('up', 'down', 'stable')),
  created_at  timestamptz not null default now(),

  unique (user_id, week_start)
);

comment on table public.weekly_summary is '주간 요약 (캐싱용)';

create index idx_weekly_summary_user_week
  on public.weekly_summary (user_id, week_start desc);

-- RLS
alter table public.weekly_summary enable row level security;

create policy "weekly_summary: users can view own summaries"
  on public.weekly_summary for select
  using (auth.uid() = user_id);

create policy "weekly_summary: users can insert own summaries"
  on public.weekly_summary for insert
  with check (auth.uid() = user_id);

create policy "weekly_summary: users can update own summaries"
  on public.weekly_summary for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Helper: percentile view ---------------------------------
-- Read-only view for percentile calculation (no RLS needed, uses underlying RLS)
create or replace view public.daily_score_stats as
select
  check_date,
  avg(total_score)::numeric(5,2) as avg_score,
  count(*) as total_users
from public.daily_checks
group by check_date;

comment on view public.daily_score_stats is '날짜별 점수 통계 (백분위 계산용)';
