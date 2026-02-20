'use client';

interface WeeklyProgressProps {
  completedDays: number;
  totalDays: number;
}

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export function WeeklyProgress({ completedDays, totalDays }: WeeklyProgressProps) {
  const rate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-cream-darker p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text">이번 주 완료율</h2>
        <span className="text-sm font-bold text-primary">{rate}%</span>
      </div>

      <div className="flex items-center justify-between gap-1">
        {DAY_LABELS.map((day, index) => {
          const isCompleted = index < completedDays;
          return (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  isCompleted
                    ? 'bg-primary text-white'
                    : 'bg-cream-dark text-text-light'
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : null}
              </div>
              <span className="text-[10px] text-text-light">{day}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-text-light mt-3">
        이번 주 {totalDays}일 중 {completedDays}일 완료
      </p>
    </div>
  );
}
