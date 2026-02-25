import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const LIFE_BOOK_SYSTEM_PROMPT = `당신은 사용자의 저널 기록을 바탕으로 따뜻한 인생 이야기를 엮어주는 작가입니다.

## 작성 원칙
1. 사용자의 답변을 존중하며, 원문의 감성을 살려 이야기를 구성
2. 시간 순서대로 자연스럽게 이어지는 서사 구성
3. 각 장(chapter)은 하나의 주제로 묶기
4. 해요체 사용, 따뜻하고 존중하는 톤
5. 사용자가 직접 쓴 답변을 인용하며 의미 부여

## 출력 형식 (JSON)
{
  "title": "책 제목",
  "subtitle": "부제",
  "dedication": "헌정사 (한 줄)",
  "chapters": [
    {
      "title": "장 제목",
      "content": "본문 (마크다운)"
    }
  ],
  "epilogue": "에필로그 (마무리 글)"
}`;

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { dateStart, dateEnd } = await req.json();

  // 프로필 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, tier")
    .eq("id", user.id)
    .single();

  if (profile?.tier !== "premium") {
    return NextResponse.json(
      { error: "프리미엄 기능입니다." },
      { status: 403 }
    );
  }

  // 해당 기간 엔트리
  let query = supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .neq("user_answer", "")
    .order("entry_date", { ascending: true });

  if (dateStart) query = query.gte("entry_date", dateStart);
  if (dateEnd) query = query.lte("entry_date", dateEnd);

  const { data: entries } = await query;

  if (!entries || entries.length < 3) {
    return NextResponse.json(
      { error: "인생책을 만들려면 최소 3개의 기록이 필요해요." },
      { status: 400 }
    );
  }

  // Claude API
  const anthropic = new Anthropic();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: LIFE_BOOK_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `사용자: ${profile?.nickname || "사용자"}님
기간: ${dateStart || entries[0].entry_date} ~ ${dateEnd || entries[entries.length - 1].entry_date}
총 ${entries.length}개의 기록

기록 내용:
${entries
  .map(
    (e) =>
      `[${e.entry_date}]
질문: ${e.custom_question}
답변: ${e.user_answer}
키워드: ${e.keywords?.join(", ") || "없음"}
---`
  )
  .join("\n")}

이 기록들을 바탕으로 인생 이야기를 구성해주세요. JSON 형식으로만 응답하세요.`,
      },
    ],
  });

  const responseText =
    message.content[0]?.type === "text" ? message.content[0].text : "";

  let bookContent;
  try {
    bookContent = JSON.parse(responseText);
  } catch {
    bookContent = {
      title: `${profile?.nickname || "사용자"}님의 인생 이야기`,
      subtitle: "감사 저널에서 엮은 나의 기록",
      dedication: "소중한 기억들을 담아",
      chapters: [
        {
          title: "나의 기록",
          content: entries
            .map((e) => `**${e.entry_date}**\n\n> ${e.custom_question}\n\n${e.user_answer}`)
            .join("\n\n---\n\n"),
        },
      ],
      epilogue: "이 이야기는 계속됩니다.",
    };
  }

  // DB 저장
  const { data: savedBook } = await supabase
    .from("life_books")
    .insert({
      user_id: user.id,
      title: bookContent.title,
      date_range_start: dateStart || entries[0].entry_date,
      date_range_end: dateEnd || entries[entries.length - 1].entry_date,
      page_count: bookContent.chapters?.length || 1,
    })
    .select()
    .single();

  return NextResponse.json({ book: bookContent, saved: savedBook });
}
