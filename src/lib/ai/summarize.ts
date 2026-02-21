import { getOpenAIClient, AI_MODELS, SYSTEM_PROMPTS } from "./client";

interface SummarizeResult {
  summary: string;
  tags: string[];
  category_suggestion: string | null;
}

/**
 * 콘텐츠를 요약하고 태그를 자동 생성합니다.
 */
export async function summarizeContent(input: {
  title?: string;
  url?: string;
  memo?: string;
  description?: string;
}): Promise<SummarizeResult> {
  const openai = getOpenAIClient();

  const contentText = [
    input.title && `제목: ${input.title}`,
    input.url && `URL: ${input.url}`,
    input.description && `설명: ${input.description}`,
    input.memo && `메모: ${input.memo}`,
  ]
    .filter(Boolean)
    .join("\n");

  // 요약과 태그를 한번에 요청
  const response = await openai.chat.completions.create({
    model: AI_MODELS.fast,
    messages: [
      {
        role: "system",
        content: `콘텐츠를 분석하여 다음 JSON 형식으로만 응답하세요:
{
  "summary": "2-3문장 한국어 요약",
  "tags": ["태그1", "태그2", "태그3"],
  "category_suggestion": "카테고리 제안 (기술, 라이프스타일, 비즈니스, 건강, 교육, 엔터테인먼트 중 하나 또는 null)"
}`,
      },
      {
        role: "user",
        content: contentText,
      },
    ],
    temperature: 0.3,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const result = response.choices[0]?.message?.content;
  if (!result) {
    return { summary: "", tags: [], category_suggestion: null };
  }

  try {
    const parsed = JSON.parse(result) as SummarizeResult;
    return {
      summary: parsed.summary || "",
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
      category_suggestion: parsed.category_suggestion || null,
    };
  } catch {
    return { summary: result, tags: [], category_suggestion: null };
  }
}

/**
 * 콘텐츠에서 태그만 추출합니다.
 */
export async function extractTags(content: string): Promise<string[]> {
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: AI_MODELS.fast,
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.tagger },
      { role: "user", content },
    ],
    temperature: 0.2,
    max_tokens: 100,
  });

  const result = response.choices[0]?.message?.content;
  if (!result) return [];

  try {
    const tags = JSON.parse(result);
    return Array.isArray(tags) ? tags.slice(0, 5) : [];
  } catch {
    return [];
  }
}
