import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl mb-4">🌿</p>
        <h1 className="text-2xl font-bold text-text mb-2">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-text-light mb-6">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
