"use client";

import { useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { useChecklistStore } from "@/stores/checklist-store";
import { useCoachingStore } from "@/stores/coaching-store";
import { ChecklistForm } from "@/components/checklist/ChecklistForm";
import { getToday } from "@/lib/utils";
import type { DailyChecklist } from "@/lib/types";

export default function ChecklistPage() {
  const { profile } = useUserStore();
  const {
    setSaving,
    markClean,
    loadFromDB,
    getChecklistData,
  } = useChecklistStore();
  const { setGenerating, setMessage, setError } = useCoachingStore();

  const today = getToday();

  // Load today's checklist on mount
  useEffect(() => {
    async function loadChecklist() {
      if (!profile) return;
      const supabase = createClient();

      const { data } = await supabase
        .from("daily_checklist")
        .select("*")
        .eq("user_id", profile.id)
        .eq("check_date", today)
        .single();

      if (data) {
        loadFromDB(data as DailyChecklist);
      }
    }

    loadChecklist();
  }, [profile, today, loadFromDB]);

  // Save checklist
  const handleSave = useCallback(async () => {
    if (!profile) return;
    setSaving(true);

    try {
      const supabase = createClient();
      const checklistData = getChecklistData();

      const { error } = await supabase.from("daily_checklist").upsert(
        {
          user_id: profile.id,
          check_date: today,
          ...checklistData,
        },
        { onConflict: "user_id,check_date" }
      );

      if (error) throw error;
      markClean();
    } catch (err) {
      console.error("Failed to save checklist:", err);
    } finally {
      setSaving(false);
    }
  }, [profile, today, getChecklistData, setSaving, markClean]);

  // Request AI coaching
  const handleRequestCoaching = useCallback(async () => {
    if (!profile) return;

    // Save first
    await handleSave();

    setGenerating(true);
    setError(null);

    try {
      const checklistData = getChecklistData();

      const response = await fetch("/api/coaching/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklist: checklistData,
          profile: {
            nickname: profile.nickname,
            birth_year: profile.birth_year,
            gender: profile.gender,
            health_goals: profile.health_goals,
            program_week: profile.program_week,
          },
        }),
      });

      if (!response.ok) throw new Error("Coaching request failed");

      const data = await response.json();
      setMessage(data);

      // Save coaching message to checklist
      const supabase = createClient();
      await supabase
        .from("daily_checklist")
        .update({ ai_coaching_message: JSON.stringify(data) })
        .eq("user_id", profile.id)
        .eq("check_date", today);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "코칭 요청에 실패했습니다."
      );
    } finally {
      setGenerating(false);
    }
  }, [
    profile,
    today,
    handleSave,
    getChecklistData,
    setGenerating,
    setMessage,
    setError,
  ]);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-text">오늘의 체크리스트</h1>
        <p className="text-sm text-text-light">
          하루의 건강 습관을 체크해보세요
        </p>
      </div>

      <ChecklistForm
        onSave={handleSave}
        onRequestCoaching={handleRequestCoaching}
      />
    </div>
  );
}
