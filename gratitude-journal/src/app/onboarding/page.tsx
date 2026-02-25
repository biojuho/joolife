"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { LIFE_THEMES } from "@/lib/types";

type Step = "nickname" | "birth_year" | "themes";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<Step>("nickname");
  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleTheme = (id: string) => {
    setSelectedThemes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const year = birthYear ? parseInt(birthYear, 10) : null;
    const { error } = await supabase
      .from("profiles")
      .update({
        nickname,
        birth_year: year && !isNaN(year) && year >= 1920 && year <= 2010 ? year : null,
        life_theme: selectedThemes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (!error) {
      // 온보딩 완료 쿠키 설정
      document.cookie = "onboarding_complete=1; path=/; max-age=31536000; samesite=lax";
      router.push("/journal");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-50 px-6">
      <div className="mb-8 text-center">
        <div className="mb-3 text-4xl">
          {step === "nickname" && "👋"}
          {step === "birth_year" && "🎂"}
          {step === "themes" && "🌟"}
        </div>
        <h1 className="text-2xl font-bold text-warm-900">
          {step === "nickname" && "반가워요!"}
          {step === "birth_year" && "태어난 해를 알려주세요"}
          {step === "themes" && "관심 있는 주제를 골라주세요"}
        </h1>
        <p className="mt-2 text-warm-600">
          {step === "nickname" && "어떻게 불러드릴까요?"}
          {step === "birth_year" && "맞춤 질문을 드리는 데 참고할게요"}
          {step === "themes" && "선택하신 주제 위주로 질문을 드릴게요"}
        </p>
      </div>

      <Card className="w-full max-w-sm border-warm-200 bg-white shadow-lg">
        <CardContent className="pt-6">
          {step === "nickname" && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="닉네임 또는 이름"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="h-14 text-center text-xl border-warm-200 focus:border-warm-400"
                maxLength={20}
                autoFocus
              />
              <Button
                onClick={() => setStep("birth_year")}
                disabled={!nickname.trim()}
                className="h-12 w-full bg-warm-600 text-lg font-semibold text-white hover:bg-warm-700"
              >
                다음
              </Button>
            </div>
          )}

          {step === "birth_year" && (
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="예: 1960"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="h-14 text-center text-xl border-warm-200 focus:border-warm-400"
                min={1920}
                max={2010}
                autoFocus
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("nickname")}
                  className="h-12 flex-1 text-lg border-warm-300 text-warm-700"
                >
                  이전
                </Button>
                <Button
                  onClick={() => setStep("themes")}
                  className="h-12 flex-1 bg-warm-600 text-lg font-semibold text-white hover:bg-warm-700"
                >
                  다음
                </Button>
              </div>
              <button
                onClick={() => setStep("themes")}
                className="block w-full text-center text-sm text-warm-400 hover:text-warm-600"
              >
                건너뛰기
              </button>
            </div>
          )}

          {step === "themes" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {LIFE_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => toggleTheme(theme.id)}
                    className={`flex h-14 items-center justify-center gap-2 rounded-xl border-2 text-lg font-medium transition-all duration-300 ${
                      selectedThemes.includes(theme.id)
                        ? "border-warm-500 bg-warm-100 text-warm-800"
                        : "border-warm-200 bg-white text-warm-600 hover:border-warm-300"
                    }`}
                  >
                    <span>{theme.emoji}</span>
                    <span>{theme.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-warm-400">
                {selectedThemes.length}개 선택됨 (나중에 변경 가능)
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("birth_year")}
                  className="h-12 flex-1 text-lg border-warm-300 text-warm-700"
                >
                  이전
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={loading}
                  className="h-12 flex-1 bg-warm-600 text-lg font-semibold text-white hover:bg-warm-700"
                >
                  {loading ? "시작 중..." : "시작하기"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step indicator */}
      <div className="mt-6 flex gap-2">
        {(["nickname", "birth_year", "themes"] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`h-2 w-8 rounded-full transition-colors duration-300 ${
              step === s
                ? "bg-warm-500"
                : (["nickname", "birth_year", "themes"] as Step[]).indexOf(step) > i
                  ? "bg-warm-300"
                  : "bg-warm-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
