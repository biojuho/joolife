import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="text-center max-w-md mx-auto px-4">
        <p className="text-7xl font-bold text-accent mb-4">404</p>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-[#6B6B66] text-sm mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
          >
            홈으로 가기
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-xl bg-gray-100 text-[#6B6B66] text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            대시보드
          </Link>
        </div>
      </div>
    </div>
  );
}
