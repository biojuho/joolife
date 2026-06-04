"use client";

import { useState, useEffect } from "react";
import {
  Bookmark,
  Sparkles,
  Zap,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Link2,
  FileText,
  ExternalLink,
} from "lucide-react";
import { getDashboardStats, getRecentContents } from "@/lib/actions/dashboard";
import SaveContentModal from "@/components/contents/SaveContentModal";
import { useRelativeNow } from "@/hooks/useRelativeNow";
import { formatRelativeTime } from "@/lib/time";

interface Stats {
  savedCount: number;
  recommendationCount: number;
  activeAutomations: number;
  weeklyActivity: number;
}

interface RecentContent {
  id: string;
  type: "url" | "memo" | "image";
  title: string | null;
  url: string | null;
  created_at: string;
  categories: { name: string; color: string } | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    savedCount: 0,
    recommendationCount: 0,
    activeAutomations: 0,
    weeklyActivity: 0,
  });
  const [recentContents, setRecentContents] = useState<RecentContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickInput, setQuickInput] = useState("");
  const relativeNow = useRelativeNow();

  useEffect(() => {
    Promise.all([getDashboardStats(), getRecentContents()])
      .then(([s, r]) => {
        setStats(s);
        setRecentContents(r as RecentContent[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "저장된 콘텐츠",
      value: stats.savedCount,
      icon: Bookmark,
      color: "text-accent",
      bg: "bg-accent-bg",
    },
    {
      label: "새 AI 추천",
      value: stats.recommendationCount,
      icon: Sparkles,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "활성 자동화",
      value: stats.activeAutomations,
      icon: Zap,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "이번 주 활동",
      value: stats.weeklyActivity,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  const handleQuickSave = () => {
    if (quickInput.trim()) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">대시보드</h1>
        <p className="text-[#6B6B66] mt-1">
          오늘의 라이프스타일 인사이트를 확인하세요.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-white rounded-2xl p-5 border border-gray-200/60 hover:shadow-sm transition-shadow ${
                loading ? "animate-pulse" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
                >
                  <Icon size={20} className={stat.color} />
                </div>
                <ArrowUpRight size={16} className="text-[#D1D1CC]" />
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
              <p className="text-sm text-[#6B6B66] mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Contents */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1A1A1A]">최근 저장</h2>
            <a
              href="/dashboard/contents"
              className="text-sm text-accent hover:underline"
            >
              전체 보기
            </a>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-3 p-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-1" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentContents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Bookmark size={24} className="text-[#D1D1CC]" />
              </div>
              <p className="text-[#6B6B66] text-sm">
                아직 저장된 콘텐츠가 없습니다.
              </p>
              <p className="text-[#A3A39E] text-xs mt-1">
                URL, 메모, 이미지를 저장해보세요.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentContents.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      content.type === "url"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {content.type === "url" ? (
                      <Link2 size={14} />
                    ) : (
                      <FileText size={14} />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">
                      {content.title || "(제목 없음)"}
                    </p>
                    <div className="flex items-center gap-2">
                      {content.categories && (
                        <span
                          className="text-[10px] font-medium"
                          style={{ color: content.categories.color }}
                        >
                          {content.categories.name}
                        </span>
                      )}
                      <span className="text-[10px] text-[#A3A39E]">
                        {formatRelativeTime(content.created_at, relativeNow)}
                      </span>
                    </div>
                  </div>
                  {content.type === "url" && content.url && (
                    <a
                      href={content.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-[#A3A39E] hover:text-accent transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Save */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
            <h2 className="font-semibold text-[#1A1A1A] mb-4">빠른 저장</h2>
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickSave()}
              placeholder="URL 또는 메모를 입력하세요..."
              className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm text-[#1A1A1A] placeholder:text-[#D1D1CC] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white transition-all"
            />
            <button
              onClick={handleQuickSave}
              className="w-full mt-3 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
            >
              저장하기
            </button>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A28] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-accent" />
              <h2 className="font-semibold text-sm">AI 인사이트</h2>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              콘텐츠를 저장하면 AI가 자동으로 분석하고 맞춤형 인사이트를
              제공합니다.
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-accent text-xs font-medium">
              <Clock size={12} />
              <span>콘텐츠 저장 후 활성화됩니다</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      <SaveContentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setQuickInput("");
          // 새로고침
          Promise.all([getDashboardStats(), getRecentContents()]).then(
            ([s, r]) => {
              setStats(s);
              setRecentContents(r as RecentContent[]);
            }
          );
        }}
        initialValue={quickInput}
      />
    </div>
  );
}
