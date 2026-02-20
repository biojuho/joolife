// ========================
// Core App Types
// ========================

export interface Profile {
  id: string;
  nickname: string;
  birth_year?: number;
  gender?: "male" | "female" | "other";
  height_cm?: number;
  weight_kg?: number;
  health_goals: string[];
  subscription_status: "free" | "basic" | "premium";
  subscription_started_at?: string;
  program_week: number;
  program_started_at?: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyChecklist {
  id: string;
  user_id: string;
  check_date: string;

  // Diet (35pts)
  meal_vegetables: boolean;
  meal_protein: boolean;
  meal_whole_grain: boolean;
  meal_fermented: boolean;
  meal_antioxidant: boolean;
  meal_water_liters: number;
  meal_processed_food: boolean;
  meal_sugar_avoided: boolean;
  meal_photo_url?: string;
  meal_note?: string;

  // Exercise (25pts)
  exercise_done: boolean;
  exercise_type?: string;
  exercise_duration_min: number;
  exercise_intensity?: "low" | "medium" | "high";
  exercise_steps: number;

  // Sleep (25pts)
  sleep_bedtime?: string;
  sleep_waketime?: string;
  sleep_hours: number;
  sleep_quality: number;
  sleep_before_screen: boolean;

  // Lifestyle (15pts)
  lifestyle_sunscreen: boolean;
  lifestyle_supplements: string[];
  lifestyle_stress_level: number;
  lifestyle_meditation_min: number;

  // Condition
  overall_energy: number;
  overall_mood: number;
  overall_skin_condition: number;

  // AI Coaching
  ai_coaching_message?: string;
  ai_coaching_generated_at?: string;

  // Score
  daily_score: number;

  created_at: string;
  updated_at: string;
}

export interface WeeklyReport {
  id: string;
  user_id: string;
  week_number: number;
  week_start_date: string;
  week_end_date: string;

  avg_daily_score: number;
  total_exercise_min: number;
  avg_sleep_hours: number;
  avg_sleep_quality: number;
  checklist_completion_rate: number;

  diet_score: number;
  exercise_score: number;
  sleep_score: number;
  lifestyle_score: number;

  ai_weekly_summary?: string;
  ai_next_week_advice?: string;
  ai_achievement_badges: string[];

  score_trend: "improving" | "stable" | "declining";

  created_at: string;
}

export interface ProgramCurriculum {
  id: string;
  week_number: number;
  theme: string;
  focus_area: string;
  daily_tips: Record<string, string>;
  challenge?: string;
  educational_content?: string;
  created_at: string;
}

// ========================
// Content Platform Types
// ========================

export type ArticleCategory =
  | "diet"
  | "exercise"
  | "sleep"
  | "lifestyle"
  | "science"
  | "mindset";

export type AccessLevel = "free" | "subscriber" | "premium";

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  category: ArticleCategory;
  tags: string[];
  access_level: AccessLevel;
  reading_time_min: number;
  view_count: number;
  like_count: number;
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  is_published: boolean;
  published_at?: string;
  author_name: string;
  related_week?: number;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  user_id?: string;
  status: "active" | "unsubscribed" | "bounced";
  source: string;
  tags: string[];
  subscribed_at: string;
  unsubscribed_at?: string;
  created_at: string;
}

// ========================
// Community Types
// ========================

export type CommunityCategory =
  | "free"
  | "question"
  | "review"
  | "challenge"
  | "tip";

export interface CommunityPost {
  id: string;
  user_id: string;
  category: CommunityCategory;
  title: string;
  content: string;
  image_urls: string[];
  like_count: number;
  comment_count: number;
  view_count: number;
  is_pinned: boolean;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  profiles?: { nickname: string };
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  is_anonymous: boolean;
  like_count: number;
  created_at: string;
  // Joined
  profiles?: { nickname: string };
  replies?: CommunityComment[];
}

// ========================
// UI Types
// ========================

export interface CoachingMessage {
  greeting: string;
  praise: string;
  advice: string;
  tomorrow_goal: string;
  science_tip: string;
  encouragement: string;
}

export interface ScoreBreakdown {
  diet_score: number;
  exercise_score: number;
  sleep_score: number;
  lifestyle_score: number;
  total_score: number;
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}
