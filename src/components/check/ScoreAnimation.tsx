"use client";

import { useEffect, useState } from "react";
import { getGrade } from "@/lib/constants";

interface ScoreAnimationProps {
  targetScore: number;
  onComplete: () => void;
}

export default function ScoreAnimation({
  targetScore,
  onComplete,
}: ScoreAnimationProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [phase, setPhase] = useState<"counting" | "reveal">("counting");
  const grade = getGrade(targetScore);

  useEffect(() => {
    // Count-up animation
    const duration = 1500;
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), targetScore);
      setDisplayScore(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayScore(targetScore);
        setTimeout(() => setPhase("reveal"), 300);
        setTimeout(() => onComplete(), 2000);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetScore, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4">
      {/* Circular score display */}
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={grade.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeDashoffset={`${2 * Math.PI * 52 * (1 - displayScore / 100)}`}
            className="transition-all duration-100 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-bold tabular-nums"
            style={{ color: grade.color }}
          >
            {displayScore}
          </span>
          <span className="text-sm text-muted-foreground">점</span>
        </div>
      </div>

      {/* Grade reveal */}
      <div
        className={`text-center space-y-2 transition-all duration-500 ${
          phase === "reveal"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <p className="text-2xl font-bold">{grade.label}</p>
        <p className="text-muted-foreground text-sm">
          오늘의 슬로에이징 점수입니다
        </p>
      </div>
    </div>
  );
}
