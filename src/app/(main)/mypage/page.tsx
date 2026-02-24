"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { getCurrentWeek, getDaysSince } from "@/lib/utils";
import { HEALTH_GOALS } from "@/lib/constants";
import {
  User,
  Calendar,
  Target,
  LogOut,
  ChevronRight,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MyPage() {
  const router = useRouter();
  const { profile, updateProfile } = useUserStore();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(profile?.nickname || "");
  const [saving, setSaving] = useState(false);

  const currentWeek = profile?.program_started_at
    ? getCurrentWeek(profile.program_started_at)
    : 0;
  const daysSince = profile?.program_started_at
    ? getDaysSince(profile.program_started_at)
    : 0;

  const handleSave = async () => {
    if (!profile || !nickname.trim()) return;
    setSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ nickname: nickname.trim() })
        .eq("id", profile.id);

      if (!error) {
        updateProfile({ nickname: nickname.trim() });
        setEditing(false);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const selectedGoals = profile?.health_goals || [];
  const goalLabels = selectedGoals
    .map((g: string) => HEALTH_GOALS.find((h) => h.key === g))
    .filter(Boolean);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-text">마이페이지</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-cream-darker p-4 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="flex-1 rounded-lg border border-cream-darker px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
                  maxLength={20}
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="text-primary"
                >
                  <Save className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="font-bold text-text text-lg">
                  {profile?.nickname}
                </p>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-text-lighter hover:text-text-light"
                >
                  수정
                </button>
              </div>
            )}
            <p className="text-sm text-text-light">
              {profile?.subscription_status === "premium"
                ? "프리미엄 회원"
                : profile?.subscription_status === "basic"
                ? "베이직 회원"
                : "무료 회원"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-cream rounded-xl p-3">
            <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-text">D+{daysSince}</p>
            <p className="text-xs text-text-lighter">진행일</p>
          </div>
          <div className="text-center bg-cream rounded-xl p-3">
            <Target className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-text">{currentWeek}/12</p>
            <p className="text-xs text-text-lighter">현재 주차</p>
          </div>
          <div className="text-center bg-cream rounded-xl p-3">
            <p className="text-2xl mb-1">
              {currentWeek >= 12 ? "🏆" : currentWeek >= 6 ? "⭐" : "🌱"}
            </p>
            <p className="text-xs text-text-lighter">등급</p>
          </div>
        </div>
      </div>

      {/* 12-Week Progress */}
      <div className="bg-white rounded-2xl border border-cream-darker p-4 mb-4">
        <h3 className="font-semibold text-text mb-3">12주 프로그램 진행</h3>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => (
            <div
              key={week}
              className={cn(
                "aspect-square rounded-xl flex items-center justify-center text-sm font-medium",
                week < currentWeek
                  ? "bg-primary text-white"
                  : week === currentWeek
                  ? "bg-primary/20 text-primary border-2 border-primary"
                  : "bg-cream-dark text-text-lighter"
              )}
            >
              {week}
            </div>
          ))}
        </div>
        <div className="mt-3 h-2 bg-cream-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(currentWeek / 12) * 100}%` }}
          />
        </div>
        <p className="text-xs text-text-lighter text-center mt-1">
          {currentWeek}/12주 완료
        </p>
      </div>

      {/* Health Goals */}
      <div className="bg-white rounded-2xl border border-cream-darker p-4 mb-4">
        <h3 className="font-semibold text-text mb-3">나의 건강 목표</h3>
        <div className="flex flex-wrap gap-2">
          {goalLabels.map(
            (goal: (typeof HEALTH_GOALS)[number] | undefined) =>
              goal && (
                <span
                  key={goal.key}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {goal.emoji} {goal.label}
                </span>
              )
          )}
          {goalLabels.length === 0 && (
            <p className="text-sm text-text-lighter">
              설정된 건강 목표가 없습니다
            </p>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-2xl border border-cream-darker overflow-hidden mb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 py-3.5 text-sm hover:bg-cream/50 transition-colors"
        >
          <span className="flex items-center gap-2 text-error">
            <LogOut className="h-4 w-4" />
            로그아웃
          </span>
          <ChevronRight className="h-4 w-4 text-text-lighter" />
        </button>
      </div>
    </div>
  );
}
