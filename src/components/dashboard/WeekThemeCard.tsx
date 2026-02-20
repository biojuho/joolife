'use client';

interface WeekThemeCardProps {
  weekNumber: number;
  title: string;
  description: string;
}

export function WeekThemeCard({ weekNumber, title, description }: WeekThemeCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-cream-darker p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex items-center justify-center rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary shrink-0">
          {weekNumber}주차
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-text leading-snug">
            {title}
          </h3>
          <p className="text-xs text-text-light mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
