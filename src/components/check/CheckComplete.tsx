"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getGrade } from "@/lib/constants";

interface CheckCompleteProps {
  score: number;
  scores: {
    sleep: number;
    exercise: number;
    diet: number;
    stress: number;
    social: number;
  };
}

const categoryInfo = [
  { key: "sleep" as const, emoji: "😴", label: "수면" },
  { key: "exercise" as const, emoji: "🏃", label: "운동" },
  { key: "diet" as const, emoji: "🥗", label: "식단" },
  { key: "stress" as const, emoji: "🧘", label: "스트레스" },
  { key: "social" as const, emoji: "👥", label: "사회활동" },
];

export default function CheckComplete({ score, scores }: CheckCompleteProps) {
  const grade = getGrade(score);

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8 animate-fade-in-up">
      {/* Score + Grade */}
      <div className="text-center space-y-3">
        <div
          className="text-6xl font-bold tabular-nums"
          style={{ color: grade.color }}
        >
          {score}
          <span className="text-2xl text-muted-foreground ml-1">점</span>
        </div>
        <p className="text-xl font-semibold">{grade.label}</p>
      </div>

      {/* Category breakdown */}
      <div className="w-full max-w-sm space-y-3">
        {categoryInfo.map(({ key, emoji, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-lg w-8 text-center">{emoji}</span>
            <span className="text-sm text-muted-foreground w-16">{label}</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(scores[key] / 5) * 100}%`,
                  backgroundColor: grade.color,
                }}
              />
            </div>
            <span className="text-sm font-medium tabular-nums w-6 text-right">
              {scores[key]}
            </span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full max-w-sm pt-4">
        <Button asChild size="lg" className="w-full">
          <Link href="/share">내 점수 공유하기</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/dashboard">대시보드 보기</Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="w-full">
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    </div>
  );
}
