-- ================================================
-- Community Tables: posts, comments, post_likes
-- ================================================

-- ================================================
-- 1. COMMUNITY POSTS
-- ================================================
create table community_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  category text not null check (category in ('free', 'question', 'review', 'challenge', 'tip')),
  title text not null,
  content text not null,
  image_urls text[] default '{}',

  like_count integer default 0,
  comment_count integer default 0,
  view_count integer default 0,

  is_pinned boolean default false,
  is_anonymous boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_community_posts_category on community_posts(category, created_at desc);
create index idx_community_posts_user on community_posts(user_id);

create trigger community_posts_updated_at
  before update on community_posts
  for each row execute function update_updated_at();

-- ================================================
-- 2. COMMUNITY COMMENTS
-- ================================================
create table community_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references community_posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  parent_id uuid references community_comments(id) on delete cascade,
  content text not null,
  is_anonymous boolean default false,
  like_count integer default 0,
  created_at timestamptz default now()
);

create index idx_community_comments_post on community_comments(post_id, created_at);

-- ================================================
-- 3. COMMUNITY POST LIKES
-- ================================================
create table community_post_likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references community_posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);
