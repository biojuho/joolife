"use client";

import Link from "next/link";
import { Heart, MessageCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMMUNITY_CATEGORIES } from "@/lib/constants";

interface PostCardProps {
  id: string;
  category: string;
  title: string;
  content: string;
  nickname: string;
  isAnonymous: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  isPinned?: boolean;
}

export function PostCard({
  id,
  category,
  title,
  content,
  nickname,
  isAnonymous,
  likeCount,
  commentCount,
  viewCount,
  createdAt,
  isPinned,
}: PostCardProps) {
  const cat = COMMUNITY_CATEGORIES.find((c) => c.key === category);
  const displayName = isAnonymous ? "익명" : nickname;
  const preview = content.length > 80 ? content.slice(0, 80) + "..." : content;

  const timeAgo = getTimeAgo(createdAt);

  return (
    <Link href={`/community/${id}`}>
      <div
        className={cn(
          "bg-white rounded-2xl border border-cream-darker p-4 transition-shadow hover:shadow-sm",
          isPinned && "border-primary/30 bg-primary/5"
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          {isPinned && (
            <span className="text-xs font-semibold text-primary">📌 고정</span>
          )}
          {cat && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cream-dark text-text-light">
              {cat.emoji} {cat.label}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-text mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-text-light mb-3 line-clamp-2">{preview}</p>

        <div className="flex items-center justify-between text-xs text-text-lighter">
          <div className="flex items-center gap-1">
            <span>{displayName}</span>
            <span>·</span>
            <span>{timeAgo}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-0.5">
              <Heart className="h-3.5 w-3.5" />
              {likeCount}
            </span>
            <span className="flex items-center gap-0.5">
              <MessageCircle className="h-3.5 w-3.5" />
              {commentCount}
            </span>
            <span className="flex items-center gap-0.5">
              <Eye className="h-3.5 w-3.5" />
              {viewCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}일 전`;

  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}
