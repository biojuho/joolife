"use client";

import { cn } from "@/lib/utils";
import { SCORE_LABELS } from "@/lib/constants";

interface CheckCardProps {
  emoji: string;
  label: string;
  question: string;
  selectedValue: number;
  onSelect: (value: number) => void;
  isActive: boolean;
}

const scoreColors = [
  "",
  "bg-red-500/20 border-red-500 text-red-400",
  "bg-orange-500/20 border-orange-500 text-orange-400",
  "bg-yellow-500/20 border-yellow-500 text-yellow-400",
  "bg-emerald-500/20 border-emerald-500 text-emerald-400",
  "bg-green-500/20 border-green-500 text-green-300",
];

export default function CheckCard({
  emoji,
  label,
  question,
  selectedValue,
  onSelect,
  isActive,
}: CheckCardProps) {
  return (
    <div
      className={cn(
        "w-full transition-all duration-500 ease-out",
        isActive
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95 pointer-events-none absolute"
      )}
    >
      <div className="flex flex-col items-center gap-8 px-4">
        {/* Emoji + Label */}
        <div className="text-center space-y-3">
          <span className="text-6xl block animate-fade-in-up">{emoji}</span>
          <h2 className="text-2xl font-bold">{label}</h2>
          <p className="text-muted-foreground text-base">{question}</p>
        </div>

        {/* 5-level score buttons */}
        <div className="flex gap-3 w-full max-w-sm justify-center" role="radiogroup" aria-label={`${label} 점수 선택`}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => onSelect(value)}
              role="radio"
              aria-checked={selectedValue === value}
              aria-label={`${label} ${SCORE_LABELS[value]} ${value}점`}
              className={cn(
                "flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-200 flex-1 min-w-0",
                "hover:scale-105 active:scale-95",
                selectedValue === value
                  ? scoreColors[value]
                  : "border-border/50 bg-card hover:border-muted-foreground/30"
              )}
            >
              <span className="text-2xl font-bold">{value}</span>
              <span className="text-[10px] leading-tight text-center whitespace-nowrap">
                {SCORE_LABELS[value]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
