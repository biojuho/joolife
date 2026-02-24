"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// 카테고리 목록 조회
export async function getCategories() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// 카테고리 생성
export async function createCategory(input: {
  name: string;
  color?: string;
  icon?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("인증이 필요합니다.");

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: user.id,
      name: input.name,
      color: input.color || "#FF6B35",
      icon: input.icon,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/contents");
  return data;
}

// 카테고리 수정
export async function updateCategory(
  id: string,
  input: { name?: string; color?: string; icon?: string; sort_order?: number }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/contents");
  return data;
}

// 카테고리 삭제
export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/contents");
}

// 인기 태그 조회
export async function getPopularTags(limit: number = 20) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase.rpc("get_user_tags", {
    p_user_id: user.id,
    p_limit: limit,
  });

  // RPC가 없으면 직접 쿼리
  if (error) {
    const { data: tags } = await supabase
      .from("content_tags")
      .select("tag, content_id")
      .limit(200);

    if (!tags) return [];

    // 수동 집계
    const tagCount: Record<string, number> = {};
    tags.forEach((t) => {
      tagCount[t.tag] = (tagCount[t.tag] || 0) + 1;
    });

    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));
  }

  return data || [];
}
