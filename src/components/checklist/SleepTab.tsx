"use client";

import { useChecklistStore } from "@/stores/checklist-store";
import { ChecklistItem, NumberInput, RatingInput } from "./ChecklistItem";

export function SleepTab() {
  const {
    booleans,
    toggleBoolean,
    sleep_hours,
    sleep_quality,
    setNumber,
  } = useChecklistStore();

  return (
    <div className="space-y-2">
      <NumberInput
        emoji="😴"
        label="수면 시간"
        value={sleep_hours}
        unit="시간"
        min={0}
        max={12}
        step={0.5}
        onChange={(v) => setNumber("sleep_hours", v)}
      />

      <RatingInput
        emoji="🌙"
        label="수면의 질"
        value={sleep_quality}
        onChange={(v) => setNumber("sleep_quality", v)}
      />

      <ChecklistItem
        emoji="📵"
        label="취침 1시간 전 스크린 차단"
        points={5}
        checked={!!booleans.sleep_before_screen}
        onToggle={() => toggleBoolean("sleep_before_screen")}
      />
    </div>
  );
}
