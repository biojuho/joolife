'use client';

import Link from 'next/link';

interface CoachingPreviewProps {
  message: string | null;
}

export function CoachingPreview({ message }: CoachingPreviewProps) {
  return (
    <div className="bg-white rounded-2xl border border-cream-darker p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-text">AI 코칭</h2>
        <Link
          href="/checklist"
          className="text-xs text-primary font-medium hover:underline"
        >
          더보기
        </Link>
      </div>

      {message ? (
        <p className="text-sm text-text-light leading-relaxed line-clamp-3">
          {message}
        </p>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-cream px-3 py-3">
          <span className="text-lg shrink-0" role="img" aria-label="light bulb">
            💡
          </span>
          <p className="text-sm text-text-light">
            체크리스트를 완료하고 AI 코칭을 받아보세요
          </p>
        </div>
      )}
    </div>
  );
}
