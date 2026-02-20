"use client";

import { useChecklistStore } from "@/stores/checklist-store";
import { ChecklistItem, NumberInput, RatingInput } from "./ChecklistItem";

export function LifestyleTab() {
  const {
    booleans,
    toggleBoolean,
    lifestyle_supplements,
    lifestyle_stress_level,
    lifestyle_meditation_min,
    setNumber,
    setSupplements,
  } = useChecklistStore();

  const SUPPLEMENT_OPTIONS = [
    "비타민D",
    "오메가3",
    "유산균",
    "비타민C",
    "마그네슘",
    "코엔자임Q10",
    "콜라겐",
    "기타",
  ];

  return (
    <div className="space-y-2">
      <ChecklistItem
        emoji="☀️"
        label="자외선 차단제 도포"
        points={5}
        checked={!!booleans.lifestyle_sunscreen}
        onToggle={() => toggleBoolean("lifestyle_sunscreen")}
      />

      <div className="p-3 rounded-xl border border-cream-darker bg-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">💊</span>
          <span className="text-sm font-medium text-text">
            오늘 복용한 영양제
          </span>
          <span className="text-xs text-primary font-semibold ml-auto">
            +5점
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUPPLEMENT_OPTIONS.map((supp) => {
            const isSelected = lifestyle_supplements.includes(supp);
            return (
              <button
                key={supp}
                type="button"
                onClick={() => {
                  const next = isSelected
                    ? lifestyle_supplements.filter((s) => s !== supp)
                    : [...lifestyle_supplements, supp];
                  setSupplements(next);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-cream-dark text-text-light"
                }`}
              >
                {supp}
              </button>
            );
          })}
        </div>
      </div>

      <NumberInput
        emoji="🧘"
        label="명상/마음챙김"
        value={lifestyle_meditation_min}
        unit="분"
        min={0}
        max={60}
        step={5}
        onChange={(v) => setNumber("lifestyle_meditation_min", v)}
      />

      <RatingInput
        emoji="😰"
        label="오늘의 스트레스 수준"
        value={lifestyle_stress_level}
        onChange={(v) => setNumber("lifestyle_stress_level", v)}
      />
    </div>
  );
}
