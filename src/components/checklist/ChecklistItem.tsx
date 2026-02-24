"use client";

import { cn } from "@/lib/utils";

interface ChecklistItemProps {
  emoji: string;
  label: string;
  points: number;
  checked: boolean;
  onToggle: () => void;
}

export function ChecklistItem({
  emoji,
  label,
  points,
  checked,
  onToggle,
}: ChecklistItemProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl border transition-all",
        checked
          ? "bg-primary-50 border-primary/30"
          : "bg-white border-cream-darker hover:border-primary/20"
      )}
    >
      <span className="text-xl">{emoji}</span>
      <span
        className={cn(
          "flex-1 text-left text-sm font-medium",
          checked ? "text-primary-700" : "text-text"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-xs font-semibold px-2 py-0.5 rounded-full",
          checked
            ? "bg-primary text-white"
            : "bg-cream-dark text-text-light"
        )}
      >
        +{points}
      </span>
      <div
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
          checked
            ? "bg-primary border-primary"
            : "border-cream-darker"
        )}
      >
        {checked && (
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </button>
  );
}

interface NumberInputProps {
  emoji: string;
  label: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function NumberInput({
  emoji,
  label,
  value,
  unit,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}: NumberInputProps) {
  return (
    <div className="p-3 rounded-xl border border-cream-darker bg-white">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{emoji}</span>
        <span className="text-sm font-medium text-text">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-cream-dark rounded-full appearance-none cursor-pointer accent-primary"
        />
        <span className="text-sm font-bold text-primary min-w-[4rem] text-right">
          {value}
          {unit}
        </span>
      </div>
    </div>
  );
}

interface RatingInputProps {
  emoji: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const RATING_EMOJIS = ["😫", "😕", "😐", "🙂", "😄"];

export function RatingInput({
  emoji,
  label,
  value,
  onChange,
}: RatingInputProps) {
  return (
    <div className="p-3 rounded-xl border border-cream-darker bg-white">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{emoji}</span>
        <span className="text-sm font-medium text-text">{label}</span>
      </div>
      <div className="flex items-center justify-between gap-1">
        {RATING_EMOJIS.map((ratingEmoji, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={cn(
              "flex-1 py-2 rounded-lg text-xl transition-all",
              value === i + 1
                ? "bg-primary-50 scale-110 ring-2 ring-primary/30"
                : "hover:bg-cream-dark"
            )}
          >
            {ratingEmoji}
          </button>
        ))}
      </div>
    </div>
  );
}
