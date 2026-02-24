import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWeeklyInsight } from "@/lib/ai/recommend";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    // 전체 콘텐츠 수
    const { count: totalContents } = await supabase
      .from("saved_contents")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_archived", false);

    // 이번 주 추가 수
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: weeklyAdded } = await supabase
      .from("saved_contents")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", weekAgo);

    // 인기 태그
    const { data: tagData } = await supabase
      .from("content_tags")
      .select("tag, content_id")
      .in(
        "content_id",
        (
          await supabase
            .from("saved_contents")
            .select("id")
            .eq("user_id", user.id)
            .eq("is_archived", false)
            .limit(50)
        ).data?.map((c) => c.id) || []
      );

    const tagCounts: Record<string, number> = {};
    tagData?.forEach((t) => {
      tagCounts[t.tag] = (tagCounts[t.tag] || 0) + 1;
    });
    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);

    // 인기 카테고리
    const { data: catData } = await supabase
      .from("saved_contents")
      .select("categories(name)")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .not("category_id", "is", null)
      .limit(50);

    const catCounts: Record<string, number> = {};
    catData?.forEach((c) => {
      const cat = c.categories as unknown as { name: string } | null;
      if (cat?.name) {
        catCounts[cat.name] = (catCounts[cat.name] || 0) + 1;
      }
    });
    const topCategories = Object.entries(catCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name]) => name);

    // 콘텐츠 타입 분포
    const { data: typeData } = await supabase
      .from("saved_contents")
      .select("type")
      .eq("user_id", user.id)
      .eq("is_archived", false);

    const contentTypes: Record<string, number> = {};
    typeData?.forEach((c) => {
      contentTypes[c.type] = (contentTypes[c.type] || 0) + 1;
    });

    // AI 인사이트 생성
    const insight = await generateWeeklyInsight({
      totalContents: totalContents || 0,
      weeklyAdded: weeklyAdded || 0,
      topTags,
      topCategories,
      contentTypes,
    });

    // 활동 로그
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action: "ai_insight",
      entity_type: "insight",
      metadata: { ...insight },
    });

    return NextResponse.json(insight);
  } catch (error) {
    console.error("AI Insight error:", error);

    if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        { error: "AI 서비스가 아직 설정되지 않았습니다." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "인사이트 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
