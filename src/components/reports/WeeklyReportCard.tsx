"use client";

import { Award, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyReportCardProps {
  weekNumber: number;
  avgScore: number;
  prevAvgScore?: number;
  aiSummary?: string;
  badges?: string[];
}

export function WeeklyReportCard({
  weekNumber,
  avgScore,
  prevAvgScore,
  aiSummary,
  badges,
}: WeeklyReportCardProps) {
  const diff = prevAvgScore != null ? avgScore - prevAvgScore : 0;
  const TrendIcon =
    diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
  const trendColor =
    diff > 0 ? "text-success" : diff < 0 ? "text-error" : "text-text-lighter";

  return (
    <div className="bg-white rounded-2xl border border-cream-darker p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-text">
          {weekNumber}주차 리포트
        </h3>
        <div className={cn("flex items-center gap-1 text-sm font-medium", trendColor)}>
          <TrendIcon className="h-4 w-4" />
          {diff > 0 ? "+" : ""}
          {diff.toFixed(1)}점
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">
            {avgScore.toFixed(1)}
          </p>
          <p className="text-xs text-text-lighter">평균 점수</p>
        </div>
        {prevAvgScore != null && (
          <div className="text-center">
            <p className="text-lg font-semibold text-text-light">
              {prevAvgScore.toFixed(1)}
            </p>
            <p className="text-xs text-text-lighter">지난주</p>
          </div>
        )}
      </div>

      {aiSummary && (
        <div className="bg-cream rounded-xl p-3 mb-3">
          <p className="text-sm text-text-light leading-relaxed">{aiSummary}</p>
        </div>
      )}

      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium"
            >
              <Award className="h-3 w-3" />
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
