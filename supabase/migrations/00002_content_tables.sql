-- ================================================
-- Content Platform Tables: newsletter, articles, article_likes
-- ================================================

-- ================================================
-- 1. NEWSLETTER SUBSCRIBERS
-- ================================================
create table newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text,
  user_id uuid references profiles(id) on delete set null,
  status text default 'active' check (status in ('active', 'unsubscribed', 'bounced')),
  source text default 'website',
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz,
  tags text[] default '{}',
  created_at timestamptz default now()
);

create index idx_newsletter_email on newsletter_subscribers(email);

-- ================================================
-- 2. ARTICLES
-- ================================================
create table articles (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  subtitle text,
  content text not null,
  excerpt text,
  cover_image_url text,
  category text not null check (category in ('diet', 'exercise', 'sleep', 'lifestyle', 'science', 'mindset')),
  tags text[] default '{}',
  access_level text default 'free' check (access_level in ('free', 'subscriber', 'premium')),

  reading_time_min integer default 1,
  view_count integer default 0,
  like_count integer default 0,

  meta_title text,
  meta_description text,

  is_featured boolean default false,
  is_published boolean default false,
  published_at timestamptz,

  author_name text default '슬로에이징 코치',

  related_week integer,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_articles_slug on articles(slug);
create index idx_articles_category on articles(category);
create index idx_articles_published on articles(is_published, published_at desc);

-- Full-text search index (Korean)
create index articles_search_idx on articles
  using gin(to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')));

create trigger articles_updated_at
  before update on articles
  for each row execute function update_updated_at();

-- ================================================
-- 3. ARTICLE LIKES
-- ================================================
create table article_likes (
  id uuid default gen_random_uuid() primary key,
  article_id uuid references articles(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade,
  guest_fingerprint text,
  created_at timestamptz default now(),
  unique(article_id, user_id),
  unique(article_id, guest_fingerprint)
);
