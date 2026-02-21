export const CHECK_CATEGORIES = [
  {
    id: "sleep" as const,
    emoji: "😴",
    label: "수면",
    question: "어젯밤 수면은 어땠나요?",
  },
  {
    id: "exercise" as const,
    emoji: "🏃",
    label: "운동",
    question: "오늘 몸을 움직였나요?",
  },
  {
    id: "diet" as const,
    emoji: "🥗",
    label: "식단",
    question: "오늘 식사는 건강했나요?",
  },
  {
    id: "stress" as const,
    emoji: "🧘",
    label: "스트레스",
    question: "오늘 마음은 평온했나요?",
  },
  {
    id: "social" as const,
    emoji: "👥",
    label: "사회활동",
    question: "오늘 누군가와 의미있는 대화를 했나요?",
  },
] as const;

export const SCORE_LABELS = [
  "", // 0 (unused)
  "매우나쁨",
  "나쁨",
  "보통",
  "좋음",
  "매우좋음",
] as const;

export const GRADE_CONFIG = [
  { min: 90, label: "🏆 슬로에이징 마스터", color: "#FDCB6E" },
  { min: 75, label: "💪 건강 습관 우수", color: "#00B894" },
  { min: 50, label: "👍 평균 이상", color: "#6C5CE7" },
  { min: 25, label: "⚠️ 개선 필요", color: "#FFA502" },
  { min: 0, label: "🚨 주의 필요", color: "#FF6B6B" },
] as const;

export function getGrade(score: number) {
  return GRADE_CONFIG.find((g) => score >= g.min) ?? GRADE_CONFIG[4];
}
