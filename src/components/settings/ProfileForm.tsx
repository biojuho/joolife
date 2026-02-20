"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile } from "@/app/settings/actions";

type Gender = "M" | "F" | "O";

interface ProfileFormProps {
  nickname: string | null;
  birthYear: number | null;
  gender: string | null;
  email: string | null;
}

export default function ProfileForm({
  nickname: initialNickname,
  birthYear: initialBirthYear,
  gender: initialGender,
  email,
}: ProfileFormProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState(initialNickname ?? "");
  const [birthYear, setBirthYear] = useState(
    initialBirthYear?.toString() ?? ""
  );
  const [gender, setGender] = useState<Gender | null>(
    (initialGender as Gender) ?? null
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await updateProfile({
      nickname,
      birth_year: birthYear ? parseInt(birthYear, 10) : null,
      gender,
    });

    if (result.success) {
      setMessage({ type: "success", text: "프로필이 저장되었습니다!" });
      router.refresh();
    } else {
      setMessage({
        type: "error",
        text: result.error ?? "저장에 실패했습니다.",
      });
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">프로필 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email (read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              이메일
            </label>
            <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/30 px-3 text-sm text-muted-foreground">
              {email ?? "소셜 로그인"}
            </div>
          </div>

          {/* Nickname */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="nickname">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="2-10자"
              maxLength={10}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Birth Year */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="birthYear">
              출생 연도
            </label>
            <input
              id="birthYear"
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="예: 1990"
              min={1940}
              max={2010}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm font-medium">성별</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "M" as Gender, label: "남성" },
                { value: "F" as Gender, label: "여성" },
                { value: "O" as Gender, label: "기타" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setGender(option.value)}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    gender === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input hover:border-muted-foreground/30"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          {message && (
            <p
              className={`text-sm ${
                message.type === "success"
                  ? "text-secondary-500"
                  : "text-destructive"
              }`}
            >
              {message.text}
            </p>
          )}

          {/* Submit */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "저장 중..." : "저장하기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
