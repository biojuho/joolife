import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getClaudeClient } from "@/lib/claude/client";

// ---------------------
// Types
// ---------------------

interface DailyScoreEntry {
  date: string;
  diet_score: number;
  exercise_score: number;
  sleep_score: number;
  lifestyle_score: number;
  total_score: number;
}

interface WeeklyCoachingResponse {
  summary: string;
  strengths: string[];
  improvements: string[];
  nextWeekFocus: string;
  badge: {
    name: string;
    description: string;
    emoji: string;
  } | null;
}

interface RequestBody {
  weekData: DailyScoreEntry[];
  profile: {
    nickname: string;
    birth_year?: number;
    gender?: string;
    health_goals: string[];
    program_week: number;
  };
}

// ---------------------
// Fallback response
// ---------------------

function getFallbackWeeklyResponse(): WeeklyCoachingResponse {
  return {
    summary:
      "이번 주도 꾸준히 건강 습관을 관리하셨습니다. 체크리스트를 통해 자신의 습관을 돌아보는 것 자체가 큰 의미가 있어요.",
    strengths: [
      "매일 체크리스트를 꾸준히 기록하셨습니다.",
      "건강한 라이프스타일을 향한 의지가 돋보입니다.",
    ],
    improvements: [
      "수분 섭취량을 조금 더 늘려보세요.",
      "취침 전 스마트폰 사용을 줄여보세요.",
    ],
    nextWeekFocus:
      "다음 주에는 매일 30분 이상 걷기와 채소 섭취에 집중해보세요.",
    badge: null,
  };
}

// ---------------------
// Build prompts
// ---------------------

function buildSystemPrompt(): string {
  return `당신은 저속노화 라이프스타일 코치입니다. 사용자의 일주일 체크리스트 데이터를 분석하여 주간 리포트를 JSON으로 작성해주세요.

규칙:
- 한국어로 작성
- 일주일간의 추세를 분석 (개선/유지/하락)
- 강점과 개선점을 구체적으로 제시
- 다음 주 집중 목표를 실천 가능하게 제안
- 특별히 잘한 부분이 있으면 배지 수여 (없으면 null)
- 따뜻하고 격려하는 톤 유지

JSON 형식으로만 응답하세요:
{
  "summary": "이번 주 전체 요약 (2-3문장)",
  "strengths": ["강점1", "강점2"],
  "improvements": ["개선점1", "개선점2"],
  "nextWeekFocus": "다음 주 집중 목표",
  "badge": {"name": "배지이름", "description": "배지설명", "emoji": "이모지"} 또는 null
}

배지 기준 예시:
- 총점 평균 80점 이상: "저속노화 마스터"
- 운동 매일 완료: "운동왕"
- 수면 7시간 이상 매일: "꿀잠 챔피언"
- 5일 이상 기록: "꾸준함의 달인"
- 식단 점수 평균 30점 이상: "건강식단 전문가"`;
}

function buildUserPrompt(body: RequestBody): string {
  const { weekData, profile } = body;

  const goalsText =
    profile.health_goals.length > 0
      ? profile.health_goals.join(", ")
      : "미설정";

  const avgTotal =
    weekData.length > 0
      ? Math.round(
          weekData.reduce((sum, d) => sum + d.total_score, 0) /
            weekData.length
        )
      : 0;
  const avgDiet =
    weekData.length > 0
      ? Math.round(
          weekData.reduce((sum, d) => sum + d.diet_score, 0) /
            weekData.length
        )
      : 0;
  const avgExercise =
    weekData.length > 0
      ? Math.round(
          weekData.reduce((sum, d) => sum + d.exercise_score, 0) /
            weekData.length
        )
      : 0;
  const avgSleep =
    weekData.length > 0
      ? Math.round(
          weekData.reduce((sum, d) => sum + d.sleep_score, 0) /
            weekData.length
        )
      : 0;
  const avgLifestyle =
    weekData.length > 0
      ? Math.round(
          weekData.reduce((sum, d) => sum + d.lifestyle_score, 0) /
            weekData.length
        )
      : 0;

  // Build daily breakdown
  const dailyBreakdown = weekData
    .map(
      (d) =>
        `  ${d.date}: 총 ${d.total_score}점 (식단 ${d.diet_score}, 운동 ${d.exercise_score}, 수면 ${d.sleep_score}, 생활 ${d.lifestyle_score})`
    )
    .join("\n");

  // Detect trend
  let trend = "데이터 부족";
  if (weekData.length >= 3) {
    const firstHalf = weekData.slice(0, Math.floor(weekData.length / 2));
    const secondHalf = weekData.slice(Math.floor(weekData.length / 2));
    const firstAvg =
      firstHalf.reduce((s, d) => s + d.total_score, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((s, d) => s + d.total_score, 0) / secondHalf.length;

    if (secondAvg - firstAvg > 5) {
      trend = "상승 추세";
    } else if (firstAvg - secondAvg > 5) {
      trend = "하락 추세";
    } else {
      trend = "안정 유지";
    }
  }

  return `사용자 정보:
- 닉네임: ${profile.nickname}
- 출생연도: ${profile.birth_year ?? "미입력"}
- 성별: ${profile.gender ?? "미입력"}
- 건강 목표: ${goalsText}
- 프로그램 ${profile.program_week}주차

이번 주 기록 일수: ${weekData.length}일

주간 평균 점수:
- 총점: ${avgTotal}/100점
- 식단: ${avgDiet}/35점
- 운동: ${avgExercise}/25점
- 수면: ${avgSleep}/25점
- 생활습관: ${avgLifestyle}/15점

일별 상세:
${dailyBreakdown}

주간 추세: ${trend}`;
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

    // Parse body
    const body: RequestBody = await request.json();

    if (!body.weekData || !body.profile) {
      return NextResponse.json(
        { error: "주간 데이터와 프로필 정보가 필요합니다." },
        { status: 400 }
      );
    }

    if (body.weekData.length === 0) {
      return NextResponse.json(
        { error: "이번 주 기록된 데이터가 없습니다." },
        { status: 400 }
      );
    }

    // Call Claude API
    const claude = getClaudeClient();

    const message = await claude.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 700,
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
      return NextResponse.json(getFallbackWeeklyResponse());
    }

    // Parse JSON response
    const parsed: WeeklyCoachingResponse = JSON.parse(textBlock.text);

    // Validate required fields
    const isValid =
      typeof parsed.summary === "string" &&
      parsed.summary.length > 0 &&
      Array.isArray(parsed.strengths) &&
      Array.isArray(parsed.improvements) &&
      typeof parsed.nextWeekFocus === "string" &&
      parsed.nextWeekFocus.length > 0;

    if (!isValid) {
      return NextResponse.json(getFallbackWeeklyResponse());
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[Coaching Weekly] Error:", error);
    return NextResponse.json(getFallbackWeeklyResponse());
  }
}
