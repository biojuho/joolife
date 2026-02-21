import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRecommendations } from "@/lib/ai/recommend";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    // 사용자 프로필 (관심사)
    const { data: profile } = await supabase
      .from("profiles")
      .select("interests")
      .eq("id", user.id)
      .single();

    // 최근 콘텐츠 20개
    const { data: contents } = await supabase
      .from("saved_contents")
      .select("id, type, title, url, memo")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("created_at", { ascending: false })
      .limit(20);

    // 각 콘텐츠의 태그 가져오기
    const contentIds = contents?.map((c) => c.id) || [];
    const { data: allTags } = contentIds.length > 0
      ? await supabase
          .from("content_tags")
          .select("content_id, tag")
          .in("content_id", contentIds)
      : { data: [] };

    const tagsByContent: Record<string, string[]> = {};
    allTags?.forEach((t) => {
      if (!tagsByContent[t.content_id]) tagsByContent[t.content_id] = [];
      tagsByContent[t.content_id].push(t.tag);
    });

    // 기존 추천 타이틀 (중복 방지)
    const { data: existingRecs } = await supabase
      .from("recommendations")
      .select("title")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    // AI 추천 생성
    const recommendations = await generateRecommendations({
      recentContents: (contents || []).map((c) => ({
        ...c,
        tags: tagsByContent[c.id] || [],
      })),
      interests: profile?.interests || [],
      existingRecommendationTitles: existingRecs?.map((r) => r.title) || [],
    });

    // DB에 저장
    if (recommendations.length > 0) {
      const { data: savedRecs } = await supabase
        .from("recommendations")
        .insert(
          recommendations.map((r) => ({
            user_id: user.id,
            type: r.type,
            title: r.title,
            description: r.description,
            reasoning: r.reasoning,
            relevance_score: r.relevance_score,
          }))
        )
        .select();

      // 활동 로그
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action: "ai_recommend",
        entity_type: "recommendation",
        metadata: { count: recommendations.length },
      });

      return NextResponse.json({
        recommendations: savedRecs,
        count: recommendations.length,
      });
    }

    return NextResponse.json({ recommendations: [], count: 0 });
  } catch (error) {
    console.error("AI Recommend error:", error);

    if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        { error: "AI 서비스가 아직 설정되지 않았습니다." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "추천 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
