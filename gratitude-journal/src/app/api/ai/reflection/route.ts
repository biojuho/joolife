import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { REFLECTION_SYSTEM_PROMPT } from "@/lib/prompts";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { entryId, userAnswer } = await req.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 엔트리 확인
  const { data: entry } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", entryId)
    .eq("user_id", user.id)
    .single();

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  // 이전 기록
  const { data: pastEntries } = await supabase
    .from("journal_entries")
    .select("custom_question, user_answer, keywords, ai_reflection")
    .eq("user_id", user.id)
    .neq("user_answer", "")
    .neq("id", entryId)
    .order("entry_date", { ascending: false })
    .limit(5);

  // Claude API
  const anthropic = new Anthropic();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
    system: REFLECTION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `오늘의 질문: ${entry.custom_question}
사용자 답변: ${userAnswer}

이전 기록 요약:
${
  pastEntries && pastEntries.length > 0
    ? pastEntries
        .map(
          (e) =>
            `- 질문: ${e.custom_question} → 키워드: ${e.keywords?.join(", ") || "없음"}`
        )
        .join("\n")
    : "첫 답변입니다."
}

리플렉션을 JSON 형식으로 생성해주세요.`,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  let reflection;
  try {
    reflection = JSON.parse(responseText);
  } catch {
    reflection = {
      reflection:
        "소중한 이야기를 나눠주셔서 감사해요. 이런 기억들이 모여 아름다운 인생 이야기가 되어가고 있네요.",
      keywords: [],
      mood_detected: 3,
      connection_to_past: null,
    };
  }

  // 엔트리 업데이트
  await supabase
    .from("journal_entries")
    .update({
      user_answer: userAnswer,
      ai_reflection: reflection.reflection,
      keywords: reflection.keywords,
      mood_score: reflection.mood_detected,
      word_count: userAnswer.length,
    })
    .eq("id", entryId);

  // 스트릭 업데이트
  const { data: profile } = await supabase
    .from("profiles")
    .select("streak_count, longest_streak, total_entries")
    .eq("id", user.id)
    .single();

  if (profile) {
    // 어제 엔트리 확인
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const { data: yesterdayEntry } = await supabase
      .from("journal_entries")
      .select("id")
      .eq("user_id", user.id)
      .eq("entry_date", yesterdayStr)
      .neq("user_answer", "")
      .single();

    const newStreak = yesterdayEntry ? profile.streak_count + 1 : 1;
    const newLongest = Math.max(newStreak, profile.longest_streak);

    await supabase
      .from("profiles")
      .update({
        streak_count: newStreak,
        longest_streak: newLongest,
        total_entries: profile.total_entries + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  }

  return NextResponse.json({ reflection });
}
