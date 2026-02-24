"use client";

import { useState, useEffect } from "react";
import { X, Link2, FileText, Image, Tag, FolderOpen } from "lucide-react";
import { createContent, type ContentType } from "@/lib/actions/contents";
import { getCategories } from "@/lib/actions/categories";

interface SaveContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValue?: string;
}

const contentTypes = [
  { type: "url" as ContentType, icon: Link2, label: "URL" },
  { type: "memo" as ContentType, icon: FileText, label: "메모" },
  { type: "image" as ContentType, icon: Image, label: "이미지" },
];

interface Category {
  id: string;
  name: string;
  color: string;
}

export default function SaveContentModal({
  isOpen,
  onClose,
  initialValue = "",
}: SaveContentModalProps) {
  const [type, setType] = useState<ContentType>("url");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState(initialValue);
  const [memo, setMemo] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      getCategories().then(setCategories).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    // URL 자동 감지
    if (initialValue && initialValue.startsWith("http")) {
      setType("url");
      setUrl(initialValue);
    } else if (initialValue) {
      setType("memo");
      setMemo(initialValue);
    }
  }, [initialValue]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createContent({
        type,
        title: title || undefined,
        description: description || undefined,
        url: type === "url" ? url : undefined,
        memo: type === "memo" ? memo : undefined,
        category_id: categoryId || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });

      // 초기화
      setTitle("");
      setUrl("");
      setMemo("");
      setDescription("");
      setCategoryId("");
      setTags([]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-[#1A1A1A]">콘텐츠 저장</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B6B66] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Type Selector */}
          <div className="flex gap-2">
            {contentTypes.map(({ type: t, icon: Icon, label }) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  type === t
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-[#6B6B66] hover:bg-gray-200"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* URL Input */}
          {type === "url" && (
            <div>
              <label className="block text-sm font-medium text-[#333330] mb-1.5">
                URL *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>
          )}

          {/* Memo Input */}
          {type === "memo" && (
            <div>
              <label className="block text-sm font-medium text-[#333330] mb-1.5">
                메모 *
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="메모를 입력하세요..."
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>
          )}

          {/* Image placeholder */}
          {type === "image" && (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <Image size={32} className="text-[#D1D1CC] mx-auto mb-3" />
              <p className="text-sm text-[#6B6B66]">
                이미지 업로드 기능은 곧 지원됩니다.
              </p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#333330] mb-1.5">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요 (선택)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#333330] mb-1.5">
              설명
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="간단한 설명 (선택)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#333330] mb-1.5">
              <FolderOpen size={14} />
              카테고리
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            >
              <option value="">카테고리 없음</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#333330] mb-1.5">
              <Tag size={14} />
              태그
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-bg text-accent text-xs font-medium"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-accent-dark"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="태그 입력 후 Enter"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-[#6B6B66] hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark disabled:opacity-50 transition-colors"
            >
              {loading ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
