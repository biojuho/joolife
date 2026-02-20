import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { DAILY_QUESTION_SYSTEM_PROMPT } from "@/lib/prompts";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 오늘 이미 엔트리가 있는지 확인
  const today = new Date().toISOString().split("T")[0];
  const { data: existing } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("entry_date", today)
    .single();

  if (existing) {
    return NextResponse.json({ entry: existing });
  }

  // 최근 7일 답변 가져오기
  const { data: recentEntries } = await supabase
    .from("journal_entries")
    .select("custom_question, user_answer, keywords, entry_date")
    .eq("user_id", user.id)
    .neq("user_answer", "")
    .order("entry_date", { ascending: false })
    .limit(7);

  // 사용자 프로필
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, birth_year, life_theme")
    .eq("id", user.id)
    .single();

  // Claude API로 질문 생성
  const anthropic = new Anthropic();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: DAILY_QUESTION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `사용자 정보:
- 닉네임: ${profile?.nickname || "사용자"}
- 출생연도: ${profile?.birth_year || "미입력"}
- 관심 테마: ${profile?.life_theme?.join(", ") || "없음"}

최근 답변 기록:
${
  recentEntries && recentEntries.length > 0
    ? recentEntries
        .map(
          (e) =>
            `- [${e.entry_date}] 질문: ${e.custom_question} / 키워드: ${e.keywords?.join(", ") || "없음"}`
        )
        .join("\n")
    : "첫 사용자입니다."
}

오늘의 질문을 생성해주세요. JSON 형식으로만 응답하세요.`,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  let aiResponse;
  try {
    aiResponse = JSON.parse(responseText);
  } catch {
    // JSON 파싱 실패 시 기본 질문
    aiResponse = {
      question: "오늘 하루 중 가장 감사했던 순간은 언제였나요?",
      category: "gratitude",
      depth_level: 1,
      follow_up_hint: "아주 작은 것도 좋아요. 따뜻한 햇살, 맛있는 커피 한 잔...",
    };
  }

  // 엔트리 생성
  const { data: newEntry } = await supabase
    .from("journal_entries")
    .insert({
      user_id: user.id,
      custom_question: aiResponse.question,
      user_answer: "",
      entry_date: today,
    })
    .select()
    .single();

  return NextResponse.json({
    entry: newEntry,
    question: aiResponse,
  });
}
