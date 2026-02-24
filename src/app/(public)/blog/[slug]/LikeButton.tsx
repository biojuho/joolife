'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  slug: string;
  initialCount: number;
}

function LikeButton({ initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  function handleLike() {
    if (liked) return;
    setLiked(true);
    setCount((c) => c + 1);
    // Fire-and-forget like; no backend endpoint defined for likes yet
  }

  return (
    <button
      onClick={handleLike}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all',
        liked
          ? 'border-pink-200 bg-pink-50 text-pink-600'
          : 'border-cream-darker bg-white text-text-light hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600'
      )}
    >
      <Heart
        className={cn('h-4 w-4', liked && 'fill-pink-600')}
      />
      좋아요 {count > 0 && count.toLocaleString()}
    </button>
  );
}

export { LikeButton };
