"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, TrendingUp } from "lucide-react";
import {
  startOfWeek,
  endOfWeek,
  format,
  subWeeks,
} from "date-fns";
import { ko } from "date-fns/locale";
import type { WeeklySummary, WeeklySummaryResponse } from "@/lib/types";
import { getMoodEmoji } from "@/lib/types";

export default function WeeklyPage() {
  const supabase = createClient();
  const [summaries, setSummaries] = useState<WeeklySummary[]>([]);
  const [currentSummary, setCurrentSummary] =
    useState<WeeklySummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [hasThisWeekEntries, setHasThisWeekEntries] = useState(false);
  const [thisWeekExists, setThisWeekExists] = useState(false);

  const thisWeekStart = format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );
  const thisWeekEnd = format(
    endOfWeek(new Date(), { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // 과거 주간 요약
    const { data: pastSummaries } = await supabase
      .from("weekly_summaries")
      .select("*")
      .eq("user_id", user.id)
      .order("week_start", { ascending: false })
      .limit(10);

    setSummaries(pastSummaries || []);

    // 이번 주 요약이 이미 있는지
    const existing = pastSummaries?.find(
      (s) => s.week_start === thisWeekStart
    );
    setThisWeekExists(!!existing);

    // 이번 주 엔트리가 있는지
    const { data: entries } = await supabase
      .from("journal_entries")
      .select("id")
      .eq("user_id", user.id)
      .gte("entry_date", thisWeekStart)
      .lte("entry_date", thisWeekEnd)
      .neq("user_answer", "");

    setHasThisWeekEntries((entries?.length || 0) > 0);
    setLoading(false);
  }, [supabase, thisWeekStart, thisWeekEnd]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateSummary = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/weekly-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekStart: thisWeekStart,
          weekEnd: thisWeekEnd,
        }),
      });

      if (!res.ok) throw new Error("주간 요약 생성 실패");

      const data = await res.json();
      if (data.summary) {
        setCurrentSummary(data.summary);
        setThisWeekExists(true);
        fetchData();
      }
    } catch (err) {
      console.error("Weekly summary error:", err);
      alert("주간 요약 생성 중 오류가 발생했어요. 다시 시도해 주세요.");
    }
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-warm-500">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-8">
      <h1 className="mb-6 text-2xl font-bold text-warm-900">
        📊 주간 회고
      </h1>

      {/* This week summary generation */}
      {!thisWeekExists && hasThisWeekEntries && (
        <Card className="mb-6 border-warm-300 bg-gradient-to-br from-warm-50 to-orange-50">
          <CardContent className="pt-5 text-center">
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-warm-500" />
            <p className="mb-3 text-warm-700">
              이번 주 기록을 정리해 드릴까요?
            </p>
            <Button
              onClick={generateSummary}
              disabled={generating}
              className="bg-warm-600 text-white hover:bg-warm-700"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  요약 생성 중...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  이번 주 회고 생성하기
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {!hasThisWeekEntries && !thisWeekExists && (
        <Card className="mb-6 border-warm-200 bg-warm-50">
          <CardContent className="py-8 text-center">
            <p className="text-warm-500">
              이번 주 아직 기록이 없어요.
              <br />
              오늘의 질문에 답해보세요!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Current generated summary */}
      {currentSummary && (
        <Card className="mb-6 border-warm-200 bg-white shadow-md animate-fade-in-up">
          <CardContent className="pt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-warm-500">
                {thisWeekStart} ~ {thisWeekEnd}
              </p>
              <span className="text-sm text-warm-400">이번 주</span>
            </div>

            <h3 className="mb-4 text-xl font-bold text-warm-900">
              {currentSummary.headline}
            </h3>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm font-medium text-warm-500">
                  주요 키워드
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentSummary.top_keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full bg-warm-100 px-3 py-1 text-sm text-warm-700"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <Separator className="bg-warm-100" />

              <div>
                <p className="mb-1 text-sm font-medium text-warm-500">
                  감정 흐름
                </p>
                <p className="text-warm-800">{currentSummary.mood_flow}</p>
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-warm-500">
                  발견한 나
                </p>
                <p className="text-warm-800">
                  {currentSummary.self_discovery}
                </p>
              </div>

              <div className="rounded-lg bg-warm-50 p-3">
                <p className="text-sm text-warm-600">
                  💡 {currentSummary.suggestion}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past summaries */}
      {summaries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-warm-800">
            지난 회고
          </h2>
          {summaries.map((summary) => (
            <Card key={summary.id} className="border-warm-200 bg-white">
              <CardContent className="pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm text-warm-500">
                    {format(new Date(summary.week_start), "M월 d일", {
                      locale: ko,
                    })}{" "}
                    ~{" "}
                    {format(new Date(summary.week_end), "M월 d일", {
                      locale: ko,
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-warm-400">
                      {summary.entry_count}회
                    </span>
                    {summary.avg_mood && (
                      <span>
                        {getMoodEmoji(Math.round(summary.avg_mood))}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-warm-800 line-clamp-3">
                  {summary.summary_text}
                </p>
                {summary.top_keywords && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {summary.top_keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-warm-100 px-2 py-0.5 text-xs text-warm-600"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
