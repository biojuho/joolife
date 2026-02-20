"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { COMMUNITY_CATEGORIES } from "@/lib/constants";
import { PostCard } from "@/components/community/PostCard";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  category: string;
  title: string;
  content: string;
  is_anonymous: boolean;
  is_pinned: boolean;
  like_count: number;
  comment_count: number;
  view_count: number;
  created_at: string;
  profiles: { nickname: string } | null;
}

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("community_posts")
      .select("*, profiles(nickname)")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20);

    if (activeCategory !== "all") {
      query = query.eq("category", activeCategory);
    }

    const { data } = await query;
    setPosts((data as Post[]) || []);
    setLoading(false);
  }, [activeCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-text">커뮤니티</h1>
        <p className="text-sm text-text-light">
          함께 건강한 습관을 만들어가요
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-3">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
            activeCategory === "all"
              ? "bg-primary text-white"
              : "bg-white text-text-light border border-cream-darker"
          )}
        >
          전체
        </button>
        {COMMUNITY_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              "flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              activeCategory === cat.key
                ? "bg-primary text-white"
                : "bg-white text-text-light border border-cream-darker"
            )}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-cream-darker p-4 animate-pulse"
            >
              <div className="h-4 bg-cream-dark rounded w-16 mb-2" />
              <div className="h-5 bg-cream-dark rounded w-3/4 mb-1" />
              <div className="h-4 bg-cream-dark rounded w-full mb-3" />
              <div className="h-3 bg-cream-dark rounded w-1/3" />
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              category={post.category}
              title={post.title}
              content={post.content}
              nickname={post.profiles?.nickname || "알 수 없음"}
              isAnonymous={post.is_anonymous}
              likeCount={post.like_count}
              commentCount={post.comment_count}
              viewCount={post.view_count}
              createdAt={post.created_at}
              isPinned={post.is_pinned}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-text-lighter mb-2">아직 게시글이 없습니다</p>
            <p className="text-sm text-text-lighter">
              첫 번째 글을 작성해보세요!
            </p>
          </div>
        )}
      </div>

      {/* FAB Write Button */}
      <Link
        href="/community/write"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-colors"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
