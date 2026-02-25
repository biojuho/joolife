import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 text-6xl">🌅</div>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-warm-900">
          매일 하나의 질문으로
          <br />
          <span className="text-warm-600">나의 인생을 기록하다</span>
        </h1>
        <p className="mb-8 max-w-md text-lg leading-relaxed text-warm-600">
          AI가 매일 따뜻한 질문을 던져드려요.
          <br />
          답하다 보면 어느새 나만의 인생 이야기가 완성됩니다.
        </p>
        <Link
          href="/login"
          className="inline-flex h-14 items-center rounded-xl bg-warm-600 px-8 text-xl font-semibold text-white shadow-lg transition-all duration-300 hover:bg-warm-700 hover:shadow-xl"
        >
          시작하기
        </Link>
        <p className="mt-4 text-sm text-warm-400">
          무료로 시작할 수 있어요
        </p>
      </div>

      {/* Features */}
      <div className="bg-white px-6 py-16">
        <div className="mx-auto max-w-lg space-y-12">
          <div className="text-center">
            <div className="mb-3 text-3xl">💬</div>
            <h3 className="mb-2 text-xl font-bold text-warm-900">
              매일 하나의 질문
            </h3>
            <p className="text-warm-600">
              AI가 당신의 기록을 참고해 매일 새로운 질문을 만들어드려요. 감사,
              인생 회고, 가치관 등 다양한 주제로 깊이 있는 대화를 나눌 수
              있어요.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-3 text-3xl">🪞</div>
            <h3 className="mb-2 text-xl font-bold text-warm-900">
              따뜻한 AI 리플렉션
            </h3>
            <p className="text-warm-600">
              답변을 보내면 AI가 공감과 의미를 담은 리플렉션을 돌려줘요. 내
              이야기 속에 숨은 강점과 지혜를 발견해 보세요.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-3 text-3xl">📊</div>
            <h3 className="mb-2 text-xl font-bold text-warm-900">
              주간 회고 요약
            </h3>
            <p className="text-warm-600">
              매주 자동으로 한 주의 기록을 정리해 드려요. 감정 흐름, 키워드,
              그리고 나에 대한 새로운 발견을 한눈에 볼 수 있어요.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-3 text-3xl">📖</div>
            <h3 className="mb-2 text-xl font-bold text-warm-900">
              나의 인생 이야기
            </h3>
            <p className="text-warm-600">
              기록이 쌓이면 나만의 인생책 PDF로 만들어 드려요. 가족에게 선물할
              수 있는 세상에 하나뿐인 책이에요.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial-style section */}
      <div className="bg-warm-100 px-6 py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-4 text-2xl">&ldquo;</div>
          <p className="mb-4 text-lg italic leading-relaxed text-warm-800">
            매일 질문에 답하면서 잊고 있던 소중한 기억들이 하나둘 떠올랐어요.
            AI의 따뜻한 응답에 위로받기도 하고요.
          </p>
          <p className="text-warm-600">— 60대 사용자</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white px-6 py-16 text-center">
        <h2 className="mb-4 text-2xl font-bold text-warm-900">
          오늘부터 나의 이야기를 시작해 보세요
        </h2>
        <Link
          href="/login"
          className="inline-flex h-14 items-center rounded-xl bg-warm-600 px-8 text-xl font-semibold text-white shadow-lg transition-all duration-300 hover:bg-warm-700 hover:shadow-xl"
        >
          무료로 시작하기
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-warm-900 px-6 py-8 text-center text-sm text-warm-300">
        <p>감사 저널 &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">JooLife</p>
      </footer>
    </div>
  );
}
