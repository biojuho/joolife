-- ============================================
-- JooLife Database Schema
-- Initial migration
-- ============================================

-- 1. profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#FF6B35',
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own categories"
  ON categories FOR ALL USING (auth.uid() = user_id);

-- 3. saved_contents
CREATE TABLE saved_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('url', 'memo', 'image')),
  title TEXT,
  description TEXT,
  url TEXT,
  image_url TEXT,
  memo TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_contents_user ON saved_contents(user_id);
CREATE INDEX idx_saved_contents_category ON saved_contents(category_id);
CREATE INDEX idx_saved_contents_created ON saved_contents(created_at DESC);

ALTER TABLE saved_contents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own contents"
  ON saved_contents FOR ALL USING (auth.uid() = user_id);

-- 4. content_tags
CREATE TABLE content_tags (
  content_id UUID REFERENCES saved_contents(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (content_id, tag)
);

ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage tags on own contents"
  ON content_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM saved_contents
      WHERE id = content_tags.content_id AND user_id = auth.uid()
    )
  );

-- 5. recommendations
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('content', 'insight', 'action')),
  title TEXT NOT NULL,
  description TEXT,
  source_url TEXT,
  reasoning TEXT,
  relevance_score REAL,
  feedback TEXT CHECK (feedback IN ('liked', 'disliked')),
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_recommendations_created ON recommendations(created_at DESC);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read/update own recommendations"
  ON recommendations FOR ALL USING (auth.uid() = user_id);

-- 6. automations
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('news_collect', 'content_alert', 'schedule')),
  config JSONB NOT NULL DEFAULT '{}',
  schedule TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own automations"
  ON automations FOR ALL USING (auth.uid() = user_id);

-- 7. automation_logs
CREATE TABLE automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID REFERENCES automations(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  result JSONB DEFAULT '{}',
  items_count INTEGER DEFAULT 0,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own automation logs"
  ON automation_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM automations
      WHERE id = automation_logs.automation_id AND user_id = auth.uid()
    )
  );

-- 8. activity_logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own activity"
  ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert activity"
  ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. user_preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  dashboard_layout JSONB DEFAULT '{"widgets": ["summary", "recent_saved", "quick_save"]}',
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'ko' CHECK (language IN ('ko', 'en')),
  notification_settings JSONB DEFAULT '{"email": true, "push": false}',
  ai_settings JSONB DEFAULT '{"enabled": true, "daily_insight": true}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own preferences"
  ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- 10. data_consents
CREATE TABLE data_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consent_type TEXT NOT NULL,
  is_granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_data_consents_user ON data_consents(user_id);

ALTER TABLE data_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own consents"
  ON data_consents FOR ALL USING (auth.uid() = user_id);

-- 11. wallet_connections (Web3 - Phase 2+)
CREATE TABLE wallet_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallet_address TEXT NOT NULL,
  chain_id INTEGER NOT NULL,
  wallet_type TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ
);

ALTER TABLE wallet_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own wallets"
  ON wallet_connections FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- Functions & Triggers
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_saved_contents_updated_at
  BEFORE UPDATE ON saved_contents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_automations_updated_at
  BEFORE UPDATE ON automations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
