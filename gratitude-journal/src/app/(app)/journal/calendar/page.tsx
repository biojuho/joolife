"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import type { JournalEntry } from "@/lib/types";
import { MOOD_EMOJIS } from "@/lib/types";

export default function CalendarPage() {
  const supabase = createClient();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("entry_date", start)
      .lte("entry_date", end)
      .neq("user_answer", "");

    setEntries(data || []);
    setLoading(false);
  }, [supabase, currentMonth]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDayOfWeek = getDay(startOfMonth(currentMonth));

  const getEntryForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return entries.find((e) => e.entry_date === dateStr);
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="px-5 pt-8">
      <h1 className="mb-6 text-2xl font-bold text-warm-900">
        📅 나의 기록
      </h1>

      {/* Month Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-warm-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-semibold text-warm-800">
          {format(currentMonth, "yyyy년 M월", { locale: ko })}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-warm-600"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card className="border-warm-200 bg-white">
        <CardContent className="pt-4">
          {/* Week day headers */}
          <div className="mb-2 grid grid-cols-7 text-center">
            {weekDays.map((day) => (
              <div
                key={day}
                className="py-2 text-sm font-medium text-warm-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for start of month */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12" />
            ))}

            {days.map((day) => {
              const entry = getEntryForDate(day);
              const isCurrentDay = isToday(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => {
                    if (entry) {
                      router.push(`/journal/${entry.id}`);
                    }
                  }}
                  disabled={!entry}
                  className={`relative flex h-12 flex-col items-center justify-center rounded-lg transition-colors ${
                    isCurrentDay
                      ? "bg-warm-100 font-bold"
                      : ""
                  } ${
                    entry
                      ? "cursor-pointer hover:bg-warm-50"
                      : "cursor-default"
                  } ${!isCurrentMonth ? "opacity-30" : ""}`}
                >
                  <span
                    className={`text-sm ${
                      isCurrentDay ? "text-warm-700" : "text-warm-800"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {entry && (
                    <span className="text-xs">
                      {entry.mood_score
                        ? MOOD_EMOJIS[entry.mood_score - 1]
                        : "✍️"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* This month stats */}
      {!loading && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Card className="border-warm-200 bg-warm-50">
            <CardContent className="py-4 text-center">
              <p className="text-3xl font-bold text-warm-700">
                {entries.length}
              </p>
              <p className="text-sm text-warm-500">이번 달 기록</p>
            </CardContent>
          </Card>
          <Card className="border-warm-200 bg-warm-50">
            <CardContent className="py-4 text-center">
              <p className="text-3xl font-bold text-warm-700">
                {entries.length > 0
                  ? (
                      entries
                        .filter((e) => e.mood_score)
                        .reduce((sum, e) => sum + (e.mood_score || 0), 0) /
                      entries.filter((e) => e.mood_score).length
                    ).toFixed(1)
                  : "-"}
              </p>
              <p className="text-sm text-warm-500">평균 기분</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
