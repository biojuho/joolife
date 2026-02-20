"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getGrade, CHECK_CATEGORIES } from "@/lib/constants";

interface TodayScoreCardProps {
  score: number | null;
  scores: {
    sleep: number | null;
    exercise: number | null;
    diet: number | null;
    stress: number | null;
    social: number | null;
  } | null;
  streak: number;
}

export default function TodayScoreCard({
  score,
  scores,
  streak,
}: TodayScoreCardProps) {
  // Not checked today
  if (score === null) {
    return (
      <Card className="border-dashed border-2 border-primary/30">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <div className="text-5xl">🌅</div>
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold">오늘의 체크가 아직 없어요</p>
            <p className="text-sm text-muted-foreground">
              30초면 충분해요! 지금 체크해보세요
            </p>
          </div>
          <Button asChild size="lg" className="mt-2">
            <Link href="/check">오늘의 체크 시작하기</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const grade = getGrade(score);

  return (
    <Card className="overflow-hidden">
      {/* Top gradient accent */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${grade.color}, ${grade.color}80)`,
        }}
      />
      <CardContent className="pt-6 pb-6 space-y-5">
        {/* Score + Grade row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 64 64"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="5"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke={grade.color}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - score / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-lg font-bold tabular-nums"
                  style={{ color: grade.color }}
                >
                  {score}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">오늘의 점수</p>
              <p className="text-base font-semibold">{grade.label}</p>
            </div>
          </div>

          {/* Streak badge */}
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-sm">🔥</span>
              <span className="text-sm font-semibold text-accent-400">
                {streak}일 연속
              </span>
            </div>
          )}
        </div>

        {/* Category mini bars */}
        {scores && (
          <div className="grid grid-cols-5 gap-2">
            {CHECK_CATEGORIES.map((cat) => {
              const val = scores[cat.id];
              return (
                <div key={cat.id} className="flex flex-col items-center gap-1">
                  <span className="text-base">{cat.emoji}</span>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: val ? `${(val / 5) * 100}%` : "0%",
                        backgroundColor: grade.color,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {val ?? "-"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
