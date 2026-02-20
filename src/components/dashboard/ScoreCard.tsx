'use client';

import { getScoreColor } from '@/lib/scoring';
import { getScoreLevel } from '@/lib/scoring';

interface ScoreCardProps {
  score: number;
}

export function ScoreCard({ score }: ScoreCardProps) {
  const radius = 58;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / 100, 1);
  const dashOffset = circumference * (1 - progress);
  const color = getScoreColor(score);
  const { label } = getScoreLevel(score);

  return (
    <div className="bg-white rounded-2xl border border-cream-darker p-4">
      <h2 className="text-sm font-semibold text-text mb-3">오늘의 점수</h2>
      <div className="flex flex-col items-center">
        <div className="relative w-36 h-36">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 136 136"
          >
            {/* Background circle */}
            <circle
              cx="68"
              cy="68"
              r={radius}
              fill="none"
              stroke="#E8DFD1"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx="68"
              cy="68"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-3xl font-bold"
              style={{ color }}
            >
              {score}
            </span>
            <span className="text-xs text-text-light">/100</span>
          </div>
        </div>
        <p
          className="mt-2 text-sm font-medium"
          style={{ color }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
