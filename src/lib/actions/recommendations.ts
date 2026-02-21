"use server";

import { createClient } from "@/lib/supabase/server";

export interface Recommendation {
  id: string;
  type: "content" | "insight" | "action";
  title: string;
  description: string;
  reasoning: string;
  relevance_score: number;
  is_read: boolean;
  is_saved: boolean;
  created_at: string;
}

export async function getRecommendations(options?: {
  unreadOnly?: boolean;
  limit?: number;
}): Promise<Recommendation[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  let query = supabase
    .from("recommendations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (options?.unreadOnly) {
    query = query.eq("is_read", false);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  } else {
    query = query.limit(20);
  }

  const { data } = await query;
  return (data as Recommendation[]) || [];
}

export async function markRecommendationRead(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("recommendations")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", user.id);
}

export async function markRecommendationSaved(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("recommendations")
    .update({ is_saved: true, is_read: true })
    .eq("id", id)
    .eq("user_id", user.id);
}

export async function dismissRecommendation(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("recommendations")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", user.id);
}

export async function getRecommendationStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { total: 0, unread: 0, saved: 0 };

  const [totalResult, unreadResult, savedResult] = await Promise.all([
    supabase
      .from("recommendations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("recommendations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false),
    supabase
      .from("recommendations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_saved", true),
  ]);

  return {
    total: totalResult.count || 0,
    unread: unreadResult.count || 0,
    saved: savedResult.count || 0,
  };
}
