-- ================================================
-- Row Level Security Policies
-- ================================================

-- ========================
-- PROFILES
-- ========================
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ========================
-- DAILY CHECKLIST
-- ========================
alter table daily_checklist enable row level security;

create policy "Users can view own checklist"
  on daily_checklist for select
  using (auth.uid() = user_id);

create policy "Users can insert own checklist"
  on daily_checklist for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checklist"
  on daily_checklist for update
  using (auth.uid() = user_id);

create policy "Users can delete own checklist"
  on daily_checklist for delete
  using (auth.uid() = user_id);

-- ========================
-- WEEKLY REPORTS
-- ========================
alter table weekly_reports enable row level security;

create policy "Users can view own reports"
  on weekly_reports for select
  using (auth.uid() = user_id);

create policy "Users can insert own reports"
  on weekly_reports for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reports"
  on weekly_reports for update
  using (auth.uid() = user_id);

-- ========================
-- PROGRAM CURRICULUM
-- ========================
alter table program_curriculum enable row level security;

create policy "Authenticated users can view curriculum"
  on program_curriculum for select
  using (auth.role() = 'authenticated');

-- ========================
-- NEWSLETTER SUBSCRIBERS
-- ========================
alter table newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on newsletter_subscribers for insert
  with check (true);

create policy "Users can read own subscription"
  on newsletter_subscribers for select
  using (
    email = (select auth.email()) or user_id = auth.uid()
  );

create policy "Users can update own subscription"
  on newsletter_subscribers for update
  using (
    email = (select auth.email()) or user_id = auth.uid()
  );

-- ========================
-- ARTICLES
-- ========================
alter table articles enable row level security;

create policy "Anyone can read published articles"
  on articles for select
  using (is_published = true);

-- ========================
-- ARTICLE LIKES
-- ========================
alter table article_likes enable row level security;

create policy "Anyone can read article likes"
  on article_likes for select
  using (true);

create policy "Users can insert article likes"
  on article_likes for insert
  with check (auth.uid() = user_id or guest_fingerprint is not null);

create policy "Users can delete own article likes"
  on article_likes for delete
  using (auth.uid() = user_id);

-- ========================
-- COMMUNITY POSTS
-- ========================
alter table community_posts enable row level security;

create policy "Anyone can read posts"
  on community_posts for select
  using (true);

create policy "Auth users can create posts"
  on community_posts for insert
  with check (auth.uid() = user_id);

create policy "Own posts can update"
  on community_posts for update
  using (auth.uid() = user_id);

create policy "Own posts can delete"
  on community_posts for delete
  using (auth.uid() = user_id);

-- ========================
-- COMMUNITY COMMENTS
-- ========================
alter table community_comments enable row level security;

create policy "Anyone can read comments"
  on community_comments for select
  using (true);

create policy "Auth users can create comments"
  on community_comments for insert
  with check (auth.uid() = user_id);

create policy "Own comments can update"
  on community_comments for update
  using (auth.uid() = user_id);

create policy "Own comments can delete"
  on community_comments for delete
  using (auth.uid() = user_id);

-- ========================
-- COMMUNITY POST LIKES
-- ========================
alter table community_post_likes enable row level security;

create policy "Anyone can read post likes"
  on community_post_likes for select
  using (true);

create policy "Auth users can like posts"
  on community_post_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike posts"
  on community_post_likes for delete
  using (auth.uid() = user_id);
