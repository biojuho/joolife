"use client";

import { useChecklistStore } from "@/stores/checklist-store";
import { RatingInput } from "./ChecklistItem";

export function ConditionTab() {
  const {
    overall_energy,
    overall_mood,
    overall_skin_condition,
    meal_note,
    setNumber,
    setString,
  } = useChecklistStore();

  return (
    <div className="space-y-2">
      <RatingInput
        emoji="⚡"
        label="에너지 레벨"
        value={overall_energy}
        onChange={(v) => setNumber("overall_energy", v)}
      />

      <RatingInput
        emoji="😊"
        label="오늘의 기분"
        value={overall_mood}
        onChange={(v) => setNumber("overall_mood", v)}
      />

      <RatingInput
        emoji="✨"
        label="피부 상태"
        value={overall_skin_condition}
        onChange={(v) => setNumber("overall_skin_condition", v)}
      />

      <div className="p-3 rounded-xl border border-cream-darker bg-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📝</span>
          <span className="text-sm font-medium text-text">오늘의 메모</span>
        </div>
        <textarea
          value={meal_note}
          onChange={(e) => setString("meal_note", e.target.value)}
          placeholder="오늘 하루는 어떠셨나요? 자유롭게 기록해보세요..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-cream-darker bg-cream text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </div>
  );
}
