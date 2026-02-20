"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "./actions";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-cream-darker p-6">
      <h2 className="text-xl font-bold text-center mb-6">회원가입</h2>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-text-light mb-1"
          >
            닉네임
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-cream-darker bg-cream focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder="슬로에이징 코치에서 사용할 이름"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-light mb-1"
          >
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-cream-darker bg-cream focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-light mb-1"
          >
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-cream-darker bg-cream focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder="6자 이상"
          />
        </div>

        {error && (
          <p className="text-sm text-error bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? "가입 중..." : "시작하기"}
        </button>
      </form>

      <p className="text-center text-sm text-text-light mt-4">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-primary font-semibold">
          로그인
        </Link>
      </p>
    </div>
  );
}
