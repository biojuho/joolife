export type CheckCategory = "sleep" | "exercise" | "diet" | "stress" | "social";

export interface DailyCheck {
  id: string;
  user_id: string;
  check_date: string;
  sleep_score: number;
  exercise_score: number;
  diet_score: number;
  stress_score: number;
  social_score: number;
  total_score: number;
  created_at: string;
}

export interface Profile {
  id: string;
  nickname: string | null;
  birth_year: number | null;
  gender: "M" | "F" | "O" | null;
  created_at: string;
  is_premium: boolean;
}

export interface WeeklySummary {
  id: string;
  user_id: string;
  week_start: string;
  avg_score: number;
  percentile: number;
  trend: "up" | "down" | "stable";
}
