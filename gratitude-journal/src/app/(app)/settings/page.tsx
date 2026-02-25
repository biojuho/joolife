"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LogOut, Flame, BookOpen, Edit3, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import { LIFE_THEMES } from "@/lib/types";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setNickname(data.nickname);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  const handleSave = async () => {
    if (!profile) return;

    await supabase
      .from("profiles")
      .update({
        nickname,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    setProfile({ ...profile, nickname });
    setEditing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-warm-500">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-8">
      <h1 className="mb-6 text-2xl font-bold text-warm-900">
        👤 나의 설정
      </h1>

      {/* Profile Card */}
      <Card className="mb-6 border-warm-200 bg-white">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between">
            <div>
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="h-10 w-40 border-warm-200"
                    maxLength={20}
                  />
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-warm-600 text-white hover:bg-warm-700"
                  >
                    저장
                  </Button>
                  <Button
                    onClick={() => {
                      setEditing(false);
                      setNickname(profile?.nickname || "");
                    }}
                    size="sm"
                    variant="ghost"
                  >
                    취소
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-warm-900">
                    {profile?.nickname}
                  </h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-warm-400 hover:text-warm-600"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              )}
              {profile?.birth_year && (
                <p className="text-sm text-warm-500">
                  {profile.birth_year}년생
                </p>
              )}
            </div>
          </div>

          {profile?.life_theme && profile.life_theme.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.life_theme.map((themeId) => {
                const theme = LIFE_THEMES.find((t) => t.id === themeId);
                return theme ? (
                  <span
                    key={themeId}
                    className="rounded-full bg-warm-100 px-3 py-1 text-sm text-warm-700"
                  >
                    {theme.emoji} {theme.label}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="mb-6 border-warm-200 bg-white">
        <CardContent className="pt-5">
          <h3 className="mb-4 font-semibold text-warm-800">나의 기록 통계</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <BookOpen className="h-4 w-4 text-warm-500" />
                <span className="text-2xl font-bold text-warm-700">
                  {profile?.total_entries || 0}
                </span>
              </div>
              <p className="text-xs text-warm-500">총 기록</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-2xl font-bold text-warm-700">
                  {profile?.streak_count || 0}
                </span>
              </div>
              <p className="text-xs text-warm-500">연속 기록</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-4 w-4 text-red-500" />
                <span className="text-2xl font-bold text-warm-700">
                  {profile?.longest_streak || 0}
                </span>
              </div>
              <p className="text-xs text-warm-500">최장 연속</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier info */}
      <Card className="mb-6 border-warm-200 bg-white">
        <CardContent className="pt-5">
          <h3 className="mb-2 font-semibold text-warm-800">구독 정보</h3>
          <p className="text-warm-600">
            {profile?.tier === "premium" ? (
              <span className="flex items-center gap-1">
                ⭐ 프리미엄 회원
              </span>
            ) : (
              <span>무료 회원</span>
            )}
          </p>
          {profile?.tier !== "premium" && (
            <p className="mt-2 text-sm text-warm-400">
              프리미엄 업그레이드로 인생책 PDF 생성 기능을 이용해 보세요.
            </p>
          )}
        </CardContent>
      </Card>

      {/* My Story link */}
      <Link href="/my-story">
        <Card className="mb-6 border-warm-200 bg-white hover:bg-warm-50 transition-colors cursor-pointer">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-warm-500" />
              <div>
                <p className="font-medium text-warm-800">나의 인생 이야기</p>
                <p className="text-sm text-warm-500">기록을 인생책으로 만들기</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-warm-400" />
          </CardContent>
        </Card>
      </Link>

      <Separator className="my-4 bg-warm-100" />

      {/* Logout */}
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
      >
        <LogOut className="mr-2 h-5 w-5" />
        로그아웃
      </Button>
    </div>
  );
}
