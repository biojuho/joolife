"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { COMMUNITY_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PostForm() {
  const router = useRouter();
  const { profile } = useUserStore();
  const [category, setCategory] = useState("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !profile) return;
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("community_posts")
        .insert({
          user_id: profile.id,
          category,
          title: title.trim(),
          content: content.trim(),
          is_anonymous: isAnonymous,
        })
        .select("id")
        .single();

      if (error) throw error;
      router.push(`/community/${data.id}`);
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          카테고리
        </label>
        <div className="flex gap-2 flex-wrap">
          {COMMUNITY_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setCategory(cat.key)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm font-medium transition-colors",
                category === cat.key
                  ? "bg-primary text-white"
                  : "bg-white text-text-light border border-cream-darker"
              )}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          제목
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          maxLength={100}
          className="w-full rounded-xl border border-cream-darker bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          내용
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={8}
          className="w-full rounded-xl border border-cream-darker bg-white px-4 py-3 text-sm resize-none focus:border-primary focus:outline-none"
        />
      </div>

      {/* Anonymous Toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsAnonymous(!isAnonymous)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            isAnonymous ? "bg-primary" : "bg-cream-darker"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
              isAnonymous && "translate-x-5"
            )}
          />
        </button>
        <span className="text-sm text-text-light">익명으로 작성</span>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!title.trim() || !content.trim() || submitting}
        className="w-full py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 transition-opacity"
      >
        {submitting ? "등록 중..." : "글 등록하기"}
      </button>
    </div>
  );
}
