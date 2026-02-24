"use client";

import { useState } from "react";
import { Heart, Reply, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentItemProps {
  id: string;
  content: string;
  nickname: string;
  isAnonymous: boolean;
  likeCount: number;
  createdAt: string;
  isOwner: boolean;
  isReply?: boolean;
  onReply?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
}

export function CommentItem({
  id,
  content,
  nickname,
  isAnonymous,
  likeCount,
  createdAt,
  isOwner,
  isReply = false,
  onReply,
  onDelete,
  onLike,
}: CommentItemProps) {
  const [liked, setLiked] = useState(false);
  const displayName = isAnonymous ? "익명" : nickname;
  const date = new Date(createdAt);
  const timeStr = date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("py-3", isReply && "ml-8 border-l-2 border-cream-dark pl-3")}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-cream-dark flex items-center justify-center text-xs">
            {isAnonymous ? "?" : displayName.charAt(0)}
          </div>
          <span className="text-sm font-medium text-text">{displayName}</span>
          <span className="text-xs text-text-lighter">{timeStr}</span>
        </div>
        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="text-text-lighter hover:text-error transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <p className="text-sm text-text-light mb-2">{content}</p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setLiked(!liked);
            onLike?.(id);
          }}
          className={cn(
            "flex items-center gap-1 text-xs transition-colors",
            liked ? "text-error" : "text-text-lighter hover:text-error"
          )}
        >
          <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
          {likeCount + (liked ? 1 : 0)}
        </button>
        {!isReply && onReply && (
          <button
            onClick={() => onReply(id)}
            className="flex items-center gap-1 text-xs text-text-lighter hover:text-text-light transition-colors"
          >
            <Reply className="h-3.5 w-3.5" />
            답글
          </button>
        )}
      </div>
    </div>
  );
}
