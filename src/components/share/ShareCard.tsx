"use client";

import { forwardRef } from "react";
import { getGrade, CHECK_CATEGORIES } from "@/lib/constants";

interface ShareCardProps {
  score: number;
  scores: {
    sleep: number;
    exercise: number;
    diet: number;
    stress: number;
    social: number;
  };
  date: string;
  nickname: string | null;
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ score, scores, date, nickname }, ref) => {
    const grade = getGrade(score);

    // Format date: "2025.01.15"
    const formattedDate = date.replace(/-/g, ".");

    return (
      <div
        ref={ref}
        className="w-[360px] p-6 rounded-2xl relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1A1A2E 0%, #16162A 50%, #0F0F1A 100%)",
          fontFamily: "'Pretendard', 'Inter', system-ui, sans-serif",
        }}
      >
        {/* Decorative gradient orb */}
        <div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-20 blur-3xl"
          style={{ background: grade.color }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full opacity-10 blur-3xl"
          style={{ background: "#6C5CE7" }}
        />

        {/* Content */}
        <div className="relative z-10 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌿</span>
              <span className="text-sm font-semibold text-white/90">
                SlowAge
              </span>
            </div>
            <span className="text-xs text-white/40">{formattedDate}</span>
          </div>

          {/* Score */}
          <div className="text-center py-3">
            <div className="relative inline-block">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={grade.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-3xl font-bold"
                  style={{ color: grade.color }}
                >
                  {score}
                </span>
                <span className="text-[10px] text-white/50">점</span>
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-white/90">
              {grade.label}
            </p>
          </div>

          {/* Category scores */}
          <div className="space-y-2">
            {CHECK_CATEGORIES.map((cat) => {
              const val = scores[cat.id];
              return (
                <div key={cat.id} className="flex items-center gap-2.5">
                  <span className="text-sm w-6 text-center">{cat.emoji}</span>
                  <span className="text-xs text-white/50 w-14">
                    {cat.label}
                  </span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(val / 5) * 100}%`,
                        backgroundColor: grade.color,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/40 tabular-nums w-4 text-right">
                    {val}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-[10px] text-white/30">
              {nickname
                ? `${nickname}님의 슬로에이징 기록`
                : "나의 슬로에이징 기록"}
            </span>
            <span className="text-[10px] text-white/20">slowage.app</span>
          </div>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = "ShareCard";

export default ShareCard;
