import { Sparkles } from "lucide-react";

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">AI 추천</h1>
        <p className="text-[#6B6B66] mt-1">
          AI가 분석한 맞춤형 콘텐츠와 인사이트를 확인하세요.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-5">
          <Sparkles size={32} className="text-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
          AI 추천이 준비 중입니다
        </h3>
        <p className="text-[#6B6B66] text-sm max-w-sm">
          콘텐츠를 저장하면 AI가 패턴을 분석하여 맞춤형 추천을 제공합니다.
        </p>
      </div>
    </div>
  );
}
