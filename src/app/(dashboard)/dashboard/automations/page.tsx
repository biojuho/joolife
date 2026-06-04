"use client";

import { useState, useEffect } from "react";
import {
  Zap,
  Plus,
  Newspaper,
  Bell,
  Calendar,
  MoreVertical,
  Trash2,
  Power,
  Clock,
  CheckCircle,
  Activity,
} from "lucide-react";
import { useRelativeNow } from "@/hooks/useRelativeNow";
import { formatRelativeTime } from "@/lib/time";
import {
  getAutomations,
  getAutomationStats,
  toggleAutomation,
  deleteAutomation,
  type Automation,
} from "@/lib/actions/automations";
import CreateAutomationModal from "@/components/automations/CreateAutomationModal";

const typeConfig = {
  news_collect: {
    icon: Newspaper,
    label: "뉴스 수집",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  content_alert: {
    icon: Bell,
    label: "콘텐츠 알림",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  schedule: {
    icon: Calendar,
    label: "스케줄",
    color: "text-green-600",
    bg: "bg-green-50",
  },
};

const scheduleLabels: Record<string, string> = {
  hourly: "매시간",
  daily: "매일",
  weekly: "매주",
};

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, totalRuns: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const relativeNow = useRelativeNow();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [a, s] = await Promise.all([
        getAutomations(),
        getAutomationStats(),
      ]);
      setAutomations(a);
      setStats(s);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (id: string, currentState: boolean) => {
    await toggleAutomation(id, !currentState);
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, is_active: !currentState } : a
      )
    );
    setStats((prev) => ({
      ...prev,
      active: currentState ? prev.active - 1 : prev.active + 1,
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 자동화를 삭제하시겠습니까?")) return;
    await deleteAutomation(id);
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    setStats((prev) => ({
      ...prev,
      total: prev.total - 1,
    }));
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">자동화</h1>
          <p className="text-[#6B6B66] mt-1">
            뉴스 수집, 콘텐츠 알림 등 자동화 규칙을 관리합니다.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
        >
          <Plus size={16} />새 자동화
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "전체 자동화",
            value: stats.total,
            icon: Zap,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          },
          {
            label: "활성 상태",
            value: stats.active,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "총 실행 횟수",
            value: stats.totalRuns,
            icon: Activity,
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

      {/* Automation List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200/60 p-5 animate-pulse"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : automations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/60 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-yellow-50 flex items-center justify-center mb-5">
            <Zap size={32} className="text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
            자동화 규칙을 만들어보세요
          </h3>
          <p className="text-[#6B6B66] text-sm max-w-sm mb-6">
            키워드 기반 뉴스 수집, 콘텐츠 알림 등 다양한 자동화를 설정할 수
            있습니다.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
          >
            <Plus size={16} />
            첫 자동화 만들기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {automations.map((automation) => {
            const config =
              typeConfig[automation.type] || typeConfig.news_collect;
            const Icon = config.icon;
            const keywords = (
              automation.config as { keywords?: string[] }
            )?.keywords;

            return (
              <div
                key={automation.id}
                className={`bg-white rounded-2xl border p-5 transition-all ${
                  automation.is_active
                    ? "border-gray-200/60"
                    : "border-gray-200/40 opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={22} className={config.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-[#1A1A1A]">
                        {automation.name}
                      </h3>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          automation.is_active
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-[#A3A39E]"
                        }`}
                      >
                        {automation.is_active ? "활성" : "비활성"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#6B6B66]">
                      <span className={`font-medium ${config.color}`}>
                        {config.label}
                      </span>
                      {automation.schedule && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {scheduleLabels[automation.schedule] ||
                            automation.schedule}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[#A3A39E]">
                        <Activity size={11} />
                        마지막 실행:{" "}
                        {formatRelativeTime(automation.last_run_at, relativeNow, {
                          emptyLabel: "실행 전",
                        })}
                      </span>
                    </div>

                    {/* Keywords */}
                    {keywords && keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {keywords.map((kw: string) => (
                          <span
                            key={kw}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-[#6B6B66]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Toggle */}
                    <button
                      onClick={() =>
                        handleToggle(automation.id, automation.is_active)
                      }
                      className={`relative w-10 h-6 rounded-full transition-colors ${
                        automation.is_active ? "bg-accent" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          automation.is_active
                            ? "translate-x-[18px]"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>

                    {/* Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === automation.id
                              ? null
                              : automation.id
                          )
                        }
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-[#A3A39E] transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === automation.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-gray-200 py-1 w-32">
                            <button
                              onClick={() =>
                                handleToggle(
                                  automation.id,
                                  automation.is_active
                                )
                              }
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6B6B66] hover:bg-gray-50"
                            >
                              <Power size={14} />
                              {automation.is_active ? "비활성화" : "활성화"}
                            </button>
                            <button
                              onClick={() => handleDelete(automation.id)}
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
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Automation Types Guide */}
      <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
        <h2 className="font-semibold text-[#1A1A1A] text-sm mb-4">
          자동화 유형 안내
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Newspaper,
              title: "뉴스 수집",
              desc: "관심 키워드 기반 뉴스 자동 수집",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: Bell,
              title: "콘텐츠 알림",
              desc: "조건에 맞는 콘텐츠 저장 시 알림",
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              icon: Calendar,
              title: "스케줄",
              desc: "정기적 AI 분석 & 추천 자동 실행",
              color: "text-green-600",
              bg: "bg-green-50",
            },
          ].map((item) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50"
              >
                <div
                  className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <ItemIcon size={16} className={item.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[#A3A39E] mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Modal */}
      <CreateAutomationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
