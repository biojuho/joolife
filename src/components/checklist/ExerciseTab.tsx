"use client";

import { useChecklistStore } from "@/stores/checklist-store";
import { ChecklistItem, NumberInput } from "./ChecklistItem";

export function ExerciseTab() {
  const {
    booleans,
    toggleBoolean,
    exercise_duration_min,
    exercise_steps,
    exercise_type,
    exercise_intensity,
    setNumber,
    setString,
  } = useChecklistStore();

  return (
    <div className="space-y-2">
      <ChecklistItem
        emoji="🏃"
        label="운동 완료"
        points={10}
        checked={!!booleans.exercise_done}
        onToggle={() => toggleBoolean("exercise_done")}
      />

      {booleans.exercise_done && (
        <>
          <div className="p-3 rounded-xl border border-cream-darker bg-white">
            <label className="block text-sm font-medium text-text mb-2">
              운동 종류
            </label>
            <div className="flex flex-wrap gap-2">
              {["걷기", "달리기", "헬스", "수영", "요가", "자전거", "기타"].map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setString("exercise_type", type)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      exercise_type === type
                        ? "bg-primary text-white"
                        : "bg-cream-dark text-text-light hover:bg-cream-darker"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          <NumberInput
            emoji="⏱️"
            label="운동 시간"
            value={exercise_duration_min}
            unit="분"
            min={0}
            max={120}
            step={5}
            onChange={(v) => setNumber("exercise_duration_min", v)}
          />

          <div className="p-3 rounded-xl border border-cream-darker bg-white">
            <label className="block text-sm font-medium text-text mb-2">
              운동 강도
            </label>
            <div className="flex gap-2">
              {(
                [
                  { key: "low", label: "가볍게", emoji: "🚶" },
                  { key: "medium", label: "보통", emoji: "🏃" },
                  { key: "high", label: "격렬", emoji: "🔥" },
                ] as const
              ).map((level) => (
                <button
                  key={level.key}
                  type="button"
                  onClick={() => setString("exercise_intensity", level.key)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    exercise_intensity === level.key
                      ? "bg-primary text-white"
                      : "bg-cream-dark text-text-light hover:bg-cream-darker"
                  }`}
                >
                  {level.emoji} {level.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <NumberInput
        emoji="👟"
        label="걸음 수"
        value={exercise_steps}
        unit="보"
        min={0}
        max={30000}
        step={500}
        onChange={(v) => setNumber("exercise_steps", v)}
      />
    </div>
  );
}
