"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      savedCount: 0,
      recommendationCount: 0,
      activeAutomations: 0,
      weeklyActivity: 0,
    };
  }

  const [
    savedResult,
    recoResult,
    autoResult,
    activityResult,
  ] = await Promise.all([
    supabase
      .from("saved_contents")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_archived", false),
    supabase
      .from("recommendations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false),
    supabase
      .from("automations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true),
    supabase
      .from("activity_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      ),
  ]);

  return {
    savedCount: savedResult.count || 0,
    recommendationCount: recoResult.count || 0,
    activeAutomations: autoResult.count || 0,
    weeklyActivity: activityResult.count || 0,
  };
}

export async function getRecentContents(limit: number = 5) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("saved_contents")
    .select("*, categories(id, name, color)")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data || [];
}
