"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
          오류가 발생했습니다
        </h2>
        <p className="text-[#6B6B66] text-sm mb-6">
          페이지를 불러오는 중 문제가 발생했습니다. 다시 시도해 주세요.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
