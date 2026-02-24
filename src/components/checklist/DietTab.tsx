"use client";

import { useChecklistStore } from "@/stores/checklist-store";
import { DIET_ITEMS } from "@/lib/constants";
import { ChecklistItem, NumberInput } from "./ChecklistItem";

export function DietTab() {
  const { booleans, toggleBoolean, meal_water_liters, setNumber } =
    useChecklistStore();

  return (
    <div className="space-y-2">
      {DIET_ITEMS.map((item) =>
        item.type === "number" && item.key === "meal_water_liters" ? (
          <NumberInput
            key={item.key}
            emoji={item.emoji}
            label={item.label}
            value={meal_water_liters}
            unit="L"
            min={0}
            max={4}
            step={0.1}
            onChange={(v) => setNumber("meal_water_liters", v)}
          />
        ) : (
          <ChecklistItem
            key={item.key}
            emoji={item.emoji}
            label={item.label}
            points={item.points}
            checked={!!booleans[item.key]}
            onToggle={() => toggleBoolean(item.key)}
          />
        )
      )}
    </div>
  );
}
