import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getClaudeClient } from "@/lib/claude/client";
import { calculateScores } from "@/lib/scoring";
import type { CoachingMessage, DailyChecklist } from "@/lib/types";

// ---------------------
// In-memory rate limiter
// ---------------------

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 3; // max requests per day
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(userId) ?? [];

  // Remove timestamps older than 24 hours
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(userId, recent);

  if (recent.length >= RATE_LIMIT_MAX) {
    return true;
  }

  recent.push(now);
  rateLimitMap.set(userId, recent);
  return false;
}

// ---------------------
// Fallback coaching message
// ---------------------

function getFallbackMessage(): CoachingMessage {
  return {
    greeting: "안녕하세요! 오늘도 건강한 하루를 보내셨나요?",
    praise: "체크리스트를 꾸준히 작성하는 것 자체가 대단한 습관입니다!",
    advice:
      "내일은 채소 섭취와 충분한 수면에 조금 더 신경 써보세요. 작은 변화가 큰 차이를 만듭니다.",
    tomorrow_goal:
      "내일은 물 1.5L 마시기와 30분 이상 걷기를 목표로 해보세요.",
    science_tip:
      "연구에 따르면 규칙적인 식습관과 수면 패턴은 세포 노화를 늦추는 데 중요한 역할을 합니다.",
    encouragement:
      "꾸준함이 가장 큰 무기입니다. 오늘 하루도 수고하셨어요!",
  };
}

// ---------------------
// Build prompts
// ---------------------

interface RequestBody {
  checklist: Partial<DailyChecklist>;
  profile: {
    nickname: string;
    birth_year?: number;
    gender?: string;
    health_goals: string[];
    program_week: number;
  };
}

function buildSystemPrompt(): string {
  return `당신은 저속노화 라이프스타일 코치입니다. 사용자의 오늘 체크리스트 데이터를 분석하여 따뜻하고 격려하는 코칭 메시지를 JSON으로 작성해주세요.

규칙:
- 한국어로 작성
- 사용자의 닉네임을 자연스럽게 사용
- 잘한 점은 구체적으로 칭찬
- 부족한 점은 긍정적으로 개선 제안
- 과학적 근거가 있는 팁 제공
- 내일 실천 가능한 구체적 목표 제시
- 전체적으로 따뜻하고 격려하는 톤 유지

JSON 형식으로만 응답하세요:
{"greeting":"인사말","praise":"잘한점 칭찬","advice":"개선 조언","tomorrow_goal":"내일 실천 목표","science_tip":"과학적 건강 팁","encouragement":"마무리 격려"}`;
}

function buildUserPrompt(body: RequestBody): string {
  const { checklist, profile } = body;
  const scores = calculateScores(checklist);

  const dietItems = [
    checklist.meal_vegetables ? "채소 5색 섭취 O" : "채소 5색 섭취 X",
    checklist.meal_protein ? "양질의 단백질 O" : "양질의 단백질 X",
    checklist.meal_whole_grain ? "통곡물 O" : "통곡물 X",
    checklist.meal_fermented ? "발효식품 O" : "발효식품 X",
    checklist.meal_antioxidant ? "항산화 식품 O" : "항산화 식품 X",
    `물 ${checklist.meal_water_liters ?? 0}L 섭취`,
    checklist.meal_processed_food
      ? "가공식품 피하기 O"
      : "가공식품 피하기 X",
    checklist.meal_sugar_avoided
      ? "정제당 피하기 O"
      : "정제당 피하기 X",
  ].join(", ");

  const exerciseItems = [
    checklist.exercise_done ? "운동 완료 O" : "운동 완료 X",
    `운동 ${checklist.exercise_duration_min ?? 0}분`,
    checklist.exercise_type ? `종류: ${checklist.exercise_type}` : "",
    `걸음 수: ${checklist.exercise_steps ?? 0}보`,
  ]
    .filter(Boolean)
    .join(", ");

  const sleepItems = [
    `수면 ${checklist.sleep_hours ?? 0}시간`,
    `수면의 질: ${checklist.sleep_quality ?? 0}/5`,
    checklist.sleep_before_screen
      ? "취침 전 스크린 차단 O"
      : "취침 전 스크린 차단 X",
  ].join(", ");

  const lifestyleItems = [
    checklist.lifestyle_sunscreen ? "자외선 차단제 O" : "자외선 차단제 X",
    `영양제: ${
      checklist.lifestyle_supplements &&
      checklist.lifestyle_supplements.length > 0
        ? checklist.lifestyle_supplements.join(", ")
        : "미복용"
    }`,
    `명상 ${checklist.lifestyle_meditation_min ?? 0}분`,
    `스트레스 수준: ${checklist.lifestyle_stress_level ?? 3}/5`,
  ].join(", ");

  const conditionItems = [
    `에너지: ${checklist.overall_energy ?? 3}/5`,
    `기분: ${checklist.overall_mood ?? 3}/5`,
    `피부 상태: ${checklist.overall_skin_condition ?? 3}/5`,
  ].join(", ");

  const goalsText =
    profile.health_goals.length > 0
      ? profile.health_goals.join(", ")
      : "미설정";

  return `사용자 정보:
- 닉네임: ${profile.nickname}
- 출생연도: ${profile.birth_year ?? "미입력"}
- 성별: ${profile.gender ?? "미입력"}
- 건강 목표: ${goalsText}
- 프로그램 ${profile.program_week}주차

오늘의 점수:
- 식단: ${scores.diet_score}/35점
- 운동: ${scores.exercise_score}/25점
- 수면: ${scores.sleep_score}/25점
- 생활습관: ${scores.lifestyle_score}/15점
- 총점: ${scores.total_score}/100점

식단 상세: ${dietItems}
운동 상세: ${exerciseItems}
수면 상세: ${sleepItems}
생활습관 상세: ${lifestyleItems}
컨디션: ${conditionItems}
${checklist.meal_note ? `식단 메모: ${checklist.meal_note}` : ""}`;
}

// ---------------------
// POST handler
// ---------------------

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // Rate limit check
    if (isRateLimited(user.id)) {
      return NextResponse.json(
        { error: "일일 코칭 요청 횟수(3회)를 초과했습니다." },
        { status: 429 }
      );
    }

    // Parse body
    const body: RequestBody = await request.json();

    if (!body.checklist || !body.profile) {
      return NextResponse.json(
        { error: "체크리스트와 프로필 정보가 필요합니다." },
        { status: 400 }
      );
    }

    // Call Claude API
    const claude = getClaudeClient();

    const message = await claude.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: buildSystemPrompt(),
      messages: [
        {
          role: "user",
          content: buildUserPrompt(body),
        },
      ],
    });

    // Extract text response
    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(getFallbackMessage());
    }

    // Parse JSON response
    const parsed: CoachingMessage = JSON.parse(textBlock.text);

    // Validate all required fields exist
    const requiredFields: (keyof CoachingMessage)[] = [
      "greeting",
      "praise",
      "advice",
      "tomorrow_goal",
      "science_tip",
      "encouragement",
    ];

    const isValid = requiredFields.every(
      (field) =>
        typeof parsed[field] === "string" && parsed[field].length > 0
    );

    if (!isValid) {
      return NextResponse.json(getFallbackMessage());
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[Coaching Daily] Error:", error);
    return NextResponse.json(getFallbackMessage());
  }
}
