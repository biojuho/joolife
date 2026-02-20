import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    emoji: "⚡",
    title: "30초 건강 체크",
    description: "수면, 운동, 식단, 스트레스, 소셜 — 5가지 항목을 빠르게 체크",
  },
  {
    emoji: "📊",
    title: "슬로에이징 점수",
    description: "0~100점 슬로에이징 점수로 오늘의 건강 상태를 한눈에 확인",
  },
  {
    emoji: "📈",
    title: "주간 트렌드",
    description: "꾸준히 기록하면 나만의 건강 변화 추이를 한눈에",
  },
  {
    emoji: "📱",
    title: "SNS 공유 카드",
    description: "예쁜 카드 이미지로 친구들과 건강 기록을 공유",
  },
];

const CHECK_ITEMS = [
  { emoji: "😴", label: "수면", desc: "어젯밤 잘 잤나요?" },
  { emoji: "🏃", label: "운동", desc: "오늘 몸을 움직였나요?" },
  { emoji: "🥗", label: "식단", desc: "건강하게 먹었나요?" },
  { emoji: "🧘", label: "스트레스", desc: "마음이 편안한가요?" },
  { emoji: "👥", label: "사회활동", desc: "사람들과 교류했나요?" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b bg-background/60 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌿</span>
            <span className="font-bold text-lg">SlowAge</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">로그인</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/check">시작하기</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute top-40 right-0 w-[300px] h-[300px] rounded-full bg-secondary-500/5 blur-3xl" />

        <div className="relative max-w-2xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
            </span>
            매일 30초, 건강한 습관의 시작
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-500 bg-clip-text text-transparent">
                SlowAge
              </span>
              <br />
              <span className="text-3xl sm:text-4xl text-foreground/90">
                슬로에이징 점수 트래커
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              하루 5가지 건강 체크로 나만의
              <br />
              슬로에이징 점수를 확인하세요.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto px-8 h-12 text-base">
              <Link href="/check">🌿 오늘의 체크 시작하기</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 h-12 text-base"
            >
              <Link href="/login">로그인</Link>
            </Button>
          </div>

          {/* Score preview */}
          <div className="pt-8">
            <div className="relative mx-auto w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="hsl(240 5% 15%)"
                  strokeWidth="6"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#6C5CE7"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * 0.25}`}
                  className="animate-score-fill"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-primary-400">75</span>
                <span className="text-xs text-muted-foreground">슬로에이징 점수</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl font-bold">왜 SlowAge인가요?</h2>
            <p className="text-muted-foreground">
              건강 관리, 복잡할 필요 없습니다
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="bg-card/50 border-white/5 hover:border-primary/20 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{feature.emoji}</span>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Check Items Preview */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10 space-y-3">
            <h2 className="text-3xl font-bold">5가지 체크 항목</h2>
            <p className="text-muted-foreground text-sm">
              매일 5개 항목을 1~5점으로 평가하세요
            </p>
          </div>

          <div className="space-y-3">
            {CHECK_ITEMS.map((item, i) => (
              <div
                key={item.label}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-card/30 hover:bg-card/60 transition-colors"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-2xl w-10 text-center">{item.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-medium ${
                        n <= 3 + i * 0.4
                          ? "bg-primary/20 text-primary-300"
                          : "bg-muted/30 text-muted-foreground/30"
                      }`}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="space-y-3">
            <p className="text-4xl">🌿</p>
            <h2 className="text-2xl font-bold">
              오늘부터 시작하세요
            </h2>
            <p className="text-muted-foreground text-sm">
              30초면 충분합니다.
              <br />
              건강한 노화의 첫 걸음을 기록하세요.
            </p>
          </div>

          <Button asChild size="lg" className="w-full sm:w-auto px-10 h-12 text-base">
            <Link href="/check">무료로 시작하기</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/50">
          <div className="flex items-center gap-2">
            <span>🌿</span>
            <span>SlowAge by JooLife</span>
          </div>
          <div className="flex gap-4">
            <Link href="/check" className="hover:text-foreground transition-colors">
              체크하기
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              대시보드
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              로그인
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
