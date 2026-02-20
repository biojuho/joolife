'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-cream-dark', className)}
      {...props}
    />
  );
}

export { Skeleton };
