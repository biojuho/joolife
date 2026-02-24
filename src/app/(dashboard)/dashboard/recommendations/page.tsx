"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Lightbulb,
  BookOpen,
  Zap,
  RefreshCw,
  Check,
  Bookmark,
  X,
  TrendingUp,
  BarChart3,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  getRecommendations,
  getRecommendationStats,
  markRecommendationRead,
  markRecommendationSaved,
  dismissRecommendation,
  type Recommendation,
} from "@/lib/actions/recommendations";

const typeConfig = {
  content: {
    icon: BookOpen,
    label: "콘텐츠 추천",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  insight: {
    icon: Lightbulb,
    label: "인사이트",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  action: {
    icon: Zap,
    label: "행동 제안",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
};

interface InsightData {
  title: string;
  summary: string;
  details: string;
  suggestions: string[];
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, saved: 0 });
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatingInsight, setGeneratingInsight] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "saved">("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recs, s] = await Promise.all([
        getRecommendations({ unreadOnly: filter === "unread" }),
        getRecommendationStats(),
      ]);
      setRecommendations(
        filter === "saved" ? recs.filter((r) => r.is_saved) : recs
      );
      setStats(s);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/recommend", { method: "POST" });
      if (res.ok) {
        await fetchData();
      }
    } catch {
      // ignore
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateInsight = async () => {
    setGeneratingInsight(true);
    try {
      const res = await fetch("/api/ai/insight", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setInsight(data);
      }
    } catch {
      // ignore
    } finally {
      setGeneratingInsight(false);
    }
  };

  const handleSave = async (id: string) => {
    await markRecommendationSaved(id);
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, is_saved: true, is_read: true } : r
      )
    );
    setStats((prev) => ({
      ...prev,
      saved: prev.saved + 1,
      unread: Math.max(0, prev.unread - 1),
    }));
  };

  const handleDismiss = async (id: string) => {
    await dismissRecommendation(id);
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_read: true } : r))
    );
    setStats((prev) => ({
      ...prev,
      unread: Math.max(0, prev.unread - 1),
    }));
  };

  const handleMarkRead = async (id: string) => {
    await markRecommendationRead(id);
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_read: true } : r))
    );
    setStats((prev) => ({
      ...prev,
      unread: Math.max(0, prev.unread - 1),
    }));
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 전`;
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">AI 추천</h1>
          <p className="text-[#6B6B66] mt-1">
            AI가 분석한 맞춤형 콘텐츠와 인사이트를 확인하세요.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={generating ? "animate-spin" : ""}
          />
          {generating ? "생성 중..." : "새 추천 받기"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "전체 추천",
            value: stats.total,
            icon: Sparkles,
            color: "text-secondary",
            bg: "bg-secondary/10",
          },
          {
            label: "읽지 않음",
            value: stats.unread,
            icon: TrendingUp,
            color: "text-accent",
            bg: "bg-accent-bg",
          },
          {
            label: "저장됨",
            value: stats.saved,
            icon: Bookmark,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-200/60 p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
                >
                  <Icon size={18} className={stat.color} />
                </div>
                <div>
                  <p className="text-xl font-bold text-[#1A1A1A]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#6B6B66]">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recommendations List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(
              [
                { key: "all", label: "전체" },
                { key: "unread", label: "읽지 않음" },
                { key: "saved", label: "저장됨" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-gray-100 text-[#6B6B66] hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Recommendation Cards */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200/60 p-5 animate-pulse"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/60 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-5">
                <Sparkles size={32} className="text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                {filter === "all"
                  ? "아직 추천이 없습니다"
                  : filter === "unread"
                    ? "읽지 않은 추천이 없습니다"
                    : "저장된 추천이 없습니다"}
              </h3>
              <p className="text-[#6B6B66] text-sm max-w-sm mb-6">
                콘텐츠를 저장하고 &quot;새 추천 받기&quot; 버튼을 누르면 AI가
                맞춤형 추천을 생성합니다.
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                <Sparkles size={16} />
                {generating ? "생성 중..." : "첫 추천 받기"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec) => {
                const config = typeConfig[rec.type] || typeConfig.content;
                const Icon = config.icon;
                return (
                  <div
                    key={rec.id}
                    className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-sm ${
                      rec.is_read
                        ? "border-gray-200/60"
                        : `${config.border} border-l-4`
                    }`}
                    onClick={() => !rec.is_read && handleMarkRead(rec.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}
                        >
                          <Icon size={18} className={config.color} />
                        </div>
                        <div>
                          <span
                            className={`text-xs font-medium ${config.color}`}
                          >
                            {config.label}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Clock size={10} className="text-[#A3A39E]" />
                            <span className="text-[10px] text-[#A3A39E]">
                              {timeAgo(rec.created_at)}
                            </span>
                            {!rec.is_read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Relevance Score */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent transition-all"
                            style={{
                              width: `${rec.relevance_score * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-[#A3A39E]">
                          {Math.round(rec.relevance_score * 100)}%
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-[#1A1A1A] text-sm mb-1">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-[#6B6B66] leading-relaxed mb-2">
                      {rec.description}
                    </p>

                    {rec.reasoning && (
                      <p className="text-[10px] text-[#A3A39E] italic mb-3">
                        {rec.reasoning}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      {!rec.is_saved ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(rec.id);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-bg text-accent hover:bg-accent/10 transition-colors"
                        >
                          <Bookmark size={12} />
                          저장
                        </button>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-600">
                          <Check size={12} />
                          저장됨
                        </span>
                      )}
                      {!rec.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDismiss(rec.id);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#A3A39E] hover:bg-gray-100 transition-colors"
                        >
                          <X size={12} />
                          무시
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weekly Insight */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A28] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-accent" />
                <h2 className="font-semibold text-sm">주간 인사이트</h2>
              </div>
              <button
                onClick={handleGenerateInsight}
                disabled={generatingInsight}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <RefreshCw
                  size={14}
                  className={`text-white/60 ${generatingInsight ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {insight ? (
              <div className="space-y-3">
                <h3 className="font-medium text-sm">{insight.title}</h3>
                <p className="text-white/70 text-xs leading-relaxed">
                  {insight.summary}
                </p>
                {insight.details && (
                  <p className="text-white/50 text-[11px] leading-relaxed">
                    {insight.details}
                  </p>
                )}
                {insight.suggestions.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider">
                      제안사항
                    </p>
                    {insight.suggestions.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-white/60 text-xs"
                      >
                        <ChevronRight
                          size={12}
                          className="mt-0.5 text-accent flex-shrink-0"
                        />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-white/60 text-sm leading-relaxed">
                  AI가 활동 데이터를 분석하여 주간 인사이트를 생성합니다.
                </p>
                <button
                  onClick={handleGenerateInsight}
                  disabled={generatingInsight}
                  className="mt-4 w-full py-2 rounded-lg bg-white/10 text-white/80 text-xs font-medium hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  {generatingInsight ? "분석 중..." : "인사이트 생성하기"}
                </button>
              </div>
            )}
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
            <h2 className="font-semibold text-[#1A1A1A] text-sm mb-4">
              AI 추천 안내
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "콘텐츠 저장",
                  desc: "URL, 메모 등을 저장하세요",
                },
                {
                  step: "2",
                  title: "패턴 분석",
                  desc: "AI가 관심사를 분석합니다",
                },
                {
                  step: "3",
                  title: "맞춤 추천",
                  desc: "개인화된 추천을 받아보세요",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent-bg text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#A3A39E]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
