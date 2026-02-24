'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ProgressBarSize = 'sm' | 'md';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  color?: string;
  size?: ProgressBarSize;
  showLabel?: boolean;
}

const sizeStyles: Record<ProgressBarSize, string> = {
  sm: 'h-1.5',
  md: 'h-3',
};

function ProgressBar({
  value,
  color = 'bg-primary',
  size = 'md',
  showLabel = false,
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-text-light">진행률</span>
          <span className="text-xs font-medium text-text">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-cream-dark',
          sizeStyles[size],
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            color,
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

export { ProgressBar };
