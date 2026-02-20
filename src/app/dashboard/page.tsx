import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "./actions";
import TodayScoreCard from "@/components/dashboard/TodayScoreCard";
import WeeklyTrendChart from "@/components/dashboard/WeeklyTrendChart";
import CategoryRadarChart from "@/components/dashboard/CategoryRadarChart";

export default async function DashboardPage() {
  const { loggedIn, today, weeklyData, streak } = await getDashboardData();

  // Not logged in state
  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-5xl">🔒</p>
          <h1 className="text-2xl font-bold">로그인이 필요합니다</h1>
          <p className="text-muted-foreground text-sm">
            대시보드는 로그인 후 이용 가능합니다.
            <br />
            체크 기록을 저장하고 트렌드를 확인해보세요.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button asChild>
              <Link href="/check">먼저 체크해보기</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">홈으로</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare today's category scores
  const todayScores = today
    ? {
        sleep: today.sleep_score,
        exercise: today.exercise_score,
        diet: today.diet_score,
        stress: today.stress_score,
        social: today.social_score,
      }
    : null;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-lg font-bold">📊 대시보드</h1>
          <Button asChild variant="ghost" size="sm">
            <Link href="/check">오늘의 체크</Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Today's Score */}
        <TodayScoreCard
          score={today?.total_score ?? null}
          scores={todayScores}
          streak={streak}
        />

        {/* Weekly Trend */}
        <WeeklyTrendChart data={weeklyData} />

        {/* Category Radar */}
        <CategoryRadarChart weeklyData={weeklyData} />

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button asChild variant="outline" className="h-auto py-3">
            <Link href="/share" className="flex flex-col items-center gap-1">
              <span className="text-lg">📱</span>
              <span className="text-xs">점수 공유하기</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-3">
            <Link href="/check" className="flex flex-col items-center gap-1">
              <span className="text-lg">✅</span>
              <span className="text-xs">체크하기</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
