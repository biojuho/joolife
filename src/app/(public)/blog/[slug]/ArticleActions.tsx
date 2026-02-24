"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleActionsProps {
  slug: string;
  likeCount: number;
}

export function ArticleActions({ slug, likeCount }: ArticleActionsProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likeCount);

  // Increment view count on mount
  useEffect(() => {
    fetch(`/api/articles/${slug}/views`, { method: "POST" }).catch(() => {});
  }, [slug]);

  const handleLike = () => {
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
  };

  return (
    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-cream-darker">
      <button
        onClick={handleLike}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
          liked
            ? "bg-red-50 text-error"
            : "bg-cream-dark text-text-light hover:bg-cream-darker"
        )}
      >
        <Heart className={cn("h-4 w-4", liked && "fill-current")} />
        좋아요 {count}
      </button>
    </div>
  );
}
