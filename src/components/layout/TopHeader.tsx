'use client';

import { cn, getGreeting, formatDateKorean } from '@/lib/utils';

export interface TopHeaderProps {
  nickname: string;
  className?: string;
}

function TopHeader({ nickname, className }: TopHeaderProps) {
  const greeting = getGreeting();
  const today = formatDateKorean(new Date());

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between bg-white/80 px-4 backdrop-blur-md',
        'border-b border-cream-darker/50',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text">
          {greeting}, <span className="text-primary">{nickname}</span>님
        </p>
      </div>
      <time className="shrink-0 text-xs text-text-light">{today}</time>
    </header>
  );
}

export { TopHeader };
