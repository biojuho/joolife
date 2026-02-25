import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { summarizeContent } from "@/lib/ai/summarize";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const body = await request.json();
    const { content_id, title, url, memo, description } = body;

    // AI 요약 생성
    const result = await summarizeContent({ title, url, memo, description });

    // content_id가 있으면 DB 업데이트 (소유권 검증)
    if (content_id) {
      // 소유권 확인
      const { data: owned, error: ownError } = await supabase
        .from("saved_contents")
        .select("id")
        .eq("id", content_id)
        .eq("user_id", user.id)
        .single();

      if (ownError || !owned) {
        return NextResponse.json({ error: "콘텐츠를 찾을 수 없습니다." }, { status: 404 });
      }

      // 설명 업데이트
      if (result.summary) {
        await supabase
          .from("saved_contents")
          .update({
            description: result.summary,
            metadata: { ai_summarized: true, ai_category: result.category_suggestion },
          })
          .eq("id", content_id)
          .eq("user_id", user.id);
      }

      // 태그 추가
      if (result.tags.length > 0) {
        const existingTags = await supabase
          .from("content_tags")
          .select("tag")
          .eq("content_id", content_id);

        const existingSet = new Set(existingTags.data?.map((t) => t.tag));
        const newTags = result.tags.filter((t) => !existingSet.has(t));

        if (newTags.length > 0) {
          await supabase.from("content_tags").insert(
            newTags.map((tag) => ({ content_id, tag }))
          );
        }
      }

      // 활동 로그
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action: "ai_summarize",
        entity_type: "content",
        entity_id: content_id,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Summarize error:", error);

    if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        { error: "AI 서비스가 아직 설정되지 않았습니다." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "요약 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
