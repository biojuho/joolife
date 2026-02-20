"use server";

import { createClient } from "@/lib/supabase/server";
import type { DailyCheck } from "@/types";

export async function getShareData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { loggedIn: false, today: null, nickname: null };
  }

  // Get today's date in KST
  const now = new Date();
  const kstOffset = 9 * 60;
  const kstDate = new Date(now.getTime() + kstOffset * 60 * 1000);
  const todayStr = kstDate.toISOString().split("T")[0];

  // Fetch today's check
  const { data: todayCheck } = await supabase
    .from("daily_checks")
    .select("*")
    .eq("user_id", user.id)
    .eq("check_date", todayStr)
    .maybeSingle();

  // Fetch profile nickname
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .maybeSingle();

  return {
    loggedIn: true,
    today: todayCheck as DailyCheck | null,
    nickname: profile?.nickname ?? null,
  };
}
