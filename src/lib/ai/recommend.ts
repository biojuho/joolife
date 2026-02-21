import { getOpenAIClient, AI_MODELS, SYSTEM_PROMPTS } from "./client";

interface Recommendation {
  type: "content" | "insight" | "action";
  title: string;
  description: string;
  reasoning: string;
  relevance_score: number;
}

/**
 * 사용자의 저장 콘텐츠를 분석하여 AI 추천을 생성합니다.
 */
export async function generateRecommendations(input: {
  recentContents: Array<{
    type: string;
    title: string | null;
    url: string | null;
    memo: string | null;
    tags: string[];
  }>;
  interests: string[];
  existingRecommendationTitles: string[];
}): Promise<Recommendation[]> {
  const openai = getOpenAIClient();

  const contentsText = input.recentContents
    .map((c, i) => {
      const parts = [
        `${i + 1}. [${c.type}]`,
        c.title && `제목: ${c.title}`,
        c.url && `URL: ${c.url}`,
        c.memo && `메모: ${c.memo.slice(0, 100)}`,
        c.tags.length > 0 && `태그: ${c.tags.join(", ")}`,
      ];
      return parts.filter(Boolean).join(" | ");
    })
    .join("\n");

  const response = await openai.chat.completions.create({
    model: AI_MODELS.fast,
    messages: [
      {
        role: "system",
        content: `${SYSTEM_PROMPTS.recommender}

사용자의 최근 저장 콘텐츠를 분석하여 3개의 추천을 생성하세요.
기존 추천과 중복되지 않아야 합니다.

JSON 배열 형식으로만 응답하세요:
[
  {
    "type": "content|insight|action",
    "title": "추천 제목",
    "description": "추천 설명 (2-3문장)",
    "reasoning": "이 추천을 하는 이유 (1문장)",
    "relevance_score": 0.0~1.0
  }
]

type 설명:
- content: 관련 콘텐츠/주제 추천
- insight: 패턴 분석 인사이트
- action: 구체적 행동 제안`,
      },
      {
        role: "user",
        content: `## 사용자 관심사
${input.interests.length > 0 ? input.interests.join(", ") : "아직 설정하지 않음"}

## 최근 저장 콘텐츠
${contentsText || "아직 저장된 콘텐츠가 없습니다."}

## 기존 추천 (중복 방지)
${input.existingRecommendationTitles.join(", ") || "없음"}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: "json_object" },
  });

  const result = response.choices[0]?.message?.content;
  if (!result) return [];

  try {
    const parsed = JSON.parse(result);
    const recommendations = Array.isArray(parsed)
      ? parsed
      : parsed.recommendations || [];
    return recommendations.slice(0, 5).map((r: Recommendation) => ({
      type: r.type || "content",
      title: r.title || "",
      description: r.description || "",
      reasoning: r.reasoning || "",
      relevance_score: Math.min(1, Math.max(0, r.relevance_score || 0.5)),
    }));
  } catch {
    return [];
  }
}

/**
 * 사용자 활동을 분석하여 주간 인사이트를 생성합니다.
 */
export async function generateWeeklyInsight(input: {
  totalContents: number;
  weeklyAdded: number;
  topTags: string[];
  topCategories: string[];
  contentTypes: Record<string, number>;
}): Promise<{
  title: string;
  summary: string;
  details: string;
  suggestions: string[];
}> {
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: AI_MODELS.fast,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPTS.insightGenerator,
      },
      {
        role: "user",
        content: `## 사용자 활동 데이터
- 전체 저장 콘텐츠: ${input.totalContents}개
- 이번 주 추가: ${input.weeklyAdded}개
- 자주 사용하는 태그: ${input.topTags.join(", ") || "없음"}
- 주요 카테고리: ${input.topCategories.join(", ") || "없음"}
- 콘텐츠 타입 분포: ${Object.entries(input.contentTypes).map(([k, v]) => `${k}: ${v}개`).join(", ") || "없음"}`,
      },
    ],
    temperature: 0.6,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const result = response.choices[0]?.message?.content;
  if (!result) {
    return {
      title: "주간 리포트",
      summary: "데이터를 분석 중입니다.",
      details: "",
      suggestions: [],
    };
  }

  try {
    const parsed = JSON.parse(result);
    return {
      title: parsed.title || "주간 리포트",
      summary: parsed.summary || "",
      details: parsed.details || "",
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions
        : [],
    };
  } catch {
    return {
      title: "주간 리포트",
      summary: result.slice(0, 200),
      details: "",
      suggestions: [],
    };
  }
}
