export interface Profile {
  id: string;
  nickname: string;
  birth_year: number | null;
  life_theme: string[];
  tier: "free" | "premium";
  streak_count: number;
  longest_streak: number;
  total_entries: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: number;
  category: QuestionCategory;
  question_text: string;
  depth_level: 1 | 2 | 3;
  tags: string[];
  is_active: boolean;
}

export type QuestionCategory =
  | "gratitude"
  | "life_review"
  | "values"
  | "relationships"
  | "growth"
  | "legacy";

export interface JournalEntry {
  id: string;
  user_id: string;
  question_id: number | null;
  custom_question: string | null;
  user_answer: string;
  ai_reflection: string | null;
  mood_score: number | null;
  keywords: string[] | null;
  word_count: number | null;
  entry_date: string;
  created_at: string;
}

export interface WeeklySummary {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  summary_text: string;
  top_keywords: string[];
  avg_mood: number | null;
  entry_count: number;
  insight: string | null;
  created_at: string;
}

export interface LifeBook {
  id: string;
  user_id: string;
  title: string;
  date_range_start: string | null;
  date_range_end: string | null;
  pdf_url: string | null;
  page_count: number | null;
  created_at: string;
}

export interface DailyQuestionResponse {
  question: string;
  category: QuestionCategory;
  depth_level: 1 | 2 | 3;
  follow_up_hint: string;
}

export interface ReflectionResponse {
  reflection: string;
  keywords: string[];
  mood_detected: number;
  connection_to_past: string | null;
}

export interface WeeklySummaryResponse {
  headline: string;
  top_keywords: string[];
  mood_flow: string;
  self_discovery: string;
  suggestion: string;
  full_summary: string;
}

export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  gratitude: "감사",
  life_review: "인생 회고",
  values: "가치관",
  relationships: "관계",
  growth: "성장",
  legacy: "유산",
};

export const LIFE_THEMES = [
  { id: "family", label: "가족", emoji: "👨‍👩‍👧‍👦" },
  { id: "health", label: "건강", emoji: "💪" },
  { id: "gratitude", label: "감사", emoji: "🙏" },
  { id: "growth", label: "성장", emoji: "🌱" },
  { id: "relationships", label: "관계", emoji: "🤝" },
  { id: "legacy", label: "유산", emoji: "📖" },
  { id: "happiness", label: "행복", emoji: "😊" },
  { id: "wisdom", label: "지혜", emoji: "🦉" },
] as const;

export const MOOD_EMOJIS = ["😢", "😟", "😐", "🙂", "😊"] as const;
