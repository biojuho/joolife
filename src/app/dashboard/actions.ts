"use server";

import { createClient } from "@/lib/supabase/server";
import type { DailyCheck } from "@/types";

export async function getDashboardData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { loggedIn: false, today: null, weeklyData: [], streak: 0 };
  }

  // Get today's date in KST
  const now = new Date();
  const kstOffset = 9 * 60;
  const kstDate = new Date(now.getTime() + kstOffset * 60 * 1000);
  const todayStr = kstDate.toISOString().split("T")[0];

  // Get last 7 days dates
  const last7Days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(kstDate);
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split("T")[0]);
  }

  // Fetch today's check
  const { data: todayCheck } = await supabase
    .from("daily_checks")
    .select("*")
    .eq("user_id", user.id)
    .eq("check_date", todayStr)
    .maybeSingle();

  // Fetch last 7 days of checks
  const { data: weeklyChecks } = await supabase
    .from("daily_checks")
    .select("*")
    .eq("user_id", user.id)
    .gte("check_date", last7Days[0])
    .lte("check_date", last7Days[6])
    .order("check_date", { ascending: true });

  // Build weekly data with gaps for missing days
  const weeklyData = last7Days.map((date) => {
    const check = weeklyChecks?.find(
      (c: DailyCheck) => c.check_date === date
    );
    return {
      date,
      dayLabel: getDayLabel(date),
      score: check?.total_score ?? null,
      sleep: check?.sleep_score ?? null,
      exercise: check?.exercise_score ?? null,
      diet: check?.diet_score ?? null,
      stress: check?.stress_score ?? null,
      social: check?.social_score ?? null,
    };
  });

  // Calculate streak (consecutive days checked)
  let streak = 0;
  const allChecks = weeklyChecks ?? [];
  for (let i = 0; i <= 6; i++) {
    const d = new Date(kstDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const found = allChecks.find(
      (c: DailyCheck) => c.check_date === dateStr
    );
    if (found) {
      streak++;
    } else {
      // If today and not yet checked, skip; otherwise break
      if (i === 0) continue;
      break;
    }
  }

  return {
    loggedIn: true,
    today: todayCheck as DailyCheck | null,
    weeklyData,
    streak,
  };
}

function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
}
