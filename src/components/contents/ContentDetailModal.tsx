"use client";

import { useState } from "react";
import {
  X,
  ExternalLink,
  Link2,
  FileText,
  ImageIcon,
  Sparkles,
  Tag,
  Loader2,
  Copy,
  Check,
  Archive,
  Trash2,
} from "lucide-react";
import { toggleArchive, deleteContent } from "@/lib/actions/contents";

interface ContentItem {
  id: string;
  type: "url" | "memo" | "image";
  title: string | null;
  description: string | null;
  url: string | null;
  memo: string | null;
  image_url: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  categories?: { name: string; color: string } | null;
  tags?: string[];
}

interface Props {
  content: ContentItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function ContentDetailModal({
  content,
  isOpen,
  onClose,
  onUpdate,
}: Props) {
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(
    content.description || null
  );
  const [aiTags, setAiTags] = useState<string[]>(content.tags || []);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_id: content.id,
          title: content.title,
          url: content.url,
          memo: content.memo,
          description: content.description,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.summary) setSummary(data.summary);
        if (data.tags?.length > 0) {
          setAiTags((prev) => [...new Set([...prev, ...data.tags])]);
        }
      }
    } catch {
      //
    } finally {
      setSummarizing(false);
    }
  };

  const handleCopy = async () => {
    const text = content.url || content.memo || content.title || "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleArchive = async () => {
    await toggleArchive(content.id, !content.is_archived);
    onUpdate?.();
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm("이 콘텐츠를 삭제하시겠습니까?")) return;
    await deleteContent(content.id);
    onUpdate?.();
    onClose();
  };

  const typeIcon = {
    url: { icon: Link2, label: "URL", color: "text-blue-600", bg: "bg-blue-50" },
    memo: { icon: FileText, label: "메모", color: "text-green-600", bg: "bg-green-50" },
    image: { icon: ImageIcon, label: "이미지", color: "text-purple-600", bg: "bg-purple-50" },
  };

  const t = typeIcon[content.type];
  const TypeIcon = t.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg ${t.bg} flex items-center justify-center`}
            >
              <TypeIcon size={16} className={t.color} />
            </div>
            <div>
              <span className={`text-xs font-medium ${t.color}`}>
                {t.label}
              </span>
              <p className="text-[10px] text-[#A3A39E]">
                {new Date(content.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-[#A3A39E]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <h2 className="text-lg font-bold text-[#1A1A1A] leading-snug">
            {content.title || "(제목 없음)"}
          </h2>

          {/* URL */}
          {content.url && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
              <Link2 size={14} className="text-[#A3A39E] flex-shrink-0" />
              <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent truncate hover:underline flex-1"
              >
                {content.url}
              </a>
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-gray-200 text-[#A3A39E] transition-colors flex-shrink-0"
              >
                {copied ? (
                  <Check size={12} className="text-green-600" />
                ) : (
                  <Copy size={12} />
                )}
              </button>
              <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:bg-gray-200 text-[#A3A39E] transition-colors flex-shrink-0"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Memo */}
          {content.memo && (
            <div className="p-4 rounded-xl bg-gray-50">
              <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
                {content.memo}
              </p>
            </div>
          )}

          {/* Category */}
          {content.categories && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B6B66]">카테고리:</span>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${content.categories.color}15`,
                  color: content.categories.color,
                }}
              >
                {content.categories.name}
              </span>
            </div>
          )}

          {/* AI Summary */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-accent" />
                <span className="text-xs font-semibold text-[#1A1A1A]">
                  AI 요약
                </span>
              </div>
              <button
                onClick={handleSummarize}
                disabled={summarizing}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-bg text-accent text-[11px] font-medium hover:bg-accent/10 transition-colors disabled:opacity-50"
              >
                {summarizing ? (
                  <>
                    <Loader2 size={11} className="animate-spin" />
                    분석 중...
                  </>
                ) : summary ? (
                  "다시 분석"
                ) : (
                  "AI 요약 생성"
                )}
              </button>
            </div>
            {summary ? (
              <p className="text-xs text-[#6B6B66] leading-relaxed">
                {summary}
              </p>
            ) : (
              <p className="text-xs text-[#A3A39E]">
                AI 요약 생성 버튼을 눌러 콘텐츠를 자동으로 분석하세요.
              </p>
            )}
          </div>

          {/* Tags */}
          {aiTags.length > 0 && (
            <div className="flex items-start gap-2">
              <Tag size={14} className="text-[#A3A39E] mt-0.5 flex-shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {aiTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-[#6B6B66]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white rounded-b-2xl border-t border-gray-100 px-6 py-4 flex items-center gap-2">
          <button
            onClick={handleArchive}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#6B6B66] hover:bg-gray-100 transition-colors"
          >
            <Archive size={14} />
            {content.is_archived ? "보관 해제" : "보관"}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
