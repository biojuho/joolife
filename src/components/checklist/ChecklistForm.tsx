"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useChecklistStore } from "@/stores/checklist-store";
import { CHECKLIST_CATEGORIES, MAX_SCORES } from "@/lib/constants";
import { getScoreLevel, getScoreColor } from "@/lib/scoring";
import { DietTab } from "./DietTab";
import { ExerciseTab } from "./ExerciseTab";
import { SleepTab } from "./SleepTab";
import { LifestyleTab } from "./LifestyleTab";
import { ConditionTab } from "./ConditionTab";

interface ChecklistFormProps {
  onSave: () => Promise<void>;
  onRequestCoaching: () => void;
}

export function ChecklistForm({ onSave, onRequestCoaching }: ChecklistFormProps) {
  const [activeTab, setActiveTab] = useState("diet");
  const { scores, isDirty, isSaving } = useChecklistStore();

  const scoreInfo = getScoreLevel(scores.total_score);

  const categoryScores = [
    { key: "diet", current: scores.diet_score, max: MAX_SCORES.diet },
    { key: "exercise", current: scores.exercise_score, max: MAX_SCORES.exercise },
    { key: "sleep", current: scores.sleep_score, max: MAX_SCORES.sleep },
    { key: "lifestyle", current: scores.lifestyle_score, max: MAX_SCORES.lifestyle },
  ];

  return (
    <div className="space-y-4">
      {/* Score Summary */}
      <div className="bg-white rounded-2xl border border-cream-darker p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-text-light">오늘의 점수</p>
            <p className="text-3xl font-bold" style={{ color: getScoreColor(scores.total_score) }}>
              {scores.total_score}
              <span className="text-base font-normal text-text-lighter">/100</span>
            </p>
          </div>
          <p className={cn("text-sm font-medium", scoreInfo.color)}>
            {scoreInfo.label}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {categoryScores.map(({ key, current, max }) => {
            const cat = CHECKLIST_CATEGORIES.find((c) => c.key === key)!;
            const pct = max > 0 ? (current / max) * 100 : 0;
            return (
              <div key={key} className="text-center">
                <p className="text-xs text-text-light mb-1">
                  {cat.emoji} {cat.label}
                </p>
                <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-text mt-1">
                  {current}/{max}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
        {CHECKLIST_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveTab(cat.key)}
            className={cn(
              "flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              activeTab === cat.key
                ? "bg-primary text-white"
                : "bg-white text-text-light border border-cream-darker"
            )}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === "diet" && <DietTab />}
        {activeTab === "exercise" && <ExerciseTab />}
        {activeTab === "sleep" && <SleepTab />}
        {activeTab === "lifestyle" && <LifestyleTab />}
        {activeTab === "condition" && <ConditionTab />}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 pb-4">
        <button
          type="button"
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className={cn(
            "flex-1 py-3 rounded-xl font-semibold transition-colors",
            isDirty
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-cream-dark text-text-lighter"
          )}
        >
          {isSaving ? "저장 중..." : isDirty ? "저장하기" : "저장됨"}
        </button>

        <button
          type="button"
          onClick={onRequestCoaching}
          className="flex-1 py-3 rounded-xl font-semibold bg-accent text-white hover:bg-accent-dark transition-colors"
        >
          AI 코칭 받기 ✨
        </button>
      </div>
    </div>
  );
}
