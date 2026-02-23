"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

type Gender = "M" | "F" | "O";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const handleComplete = async () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        nickname: nickname.trim(),
        birth_year: birthYear ? parseInt(birthYear, 10) : null,
        gender: gender,
      })
      .eq("id", user.id);

    if (updateError) {
      setError("프로필 저장에 실패했습니다.");
      setLoading(false);
      return;
    }

    router.push("/check");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 justify-center">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? "w-10 bg-primary" : "w-6 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Nickname */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center space-y-2">
              <p className="text-4xl">👋</p>
              <h1 className="text-2xl font-bold">반가워요!</h1>
              <p className="text-sm text-muted-foreground">
                슬로에이지에서 사용할 닉네임을 알려주세요
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임 (2-10자)"
                    maxLength={10}
                    className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <Button
                    onClick={() => {
                      if (nickname.trim().length < 2) {
                        setError("2자 이상 입력해주세요.");
                        return;
                      }
                      setError(null);
                      setStep(2);
                    }}
                    disabled={!nickname.trim()}
                    className="w-full"
                    size="lg"
                  >
                    다음
                  </Button>
                  {error && (
                    <p className="text-sm text-destructive text-center">
                      {error}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Birth Year */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center space-y-2">
              <p className="text-4xl">🎂</p>
              <h1 className="text-2xl font-bold">출생 연도</h1>
              <p className="text-sm text-muted-foreground">
                연령대별 건강 인사이트를 위해 필요해요
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="예: 1990"
                    min={1940}
                    max={2010}
                    className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setStep(3)}
                      variant="outline"
                      className="flex-1"
                      size="lg"
                    >
                      건너뛰기
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={
                        !!birthYear &&
                        (parseInt(birthYear) < 1940 ||
                          parseInt(birthYear) > 2010)
                      }
                      className="flex-1"
                      size="lg"
                    >
                      다음
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Gender */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center space-y-2">
              <p className="text-4xl">🌈</p>
              <h1 className="text-2xl font-bold">성별</h1>
              <p className="text-sm text-muted-foreground">
                맞춤형 건강 조언을 위해 필요해요
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "M" as Gender, label: "남성", emoji: "👨" },
                      { value: "F" as Gender, label: "여성", emoji: "👩" },
                      { value: "O" as Gender, label: "기타", emoji: "🧑" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setGender(option.value)}
                        className={`flex flex-col items-center gap-1.5 p-4 rounded-lg border-2 transition-all ${
                          gender === option.value
                            ? "border-primary bg-primary/10"
                            : "border-muted hover:border-muted-foreground/30"
                        }`}
                      >
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {error && (
                    <p className="text-sm text-destructive text-center">
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleComplete}
                      variant="outline"
                      disabled={loading}
                      className="flex-1"
                      size="lg"
                    >
                      건너뛰기
                    </Button>
                    <Button
                      onClick={handleComplete}
                      disabled={loading}
                      className="flex-1"
                      size="lg"
                    >
                      {loading ? "저장 중..." : "완료"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Back button */}
        {step > 1 && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setStep(step - 1);
                setError(null);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← 이전으로
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
