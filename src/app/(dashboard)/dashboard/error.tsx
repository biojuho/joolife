"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
        <AlertTriangle size={28} className="text-red-500" />
      </div>
      <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">
        데이터를 불러올 수 없습니다
      </h2>
      <p className="text-[#6B6B66] text-sm mb-6 text-center max-w-sm">
        네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
      >
        <RefreshCw size={16} />
        다시 시도
      </button>
    </div>
  );
}
