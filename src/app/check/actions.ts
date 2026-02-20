"use server";

import { createClient } from "@/lib/supabase/server";

interface SaveCheckInput {
  sleep_score: number;
  exercise_score: number;
  diet_score: number;
  stress_score: number;
  social_score: number;
}

export async function saveCheck(input: SaveCheckInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // Get today's date in KST (Asia/Seoul)
  const now = new Date();
  const kstOffset = 9 * 60; // UTC+9
  const kstDate = new Date(now.getTime() + kstOffset * 60 * 1000);
  const checkDate = kstDate.toISOString().split("T")[0];

  // Check if already checked today
  const { data: existing } = await supabase
    .from("daily_checks")
    .select("id")
    .eq("user_id", user.id)
    .eq("check_date", checkDate)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "already_checked" };
  }

  // Validate scores (1-5)
  const scores = [
    input.sleep_score,
    input.exercise_score,
    input.diet_score,
    input.stress_score,
    input.social_score,
  ];
  if (scores.some((s) => s < 1 || s > 5 || !Number.isInteger(s))) {
    return { success: false, error: "점수는 1~5 사이여야 합니다." };
  }

  const { error } = await supabase.from("daily_checks").insert({
    user_id: user.id,
    check_date: checkDate,
    ...input,
  });

  if (error) {
    console.error("Failed to save check:", error);
    return { success: false, error: "저장에 실패했습니다." };
  }

  return { success: true };
}

export async function checkTodayStatus() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Not logged in — allow check without saving
    return { checked: false, loggedIn: false };
  }

  const now = new Date();
  const kstOffset = 9 * 60;
  const kstDate = new Date(now.getTime() + kstOffset * 60 * 1000);
  const checkDate = kstDate.toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("daily_checks")
    .select("id, total_score")
    .eq("user_id", user.id)
    .eq("check_date", checkDate)
    .maybeSingle();

  return {
    checked: !!existing,
    loggedIn: true,
    todayScore: existing?.total_score ?? null,
  };
}
