"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { CommentItem } from "./CommentItem";
import { Send } from "lucide-react";

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

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onRefresh: () => void;
}

export function CommentSection({
  postId,
  comments,
  onRefresh,
}: CommentSectionProps) {
  const { profile } = useUserStore();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const topLevel = comments.filter((c) => !c.parent_id);
  const replies = comments.filter((c) => c.parent_id);

  const handleSubmit = useCallback(async () => {
    if (!newComment.trim() || !profile) return;
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("community_comments").insert({
        post_id: postId,
        user_id: profile.id,
        content: newComment.trim(),
        parent_id: replyTo,
        is_anonymous: false,
      });

      if (error) throw error;

      // Update comment count
      await supabase.rpc("increment_comment_count", { post_id: postId });

      setNewComment("");
      setReplyTo(null);
      onRefresh();
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  }, [newComment, profile, postId, replyTo, onRefresh]);

  const handleDelete = useCallback(
    async (commentId: string) => {
      const supabase = createClient();
      await supabase.from("community_comments").delete().eq("id", commentId);
      onRefresh();
    },
    [onRefresh]
  );

  return (
    <div>
      <h3 className="font-semibold text-text mb-3">
        댓글 {comments.length}개
      </h3>

      {/* Comment Input */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          {replyTo && (
            <div className="absolute -top-6 left-0 text-xs text-primary flex items-center gap-1">
              <span>답글 작성 중</span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-text-lighter hover:text-text-light"
              >
                ✕
              </button>
            </div>
          )}
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="댓글을 입력하세요..."
            className="w-full rounded-xl border border-cream-darker bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim() || submitting}
          className="rounded-xl bg-primary px-3 py-2.5 text-white disabled:opacity-50 transition-opacity"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-cream-dark">
        {topLevel.map((comment) => (
          <div key={comment.id}>
            <CommentItem
              id={comment.id}
              content={comment.content}
              nickname={comment.profiles?.nickname || "알 수 없음"}
              isAnonymous={comment.is_anonymous}
              likeCount={comment.like_count}
              createdAt={comment.created_at}
              isOwner={comment.user_id === profile?.id}
              onReply={(id) => setReplyTo(id)}
              onDelete={handleDelete}
            />
            {/* Replies */}
            {replies
              .filter((r) => r.parent_id === comment.id)
              .map((reply) => (
                <CommentItem
                  key={reply.id}
                  id={reply.id}
                  content={reply.content}
                  nickname={reply.profiles?.nickname || "알 수 없음"}
                  isAnonymous={reply.is_anonymous}
                  likeCount={reply.like_count}
                  createdAt={reply.created_at}
                  isOwner={reply.user_id === profile?.id}
                  isReply
                  onDelete={handleDelete}
                />
              ))}
          </div>
        ))}

        {comments.length === 0 && (
          <p className="py-8 text-center text-sm text-text-lighter">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </p>
        )}
      </div>
    </div>
  );
}
