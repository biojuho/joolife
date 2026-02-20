'use client';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_LABELS = ['기본 정보', '신체 정보', '건강 목표', '시작일 선택'];

export default function OnboardingProgress({
  currentStep,
  totalSteps = 4,
}: OnboardingProgressProps) {
  return (
    <div className="w-full px-4 py-6">
      {/* Step dots with connecting lines */}
      <div className="flex items-center justify-center gap-0">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <div key={step} className="flex items-center">
              {/* Step dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-full
                    text-sm font-semibold transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-primary text-white shadow-md shadow-primary/30'
                        : isActive
                          ? 'bg-primary text-white shadow-lg shadow-primary/40 ring-4 ring-primary-100'
                          : 'bg-cream-dark text-text-lighter'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="h-5 w-5"
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
                  ) : (
                    step
                  )}
                </div>
                {/* Step label */}
                <span
                  className={`
                    mt-2 text-xs font-medium transition-colors duration-300
                    ${
                      isCompleted || isActive
                        ? 'text-primary'
                        : 'text-text-lighter'
                    }
                  `}
                >
                  {STEP_LABELS[i]}
                </span>
              </div>

              {/* Connecting line (not after last step) */}
              {step < totalSteps && (
                <div
                  className={`
                    mx-1 mb-6 h-0.5 w-8 rounded-full transition-colors duration-300
                    sm:w-12
                    ${isCompleted ? 'bg-primary' : 'bg-cream-darker'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar (alternative visual) */}
      <div className="mx-auto mt-4 h-1 max-w-xs overflow-hidden rounded-full bg-cream-dark">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
