-- 사용자 프로필 (Supabase Auth 확장)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  nickname TEXT NOT NULL,
  birth_year INTEGER,
  life_theme TEXT[],
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  streak_count INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_entries INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI 질문 풀
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  question_text TEXT NOT NULL,
  depth_level INTEGER DEFAULT 1 CHECK (depth_level BETWEEN 1 AND 3),
  tags TEXT[],
  is_active BOOLEAN DEFAULT true
);

-- 일일 저널 엔트리
CREATE TABLE journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id),
  custom_question TEXT,
  user_answer TEXT NOT NULL DEFAULT '',
  ai_reflection TEXT,
  mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
  keywords TEXT[],
  word_count INTEGER,
  entry_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 주간 회고 요약
CREATE TABLE weekly_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  summary_text TEXT NOT NULL,
  top_keywords TEXT[],
  avg_mood DECIMAL(2,1),
  entry_count INTEGER,
  insight TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 인생책 생성 기록 (프리미엄)
CREATE TABLE life_books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date_range_start DATE,
  date_range_end DATE,
  pdf_url TEXT,
  page_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own entries" ON journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own summaries" ON weekly_summaries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own books" ON life_books FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read questions" ON questions FOR SELECT USING (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname)
  VALUES (new.id, '');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 질문 시드 데이터
INSERT INTO questions (category, question_text, depth_level, tags) VALUES
('gratitude', '오늘 하루 중 가장 감사했던 순간은 언제였나요?', 1, ARRAY['일상', '감사']),
('gratitude', '최근에 누군가가 해준 작은 친절이 있었나요?', 1, ARRAY['관계', '감사']),
('gratitude', '당연하다고 생각했지만, 사실은 감사한 것이 있다면요?', 2, ARRAY['성찰', '감사']),
('gratitude', '살면서 가장 감사한 만남은 누구와의 만남이었나요?', 3, ARRAY['관계', '인생']),
('gratitude', '지금 이 순간, 건강에 대해 감사한 점이 있으신가요?', 1, ARRAY['건강', '감사']),
('life_review', '어린 시절 가장 행복했던 기억은 무엇인가요?', 2, ARRAY['어린시절', '행복']),
('life_review', '인생에서 가장 자랑스러운 순간을 떠올려 보세요.', 2, ARRAY['성취', '자부심']),
('life_review', '지금의 나를 만든 가장 중요한 선택은 무엇이었나요?', 3, ARRAY['선택', '인생']),
('life_review', '20대의 나에게 해주고 싶은 말이 있다면요?', 3, ARRAY['조언', '과거']),
('life_review', '가장 맛있었던 음식과 그때의 상황이 기억나시나요?', 1, ARRAY['음식', '기억']),
('values', '살면서 가장 중요하게 여기는 가치 3가지는 무엇인가요?', 2, ARRAY['가치관', '철학']),
('values', '돈으로 살 수 없는 것 중 가장 소중한 것은요?', 2, ARRAY['가치관', '소중함']),
('values', '나이가 들면서 생각이 바뀐 것이 있다면요?', 3, ARRAY['변화', '성장']),
('values', '행복이란 무엇이라고 생각하시나요?', 3, ARRAY['행복', '철학']),
('values', '나만의 인생 원칙이 있다면 무엇인가요?', 2, ARRAY['원칙', '가치관']),
('relationships', '가장 오래된 친구와의 추억을 들려주세요.', 2, ARRAY['우정', '추억']),
('relationships', '배우자/파트너와의 첫 만남을 기억하시나요?', 2, ARRAY['사랑', '만남']),
('relationships', '부모님에게 감사한 점은 무엇인가요?', 2, ARRAY['가족', '감사']),
('relationships', '자녀에게 꼭 전하고 싶은 말이 있다면요?', 3, ARRAY['가족', '유산']),
('relationships', '최근에 누군가와 나눈 따뜻한 대화가 있었나요?', 1, ARRAY['소통', '따뜻함']),
('growth', '인생에서 가장 어려웠던 시기를 어떻게 극복하셨나요?', 3, ARRAY['극복', '회복력']),
('growth', '실패했지만 오히려 감사한 경험이 있으신가요?', 3, ARRAY['실패', '배움']),
('growth', '최근에 새롭게 배운 것이 있다면요?', 1, ARRAY['배움', '성장']),
('growth', '나이가 들면서 더 좋아진 점은 무엇인가요?', 2, ARRAY['노화', '긍정']),
('growth', '용기를 냈던 순간이 기억나시나요?', 2, ARRAY['용기', '도전']),
('legacy', '다음 세대에 꼭 전하고 싶은 인생 교훈은요?', 3, ARRAY['지혜', '유산']),
('legacy', '100년 후에도 기억되고 싶은 나의 모습은요?', 3, ARRAY['유산', '의미']),
('legacy', '내가 세상에 남기고 싶은 것은 무엇인가요?', 3, ARRAY['유산', '목적']),
('legacy', '손주에게 들려주고 싶은 이야기가 있나요?', 2, ARRAY['가족', '이야기']),
('legacy', '나의 인생을 한 문장으로 표현한다면요?', 3, ARRAY['인생', '정리']);
