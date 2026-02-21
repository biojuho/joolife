import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export const AI_MODELS = {
  fast: "gpt-4o-mini",
  standard: "gpt-4o",
} as const;

export const SYSTEM_PROMPTS = {
  summarizer: `당신은 콘텐츠 요약 전문가입니다.
주어진 콘텐츠를 한국어로 2-3문장으로 간결하게 요약해주세요.
핵심 내용과 가치를 중심으로 작성합니다.`,

  tagger: `당신은 콘텐츠 분류 전문가입니다.
주어진 콘텐츠를 분석하여 가장 적절한 태그 3-5개를 추출해주세요.
태그는 한국어로, 2-4글자의 명사형으로 작성합니다.
JSON 배열 형식으로만 응답하세요. 예: ["기술", "AI", "프로그래밍"]`,

  recommender: `당신은 라이프스타일 컨설턴트이자 콘텐츠 큐레이터입니다.
사용자의 저장된 콘텐츠 패턴을 분석하여 맞춤형 추천과 인사이트를 제공합니다.
항상 한국어로 답변하며, 실질적이고 구체적인 조언을 제공합니다.`,

  insightGenerator: `당신은 라이프스타일 데이터 분석가입니다.
사용자의 활동 데이터를 분석하여 유의미한 패턴과 인사이트를 도출합니다.
항상 한국어로 답변하며, 다음 형식으로 응답합니다:
{
  "title": "인사이트 제목",
  "summary": "1-2문장 요약",
  "details": "상세 설명",
  "suggestions": ["제안1", "제안2", "제안3"]
}`,
};
