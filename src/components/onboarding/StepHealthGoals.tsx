'use client';

import { HEALTH_GOALS } from '@/lib/constants';

interface StepHealthGoalsProps {
  selectedGoals: string[];
  onToggle: (goalKey: string) => void;
}

export default function StepHealthGoals({
  selectedGoals,
  onToggle,
}: StepHealthGoalsProps) {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text">건강 목표를 선택하세요</h2>
        <p className="mt-2 text-sm text-text-light">
          관심 있는 목표를 모두 선택해주세요 (복수 선택 가능)
        </p>
      </div>

      {/* Goal chips */}
      <div className="grid grid-cols-2 gap-3">
        {HEALTH_GOALS.map((goal) => {
          const isSelected = selectedGoals.includes(goal.key);

          return (
            <button
              key={goal.key}
              type="button"
              onClick={() => onToggle(goal.key)}
              className={`
                relative flex items-center gap-3 rounded-2xl border-2 px-4 py-4
                transition-all duration-200 active:scale-[0.97]
                ${
                  isSelected
                    ? 'border-primary bg-primary-50 shadow-md shadow-primary/10'
                    : 'border-cream-darker bg-white hover:border-primary-200 hover:bg-primary-50/30'
                }
              `}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <svg
                    className="h-3 w-3 text-white"
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
                </div>
              )}

              <span className="text-2xl">{goal.emoji}</span>
              <span
                className={`text-sm font-semibold ${
                  isSelected ? 'text-primary-dark' : 'text-text'
                }`}
              >
                {goal.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected count */}
      <div className="text-center">
        <p className="text-sm text-text-light">
          <span className="font-bold text-primary">{selectedGoals.length}</span>개 선택됨
        </p>
        {selectedGoals.length === 0 && (
          <p className="mt-1 text-xs text-accent">
            최소 1개 이상의 목표를 선택해주세요
          </p>
        )}
      </div>
    </div>
  );
}
