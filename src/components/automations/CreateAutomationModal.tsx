"use client";

import { useState } from "react";
import {
  X,
  Newspaper,
  Bell,
  Calendar,
} from "lucide-react";
import {
  createAutomation,
  type AutomationType,
} from "@/lib/actions/automations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const automationTypes: {
  type: AutomationType;
  label: string;
  description: string;
  icon: typeof Newspaper;
  color: string;
  bg: string;
}[] = [
  {
    type: "news_collect",
    label: "뉴스 수집",
    description: "키워드 기반으로 뉴스를 자동 수집합니다",
    icon: Newspaper,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    type: "content_alert",
    label: "콘텐츠 알림",
    description: "특정 조건의 콘텐츠가 추가되면 알립니다",
    icon: Bell,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    type: "schedule",
    label: "스케줄",
    description: "정해진 시간에 자동 작업을 실행합니다",
    icon: Calendar,
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

export default function CreateAutomationModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<AutomationType | null>(null);
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [schedule, setSchedule] = useState("daily");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!selectedType || !name.trim()) return;

    setSaving(true);
    try {
      const config: Record<string, unknown> = {};

      if (selectedType === "news_collect") {
        config.keywords = keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean);
      } else if (selectedType === "content_alert") {
        config.keywords = keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean);
        config.alert_type = "keyword_match";
      } else if (selectedType === "schedule") {
        config.action = "ai_recommend";
      }

      await createAutomation({
        name,
        type: selectedType,
        config,
        schedule,
      });
      handleClose();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedType(null);
    setName("");
    setKeywords("");
    setSchedule("daily");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#1A1A1A]">
            {step === 1 ? "자동화 유형 선택" : "자동화 설정"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-[#A3A39E]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step 1: Type Selection */}
        {step === 1 && (
          <div className="space-y-3">
            {automationTypes.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => {
                    setSelectedType(item.type);
                    setStep(2);
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-accent hover:shadow-sm transition-all text-left"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}
                  >
                    <Icon size={22} className={item.color} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1A1A1A]">
                      {item.label}
                    </p>
                    <p className="text-xs text-[#6B6B66] mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Configuration */}
        {step === 2 && selectedType && (
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                자동화 이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: AI 뉴스 수집"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white transition-all"
              />
            </div>

            {/* Keywords (for news_collect and content_alert) */}
            {(selectedType === "news_collect" ||
              selectedType === "content_alert") && (
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                  키워드 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="예: AI, 블록체인, 라이프스타일"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white transition-all"
                />
              </div>
            )}

            {/* Schedule */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                실행 주기
              </label>
              <div className="flex gap-2">
                {[
                  { value: "hourly", label: "매시간" },
                  { value: "daily", label: "매일" },
                  { value: "weekly", label: "매주" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSchedule(value)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      schedule === value
                        ? "bg-accent text-white"
                        : "bg-gray-100 text-[#6B6B66] hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-[#6B6B66] text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                이전
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim() || saving}
                className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                {saving ? "생성 중..." : "생성하기"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
