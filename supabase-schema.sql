-- ============================================
-- JooLife (쥬라프) - Supabase Database Schema
-- ============================================
-- Supabase SQL Editor에서 실행하세요.
-- 순서대로 실행해야 합니다 (외래 키 의존성).

-- ============================================
-- 1. PROFILES (사용자 프로필)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 자동 프로필 생성 트리거
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 2. USER PREFERENCES (사용자 환경설정)
-- ============================================
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'ko',
  notification_settings JSONB DEFAULT '{"email": true, "push": false}',
  ai_settings JSONB DEFAULT '{"enabled": true, "daily_insight": true}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CATEGORIES (콘텐츠 카테고리)
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#FF6B35',
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. SAVED CONTENTS (저장 콘텐츠)
-- ============================================
CREATE TABLE saved_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  category_id UUID REFERENCES categories ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('url', 'memo', 'image')),
  title TEXT,
  description TEXT,
  url TEXT,
  memo TEXT,
  image_url TEXT,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. CONTENT TAGS (콘텐츠 태그)
-- ============================================
CREATE TABLE content_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES saved_contents ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. RECOMMENDATIONS (AI 추천)
-- ============================================
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('content', 'insight', 'action')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reasoning TEXT,
  relevance_score FLOAT DEFAULT 0.5,
  is_read BOOLEAN DEFAULT false,
  is_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. AUTOMATIONS (자동화)
-- ============================================
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('news_collect', 'content_alert', 'schedule')),
  config JSONB NOT NULL DEFAULT '{}',
  schedule TEXT,
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. AUTOMATION LOGS (자동화 실행 로그)
-- ============================================
CREATE TABLE automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES automations ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  result JSONB,
  items_count INTEGER DEFAULT 0,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. WALLET CONNECTIONS (Web3 지갑)
-- ============================================
CREATE TABLE wallet_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  chain_id INTEGER NOT NULL,
  wallet_type TEXT,
  is_primary BOOLEAN DEFAULT false,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. ACTIVITY LOGS (활동 로그)
-- ============================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_saved_contents_user ON saved_contents(user_id);
CREATE INDEX idx_saved_contents_category ON saved_contents(category_id);
CREATE INDEX idx_saved_contents_user_archived ON saved_contents(user_id, is_archived);
CREATE INDEX idx_saved_contents_created ON saved_contents(user_id, created_at DESC);
CREATE INDEX idx_content_tags_content ON content_tags(content_id);
CREATE INDEX idx_content_tags_tag ON content_tags(tag);
CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_recommendations_user_read ON recommendations(user_id, is_read);
CREATE INDEX idx_automations_user ON automations(user_id);
CREATE INDEX idx_automation_logs_automation ON automation_logs(automation_id);
CREATE INDEX idx_wallet_connections_user ON wallet_connections(user_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User Preferences
CREATE POLICY "prefs_select" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "prefs_insert" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "prefs_update" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Categories
CREATE POLICY "categories_all" ON categories FOR ALL USING (auth.uid() = user_id);

-- Saved Contents
CREATE POLICY "contents_all" ON saved_contents FOR ALL USING (auth.uid() = user_id);

-- Content Tags
CREATE POLICY "tags_all" ON content_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM saved_contents WHERE saved_contents.id = content_tags.content_id AND saved_contents.user_id = auth.uid())
);

-- Recommendations
CREATE POLICY "recs_select" ON recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "recs_update" ON recommendations FOR UPDATE USING (auth.uid() = user_id);

-- Automations
CREATE POLICY "automations_all" ON automations FOR ALL USING (auth.uid() = user_id);

-- Automation Logs
CREATE POLICY "logs_select" ON automation_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM automations WHERE automations.id = automation_logs.automation_id AND automations.user_id = auth.uid())
);

-- Wallet Connections
CREATE POLICY "wallets_all" ON wallet_connections FOR ALL USING (auth.uid() = user_id);

-- Activity Logs
CREATE POLICY "activity_select" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "activity_insert" ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- updated_at 자동 갱신 트리거
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON saved_contents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON automations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON wallet_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
