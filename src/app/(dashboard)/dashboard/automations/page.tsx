import { Zap, Plus } from "lucide-react";

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">자동화</h1>
          <p className="text-[#6B6B66] mt-1">
            뉴스 수집, 콘텐츠 알림 등 자동화 규칙을 관리합니다.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors">
          <Plus size={16} />
          새 자동화
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-yellow-50 flex items-center justify-center mb-5">
          <Zap size={32} className="text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
          자동화 규칙을 만들어보세요
        </h3>
        <p className="text-[#6B6B66] text-sm max-w-sm">
          키워드 기반 뉴스 수집, RSS 피드 구독, 콘텐츠 알림 등
          다양한 자동화를 설정할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
