import { Bookmark, Filter, Grid3X3, List } from "lucide-react";

export default function ContentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">저장 콘텐츠</h1>
          <p className="text-[#6B6B66] mt-1">
            저장한 URL, 메모, 이미지를 관리합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-[#6B6B66] transition-colors">
            <Filter size={18} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-[#6B6B66] transition-colors">
            <Grid3X3 size={18} />
          </button>
          <button className="p-2 rounded-lg bg-gray-100 text-[#1A1A1A] transition-colors">
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/60 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
          <Bookmark size={32} className="text-[#D1D1CC]" />
        </div>
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
          아직 저장된 콘텐츠가 없습니다
        </h3>
        <p className="text-[#6B6B66] text-sm max-w-sm">
          상단의 &quot;저장하기&quot; 버튼을 눌러 URL, 메모, 이미지를
          저장해보세요.
        </p>
      </div>
    </div>
  );
}
