"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { getCurrentWeek } from "@/lib/utils";
import { MAX_SCORES } from "@/lib/constants";
import { CategoryRadarChart } from "@/components/reports/CategoryRadarChart";
import { ScoreBarChart } from "@/components/reports/ScoreBarChart";
import { WeeklyReportCard } from "@/components/reports/WeeklyReportCard";
import { cn } from "@/lib/utils";

interface DailyScore {
  check_date: string;
  total_score: number;
  diet_score: number;
  exercise_score: number;
  sleep_score: number;
  lifestyle_score: number;
}

interface WeeklyReport {
  week_number: number;
  avg_total_score: number;
  avg_diet_score: number;
  avg_exercise_score: number;
  avg_sleep_score: number;
  avg_lifestyle_score: number;
  ai_summary: string | null;
  badges: string[] | null;
}

export default function ReportsPage() {
  const { profile } = useUserStore();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [dailyScores, setDailyScores] = useState<DailyScore[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [prevReport, setPrevReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);

  const currentWeek = profile?.program_started_at
    ? getCurrentWeek(profile.program_started_at)
    : 1;

  useEffect(() => {
    setSelectedWeek(currentWeek);
  }, [currentWeek]);

  useEffect(() => {
    async function fetchData() {
      if (!profile?.program_started_at) return;
      setLoading(true);
      const supabase = createClient();

      // Calculate week date range
      const startDate = new Date(profile.program_started_at);
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (selectedWeek - 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const startStr = weekStart.toISOString().split("T")[0];
      const endStr = weekEnd.toISOString().split("T")[0];

      // Fetch daily scores for the week
      const { data: scores } = await supabase
        .from("daily_checklist")
        .select(
          "check_date, total_score, diet_score, exercise_score, sleep_score, lifestyle_score"
        )
        .eq("user_id", profile.id)
        .gte("check_date", startStr)
        .lte("check_date", endStr)
        .order("check_date");

      setDailyScores((scores as DailyScore[]) || []);

      // Fetch weekly report
      const { data: report } = await supabase
        .from("weekly_reports")
        .select("*")
        .eq("user_id", profile.id)
        .eq("week_number", selectedWeek)
        .single();

      setWeeklyReport(report as WeeklyReport | null);

      // Fetch previous week report
      if (selectedWeek > 1) {
        const { data: prev } = await supabase
          .from("weekly_reports")
          .select("*")
          .eq("user_id", profile.id)
          .eq("week_number", selectedWeek - 1)
          .single();

        setPrevReport(prev as WeeklyReport | null);
      } else {
        setPrevReport(null);
      }

      setLoading(false);
    }

    fetchData();
  }, [profile, selectedWeek]);

  // Calculate averages from daily scores
  const avgScores = dailyScores.length > 0
    ? {
        diet: dailyScores.reduce((s, d) => s + d.diet_score, 0) / dailyScores.length,
        exercise: dailyScores.reduce((s, d) => s + d.exercise_score, 0) / dailyScores.length,
        sleep: dailyScores.reduce((s, d) => s + d.sleep_score, 0) / dailyScores.length,
        lifestyle: dailyScores.reduce((s, d) => s + d.lifestyle_score, 0) / dailyScores.length,
        total: dailyScores.reduce((s, d) => s + d.total_score, 0) / dailyScores.length,
      }
    : null;

  const radarData = avgScores
    ? [
        { category: "식단", score: avgScores.diet, maxScore: MAX_SCORES.diet },
        { category: "운동", score: avgScores.exercise, maxScore: MAX_SCORES.exercise },
        { category: "수면", score: avgScores.sleep, maxScore: MAX_SCORES.sleep },
        { category: "생활습관", score: avgScores.lifestyle, maxScore: MAX_SCORES.lifestyle },
      ]
    : [];

  const barData = dailyScores.map((d) => ({
    date: d.check_date,
    score: d.total_score,
  }));

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-text">주간 리포트</h1>
        <p className="text-sm text-text-light">주간 건강 습관 분석</p>
      </div>

      {/* Week Selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
        {Array.from({ length: currentWeek }, (_, i) => i + 1).map((week) => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={cn(
              "flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              selectedWeek === week
                ? "bg-primary text-white"
                : "bg-white text-text-light border border-cream-darker"
            )}
          >
            {week}주차
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="bg-white rounded-2xl border border-cream-darker p-4 h-40" />
          <div className="bg-white rounded-2xl border border-cream-darker p-4 h-64" />
          <div className="bg-white rounded-2xl border border-cream-darker p-4 h-48" />
        </div>
      ) : dailyScores.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-text-lighter mb-1">
            {selectedWeek}주차 데이터가 없습니다
          </p>
          <p className="text-sm text-text-lighter">
            체크리스트를 작성하면 리포트가 생성됩니다
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Weekly Summary */}
          <WeeklyReportCard
            weekNumber={selectedWeek}
            avgScore={avgScores?.total || 0}
            prevAvgScore={prevReport?.avg_total_score}
            aiSummary={weeklyReport?.ai_summary || undefined}
            badges={weeklyReport?.badges || undefined}
          />

          {/* Radar Chart */}
          <div className="bg-white rounded-2xl border border-cream-darker p-4">
            <h3 className="font-semibold text-text mb-2">카테고리별 분석</h3>
            <CategoryRadarChart data={radarData} />
          </div>

          {/* Daily Bar Chart */}
          <div className="bg-white rounded-2xl border border-cream-darker p-4">
            <h3 className="font-semibold text-text mb-2">일별 점수</h3>
            <ScoreBarChart data={barData} />
          </div>
        </div>
      )}
    </div>
  );
}
