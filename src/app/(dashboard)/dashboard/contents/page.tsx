"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bookmark,
  Filter,
  Grid3X3,
  List,
  Plus,
  Search,
  Link2,
  FileText,
  X,
} from "lucide-react";
import { getContents, type ContentType } from "@/lib/actions/contents";
import { getCategories } from "@/lib/actions/categories";
import ContentCard from "@/components/contents/ContentCard";
import SaveContentModal from "@/components/contents/SaveContentModal";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface ContentItem {
  id: string;
  type: "url" | "memo" | "image";
  title: string | null;
  description: string | null;
  url: string | null;
  memo: string | null;
  is_archived: boolean;
  created_at: string;
  categories: { id: string; name: string; color: string } | null;
}

export default function ContentsPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState<ContentType | "">("");
  const [showArchived, setShowArchived] = useState(false);

  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count } = await getContents({
        search: search || undefined,
        category_id: selectedCategory || undefined,
        type: (selectedType as ContentType) || undefined,
        is_archived: showArchived,
      });
      setContents(data as ContentItem[]);
      setTotalCount(count);
    } catch {
      // 인증 안 된 경우
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedType, showArchived]);

  useEffect(() => {
    fetchContents();
    getCategories().then(setCategories).catch(() => {});
  }, [fetchContents]);

  // 검색 디바운스
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const hasFilters = selectedCategory || selectedType || showArchived;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">저장 콘텐츠</h1>
          <p className="text-[#6B6B66] mt-1">
            총 <span className="font-semibold text-accent">{totalCount}</span>
            개의 콘텐츠
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
        >
          <Plus size={16} />새 콘텐츠
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A39E]"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="제목, URL, 메모로 검색..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white transition-all"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {[
              { value: "", label: "전체", icon: Filter },
              { value: "url", label: "URL", icon: Link2 },
              { value: "memo", label: "메모", icon: FileText },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() =>
                  setSelectedType(value as ContentType | "")
                }
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedType === value
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-[#6B6B66] hover:bg-gray-200"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex gap-1 border-l border-gray-200 pl-3">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-100 text-[#1A1A1A]"
                  : "text-[#A3A39E] hover:bg-gray-50"
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-gray-100 text-[#1A1A1A]"
                  : "text-[#A3A39E] hover:bg-gray-50"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !selectedCategory
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-gray-100 text-[#6B6B66] hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? "" : cat.id
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? "text-white"
                    : "text-[#6B6B66] hover:opacity-80"
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === cat.id
                      ? cat.color
                      : cat.color + "15",
                  color:
                    selectedCategory === cat.id ? "white" : cat.color,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Active Filters */}
        {hasFilters && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-[#A3A39E]">필터:</span>
            {showArchived && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-100 text-xs text-[#6B6B66]">
                보관됨
                <button onClick={() => setShowArchived(false)}>
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedType("");
                setShowArchived(false);
              }}
              className="text-xs text-accent hover:underline"
            >
              초기화
            </button>
          </div>
        )}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200/60 p-4 animate-pulse"
            >
              <div className="flex gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gray-200" />
                <div className="w-16 h-5 rounded bg-gray-200" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : contents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/60 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
            <Bookmark size={32} className="text-[#D1D1CC]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
            {search ? "검색 결과가 없습니다" : "아직 저장된 콘텐츠가 없습니다"}
          </h3>
          <p className="text-[#6B6B66] text-sm max-w-sm">
            {search
              ? "다른 키워드로 검색해보세요."
              : "상단의 \"새 콘텐츠\" 버튼을 눌러 URL, 메모를 저장해보세요."}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      )}

      {/* Save Modal */}
      <SaveContentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchContents();
        }}
      />
    </div>
  );
}
