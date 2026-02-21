import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FREE_FEATURES = [
  "매일 5항목 건강 체크",
  "슬로에이징 점수 확인",
  "7일 트렌드 차트",
  "SNS 공유 카드",
  "카테고리별 균형 분석",
];

const PREMIUM_FEATURES = [
  { text: "무제한 트렌드 분석 (30일+)", highlight: true },
  { text: "전체 유저 퍼센타일 비교", highlight: true },
  { text: "AI 맞춤 건강 조언", highlight: true },
  { text: "프리미엄 공유 카드 디자인", highlight: false },
  { text: "데이터 내보내기 (CSV)", highlight: false },
  { text: "광고 없는 경험", highlight: false },
  { text: "우선 고객 지원", highlight: false },
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-lg font-bold">✨ 프리미엄</h1>
          <Button asChild variant="ghost" size="sm">
            <Link href="/settings">설정</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <div className="text-center space-y-3">
          <p className="text-5xl">✨</p>
          <h2 className="text-2xl font-bold">
            슬로에이징을 더 깊게
          </h2>
          <p className="text-muted-foreground text-sm">
            프리미엄으로 나만의 건강 데이터를
            <br />
            더 깊이 분석해보세요
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-4">
          {/* Free Plan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>🌱 무료</span>
                <span className="text-sm text-muted-foreground font-normal">
                  현재 플랜
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {FREE_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-secondary-500">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-bl-lg">
              추천
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <div className="flex items-center justify-between">
                  <span>✨ 프리미엄</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold">₩4,900</span>
                    <span className="text-sm text-muted-foreground">
                      /월
                    </span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {/* Include free features */}
                {FREE_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-secondary-500/50">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
                <li className="border-t border-white/5 pt-2" />
                {PREMIUM_FEATURES.map(({ text, highlight }) => (
                  <li
                    key={text}
                    className={`flex items-center gap-2 text-sm ${
                      highlight ? "font-medium" : ""
                    }`}
                  >
                    <span className="text-primary-400">★</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full" size="lg" disabled>
                곧 출시 예정
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                출시 시 알림을 받으시려면 체크를 꾸준히 해주세요!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
