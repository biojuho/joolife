"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ContentType = "url" | "memo" | "image";

export interface CreateContentInput {
  type: ContentType;
  title?: string;
  description?: string;
  url?: string;
  memo?: string;
  category_id?: string;
  tags?: string[];
}

export interface UpdateContentInput {
  id: string;
  title?: string;
  description?: string;
  memo?: string;
  category_id?: string | null;
  is_archived?: boolean;
  tags?: string[];
}

// 콘텐츠 목록 조회
export async function getContents(params?: {
  search?: string;
  category_id?: string;
  type?: ContentType;
  is_archived?: boolean;
  tag?: string;
  page?: number;
  limit?: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: [], count: 0 };

  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("saved_contents")
    .select("*, categories(id, name, color)", { count: "exact" })
    .eq("user_id", user.id)
    .eq("is_archived", params?.is_archived ?? false)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (params?.category_id) {
    query = query.eq("category_id", params.category_id);
  }

  if (params?.type) {
    query = query.eq("type", params.type);
  }

  if (params?.search) {
    // PostgREST 특수문자 이스케이프
    const sanitized = params.search.replace(/[%_,.()"\\]/g, "");
    if (sanitized) {
      query = query.or(
        `title.ilike.%${sanitized}%,description.ilike.%${sanitized}%,memo.ilike.%${sanitized}%,url.ilike.%${sanitized}%`
      );
    }
  }

  const { data, count, error } = await query;

  if (error) throw new Error(error.message);

  // 태그 필터는 별도 처리
  if (params?.tag && data) {
    const contentIds = data.map((c) => c.id);
    const { data: taggedIds } = await supabase
      .from("content_tags")
      .select("content_id")
      .in("content_id", contentIds)
      .eq("tag", params.tag);

    const taggedSet = new Set(taggedIds?.map((t) => t.content_id));
    return {
      data: data.filter((c) => taggedSet.has(c.id)),
      count: data.filter((c) => taggedSet.has(c.id)).length,
    };
  }

  return { data: data || [], count: count || 0 };
}

// 콘텐츠 단건 조회
export async function getContent(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("인증이 필요합니다.");

  const [contentResult, tagsResult] = await Promise.all([
    supabase
      .from("saved_contents")
      .select("*, categories(id, name, color)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase.from("content_tags").select("tag").eq("content_id", id),
  ]);

  if (contentResult.error) throw new Error(contentResult.error.message);
  if (tagsResult.error) throw new Error(tagsResult.error.message);

  return {
    ...contentResult.data,
    tags: tagsResult.data?.map((t) => t.tag) || [],
  };
}

// 콘텐츠 생성
export async function createContent(input: CreateContentInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("인증이 필요합니다.");

  // URL인 경우 자동 타이틀 설정
  let title = input.title;
  if (input.type === "url" && !title && input.url) {
    title = input.url;
  }

  const { data, error } = await supabase
    .from("saved_contents")
    .insert({
      user_id: user.id,
      type: input.type,
      title,
      description: input.description,
      url: input.url,
      memo: input.memo,
      category_id: input.category_id || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 태그 추가
  if (input.tags && input.tags.length > 0) {
    const { error: tagError } = await supabase.from("content_tags").insert(
      input.tags.map((tag) => ({
        content_id: data.id,
        tag: tag.trim(),
      }))
    );
    if (tagError) console.error("Tag insert error:", tagError.message);
  }

  // 활동 로그
  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action: "save_content",
    entity_type: "content",
    entity_id: data.id,
    metadata: { type: input.type },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contents");

  return data;
}

// 콘텐츠 수정
export async function updateContent(input: UpdateContentInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("인증이 필요합니다.");

  const { tags, id, ...updateData } = input;

  const { data, error } = await supabase
    .from("saved_contents")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 태그 업데이트
  if (tags !== undefined) {
    const { error: deleteTagError } = await supabase
      .from("content_tags")
      .delete()
      .eq("content_id", id);
    if (deleteTagError) console.error("Tag delete error:", deleteTagError.message);

    if (tags.length > 0) {
      const { error: insertTagError } = await supabase.from("content_tags").insert(
        tags.map((tag) => ({
          content_id: id,
          tag: tag.trim(),
        }))
      );
      if (insertTagError) console.error("Tag insert error:", insertTagError.message);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contents");

  return data;
}

// 콘텐츠 삭제
export async function deleteContent(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("인증이 필요합니다.");

  const { error } = await supabase
    .from("saved_contents")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contents");
}

// 콘텐츠 아카이브 토글
export async function toggleArchive(id: string, isArchived: boolean) {
  return updateContent({ id, is_archived: isArchived });
}
