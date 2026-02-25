"use client";

import { useState } from "react";
import {
  Link2,
  FileText,
  Image,
  MoreVertical,
  Archive,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { deleteContent, toggleArchive } from "@/lib/actions/contents";

interface ContentCardProps {
  content: {
    id: string;
    type: "url" | "memo" | "image";
    title: string | null;
    description: string | null;
    url: string | null;
    memo: string | null;
    is_archived: boolean;
    created_at: string;
    categories: { id: string; name: string; color: string } | null;
  };
  tags?: string[];
}

const typeConfig = {
  url: { icon: Link2, label: "URL", color: "text-blue-600 bg-blue-50" },
  memo: {
    icon: FileText,
    label: "메모",
    color: "text-green-600 bg-green-50",
  },
  image: {
    icon: Image,
    label: "이미지",
    color: "text-purple-600 bg-purple-50",
  },
};

export default function ContentCard({ content, tags = [] }: ContentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const config = typeConfig[content.type];
  const Icon = config.icon;

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setDeleting(true);
    try {
      await deleteContent(content.id);
    } catch {
      setDeleting(false);
    }
  };

  const handleArchive = async () => {
    await toggleArchive(content.id, !content.is_archived);
    setMenuOpen(false);
  };

  const [now] = useState(() => Date.now());
  const timeAgo = (dateStr: string) => {
    const diff = now - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}일 전`;
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  return (
    <div
      className={`group bg-white rounded-xl border border-gray-200/60 p-4 hover:shadow-sm transition-all ${
        deleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.color}`}
          >
            <Icon size={14} />
          </span>
          {content.categories && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: content.categories.color + "15",
                color: content.categories.color,
              }}
            >
              {content.categories.name}
            </span>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 text-[#A3A39E] transition-all"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-gray-200 py-1 w-36">
                <button
                  onClick={handleArchive}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6B6B66] hover:bg-gray-50"
                >
                  <Archive size={14} />
                  {content.is_archived ? "복원" : "보관"}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  삭제
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <h3 className="font-medium text-[#1A1A1A] text-sm line-clamp-2 mb-1">
        {content.title || "(제목 없음)"}
      </h3>

      {content.description && (
        <p className="text-xs text-[#6B6B66] line-clamp-2 mb-2">
          {content.description}
        </p>
      )}

      {content.type === "url" && content.url && (
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mb-2"
        >
          <ExternalLink size={11} />
          <span className="truncate max-w-[200px]">{content.url}</span>
        </a>
      )}

      {content.type === "memo" && content.memo && (
        <p className="text-xs text-[#6B6B66] line-clamp-3 bg-gray-50 rounded-lg p-2.5 mb-2">
          {content.memo}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-accent-bg text-accent font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <p className="text-[10px] text-[#A3A39E]">
        {timeAgo(content.created_at)}
      </p>
    </div>
  );
}
