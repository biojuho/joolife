// ========================
// Checklist Item Definitions
// ========================

export interface ChecklistItemDef {
  key: string;
  label: string;
  emoji: string;
  points: number;
  category: "diet" | "exercise" | "sleep" | "lifestyle";
  type: "boolean" | "number" | "rating";
}

export const DIET_ITEMS: ChecklistItemDef[] = [
  {
    key: "meal_vegetables",
    label: "채소 5색 이상 섭취",
    emoji: "🥬",
    points: 5,
    category: "diet",
    type: "boolean",
  },
  {
    key: "meal_protein",
    label: "양질의 단백질 섭취",
    emoji: "🥩",
    points: 5,
    category: "diet",
    type: "boolean",
  },
  {
    key: "meal_whole_grain",
    label: "통곡물 섭취",
    emoji: "🌾",
    points: 4,
    category: "diet",
    type: "boolean",
  },
  {
    key: "meal_fermented",
    label: "발효식품 섭취",
    emoji: "🫙",
    points: 4,
    category: "diet",
    type: "boolean",
  },
  {
    key: "meal_antioxidant",
    label: "항산화 식품 (베리류/녹차 등)",
    emoji: "🫐",
    points: 4,
    category: "diet",
    type: "boolean",
  },
  {
    key: "meal_water_liters",
    label: "물 1.5L 이상 섭취",
    emoji: "💧",
    points: 5,
    category: "diet",
    type: "number",
  },
  {
    key: "meal_processed_food",
    label: "가공식품 피하기",
    emoji: "🚫",
    points: 4,
    category: "diet",
    type: "boolean",
  },
  {
    key: "meal_sugar_avoided",
    label: "정제당 피하기",
    emoji: "🍬",
    points: 4,
    category: "diet",
    type: "boolean",
  },
];

export const EXERCISE_ITEMS: ChecklistItemDef[] = [
  {
    key: "exercise_done",
    label: "운동 완료",
    emoji: "🏃",
    points: 10,
    category: "exercise",
    type: "boolean",
  },
  {
    key: "exercise_duration_min",
    label: "운동 시간 (분)",
    emoji: "⏱️",
    points: 8,
    category: "exercise",
    type: "number",
  },
  {
    key: "exercise_steps",
    label: "걸음 수 (7000보+)",
    emoji: "👟",
    points: 7,
    category: "exercise",
    type: "number",
  },
];

export const SLEEP_ITEMS: ChecklistItemDef[] = [
  {
    key: "sleep_hours",
    label: "수면 시간",
    emoji: "😴",
    points: 10,
    category: "sleep",
    type: "number",
  },
  {
    key: "sleep_quality",
    label: "수면의 질",
    emoji: "🌙",
    points: 10,
    category: "sleep",
    type: "rating",
  },
  {
    key: "sleep_before_screen",
    label: "취침 1시간 전 스크린 차단",
    emoji: "📵",
    points: 5,
    category: "sleep",
    type: "boolean",
  },
];

export const LIFESTYLE_ITEMS: ChecklistItemDef[] = [
  {
    key: "lifestyle_sunscreen",
    label: "자외선 차단제 도포",
    emoji: "☀️",
    points: 5,
    category: "lifestyle",
    type: "boolean",
  },
  {
    key: "lifestyle_supplements",
    label: "영양제 복용",
    emoji: "💊",
    points: 5,
    category: "lifestyle",
    type: "boolean",
  },
  {
    key: "lifestyle_meditation_min",
    label: "명상/마음챙김 (분)",
    emoji: "🧘",
    points: 5,
    category: "lifestyle",
    type: "number",
  },
];

// ========================
// Score Maximums
// ========================

export const MAX_SCORES = {
  diet: 35,
  exercise: 25,
  sleep: 25,
  lifestyle: 15,
  total: 100,
} as const;

// ========================
// Categories
// ========================

export const CHECKLIST_CATEGORIES = [
  { key: "diet", label: "식단", emoji: "🥗", color: "text-green-600" },
  { key: "exercise", label: "운동", emoji: "🏃", color: "text-blue-600" },
  { key: "sleep", label: "수면", emoji: "😴", color: "text-purple-600" },
  {
    key: "lifestyle",
    label: "생활습관",
    emoji: "🌿",
    color: "text-orange-600",
  },
  { key: "condition", label: "컨디션", emoji: "💫", color: "text-pink-600" },
] as const;

export const ARTICLE_CATEGORIES = [
  { key: "diet", label: "식단", emoji: "🥗" },
  { key: "exercise", label: "운동", emoji: "🏃" },
  { key: "sleep", label: "수면", emoji: "😴" },
  { key: "lifestyle", label: "생활습관", emoji: "🌿" },
  { key: "science", label: "과학", emoji: "🔬" },
  { key: "mindset", label: "마인드셋", emoji: "🧠" },
] as const;

export const COMMUNITY_CATEGORIES = [
  { key: "free", label: "자유", emoji: "💬" },
  { key: "question", label: "질문", emoji: "❓" },
  { key: "review", label: "후기", emoji: "⭐" },
  { key: "challenge", label: "챌린지", emoji: "🔥" },
  { key: "tip", label: "꿀팁", emoji: "💡" },
] as const;

// ========================
// Health Goals
// ========================

export const HEALTH_GOALS = [
  { key: "weight_loss", label: "체중감량", emoji: "⚖️" },
  { key: "muscle", label: "근력강화", emoji: "💪" },
  { key: "sleep_improve", label: "수면개선", emoji: "😴" },
  { key: "skin_care", label: "피부관리", emoji: "✨" },
  { key: "antioxidant", label: "항산화/면역", emoji: "🛡️" },
  { key: "stress", label: "스트레스관리", emoji: "🧘" },
] as const;

// ========================
// Mood Emojis
// ========================

export const MOOD_EMOJIS = ["😫", "😕", "😐", "🙂", "😄"] as const;
export const MOOD_LABELS = [
  "매우 나쁨",
  "나쁨",
  "보통",
  "좋음",
  "매우 좋음",
] as const;
