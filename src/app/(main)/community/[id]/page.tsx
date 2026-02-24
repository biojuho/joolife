"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Heart, Eye, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { CommentSection } from "@/components/community/CommentSection";
import { COMMUNITY_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  user_id: string;
  category: string;
  title: string;
  content: string;
  is_anonymous: boolean;
  like_count: number;
  comment_count: number;
  view_count: number;
  created_at: string;
  profiles: { nickname: string } | null;
}

interface Comment {
  id: string;
  content: string;
  parent_id: string | null;
  user_id: string;
  is_anonymous: boolean;
  like_count: number;
  created_at: string;
  profiles: { nickname: string } | null;
}

export default function CommunityPostPage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useUserStore();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const postId = params.id as string;
  const isOwner = post?.user_id === profile?.id;

  const fetchPost = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select("*, profiles(nickname)")
      .eq("id", postId)
      .single();

    if (data) {
      setPost(data as Post);
      // Increment view count
      await supabase
        .from("community_posts")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", postId);
    }
    setLoading(false);
  }, [postId]);

  const fetchComments = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_comments")
      .select("*, profiles(nickname)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    setComments((data as Comment[]) || []);
  }, [postId]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  // Check if user already liked
  useEffect(() => {
    async function checkLike() {
      if (!profile) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("community_post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", profile.id)
        .single();

      if (data) setLiked(true);
    }
    checkLike();
  }, [profile, postId]);

  const handleLike = async () => {
    if (!profile || !post) return;
    const supabase = createClient();

    if (liked) {
      await supabase
        .from("community_post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", profile.id);

      setPost({ ...post, like_count: post.like_count - 1 });
    } else {
      await supabase.from("community_post_likes").insert({
        post_id: postId,
        user_id: profile.id,
      });

      setPost({ ...post, like_count: post.like_count + 1 });
    }
    setLiked(!liked);
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const supabase = createClient();
    await supabase.from("community_posts").delete().eq("id", postId);
    router.replace("/community");
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-cream-dark rounded w-3/4" />
        <div className="h-4 bg-cream-dark rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-cream-dark rounded" />
          <div className="h-4 bg-cream-dark rounded" />
          <div className="h-4 bg-cream-dark rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-lighter">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const cat = COMMUNITY_CATEGORIES.find((c) => c.key === post.category);
  const displayName = post.is_anonymous
    ? "익명"
    : post.profiles?.nickname || "알 수 없음";
  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.back()}
          className="text-text-light hover:text-text transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm text-text-light">커뮤니티</span>
      </div>

      {/* Post Content */}
      <div className="bg-white rounded-2xl border border-cream-darker p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          {cat && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cream-dark text-text-light">
              {cat.emoji} {cat.label}
            </span>
          )}
        </div>

        <h1 className="text-lg font-bold text-text mb-2">{post.title}</h1>

        <div className="flex items-center gap-2 text-xs text-text-lighter mb-4">
          <span>{displayName}</span>
          <span>·</span>
          <span>{date}</span>
          <span>·</span>
          <span className="flex items-center gap-0.5">
            <Eye className="h-3 w-3" /> {post.view_count}
          </span>
        </div>

        <p className="text-sm text-text-light whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-dark">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors",
              liked ? "text-error" : "text-text-lighter hover:text-error"
            )}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-current")} />
            좋아요 {post.like_count}
          </button>

          {isOwner && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 text-sm text-text-lighter hover:text-error transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-2xl border border-cream-darker p-4">
        <CommentSection
          postId={postId}
          comments={comments}
          onRefresh={fetchComments}
        />
      </div>
    </div>
  );
}
