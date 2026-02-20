"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError("로그인 중 오류가 발생했어요. 다시 시도해 주세요.");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-50 px-6">
      <div className="mb-10 text-center">
        <div className="mb-4 text-5xl">🌅</div>
        <h1 className="mb-2 text-3xl font-bold text-warm-900">감사 저널</h1>
        <p className="text-lg text-warm-700">
          나의 인생 이야기를 기록해 보세요
        </p>
      </div>

      <Card className="w-full max-w-sm border-warm-200 bg-white shadow-lg">
        <CardContent className="pt-6">
          {sent ? (
            <div className="text-center">
              <div className="mb-4 text-4xl">✉️</div>
              <h2 className="mb-2 text-xl font-semibold text-warm-900">
                메일을 확인해 주세요
              </h2>
              <p className="text-warm-700">
                <span className="font-medium">{email}</span>
                으로 로그인 링크를 보내드렸어요.
              </p>
              <p className="mt-3 text-sm text-warm-500">
                메일이 오지 않으면 스팸함을 확인해 주세요.
              </p>
              <Button
                variant="ghost"
                className="mt-4 text-warm-600"
                onClick={() => setSent(false)}
              >
                다른 이메일로 시도하기
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-warm-800"
                >
                  이메일 주소
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-lg border-warm-200 focus:border-warm-400 focus:ring-warm-400"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-warm-600 text-lg font-semibold text-white hover:bg-warm-700"
              >
                {loading ? "보내는 중..." : "로그인 링크 받기"}
              </Button>
              <p className="text-center text-sm text-warm-500">
                처음이신가요? 이메일만 입력하면 자동으로 가입돼요.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
