'use client';

interface StepStartDateProps {
  startDate: string | null;
  onSelect: (date: string) => void;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getNextMonday(): string {
  const today = new Date();
  const day = today.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  return nextMonday.toISOString().split('T')[0];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

function getEndDate(startDateStr: string): string {
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(start);
  end.setDate(start.getDate() + 83); // 12 weeks = 84 days, end is day 84
  return formatDate(end.toISOString().split('T')[0]);
}

export default function StepStartDate({ startDate, onSelect }: StepStartDateProps) {
  const today = getToday();
  const nextMonday = getNextMonday();

  const options = [
    {
      value: today,
      label: '오늘 바로 시작',
      sublabel: formatDate(today),
      emoji: '🚀',
      description: '지금 바로 건강한 변화를 시작하세요!',
    },
    {
      value: nextMonday,
      label: '다음 주 월요일부터',
      sublabel: formatDate(nextMonday),
      emoji: '📅',
      description: '주 단위로 깔끔하게 시작해요',
    },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text">시작일을 선택하세요</h2>
        <p className="mt-2 text-sm text-text-light">
          언제부터 프로그램을 시작할까요?
        </p>
      </div>

      {/* Date options */}
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = startDate === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`
                w-full rounded-2xl border-2 p-5 text-left
                transition-all duration-200 active:scale-[0.98]
                ${
                  isSelected
                    ? 'border-primary bg-primary-50 shadow-lg shadow-primary/15'
                    : 'border-cream-darker bg-white hover:border-primary-200 hover:bg-primary-50/30'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{option.emoji}</span>
                <div className="flex-1">
                  <p
                    className={`text-base font-bold ${
                      isSelected ? 'text-primary-dark' : 'text-text'
                    }`}
                  >
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-sm text-text-light">{option.sublabel}</p>
                  <p className="mt-1 text-xs text-text-lighter">{option.description}</p>
                </div>
                {/* Radio indicator */}
                <div
                  className={`
                    mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2
                    transition-all duration-200
                    ${
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-cream-darker bg-white'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Program summary card */}
      {startDate && (
        <div className="animate-scale-in overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Card header */}
          <div className="bg-primary px-5 py-4">
            <h3 className="text-lg font-bold text-white">12주 프로그램</h3>
            <p className="mt-0.5 text-sm text-primary-100">
              SlowAging Coach 저속노화 코칭
            </p>
          </div>

          {/* Card body */}
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-light">시작일</span>
              <span className="text-sm font-semibold text-text">
                {formatDate(startDate)}
              </span>
            </div>
            <div className="h-px bg-cream-dark" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-light">종료일</span>
              <span className="text-sm font-semibold text-text">
                {getEndDate(startDate)}
              </span>
            </div>
            <div className="h-px bg-cream-dark" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-light">총 기간</span>
              <span className="text-sm font-semibold text-primary">84일 (12주)</span>
            </div>
          </div>

          {/* Commitment message */}
          <div className="border-t border-cream-dark bg-primary-50/50 px-5 py-4">
            <p className="text-center text-sm leading-relaxed text-primary-dark">
              매일 5분, 작은 습관이 모여<br />
              <span className="font-bold">건강한 변화</span>를 만들어갑니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
