-- ================================================
-- Core Tables: profiles, daily_checklist, weekly_reports, program_curriculum
-- ================================================

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ================================================
-- 1. PROFILES
-- ================================================
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  nickname text not null,
  birth_year integer,
  gender text check (gender in ('male', 'female', 'other')),
  height_cm numeric,
  weight_kg numeric,
  health_goals text[] default '{}',
  subscription_status text default 'free' check (subscription_status in ('free', 'basic', 'premium')),
  subscription_started_at timestamptz,
  program_week integer default 1,
  program_started_at timestamptz,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, coalesce(new.raw_user_meta_data->>'nickname', '사용자'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- ================================================
-- 2. DAILY CHECKLIST
-- ================================================
create table daily_checklist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  check_date date not null default current_date,

  -- Diet (35pts)
  meal_vegetables boolean default false,
  meal_protein boolean default false,
  meal_whole_grain boolean default false,
  meal_fermented boolean default false,
  meal_antioxidant boolean default false,
  meal_water_liters numeric default 0,
  meal_processed_food boolean default false,
  meal_sugar_avoided boolean default false,
  meal_photo_url text,
  meal_note text,

  -- Exercise (25pts)
  exercise_done boolean default false,
  exercise_type text,
  exercise_duration_min integer default 0,
  exercise_intensity text check (exercise_intensity in ('low', 'medium', 'high')),
  exercise_steps integer default 0,

  -- Sleep (25pts)
  sleep_bedtime time,
  sleep_waketime time,
  sleep_hours numeric default 0,
  sleep_quality integer default 3 check (sleep_quality between 1 and 5),
  sleep_before_screen boolean default false,

  -- Lifestyle (15pts)
  lifestyle_sunscreen boolean default false,
  lifestyle_supplements text[] default '{}',
  lifestyle_stress_level integer default 3 check (lifestyle_stress_level between 1 and 5),
  lifestyle_meditation_min integer default 0,

  -- Condition
  overall_energy integer default 3 check (overall_energy between 1 and 5),
  overall_mood integer default 3 check (overall_mood between 1 and 5),
  overall_skin_condition integer default 3 check (overall_skin_condition between 1 and 5),

  -- AI Coaching
  ai_coaching_message text,
  ai_coaching_generated_at timestamptz,

  -- Score
  daily_score integer default 0,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(user_id, check_date)
);

create index idx_daily_checklist_user_date on daily_checklist(user_id, check_date desc);

create trigger daily_checklist_updated_at
  before update on daily_checklist
  for each row execute function update_updated_at();

-- ================================================
-- 3. WEEKLY REPORTS
-- ================================================
create table weekly_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  week_number integer not null,
  week_start_date date not null,
  week_end_date date not null,

  avg_daily_score numeric default 0,
  total_exercise_min integer default 0,
  avg_sleep_hours numeric default 0,
  avg_sleep_quality numeric default 0,
  checklist_completion_rate numeric default 0,

  diet_score numeric default 0,
  exercise_score numeric default 0,
  sleep_score numeric default 0,
  lifestyle_score numeric default 0,

  ai_weekly_summary text,
  ai_next_week_advice text,
  ai_achievement_badges text[] default '{}',

  score_trend text check (score_trend in ('improving', 'stable', 'declining')),

  created_at timestamptz default now(),

  unique(user_id, week_number)
);

create index idx_weekly_reports_user on weekly_reports(user_id, week_number);

-- ================================================
-- 4. PROGRAM CURRICULUM
-- ================================================
create table program_curriculum (
  id uuid default gen_random_uuid() primary key,
  week_number integer not null unique,
  theme text not null,
  focus_area text not null,
  daily_tips jsonb,
  challenge text,
  educational_content text,
  created_at timestamptz default now()
);
