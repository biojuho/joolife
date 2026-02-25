import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { WEEKLY_SUMMARY_SYSTEM_PROMPT } from "@/lib/prompts";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { weekStart, weekEnd } = await req.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 이번 주 엔트리
  const { data: entries } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .gte("entry_date", weekStart)
    .lte("entry_date", weekEnd)
    .neq("user_answer", "")
    .order("entry_date", { ascending: true });

  if (!entries || entries.length === 0) {
    return NextResponse.json(
      { error: "이번 주 작성한 기록이 없어요." },
      { status: 400 }
    );
  }

  // 프로필
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();

  // Claude API
  const anthropic = new Anthropic();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1200,
    system: WEEKLY_SUMMARY_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `사용자: ${profile?.nickname || "사용자"}님
기간: ${weekStart} ~ ${weekEnd}
작성 횟수: ${entries.length}회

이번 주 기록:
${entries
  .map(
    (e) =>
      `[${e.entry_date}]
질문: ${e.custom_question}
답변: ${e.user_answer}
감정: ${e.mood_score}/5
키워드: ${e.keywords?.join(", ") || "없음"}
---`
  )
  .join("\n")}

주간 요약을 JSON 형식으로 생성해주세요.`,
      },
    ],
  });

  const responseText =
    message.content[0]?.type === "text" ? message.content[0].text : "";

  let summary;
  try {
    summary = JSON.parse(responseText);
  } catch {
    summary = {
      headline: "이번 주도 소중한 기록을 남기셨네요",
      top_keywords: [],
      mood_flow: "꾸준히 기록하신 한 주였어요.",
      self_discovery: "매일 자신을 돌아보는 습관이 훌륭해요.",
      suggestion: "다음 주도 편안한 마음으로 기록해 보세요.",
      full_summary: "이번 주 소중한 이야기를 나눠주셔서 감사해요.",
    };
  }

  // 평균 감정 계산
  const moodScores = entries
    .filter((e) => e.mood_score)
    .map((e) => e.mood_score!);
  const avgMood =
    moodScores.length > 0
      ? Math.round(
          (moodScores.reduce((a, b) => a + b, 0) / moodScores.length) * 10
        ) / 10
      : null;

  // DB 저장
  const { data: savedSummary } = await supabase
    .from("weekly_summaries")
    .insert({
      user_id: user.id,
      week_start: weekStart,
      week_end: weekEnd,
      summary_text: summary.full_summary,
      top_keywords: summary.top_keywords,
      avg_mood: avgMood,
      entry_count: entries.length,
      insight: summary.self_discovery,
    })
    .select()
    .single();

  return NextResponse.json({ summary, saved: savedSummary });
}
