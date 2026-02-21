"use client";

import { useState, useEffect } from "react";
import {
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  Sparkles,
  Save,
  Plus,
  X,
  Check,
  ChevronLeft,
  Mail,
  Wallet,
} from "lucide-react";
import {
  getProfile,
  getUserPreferences,
  updateProfile,
  updateUserPreferences,
  getUserEmail,
  type Profile,
  type UserPreferences,
} from "@/lib/actions/settings";

type SettingsTab =
  | "profile"
  | "notifications"
  | "theme"
  | "privacy"
  | "language";

const tabsList = [
  { key: "profile" as const, icon: User, title: "프로필", description: "이름, 관심사를 설정합니다" },
  { key: "notifications" as const, icon: Bell, title: "알림", description: "이메일 및 푸시 알림" },
  { key: "theme" as const, icon: Palette, title: "테마", description: "라이트/다크 모드" },
  { key: "privacy" as const, icon: Shield, title: "개인정보 & 보안", description: "데이터 동의, 보안" },
  { key: "language" as const, icon: Globe, title: "언어", description: "서비스 언어 설정" },
];

// Separate link for wallet (navigates to sub-page)
const walletLink = { icon: Wallet, title: "Web3 지갑", description: "블록체인 지갑 연결 및 관리", href: "/dashboard/settings/wallet" };

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    Promise.all([getProfile(), getUserPreferences(), getUserEmail()])
      .then(([p, pref, e]) => {
        setProfile(p);
        setPreferences(pref);
        setEmail(e);
        if (p) {
          setDisplayName(p.display_name || "");
          setBio(p.bio || "");
          setInterests(p.interests || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({
        display_name: displayName,
        bio,
        interests,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      //
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async (
    updates: Partial<{
      theme: string;
      language: string;
      notification_settings: Record<string, boolean>;
      ai_settings: Record<string, boolean>;
    }>
  ) => {
    setSaving(true);
    try {
      await updateUserPreferences(updates);
      setPreferences((prev) =>
        prev
          ? {
              ...prev,
              ...(updates as Partial<UserPreferences>),
            }
          : prev
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      //
    } finally {
      setSaving(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">설정</h1>
          <p className="text-[#6B6B66] mt-1">계정 및 서비스 설정을 관리합니다.</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200/60 p-5 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main menu view
  if (!activeTab) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">설정</h1>
          <p className="text-[#6B6B66] mt-1">계정 및 서비스 설정을 관리합니다.</p>
        </div>

        <div className="space-y-3">
          {tabsList.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="w-full bg-white rounded-2xl border border-gray-200/60 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-[#6B6B66]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1A1A1A] text-sm">
                    {tab.title}
                  </h3>
                  <p className="text-[#A3A39E] text-xs mt-0.5">
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Web3 Wallet Link */}
          <a
            href={walletLink.href}
            className="w-full bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200/60 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow text-left block"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <walletLink.icon size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1A1A1A] text-sm">
                {walletLink.title}
              </h3>
              <p className="text-[#A3A39E] text-xs mt-0.5">
                {walletLink.description}
              </p>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
              Web3
            </span>
          </a>
        </div>
      </div>
    );
  }

  const currentTab = tabsList.find((t) => t.key === activeTab)!;

  return (
    <div className="space-y-6">
      {/* Header with Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab(null)}
          className="p-2 rounded-xl hover:bg-gray-100 text-[#6B6B66] transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            {currentTab.title}
          </h1>
          <p className="text-[#6B6B66] mt-0.5 text-sm">
            {currentTab.description}
          </p>
        </div>
        {saved && (
          <span className="ml-auto flex items-center gap-1 text-green-600 text-sm font-medium">
            <Check size={16} />
            저장됨
          </span>
        )}
      </div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 space-y-5">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              이메일
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-sm text-[#6B6B66]">
              <Mail size={14} />
              {email || "이메일 없음"}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              표시 이름
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white transition-all"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              소개
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="간단한 자기소개를 작성하세요"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              관심사
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent-bg text-accent text-xs font-medium"
                >
                  {interest}
                  <button onClick={() => removeInterest(interest)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addInterest()}
                placeholder="관심사를 추가하세요"
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:bg-white transition-all"
              />
              <button
                onClick={addInterest}
                className="px-3 py-2 rounded-xl bg-gray-100 text-[#6B6B66] hover:bg-gray-200 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && preferences && (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 space-y-4">
          {[
            {
              key: "email",
              title: "이메일 알림",
              desc: "새 추천, 자동화 결과를 이메일로 받습니다",
              checked: preferences.notification_settings.email,
            },
            {
              key: "push",
              title: "푸시 알림",
              desc: "브라우저 푸시 알림을 받습니다",
              checked: preferences.notification_settings.push,
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {item.title}
                </p>
                <p className="text-xs text-[#A3A39E] mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  handleSavePreferences({
                    notification_settings: {
                      ...preferences.notification_settings,
                      [item.key]: !item.checked,
                    },
                  })
                }
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  item.checked ? "bg-accent" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    item.checked
                      ? "translate-x-[18px]"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Theme Settings */}
      {activeTab === "theme" && preferences && (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light", label: "라이트", desc: "밝은 배경" },
              { value: "dark", label: "다크", desc: "어두운 배경" },
              { value: "system", label: "시스템", desc: "OS 설정 따름" },
            ].map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => handleSavePreferences({ theme: value })}
                className={`p-5 rounded-xl border-2 text-center transition-all ${
                  preferences.theme === value
                    ? "border-accent bg-accent-bg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg mx-auto mb-2 ${
                    value === "light"
                      ? "bg-white border border-gray-300"
                      : value === "dark"
                        ? "bg-[#1A1A1A]"
                        : "bg-gradient-to-r from-white to-[#1A1A1A] border border-gray-300"
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    preferences.theme === value
                      ? "text-accent"
                      : "text-[#6B6B66]"
                  }`}
                >
                  {label}
                </p>
                <p className="text-[10px] text-[#A3A39E] mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      {activeTab === "privacy" && preferences && (
        <div className="space-y-4">
          {/* AI Settings */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-accent" />
              <h3 className="font-semibold text-sm text-[#1A1A1A]">
                AI 데이터 처리
              </h3>
            </div>
            {[
              {
                key: "enabled",
                title: "AI 기능 활성화",
                desc: "콘텐츠 분석, 요약, 추천을 위해 AI를 사용합니다",
                checked: preferences.ai_settings.enabled,
              },
              {
                key: "daily_insight",
                title: "일일 인사이트",
                desc: "매일 AI가 활동 데이터를 분석하여 인사이트를 생성합니다",
                checked: preferences.ai_settings.daily_insight,
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 mb-2 last:mb-0"
              >
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#A3A39E] mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() =>
                    handleSavePreferences({
                      ai_settings: {
                        ...preferences.ai_settings,
                        [item.key]: !item.checked,
                      },
                    })
                  }
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    item.checked ? "bg-accent" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      item.checked
                        ? "translate-x-[18px]"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Data Policy */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
            <h3 className="font-semibold text-sm text-[#1A1A1A] mb-3">
              데이터 관리
            </h3>
            <div className="space-y-2">
              <p className="text-xs text-[#6B6B66] leading-relaxed">
                JooLife는 개인정보보호법(PIPA)을 준수하며, 모든 데이터는 안전하게
                암호화되어 저장됩니다. AI 처리 데이터는 외부에 공유되지 않습니다.
              </p>
              <div className="flex gap-2 pt-2">
                <button className="px-4 py-2 rounded-xl bg-gray-100 text-[#6B6B66] text-xs font-medium hover:bg-gray-200 transition-colors">
                  데이터 내보내기
                </button>
                <button className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors">
                  계정 삭제 요청
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Language Settings */}
      {activeTab === "language" && preferences && (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
          <div className="space-y-2">
            {[
              { value: "ko", label: "한국어", flag: "🇰🇷" },
              { value: "en", label: "English", flag: "🇺🇸" },
            ].map(({ value, label, flag }) => (
              <button
                key={value}
                onClick={() => handleSavePreferences({ language: value })}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  preferences.language === value
                    ? "border-accent bg-accent-bg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-xl">{flag}</span>
                <span
                  className={`text-sm font-medium ${
                    preferences.language === value
                      ? "text-accent"
                      : "text-[#6B6B66]"
                  }`}
                >
                  {label}
                </span>
                {preferences.language === value && (
                  <Check size={16} className="ml-auto text-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
