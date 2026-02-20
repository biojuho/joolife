'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { ArticleCategory } from '@/lib/types';

type BadgeVariant = 'solid' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  category?: ArticleCategory;
  variant?: BadgeVariant;
  label?: string;
}

const categoryConfig: Record<
  ArticleCategory,
  { solid: string; outline: string; label: string }
> = {
  diet: {
    solid: 'bg-emerald-100 text-emerald-700',
    outline: 'border-emerald-300 text-emerald-700',
    label: '식단',
  },
  exercise: {
    solid: 'bg-blue-100 text-blue-700',
    outline: 'border-blue-300 text-blue-700',
    label: '운동',
  },
  sleep: {
    solid: 'bg-purple-100 text-purple-700',
    outline: 'border-purple-300 text-purple-700',
    label: '수면',
  },
  lifestyle: {
    solid: 'bg-orange-100 text-orange-700',
    outline: 'border-orange-300 text-orange-700',
    label: '생활습관',
  },
  science: {
    solid: 'bg-indigo-100 text-indigo-700',
    outline: 'border-indigo-300 text-indigo-700',
    label: '과학',
  },
  mindset: {
    solid: 'bg-pink-100 text-pink-700',
    outline: 'border-pink-300 text-pink-700',
    label: '마인드셋',
  },
};

function Badge({
  category,
  variant = 'solid',
  label,
  className,
  children,
  ...props
}: BadgeProps) {
  const config = category ? categoryConfig[category] : null;
  const displayLabel = label ?? config?.label ?? children;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        variant === 'outline' && 'border bg-transparent',
        config
          ? config[variant]
          : variant === 'solid'
            ? 'bg-cream-dark text-text-light'
            : 'border-cream-darker text-text-light',
        className,
      )}
      {...props}
    >
      {displayLabel}
    </span>
  );
}

export { Badge };
